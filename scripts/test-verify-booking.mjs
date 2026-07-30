/**
 * Tests for the booking gate — the one place on this site where a bug means
 * giving away paid sessions. Run with: node scripts/test-verify-booking.mjs
 *
 * The endpoint is plain TS with no framework imports, so we can drive it
 * directly with a stub req/res instead of standing up a server.
 */
import { createHmac } from 'node:crypto';
import assert from 'node:assert/strict';

// Node 22.6+ strips the types, so the .ts source imports directly.
const { default: handler } = await import('../api/verify-booking.ts');

const SECRET = 'test_secret_do_not_use';
const LINK = 'plink_TESTlink123456';
const PAYMENT = 'pay_TESTpayment123';
const REFERENCE = '';

const sign = (linkId, reference, status, paymentId, secret = SECRET) =>
  createHmac('sha256', secret).update(`${linkId}|${reference}|${status}|${paymentId}`).digest('hex');

async function call(body, { method = 'POST', secret = SECRET } = {}) {
  if (secret === null) delete process.env.RAZORPAY_KEY_SECRET;
  else process.env.RAZORPAY_KEY_SECRET = secret;

  let captured;
  const res = {
    status(code) { this._code = code; return this; },
    setHeader() {},
    json(payload) { captured = { code: this._code, body: payload }; },
  };
  // The handler is async now (it records the booking), so wait for it before
  // reading what it wrote.
  await handler({ method, body }, res);
  return captured;
}

const validBody = {
  razorpay_payment_id: PAYMENT,
  razorpay_payment_link_id: LINK,
  razorpay_payment_link_reference_id: REFERENCE,
  razorpay_payment_link_status: 'paid',
  razorpay_signature: sign(LINK, REFERENCE, 'paid', PAYMENT),
};

const tests = {
  'a correctly signed redirect verifies': async () => {
    const r = await call(validBody);
    assert.equal(r.body.verified, true);
    assert.equal(r.body.configured, true);
    assert.match(r.body.downloadToken, /^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/);
  },

  'a forged signature is rejected': async () => {
    const r = await call({ ...validBody, razorpay_signature: 'a'.repeat(64) });
    assert.equal(r.body.verified, false);
    assert.equal(r.body.reason, 'signature_mismatch');
  },

  'a signature from a different secret is rejected': async () => {
    const r = await call({
      ...validBody,
      razorpay_signature: sign(LINK, REFERENCE, 'paid', PAYMENT, 'wrong_secret'),
    });
    assert.equal(r.body.verified, false);
  },

  'tampering with the payment id invalidates the signature': async () => {
    const r = await call({ ...validBody, razorpay_payment_id: 'pay_SOMEONEELSES1' });
    assert.equal(r.body.verified, false);
  },

  'a status other than paid is rejected before any HMAC work': async () => {
    const r = await call({ ...validBody, razorpay_payment_link_status: 'cancelled' });
    assert.equal(r.body.verified, false);
    assert.equal(r.body.reason, 'malformed');
  },

  'garbage params are rejected as malformed': async () => {
    const r = await call({ razorpay_payment_id: '../../etc/passwd', razorpay_signature: 'x' });
    assert.equal(r.body.verified, false);
    assert.equal(r.body.reason, 'malformed');
  },

  'an empty body is a bad request, not a pass': async () => {
    const r = await call(null);
    assert.equal(r.body.verified, false);
    assert.equal(r.code, 400);
  },

  'GET is refused': async () => {
    const r = await call(validBody, { method: 'GET' });
    assert.equal(r.code, 405);
    assert.equal(r.body.verified, false);
  },

  'a missing secret reports unconfigured rather than verifying': async () => {
    const r = await call(validBody, { secret: null });
    assert.equal(r.body.verified, false);
    assert.equal(r.body.configured, false);
  },

  'the scheduling url is withheld unless the payment verified': async () => {
    process.env.CALENDLY_URL = 'https://calendly.com/example';
    const bad = await call({ ...validBody, razorpay_signature: 'b'.repeat(64) });
    assert.equal(bad.body.schedulingUrl, undefined);
    const good = await call(validBody);
    assert.equal(good.body.schedulingUrl, 'https://calendly.com/example');
    delete process.env.CALENDLY_URL;
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}\n    ${err.message}`);
  }
}

console.log(failed ? `\n${failed} test(s) failed` : `\nAll ${Object.keys(tests).length} tests passed`);
process.exit(failed ? 1 : 0);
