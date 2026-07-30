/**
 * Fetches the buyer's details for a payment Razorpay has already told us about.
 *
 * The redirect only carries ids and a signature — it does NOT include the
 * customer's email or phone, and it would be worthless if it did, because
 * anything in a URL is attacker-supplied. The only trustworthy source is
 * Razorpay's own API, called server-to-server with the key credentials.
 *
 * Needs RAZORPAY_KEY_ID alongside the secret already used for signature
 * verification. Without it this returns null and the booking is stored with
 * just the payment id, which is still enough to gate the download.
 */

export type PaymentDetails = {
  email: string | null;
  phone: string | null;
  name: string | null;
  amountMinor: number | null;
  currency: string | null;
};

const PAYMENT_ID = /^pay_[A-Za-z0-9]{6,40}$/;

function str(v: unknown, max = 320): string | null {
  return typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : null;
}

export async function fetchPaymentDetails(paymentId: string): Promise<PaymentDetails | null> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !PAYMENT_ID.test(paymentId)) return null;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      console.error('razorpay payment fetch failed', res.status);
      return null;
    }

    const p = (await res.json()) as Record<string, unknown>;
    const notes = (p.notes ?? {}) as Record<string, unknown>;

    return {
      email: str(p.email),
      phone: str(p.contact, 32),
      // Razorpay has no first-class name field on a payment; buyers usually
      // land in notes.name when the checkout form collects it.
      name: str(notes.name) ?? str(notes.Name),
      amountMinor: Number.isInteger(p.amount) ? (p.amount as number) : null,
      currency: str(p.currency, 8),
    };
  } catch (err) {
    // Never let a details lookup break the booking flow — the payment is
    // already verified at this point and the buyer must get their session.
    console.error('razorpay payment fetch error', err instanceof Error ? err.message : err);
    return null;
  }
}
