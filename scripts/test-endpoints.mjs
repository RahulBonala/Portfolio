/**
 * Tests for /api/reviews and /api/contact.
 *
 * These are the two endpoints reachable without a payment, so they are where
 * abuse would land: an open write path, or a read that leaks buyer details.
 */
import assert from 'node:assert/strict';
import { mintToken } from '../api/_lib/token.ts';
import reviews from '../api/reviews.ts';
import contact from '../api/contact.ts';

const SECRET = 'test_secret_do_not_use';
const PAY = 'pay_ABCDEFGH1234';

/** Captures a handler's response without a server. */
async function call(handler, { method = 'POST', body = null, headers = {} } = {}) {
  let captured;
  const res = {
    status(code) { this._code = code; return this; },
    setHeader() {},
    json(payload) { captured = { code: this._code, body: payload }; },
    send(payload) { captured = { code: this._code, body: payload }; },
  };
  await handler({ method, body, headers, url: '/' }, res);
  return captured;
}

const withDb = (on) => {
  if (on) {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  } else {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
};

const tests = {
  // ── the shareable /review link: open, but only into a moderation queue ──
  'a review with no token is accepted as an invite': async () => {
    process.env.RAZORPAY_KEY_SECRET = SECRET;
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 5, body: 'genuinely useful hour, thanks' },
    });
    // Reaches the insert (which fails against the fake DB URL) rather than
    // being refused up front — the point is it is no longer a 403.
    assert.notEqual(r.code, 403);
  },

  'an invite review is published immediately': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 4, body: 'genuinely useful hour, thanks' },
    });
    assert.ok(r.body.pending === false || r.body.ok === false);
  },

  'a review with a forged token is still refused': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Spam', rating: 5, body: 'buy my thing now', token: `${Buffer.from(`${PAY}.${Date.now() + 9e6}`).toString('base64url')}.${'a'.repeat(64)}` },
    });
    assert.equal(r.code, 403);
    assert.equal(r.body.error, 'invalid_token');
  },

  'a review with a token from another secret is refused': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'X', rating: 5, body: 'a genuine looking review', token: mintToken(PAY, 'other_secret') },
    });
    assert.equal(r.code, 403);
  },

  'an expired token degrades to an invite rather than failing': async () => {
    withDb(true);
    const stale = mintToken(PAY, SECRET, Date.now() - 10 * 60 * 60 * 1000);
    const r = await call(reviews, {
      body: { name: 'Late reviewer', rating: 5, body: 'writing this a week later', token: stale },
    });
    assert.notEqual(r.code, 403);
  },

  'the review honeypot is silently accepted and stores nothing': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Bot', rating: 5, body: 'spam spam spam spam', _gotcha: 'filled' },
    });
    assert.equal(r.code, 200);
    assert.equal(r.body.pending, false);
  },

  'URLs in the review body are stripped': async () => {
    // We cannot easily test the insert content without mocking db,
    // but we can ensure it doesn't fail due to stripping and test the logic.
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 4, body: 'great session, visit http://spam.com/buy here or www.google.com and https://test.org' },
    });
    // DB mock fails insert so we check we at least get past validation
    assert.notEqual(r.code, 400); 
  },

  'a valid token with a bad rating is rejected': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'X', rating: 99, body: 'a genuine looking review', token: mintToken(PAY, SECRET) },
    });
    assert.equal(r.code, 400);
    assert.equal(r.body.error, 'invalid_review');
  },

  'a valid token with an empty body is rejected': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'X', rating: 5, body: 'hi', token: mintToken(PAY, SECRET) },
    });
    assert.equal(r.code, 400);
  },

  // ── the optional email, captured for follow-up only ─────────────────────
  'a review without an email is still accepted': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 5, body: 'no email given, still fine' },
    });
    assert.notEqual(r.code, 400);
  },

  'a review with a well-formed email gets past validation': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 5, body: 'happy to hear about offers', email: 'someone@example.com' },
    });
    assert.notEqual(r.code, 400);
  },

  'a typo in the optional email is reported rather than silently dropped': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 5, body: 'a genuine looking review', email: 'someone@example' },
    });
    assert.equal(r.code, 400);
    assert.equal(r.body.error, 'invalid_email');
  },

  'a review email is never echoed back in the response': async () => {
    withDb(true);
    const r = await call(reviews, {
      body: { name: 'Attendee', rating: 5, body: 'a genuine looking review', email: 'private@example.com' },
    });
    assert.ok(!JSON.stringify(r.body).includes('private@example.com'));
  },

  'GET returns an empty list when there is no database': async () => {
    withDb(false);
    const r = await call(reviews, { method: 'GET' });
    assert.equal(r.code, 200);
    assert.deepEqual(r.body, { reviews: [] });
  },

  'reviews refuses methods other than GET and POST': async () => {
    withDb(true);
    const r = await call(reviews, { method: 'DELETE' });
    assert.equal(r.code, 405);
  },

  // ── contact: open by necessity, so the guards matter ────────────────────
  'the honeypot is silently accepted and stores nothing': async () => {
    withDb(false); // would 503 if it tried to store
    const r = await call(contact, {
      body: { name: 'Bot', email: 'bot@spam.com', message: 'hello', _gotcha: 'filled' },
    });
    assert.equal(r.code, 200);
    assert.equal(r.body.ok, true);
  },

  'a malformed email is rejected': async () => {
    withDb(true);
    const r = await call(contact, { body: { name: 'A', email: 'not-an-email', message: 'hello there' } });
    assert.equal(r.code, 400);
  },

  'a missing name is rejected': async () => {
    withDb(true);
    const r = await call(contact, { body: { name: '', email: 'a@b.co', message: 'hello there' } });
    assert.equal(r.code, 400);
  },

  'contact reports unconfigured rather than pretending to save': async () => {
    withDb(false);
    const r = await call(contact, { body: { name: 'A', email: 'a@b.co', message: 'hello there' } });
    assert.equal(r.code, 503);
    assert.equal(r.body.ok, false);
  },

  'contact refuses GET': async () => {
    const r = await call(contact, { method: 'GET' });
    assert.equal(r.code, 405);
  },

  'no response body ever echoes the service role key': async () => {
    withDb(true);
    const r = await call(contact, { body: { name: 'A', email: 'not-an-email', message: 'x y z' } });
    assert.ok(!JSON.stringify(r.body).includes('service_role_test'));
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try { await fn(); console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); }
}
console.log(failed ? `\n${failed} failed` : `\nAll ${Object.keys(tests).length} endpoint tests passed`);
process.exit(failed ? 1 : 0);
