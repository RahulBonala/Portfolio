/**
 * Tests for the paid-download token. The Playbook is a product, so a bug here
 * either gives it away free or blocks someone who paid.
 */
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mintToken, verifyToken, TOKEN_TTL_MS } from '../api/_lib/token.ts';

const SECRET = 'test_secret_do_not_use';
const PAY = 'pay_ABCDEFGH1234';

const tests = {
  'a freshly minted token verifies'() {
    const r = verifyToken(mintToken(PAY, SECRET), SECRET);
    assert.equal(r.ok, true);
    assert.equal(r.paymentId, PAY);
  },
  'a token minted with a different secret is rejected'() {
    const r = verifyToken(mintToken(PAY, 'other_secret'), SECRET);
    assert.equal(r.ok, false);
    assert.equal(r.reason, 'bad_signature');
  },
  'an expired token is rejected'() {
    const past = Date.now() - TOKEN_TTL_MS - 1000;
    const r = verifyToken(mintToken(PAY, SECRET, past), SECRET);
    assert.equal(r.ok, false);
    assert.equal(r.reason, 'expired');
  },
  'a token still valid just inside the window passes'() {
    const t = mintToken(PAY, SECRET, Date.now() - TOKEN_TTL_MS + 5000);
    assert.equal(verifyToken(t, SECRET).ok, true);
  },
  'tampering with the payload invalidates the signature'() {
    const t = mintToken(PAY, SECRET);
    const [, sig] = t.split('.');
    const forged = `${Buffer.from(`pay_SOMEONEELSE.${Date.now() + 9e6}`).toString('base64url')}.${sig}`;
    assert.equal(verifyToken(forged, SECRET).ok, false);
  },
  'extending the expiry invalidates the signature'() {
    const payload = `${PAY}.${Date.now() + 10 * TOKEN_TTL_MS}`;
    const t = mintToken(PAY, SECRET);
    const forged = `${Buffer.from(payload).toString('base64url')}.${t.split('.')[1]}`;
    assert.equal(verifyToken(forged, SECRET).ok, false);
  },
  'garbage is rejected as malformed'() {
    for (const bad of ['', 'x', '....', 'abc.def', 'a'.repeat(600)]) {
      assert.equal(verifyToken(bad, SECRET).ok, false, `accepted: ${bad.slice(0, 20)}`);
    }
  },
  'a payment id that is not a Razorpay id is rejected'() {
    const payload = '../../etc/passwd.' + (Date.now() + 9e6);
    const sig = createHmac('sha256', SECRET).update(payload).digest('hex');
    const t = `${Buffer.from(payload).toString('base64url')}.${sig}`;
    assert.equal(verifyToken(t, SECRET).ok, false);
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try { await fn(); console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); }
}
console.log(failed ? `\n${failed} failed` : `\nAll ${Object.keys(tests).length} token tests passed`);
process.exit(failed ? 1 : 0);
