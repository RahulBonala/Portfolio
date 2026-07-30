import { createHmac, timingSafeEqual } from 'node:crypto';
import { mintToken } from './_lib/token.js';
import { dbConfigured, insert } from './_lib/db.js';
import { fetchPaymentDetails, type PaymentDetails } from './_lib/razorpay.js';

/**
 * Proves, server-side, that a visitor of /teach/booked actually paid.
 *
 * WHY THIS EXISTS
 * ---------------
 * Razorpay sends the buyer back with the payment details in the query string.
 * Those params are attacker-controllable — anyone can type them, and anyone who
 * has paid once can share the URL. So nothing on the URL is believed until it
 * is checked here, on the server, where the credentials live.
 *
 * TWO REDIRECT SHAPES, TWO PROOFS
 * -------------------------------
 * 1. PAYMENT BUTTON (what the live button on /teach uses). Its widget builds
 *    the return URL as literally `callbackUrl + "?payment_id=" + paymentId`,
 *    so a bare payment id is the ONLY thing that arrives. There is no signature
 *    to verify. Instead we ask Razorpay directly what that payment is, over an
 *    authenticated server-to-server call, and accept it only when it is a real,
 *    settled payment for the price of a session. A forged id fails because it
 *    does not exist; someone else's cheaper payment fails on the amount.
 *
 * 2. PAYMENT LINK (a link issued by hand). This one is signed, so we check the
 *    HMAC-SHA256 of `payment_link_id|reference_id|status|payment_id` with the
 *    key secret, which is cheaper than a network round trip.
 *
 * SETUP: add RAZORPAY_KEY_SECRET and RAZORPAY_KEY_ID to the Vercel project's
 * environment variables (Settings → Environment Variables), from the Razorpay
 * dashboard under Account & Settings → API Keys. Neither may be prefixed with
 * VITE_, because Vite inlines any VITE_* value into the public bundle.
 *
 * With the credentials missing this endpoint reports `configured: false` and
 * the page falls back to a weaker check (see src/lib/payment.ts) rather than
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

/**
 * What a session costs, in paise. Must equal BOOKING.amountMinor in
 * src/lib/booking.ts and the amount on the Razorpay button — change the price
 * and all three move together. Deliberately duplicated rather than imported:
 * tsconfig.api.json compiles `api` alone, so reaching into src/ would pull a
 * client file into a second TypeScript project.
 */
const SESSION_AMOUNT_MINOR = 9900;
const SESSION_CURRENCY = 'INR';

/**
 * Payment states that mean the money is really there. Razorpay spells the
 * authorised state the British way; the American spelling is accepted too so a
 * future API change cannot silently lock out buyers.
 */
const SETTLED = new Set(['captured', 'authorized', 'authorised']);

function str(value: unknown, max = 200): string {
  return typeof value === 'string' && value.length <= max ? value : '';
}

/**
 * Records the buyer so Rahul has a list of who booked, and so a review can be
 * tied back to a real payment. Deliberately fire-and-forget with its own
 * try/catch: the payment is already verified by the time this runs, and a
 * database hiccup must never stop someone reaching their session.
 */
async function recordBooking(paymentId: string, linkId: string, known?: PaymentDetails | null) {
  if (!dbConfigured()) return;
  try {
    // The Payment Button path has already looked this payment up to prove it;
    // reusing that result keeps the buyer waiting on one API call, not two.
    const details = known ?? (await fetchPaymentDetails(paymentId));
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

/**
 * Proves a Payment Button return by asking Razorpay about the payment.
 *
 * A forged or invented id fails because Razorpay does not return it. Another
 * merchant's payment fails for the same reason — the lookup is authenticated as
 * us. A real but wrong payment of ours (a refund test, a different product)
 * fails the amount and currency checks. What survives all three is a settled
 * ₹99 session payment, which is exactly who should get in.
 */
async function lookupAndGrant(res: Res, paymentId: string, secret: string) {
  if (!process.env.RAZORPAY_KEY_ID) {
    // Nothing to verify *with*. Same fail-open-but-loud stance as a missing
    // secret: this is our deployment gap, not the buyer's fault.
    return res.status(200).json({ verified: false, configured: false, reason: 'unconfigured' });
  }

  const details = await fetchPaymentDetails(paymentId);

  if (!details) {
    return res.status(200).json({ verified: false, configured: true, reason: 'payment_not_found' });
  }
  if (!details.status || !SETTLED.has(details.status)) {
    return res.status(200).json({ verified: false, configured: true, reason: 'payment_not_settled' });
  }
  if (details.amountMinor !== SESSION_AMOUNT_MINOR || details.currency !== SESSION_CURRENCY) {
    return res.status(200).json({ verified: false, configured: true, reason: 'amount_mismatch' });
  }

  await recordBooking(paymentId, '', details);

  return res.status(200).json({
    verified: true,
    configured: true,
    reason: 'verified',
    ...(process.env.CALENDLY_URL ? { schedulingUrl: process.env.CALENDLY_URL } : {}),
    downloadToken: mintToken(paymentId, secret),
  });
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

  // ── Payment Button: a bare payment id, nothing to check it against ──────
  // Asking Razorpay what this payment is is the whole proof, so it runs before
  // the signature branch rejects the request for the missing link fields.
  if (PAYMENT_ID.test(paymentId) && !linkId && !signature) {
    return lookupAndGrant(res, paymentId, secret);
  }

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
