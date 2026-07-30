import { dbConfigured, insert, select } from './_lib/db.js';
import { verifyToken } from './_lib/token.js';

type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ recorded: false, error: 'method_not_allowed' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(503).json({ recorded: false, configured: false });
  if (!dbConfigured()) return res.status(503).json({ recorded: false, configured: false });

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as Record<string, unknown> | null;
  if (!body) return res.status(400).json({ recorded: false, error: 'bad_request' });

  const token = typeof body.t === 'string' ? body.t : '';
  const check = verifyToken(token, secret);
  if (!check.ok) {
    return res.status(403).json({ recorded: false, error: 'forbidden' });
  }

  const paymentId = check.paymentId;
  const eventUri = typeof body.eventUri === 'string' ? body.eventUri : null;
  const inviteeUri = typeof body.inviteeUri === 'string' ? body.inviteeUri : null;

  try {
    const existing = await select<{ scheduled_at: string | null }>(
      'bookings',
      `?razorpay_payment_id=eq.${encodeURIComponent(paymentId)}&select=scheduled_at`
    );

    if (existing.length > 0 && existing[0].scheduled_at) {
      return res.status(200).json({ recorded: true, alreadyScheduled: true });
    }

    await insert(
      'bookings',
      {
        razorpay_payment_id: paymentId,
        scheduled_at: new Date().toISOString(),
        calendly_event_uri: eventUri,
        calendly_invitee_uri: inviteeUri,
        status: 'scheduled'
      },
      { onConflict: 'razorpay_payment_id' }
    );

    return res.status(200).json({ recorded: true });
  } catch {
    return res.status(500).json({ recorded: false, error: 'save_failed' });
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
