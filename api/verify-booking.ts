import { createHmac, timingSafeEqual } from 'node:crypto';
import { mintToken } from './_lib/token.js';
import { dbConfigured, insert } from './_lib/db.js';
import { fetchPaymentDetails } from './_lib/razorpay.js';

/**
 * Verifies a Razorpay Payment Button redirect server-side.
 *
 * WHY THIS EXISTS
 * ---------------
 * Razorpay sends the buyer back to /teach/booked with the payment details in
 * the query string. Those params are attacker-controllable — anyone can type
 * them, and anyone who has paid once can share the URL. The only thing that
 * makes them trustworthy is `razorpay_signature`, an HMAC-SHA256 the client
 * cannot compute or check, because doing so requires the key secret. So the
 * check has to happen here, on the server, where the secret lives.
 *
 * The signed payload for a Payment Link / Payment Button redirect is:
 *   payment_link_id | payment_link_reference_id | payment_link_status | payment_id
 * joined with "|", HMAC'd with the Razorpay KEY SECRET.
 *
 * SETUP: add RAZORPAY_KEY_SECRET to the Vercel project's environment variables
 * (Settings → Environment Variables). Get it from the Razorpay dashboard under
 * Account & Settings → API Keys. It is a SECRET — it must never be prefixed
 * with VITE_, because Vite inlines any VITE_* value into the public bundle.
 *
 * Until that variable is set this endpoint reports `configured: false` and the
 * page falls back to a weaker check (see src/lib/payment.ts) rather than
 * locking out people who have genuinely paid.
 */

type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
};

const PAYMENT_ID = /^pay_[A-Za-z0-9]{6,40}$/;
const LINK_ID = /^plink_[A-Za-z0-9]{6,40}$/;
const SIGNATURE = /^[a-f0-9]{64}$/;

function str(value: unknown, max = 200): string {
  return typeof value === 'string' && value.length <= max ? value : '';
}

/**
 * Records the buyer so Rahul has a list of who booked, and so a review can be
 * tied back to a real payment. Deliberately fire-and-forget with its own
 * try/catch: the payment is already verified by the time this runs, and a
 * database hiccup must never stop someone reaching their session.
 */
async function recordBooking(paymentId: string, linkId: string) {
  if (!dbConfigured()) return;
  try {
    const details = await fetchPaymentDetails(paymentId);
    await insert(
      'bookings',
      {
        razorpay_payment_id: paymentId,
        razorpay_payment_link_id: linkId || null,
        email: details?.email ?? null,
        phone: details?.phone ?? null,
        name: details?.name ?? null,
        amount_minor: details?.amountMinor ?? null,
        currency: details?.currency ?? 'INR',
        status: 'paid',
      },
      { onConflict: 'razorpay_payment_id' }
    );
  } catch (err) {
    console.error('recordBooking failed', err instanceof Error ? err.message : err);
  }
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ verified: false, reason: 'method_not_allowed' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // Fail *open but loud*: a missing secret is a deployment gap, not a
    // fraudulent visitor, and we must not strand a paying customer.
    return res.status(200).json({ verified: false, configured: false, reason: 'unconfigured' });
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as
    | Record<string, unknown>
    | null;
  if (!body) return res.status(400).json({ verified: false, configured: true, reason: 'bad_request' });

  const paymentId = str(body.razorpay_payment_id);
  const linkId = str(body.razorpay_payment_link_id);
  const reference = str(body.razorpay_payment_link_reference_id);
  const status = str(body.razorpay_payment_link_status, 40);
  const signature = str(body.razorpay_signature, 128).trim().toLowerCase();

  if (
    !PAYMENT_ID.test(paymentId) ||
    !LINK_ID.test(linkId) ||
    !SIGNATURE.test(signature) ||
    status !== 'paid'
  ) {
    return res.status(200).json({ verified: false, configured: true, reason: 'malformed' });
  }

  const payload = `${linkId}|${reference}|${status}|${paymentId}`;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  // Both sides are fixed-length hex here, so the lengths always match and
  // timingSafeEqual cannot throw.
  const ok = timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));

  // Only a genuine payment gets recorded, so the bookings table can be trusted
  // as the list of people who actually paid.
  if (ok) await recordBooking(paymentId, linkId);

  return res.status(200).json({
    verified: ok,
    configured: true,
    reason: ok ? 'verified' : 'signature_mismatch',
    // Handed out ONLY on a verified payment. Set CALENDLY_URL in Vercel and
    // the scheduling link stops being a constant in the public JS bundle —
    // which is the difference between "hard to find" and "not there at all".
    ...(ok && process.env.CALENDLY_URL ? { schedulingUrl: process.env.CALENDLY_URL } : {}),
    // Short-lived permission to download the Playbook. Minted here because
    // this is the only place a payment has actually been proven.
    ...(ok ? { downloadToken: mintToken(paymentId, secret) } : {}),
  });
}

function safeParse(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
