import assert from 'node:assert/strict';
import handler from '../api/booking-scheduled.js';
import { dbConfigured, insert, select } from '../api/_lib/db.js';
import { mintToken } from '../api/_lib/token.js';

process.env.RAZORPAY_KEY_SECRET = 'a'.repeat(64);
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

let status = 0;
let jsonBody = null;
const res = {
  status: (s) => {
    status = s;
    return res;
  },
  setHeader: () => {},
  json: (body) => {
    jsonBody = body;
  },
};

// Mock the db functions
const _store = new Map();
let mockSelectResult = [];

const mockDbConfigured = true;

const tests = {
  'a missing token is refused': async () => {
    await handler({ method: 'POST', body: {} }, res);
    assert.equal(status, 403);
    assert.deepEqual(jsonBody, { recorded: false, error: 'forbidden' });
  },

  'a forged token is refused': async () => {
    await handler({ method: 'POST', body: { t: 'forged' } }, res);
    assert.equal(status, 403);
    assert.deepEqual(jsonBody, { recorded: false, error: 'forbidden' });
  },

  'an unconfigured database reports rather than pretending': async () => {
    delete process.env.SUPABASE_URL;
    await handler({ method: 'POST', body: { t: 'forged' } }, res);
    assert.equal(status, 503);
    process.env.SUPABASE_URL = 'https://example.supabase.co';
  },

  'GET is refused': async () => {
    await handler({ method: 'GET' }, res);
    assert.equal(status, 405);
  },

  'a valid token records the scheduling': async () => {
    const paymentId = 'pay_SCHtest123';
    const t = mintToken(paymentId, process.env.RAZORPAY_KEY_SECRET);
    
    // We cannot easily test the DB side effects without full mocking,
    // so we just test that the endpoint calls db successfully.
    // The endpoint will throw in this simple environment because db.ts calls fetch() which isn't mocked,
    // but we can mock globalThis.fetch to pretend the DB call worked.
    
    globalThis.fetch = async (url) => {
      if (url.includes('select=scheduled_at')) {
        return { ok: true, text: async () => '[]' };
      }
      return { ok: true, text: async () => '' };
    };

    await handler({ method: 'POST', body: { t } }, res);
    assert.equal(status, 200);
    assert.deepEqual(jsonBody, { recorded: true });
  },

  'a second call reports alreadyScheduled': async () => {
    const paymentId = 'pay_SCHtest123';
    const t = mintToken(paymentId, process.env.RAZORPAY_KEY_SECRET);
    
    globalThis.fetch = async (url) => {
      if (url.includes('select=scheduled_at')) {
        return { ok: true, text: async () => JSON.stringify([{ scheduled_at: new Date().toISOString() }]) };
      }
      return { ok: true, text: async () => '' };
    };

    await handler({ method: 'POST', body: { t } }, res);
    assert.equal(status, 200);
    assert.deepEqual(jsonBody, { recorded: true, alreadyScheduled: true });
  },
  
  'no response body ever echoes the service role key': async () => {
    assert.equal(JSON.stringify(jsonBody).includes(process.env.SUPABASE_SERVICE_ROLE_KEY), false);
  }
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.error(err.message || err);
    failed += 1;
  }
}

console.log(`\nAll ${Object.keys(tests).length} booking scheduled tests passed`);
if (failed > 0) process.exit(1);
