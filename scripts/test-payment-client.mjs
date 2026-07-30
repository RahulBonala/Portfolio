/**
 * Client booking-gate regressions. These run without a DOM by stubbing only
 * the browser APIs used by src/lib/payment.ts.
 */
import assert from 'node:assert/strict';

const values = new Map();
globalThis.sessionStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: (key) => values.delete(key),
  clear: () => values.clear(),
};

let scrubCount = 0;
globalThis.window = {
  location: { pathname: '/teach' },
  history: { replaceState: () => { scrubCount += 1; } },
};

const { checkBookingAccess } = await import('../src/lib/payment.ts');

const paymentId = 'pay_CLIENTtest123';
const token = `${Buffer.from(`${paymentId}.${Date.now() + 60_000}`).toString('base64url')}.${'b'.repeat(64)}`;
const search = new URLSearchParams({
  razorpay_payment_id: paymentId,
  razorpay_payment_link_id: 'plink_CLIENTtest123',
  razorpay_payment_link_reference_id: '',
  razorpay_payment_link_status: 'paid',
  razorpay_signature: 'a'.repeat(64),
}).toString();

const tests = {
  'the payment button return is accepted from ?payment_id alone': async () => {
    values.clear();
    scrubCount = 0;
    let sent;
    globalThis.fetch = async (_url, init) => {
      sent = JSON.parse(init.body);
      return {
        ok: true,
        json: async () => ({ verified: true, configured: true, downloadToken: token }),
      };
    };

    const result = await checkBookingAccess(`?payment_id=${paymentId}`);
    assert.deepEqual(sent, { razorpay_payment_id: paymentId });
    assert.equal(result.state, 'granted');
    assert.equal(result.verified, true);
    assert.equal(result.paymentId, paymentId);
    assert.equal(result.downloadToken, token);
    assert.equal(result.scheduled, false);
    assert.equal(scrubCount, 1);
  },

  'a payment id that is not a Razorpay id is not sent anywhere': async () => {
    values.clear();
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      throw new Error('fetch should not run');
    };

    const result = await checkBookingAccess('?payment_id=../../etc/passwd');
    assert.equal(calls, 0);
    assert.equal(result.state, 'denied');
  },

  'fresh payment params override stale cached access': async () => {
    scrubCount = 0;
    values.set('rb-booking-verified', JSON.stringify({ verified: false }));
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      return {
        ok: true,
        json: async () => ({
          verified: true,
          configured: true,
          schedulingUrl: 'https://calendly.com/example/60min',
          downloadToken: token,
        }),
      };
    };

    const result = await checkBookingAccess(`?${search}`);
    assert.equal(calls, 1);
    assert.equal(result.state, 'granted');
    assert.equal(result.verified, true);
    assert.equal(result.paymentId, paymentId);
    assert.equal(result.downloadToken, token);
    assert.equal(result.scheduled, false);
    assert.equal(scrubCount, 1);
  },

  'a server failure keeps callback params available for retry': async () => {
    values.clear();
    scrubCount = 0;
    globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });

    const result = await checkBookingAccess(`?${search}`);
    assert.equal(result.state, 'granted');
    assert.equal(result.verified, false);
    assert.equal(result.verificationIssue, 'server');
    assert.equal(scrubCount, 0);
  },

  'verified access is recalled after callback params are scrubbed': async () => {
    values.clear();
    values.set('rb-booking-verified', JSON.stringify({
      verified: true,
      paymentId,
      schedulingUrl: 'https://calendly.com/example/60min',
      downloadToken: token,
      scheduled: true,
    }));
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      throw new Error('fetch should not run');
    };

    const result = await checkBookingAccess('');
    assert.equal(calls, 0);
    assert.equal(result.state, 'granted');
    assert.equal(result.paymentId, paymentId);
    assert.equal(result.downloadToken, token);
    assert.equal(result.scheduled, true);
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ✗ ${name}\n    ${error.message}`);
  }
}

console.log(failed ? `\n${failed} client payment test(s) failed` : `\nAll ${Object.keys(tests).length} client payment tests passed`);
process.exit(failed ? 1 : 0);
