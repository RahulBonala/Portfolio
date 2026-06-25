// Single source of truth for the "Book a session" flow.
//
// IMPORTANT — two things are configured in the Razorpay dashboard, NOT here:
//   1. The amount. `razorpayButtonId` below must be a Payment Button created
//      for ₹99. If the current button is still ₹49, create/replace it with a
//      ₹99 button and paste the new id here (and update `price` to match).
//   2. The post-payment redirect. Set the button's "success/redirect URL" to
//      https://rahulbonala.me/teach/booked so the Calendly link is only shown
//      after a successful payment.
export const BOOKING = {
  price: '₹99',
  route: '/teach',
  bookedRoute: '/teach/booked',
  razorpayButtonId: 'pl_SZtl3NKr9FohLH',
  // Scheduling link shown on /teach/booked after payment. Confirm/replace with
  // your real Calendly (or Cal.com) link.
  calendly: 'https://calendly.com/rahulbonala06',
  slotsLabel: 'Limited slots each week',
} as const;
