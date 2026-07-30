import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Short-lived download tokens for paid assets.
 *
 * The Playbook is a product, not a freebie, so it can't sit at a public URL.
 * But a download still has to be a plain GET the browser can follow, which
 * means the proof of payment has to travel in the URL — and anything in a URL
 * is copyable. A signed, expiring token is the standard answer: it proves the
 * server minted it, ties it to one payment, and stops working shortly after,
 * so a shared link is worthless within the hour.
 *
 * Format: base64url(paymentId.expiryMs).hexSignature
 * Signed with the same RAZORPAY_KEY_SECRET used to verify the payment, so
 * there is no second secret to configure or rotate.
 */

/** How long a download link stays valid. Long enough to finish the booking. */
export const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const b64url = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
const unb64url = (s: string) => Buffer.from(s, 'base64url').toString('utf8');

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function mintToken(paymentId: string, secret: string, now = Date.now()): string {
  const payload = `${paymentId}.${now + TOKEN_TTL_MS}`;
  return `${b64url(payload)}.${sign(payload, secret)}`;
}

// The absent-side keys are declared explicitly: Vercel type-checks each function
// with its own generated tsconfig, and without strictNullChecks TypeScript will
// not narrow a union on a boolean discriminant. Spelling both keys on both
// variants keeps `check.reason` / `check.paymentId` legal either way.
export type TokenCheck =
  | { ok: true; paymentId: string; reason?: undefined }
  | { ok: false; paymentId?: undefined; reason: 'malformed' | 'bad_signature' | 'expired' };

export function verifyToken(token: string, secret: string, now = Date.now()): TokenCheck {
  if (typeof token !== 'string' || token.length > 512) return { ok: false, reason: 'malformed' };

  const dot = token.lastIndexOf('.');
  if (dot <= 0) return { ok: false, reason: 'malformed' };

  const encoded = token.slice(0, dot);
  const supplied = token.slice(dot + 1).toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(supplied)) return { ok: false, reason: 'malformed' };

  let payload: string;
  try {
    payload = unb64url(encoded);
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const sep = payload.lastIndexOf('.');
  if (sep <= 0) return { ok: false, reason: 'malformed' };

  const paymentId = payload.slice(0, sep);
  const expiry = Number(payload.slice(sep + 1));
  if (!/^pay_[A-Za-z0-9]{6,40}$/.test(paymentId) || !Number.isFinite(expiry)) {
    return { ok: false, reason: 'malformed' };
  }

  // Check the signature BEFORE the expiry, so an attacker can't learn anything
  // from the difference between "expired" and "forged".
  const expected = sign(payload, secret);
  const equal = timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(supplied, 'hex'));
  if (!equal) return { ok: false, reason: 'bad_signature' };
  if (now > expiry) return { ok: false, reason: 'expired' };

  return { ok: true, paymentId };
}
