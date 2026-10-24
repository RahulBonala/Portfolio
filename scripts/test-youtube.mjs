/**
 * Tests for /api/youtube: the feed parser, and that a failing feed reaches the
 * page as an empty list rather than an error.
 */
import assert from 'node:assert/strict';
import youtube, { parseFeed } from '../api/youtube.ts';

const entry = (id, title, published) => `
  <entry>
    <id>yt:video:${id}</id>
    <yt:videoId>${id}</yt:videoId>
    <title>${title}</title>
    <published>${published}</published>
  </entry>`;

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <title>Pay Grade AI</title>
  ${entry('aaaaaaaaaa1', 'Oldest', '2026-10-01T10:00:00+00:00')}
  ${entry('bbbbbbbbbb2', 'GPT &amp; Claude: what it costs', '2026-10-04T10:00:00+00:00')}
  ${entry('not-an-id', 'Bad id', '2026-10-05T10:00:00+00:00')}
  ${entry('cccccccccc3', 'Middle', '2026-10-03T10:00:00+00:00')}
  ${entry('dddddddddd4', 'Newest', '2026-10-06T10:00:00+00:00')}
</feed>`;

async function call(method = 'GET') {
  let captured;
  const res = {
    status(code) { this._code = code; return this; },
    setHeader() {},
    json(body) { captured = { code: this._code, body }; },
  };
  await youtube({ method }, res);
  return captured;
}

const tests = {
  'the three newest valid videos come back, newest first': () => {
    const videos = parseFeed(FEED);
    assert.deepEqual(videos.map((v) => v.id), ['dddddddddd4', 'bbbbbbbbbb2', 'cccccccccc3']);
  },

  'titles are decoded from XML entities': () => {
    const [, second] = parseFeed(FEED);
    assert.equal(second.title, 'GPT & Claude: what it costs');
  },

  'an empty or unrelated document yields no videos': () => {
    assert.deepEqual(parseFeed(''), []);
    assert.deepEqual(parseFeed('<html>blocked</html>'), []);
  },

  'a failing feed is an empty list, not an error': async () => {
    globalThis.fetch = async () => ({ ok: false, status: 500, text: async () => '' });
    const r = await call();
    assert.equal(r.code, 200);
    assert.deepEqual(r.body, { videos: [] });
  },

  'a working feed is served': async () => {
    globalThis.fetch = async () => ({ ok: true, status: 200, text: async () => FEED });
    const r = await call();
    assert.equal(r.code, 200);
    assert.equal(r.body.videos.length, 3);
  },

  'only GET is allowed': async () => {
    const r = await call('POST');
    assert.equal(r.code, 405);
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

console.log(failed ? `\n${failed} youtube test(s) failed` : `\nAll ${Object.keys(tests).length} youtube tests passed`);
process.exit(failed ? 1 : 0);
