/**
 * Client half of the booking gate.
 *
 * The scheduling link on /teach/booked is the product — handing it to anyone
 * who types the URL means free sessions. Razorpay redirects a real buyer back
 * with signed params, so the flow is:
 *
 *   1. Read the redirect params from the URL.
 *   2. POST them to /api/verify-booking, which checks the HMAC signature with
 *      the key secret. That check cannot happen here: shipping the secret to
 *      the browser would publish it.
 *   3. Cache the verdict for this tab, then scrub the params out of the URL so
 *      a copy-pasted link (or a browser-history screenshot) can't be reused.
 *
 * If the server reports it has no secret configured, we fall back to requiring
 * well-formed params. That is a speed bump, not a security control — anyone
 * who has paid once can replay their own link. Set RAZORPAY_KEY_SECRET in
 * Vercel to close it properly.
 */

export type BookingAccess =
  | { state: 'checking' }
  /**
   * `schedulingUrl` is present only when the server verified the payment AND
   * CALENDLY_URL is set there. When it is, use it in preference to the bundled
   * constant — that's what lets the real link live outside the public bundle.
   */
  | { state: 'granted'; verified: boolean; schedulingUrl?: string }
  | { state: 'denied' };

const SESSION_KEY = 'rb-booking-verified';

const PAYMENT_ID = /^pay_[A-Za-z0-9]{6,40}$/;
const LINK_ID = /^plink_[A-Za-z0-9]{6,40}$/;
const SIGNATURE = /^[a-f0-9]{64}$/;

type RedirectParams = {
  razorpay_payment_id: string;
  razorpay_payment_link_id: string;
  razorpay_payment_link_reference_id: string;
  razorpay_payment_link_status: string;
  razorpay_signature: string;
};

/** Pulls the Razorpay redirect params off the URL, or null if they're absent//malformed. */
function readRedirectParams(search: string): RedirectParams | null {
  const q = new URLSearchParams(search);
  const params: RedirectParams = {
    razorpay_payment_id: q.get('razorpay_payment_id') ?? '',
    razorpay_payment_link_id: q.get('razorpay_payment_link_id') ?? '',
    razorpay_payment_link_reference_id: q.get('razorpay_payment_link_reference_id') ?? '',
    razorpay_payment_link_status: q.get('razorpay_payment_link_status') ?? '',
    razorpay_signature: q.get('razorpay_signature') ?? '',
  };

  const wellFormed =
    PAYMENT_ID.test(params.razorpay_payment_id) &&
    LINK_ID.test(params.razorpay_payment_link_id) &&
    SIGNATURE.test(params.razorpay_signature) &&
    params.razorpay_payment_link_status === 'paid';

  return wellFormed ? params : null;
}

/** Remembers a granted verdict so a refresh doesn't bounce a paying customer. */
function remember(verified: boolean) {
  try {
    sessionStorage.setItem(SESSION_KEY, verified ? 'verified' : 'unverified');
  } catch {
    /* sessionStorage unavailable — they just can't refresh */
  }
}

function recall(): BookingAccess | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'verified') return { state: 'granted', verified: true };
    if (stored === 'unverified') return { state: 'granted', verified: false };
  } catch {
    /* sessionStorage unavailable */
  }
  return null;
}

/** Strips the payment params so the URL isn't reusable if shared or bookmarked. */
function scrubUrl() {
  try {
    window.history.replaceState({}, '', window.location.pathname);
  } catch {
    /* non-fatal */
  }
}

export async function checkBookingAccess(search: string): Promise<BookingAccess> {
  const remembered = recall();
  if (remembered) return remembered;

  const params = readRedirectParams(search);
  if (!params) return { state: 'denied' };

  try {
    const res = await fetch('/api/verify-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    // No endpoint deployed (static-only preview, or the function is missing):
    // treat it exactly like "unconfigured" rather than denying a real buyer.
    if (!res.ok) {
      remember(false);
      scrubUrl();
      return { state: 'granted', verified: false };
    }

    const data = (await res.json()) as {
      verified?: boolean;
      configured?: boolean;
      schedulingUrl?: string;
    };

    if (data.verified) {
      remember(true);
      scrubUrl();
      const url = typeof data.schedulingUrl === 'string' ? data.schedulingUrl : undefined;
      // Only trust an https URL from the response — never render an
      // attacker-influenceable scheme like javascript: into an href.
      const safe = url && /^https:\/\//.test(url) ? url : undefined;
      return { state: 'granted', verified: true, schedulingUrl: safe };
    }

    if (data.configured === false) {
      remember(false);
      scrubUrl();
      return { state: 'granted', verified: false };
    }

    // Configured and the signature did not check out — this is a forged or
    // replayed link. Deny.
    return { state: 'denied' };
  } catch {
    // Network failure. The params were well-formed, so let them through
    // unverified rather than punishing someone who has actually paid.
    remember(false);
    scrubUrl();
    return { state: 'granted', verified: false };
  }
}
