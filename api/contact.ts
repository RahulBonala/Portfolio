import { dbConfigured, insert } from './_lib/db.js';

/**
 * Contact form submissions.
 *
 * Replaces the EmailJS relay: messages land in the database, where they can't
 * be lost to a third-party free tier and don't depend on the visitor having a
 * mail client configured.
 *
 * This is an open write endpoint — it has to be, since anyone may contact you —
 * so it carries the defences an open endpoint needs: a honeypot, length caps,
 * a plausibility check on the email, and no echoing of stored content back to
 * the caller.
 */

type Req = { method?: string; body?: unknown; headers?: Record<string, unknown> };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
};

const LIMITS = { name: 100, email: 320, message: 4000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex -- stripping control characters is the point
  return value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max);
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as
    | Record<string, unknown>
    | null;
  if (!body) return res.status(400).json({ ok: false, error: 'bad_request' });

  // Honeypot. A bot fills every field it finds; a human never sees this one.
  // Report success so the bot has no signal to adapt to, and store nothing.
  if (clean(body._gotcha, 50)) return res.status(200).json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (!name || !EMAIL.test(email) || message.length < 2) {
    return res.status(400).json({ ok: false, error: 'invalid_message' });
  }

  if (!dbConfigured()) {
    // Be honest rather than swallowing the message: the client falls back to
    // a mailto handoff so the enquiry still reaches Rahul.
    return res.status(503).json({ ok: false, error: 'unconfigured' });
  }

  try {
    await insert('contact_messages', {
      name,
      email,
      message,
      user_agent: clean(req.headers?.['user-agent'], 300) || null,
    });
    return res.status(200).json({ ok: true });
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
