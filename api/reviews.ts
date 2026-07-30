import { verifyToken } from './_lib/token.js';
import { dbConfigured, insert, select } from './_lib/db.js';

/**
 * Testimonials.
 *
 *   GET  /api/reviews  → the approved reviews, for public display
 *   POST /api/reviews  → submit one, gated on a paid-session token
 *
 * Two decisions worth stating, because both are the difference between a
 * testimonials section and a spam board:
 *
 * 1. Submitting requires the same token that unlocks the Playbook, so only
 *    someone who actually paid can leave a review, and it is tied to their
 *    payment id. There is no open write path.
 * 2. Reviews are created `pending`. Nothing reaches the public page until
 *    Rahul flips it to `approved` in the Supabase dashboard. A public page
 *    that renders unmoderated user text is a page you have handed to someone
 *    else to write.
 *
 * The GET response is deliberately narrow: display name, role, rating, body,
 * date. Emails, phone numbers and payment ids never leave the database.
 */

type Req = { method?: string; url?: string; body?: unknown };
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

const LIMITS = { name: 60, role: 60, body: 600 };

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  // Strip control characters so a review can't smuggle newline tricks into
  // anything that later renders it.
  // eslint-disable-next-line no-control-regex -- stripping control characters is the point
  return value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max);
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!dbConfigured()) {
    // No database yet: report an empty list rather than an error, so the page
    // simply renders without a testimonials section.
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

  // Proof of purchase. Without this, /api/reviews would be an open write
  // endpoint on a public site.
  const check = verifyToken(typeof body.token === 'string' ? body.token : '', secret);
  if (!check.ok) return res.status(403).json({ ok: false, error: 'not_a_buyer' });

  const displayName = clean(body.name, LIMITS.name);
  const role = clean(body.role, LIMITS.role);
  const text = clean(body.body, LIMITS.body);
  const rating = Number(body.rating);

  if (!displayName || text.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ ok: false, error: 'invalid_review' });
  }

  try {
    await insert(
      'reviews',
      {
        razorpay_payment_id: check.paymentId,
        display_name: displayName,
        role: role || null,
        rating,
        body: text,
        status: 'pending',
      },
      { onConflict: 'razorpay_payment_id' }
    );
    return res.status(200).json({ ok: true, pending: true });
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
