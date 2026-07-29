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
  /** Live call length, in minutes. Must match the Calendly event's duration. */
  durationMinutes: 60,
} as const;

/**
 * Exactly what a buyer gets, in the order they get it.
 *
 * This is the page's main job: someone who has never met Rahul is deciding
 * whether an hour with him is worth the money, and vague promises ("we'll
 * build together") don't clear that bar. Naming the concrete artefacts —
 * a recording, a written note, a prompt pack — is what makes it feel real.
 *
 * Every line here is a PROMISE. If you can't deliver one of these on every
 * single session, delete it rather than shipping a claim you'll miss.
 */
export const SESSION_STAGES = [
  {
    when: 'Before',
    label: 'Before we meet',
    note: 'So the hour starts at full speed instead of on introductions.',
    items: [
      'You fill a short intake: what you’re building, where you’re stuck, what a win looks like.',
      'I go through your repo, Figma file or live site beforehand — you’re not paying for me to read it on the call.',
      'You get a one-line plan for the hour, so we both know what we’re doing before we start.',
    ],
  },
  {
    when: 'During',
    label: 'The live hour',
    note: 'Screen-shared, 1:1, on Google Meet. Your project — never a demo app.',
    items: [
      'We build on your actual project, together, for the full hour.',
      'My real AI workflow, in the open: which tools, which prompts, and where I stop trusting them.',
      'Every decision explained as we make it, so you can repeat it without me.',
    ],
  },
  {
    when: 'After',
    label: 'What you keep',
    note: 'The part most sessions skip — and the reason the hour still pays off a month later.',
    items: [
      'The full session recording, yours to keep.',
      'A written note: what we figured out, what to do next, and every link I referenced.',
      'My prompt pack and tool list — the same one I use daily, not a generic roundup.',
      'Seven days of async follow-up over email, for the questions that surface once you’re back in the code.',
    ],
  },
] as const;

/** Promises that de-risk the purchase. Shown right next to the price. */
export const SESSION_GUARANTEES = [
  { title: 'Full refund', body: 'If the hour didn’t help, tell me and I refund it. No form, no argument.' },
  { title: 'Free reschedule', body: 'Move your slot up to 24 hours before, as often as you need.' },
  { title: 'A real person', body: 'You’re booking me, not a junior on my behalf. Every session, every time.' },
] as const;

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
