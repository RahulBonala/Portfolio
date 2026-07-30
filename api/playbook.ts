import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyToken } from './_lib/token.js';

/**
 * Serves the AI Builder's Playbook to buyers only.
 *
 * The PDF deliberately does NOT live in public/ — anything there is published
 * at a guessable URL and can never be un-shared. It sits in api/_assets/ and
 * is streamed from here only when the caller presents a token this server
 * minted after verifying a real payment (see api/verify-booking.ts).
 *
 * vercel.json's `functions.includeFiles` is what ships the PDF alongside this
 * function; without it the file would be missing at runtime.
 */

type Req = { method?: string; url?: string; query?: Record<string, unknown> };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
  send: (body: Buffer | string) => void;
};

const here = dirname(fileURLToPath(import.meta.url));

/** Read once per warm instance rather than per request. */
let cached: Buffer | null = null;
function playbookBytes(): Buffer | null {
  if (cached) return cached;
  // Try the paths Vercel may resolve to depending on how the function is bundled.
  for (const p of [
    join(here, '_assets', 'playbook.pdf'),
    join(process.cwd(), 'api', '_assets', 'playbook.pdf'),
  ]) {
    try {
      cached = readFileSync(p);
      return cached;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

export default function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // Nothing can be verified, so nothing is handed out. Unlike the booking
    // gate — where failing open only risks a scheduling link — failing open
    // here would publish the product itself.
    return res.status(503).json({ error: 'unconfigured' });
  }

  const raw =
    (req.query && typeof req.query.t === 'string' && req.query.t) ||
    new URL(req.url ?? '', 'http://localhost').searchParams.get('t') ||
    '';

  const check = verifyToken(raw, secret);
  if (!check.ok) {
    return res.status(403).json({ error: 'invalid_token', reason: check.reason });
  }

  const bytes = playbookBytes();
  if (!bytes) {
    return res.status(500).json({ error: 'playbook_missing' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="AI-Builders-Playbook.pdf"');
  res.setHeader('Content-Length', String(bytes.length));
  return res.status(200).send(bytes);
}
