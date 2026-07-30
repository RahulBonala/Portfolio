import { createHmac } from 'node:crypto';
import { verifyToken } from './_lib/token.js';
import { dbConfigured, insert, select } from './_lib/db.js';

/**
 * Testimonials.
 *
 *   GET  /api/reviews  → approved reviews, for public display
 *   POST /api/reviews  → submit one
 *
 * Two ways in, because they solve different problems:
 *
 *   'buyer'  — from /teach, carrying the token minted after a verified
 *              payment. Attributed to that payment id automatically.
 *   'invite' — from the shareable /review link Rahul sends after a session.
 *              No token, because the person is asked days later, long after
 *              their one-hour token expired and their browser tab closed.
 *
 * The invite path is an open write endpoint, so it carries the defences one
 * needs: a honeypot, length and shape checks, URL stripping, and per-IP rate limiting.
 * A review is published immediately ('approved'), so link spam is the primary
 * threat model. A review that needs a link can be emailed.
 *
 * A review may also carry an optional email, given so Rahul can follow up
 * about an offer or a later session. It is stored and nothing more: it is
 * absent from the GET selection below, so it cannot be read back out through
 * this endpoint even by mistake.
 *
 * The GET response is deliberately narrow: display name, role, rating, body,
 * date. Emails, phone numbers, payment ids and IP hashes never leave the
 * database.
 */

type Req = {
  method?: string;
  url?: string;
  body?: unknown;
  headers?: Record<string, unknown>;
};
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
};

type ReviewRow = {
  display_name: string;
  role: string | null;
  rating: number;
  body: string;
  created_at: string;
};

const LIMITS = { name: 60, role: 60, email: 320, body: 600 };

/** Same plausibility check the contact form uses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reviews allowed from one IP per day on the open path. */
export const INVITE_RATE_LIMIT = 3;
const RATE_WINDOW_MS = 24 * 60 * 60 * 1000;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex -- stripping control characters is the point
  return value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max);
}

function stripUrls(text: string): string {
  // Catch http://, https://, and www. prefixes
  return text.replace(/(?:https?:\/\/|www\.)\S+/gi, '[link removed]').trim();
}

/**
 * Salted hash of the caller's IP. Hashed rather than stored raw because rate
 * limiting never needs to know who someone is, and a plaintext IP list is a
 * liability with no upside.
 */
function submitterHash(req: Req, secret: string): string | null {
  const fwd = req.headers?.['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : typeof fwd === 'string' ? fwd.split(',')[0] : '';
  const ip = (raw ?? '').trim();
  if (!ip) return null;
  return createHmac('sha256', secret).update(ip).digest('hex').slice(0, 40);
}

async function overRateLimit(hash: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  try {
    const rows = await select<{ id: string }>(
      'reviews',
      `?submitter_hash=eq.${encodeURIComponent(hash)}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=${INVITE_RATE_LIMIT}`
    );
    return rows.length >= INVITE_RATE_LIMIT;
  } catch {
    // If the check itself fails, let the review through: the other defences
    // still apply, and silently dropping a genuine review is the worse outcome.
    return false;
  }
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!dbConfigured()) {
    return req.method === 'GET'
      ? res.status(200).json({ reviews: [] })
      : res.status(503).json({ ok: false, error: 'unconfigured' });
  }

  if (req.method === 'GET') {
    try {
      const rows = await select<ReviewRow>(
        'reviews',
        '?status=eq.approved&select=display_name,role,rating,body,created_at&order=created_at.desc&limit=12'
      );
      return res.status(200).json({
        reviews: rows.map((r) => ({
          name: r.display_name,
          role: r.role,
          rating: r.rating,
          body: r.body,
          date: r.created_at,
        })),
      });
    } catch {
      // A read failure should never take the page down with it.
      return res.status(200).json({ reviews: [] });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(503).json({ ok: false, error: 'unconfigured' });

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as
    | Record<string, unknown>
    | null;
  if (!body) return res.status(400).json({ ok: false, error: 'bad_request' });

  // Honeypot. Report success so a bot gets no signal to adapt to, store nothing.
  if (clean(body._gotcha, 50)) return res.status(200).json({ ok: true, pending: false });

  // A token is optional now. When present and valid it upgrades the review to
  // 'buyer' and ties it to the payment; when absent we fall back to the open
  // invite path. A FORGED token is still refused rather than downgraded —
  // someone sending one is not someone to quietly accept.
  const rawToken = typeof body.token === 'string' ? body.token.trim() : '';
  let paymentId: string | null = null;
  let source: 'buyer' | 'invite' = 'invite';

  if (rawToken) {
    const check = verifyToken(rawToken, secret);
    if (check.ok) {
      paymentId = check.paymentId;
      source = 'buyer';
    } else if (check.reason !== 'expired') {
      // An expired token is the normal case for someone reviewing days later,
      // so it falls through to the invite path. Anything else is refused.
      return res.status(403).json({ ok: false, error: 'invalid_token' });
    }
  }

  const displayName = clean(body.name, LIMITS.name);
  const role = clean(body.role, LIMITS.role);
  const email = clean(body.email, LIMITS.email);
  const text = stripUrls(clean(body.body, LIMITS.body));
  const rating = Number(body.rating);

  if (!displayName || text.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ ok: false, error: 'invalid_review' });
  }

  // Leaving it out is fine. Getting it wrong is worth saying so, because a
  // typo here means the follow-up it was given for never arrives.
  if (email && !EMAIL.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const hash = submitterHash(req, secret);
  if (source === 'invite' && hash && (await overRateLimit(hash))) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  try {
    await insert(
      'reviews',
      {
        razorpay_payment_id: paymentId,
        display_name: displayName,
        role: role || null,
        rating,
        body: text,
        status: 'approved',
        source,
        submitter_hash: hash,
        // Sent only when one was given. PostgREST rejects the whole insert for
        // a column the table does not have, so omitting the key means a
        // database that has not run the `email` migration yet still accepts
        // every review that leaves the field blank, rather than none at all.
        ...(email ? { email } : {}),
      },
      // Only the buyer path can conflict — one review per payment. Invite rows
      // have a null payment id and are excluded by the partial unique index.
      paymentId ? { onConflict: 'razorpay_payment_id' } : {}
    );
    return res.status(200).json({ ok: true, pending: false });
  } catch {
    return res.status(500).json({ ok: false, error: 'save_failed' });
  }
}

function safeParse(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
