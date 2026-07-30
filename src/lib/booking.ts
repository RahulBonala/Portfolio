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
  // Points at the event itself, not the profile page — a buyer who has just
  // paid should land on the calendar, not on a list of one thing to click.
  calendly: 'https://calendly.com/rahulbonala06/30min',
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
 * the Playbook, the prompts, the community — is what makes it feel real.
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
      'You tell me your idea when you book. Don’t have one? I’ll help you find a simple one in the first five minutes.',
      'I look at whatever you already have (a sketch, a doc, a half-finished project) before we meet.',
      'You get a one-line plan for the hour, so we both know what we’re doing before we start.',
    ],
  },
  {
    when: 'During',
    label: 'The live hour',
    note: 'Screen-shared, 1:1, on Google Meet. A conversation, not a lecture.',
    items: [
      'We walk the whole path: define, design, develop, deploy, using your idea as the example.',
      'You watch every click, every prompt, every fix. Interrupt whenever you want.',
      'When something breaks, you see exactly how I diagnose and fix it with AI. That’s the part you keep.',
    ],
  },
  {
    when: 'After',
    label: 'What you keep',
    note: 'The support doesn’t stop at 60 minutes. That’s the whole point.',
    items: [
      'The AI Builder’s Playbook: a 15-page PDF with every step written out, every tool linked, and 7 copy-paste prompts. Yours to keep.',
      'Access to the AI Builders community on WhatsApp, where you can ask questions and share what you build.',
      'Me, afterwards. Stuck next week? Message me directly. No extra charge. I want you to finish what you start.',
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
    'A two-minute walkthrough of how the hour runs: what you bring, what we build, and what you leave with.',
} as const;

export const hasSessionVideo = Boolean(SESSION_VIDEO.youTubeId || SESSION_VIDEO.file);
