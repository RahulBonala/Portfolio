// Single source of truth for the "Book a session" flow.
//
// IMPORTANT — two things are configured in the Razorpay dashboard, NOT here:
//   1. The amount. `razorpayButtonId` below must point at a Payment Button
//      created for the same amount as `price`. If you change the price, create
//      a new button in the dashboard and update BOTH values together.
//   2. The post-payment redirect. The button's "success/redirect URL" must be
//      https://rahulbonala.me/teach/booked — that page verifies the payment
//      before it hands out the scheduling link (see src/lib/payment.ts).
export const BOOKING = {
  price: '₹99',
  /** Amount in paise. Must match the Razorpay button and `price`. */
  amountMinor: 9900,
  currency: 'INR',
  route: '/teach',
  bookedRoute: '/teach/booked',
  razorpayButtonId: 'pl_SZtl3NKr9FohLH',
  // Scheduling link, shown on /teach/booked only after payment verification.
  calendly: 'https://calendly.com/rahulbonala06',
  slotsLabel: 'Limited slots each week',
  email: 'rahulbonala06@gmail.com',
} as const;

/**
 * Intro video for the 1:1 session, shown on /teach above the payment button.
 *
 * Set ONE of these and the video section appears; leave both empty and the
 * section is omitted entirely (no broken player, no empty box).
 *
 *   youTubeId — the 11-character id from a YouTube URL. Preferred: no file to
 *               host, and youtube-nocookie.com means no tracking cookie is set
 *               until the visitor actually presses play.
 *   file      — a self-hosted MP4 in /public (e.g. '/session-intro.mp4').
 *               Use this if you'd rather not send visitors to YouTube.
 *
 * `poster` is the still frame shown before play. Strongly recommended for the
 * self-hosted path — without it the player shows a black rectangle.
 */
export const SESSION_VIDEO = {
  youTubeId: '',
  file: '',
  poster: '',
  title: 'What a 1:1 session actually looks like',
  caption:
    'A two-minute walkthrough of how the hour runs — what you bring, what we build, and what you leave with.',
} as const;

export const hasSessionVideo = Boolean(SESSION_VIDEO.youTubeId || SESSION_VIDEO.file);
