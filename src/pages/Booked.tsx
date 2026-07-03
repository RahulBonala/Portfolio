import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BOOKING } from '../lib/booking';
import { RB_EVENTS } from '../lib/robomark';
import { useReveals } from '../hooks/useReveals';
import './Teach.css';

/**
 * Reached via the Razorpay payment button's success-redirect (configured in
 * the dashboard to point here). This is where the scheduling link lives, so
 * the calendar is only handed out after a successful payment.
 */
const Booked: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'Payment received — pick your slot · Rahul Bonala';
    // A booking landed — the header robot cheers
    window.dispatchEvent(new Event(RB_EVENTS.celebrate));
  }, []);

  return (
    <div className="teach booked" ref={ref}>
      <div className="container booked-inner">
        <span className="booked-mark" aria-hidden="true">✓</span>
        <p className="teach-eyebrow">Payment received</p>
        <h1 className="teach-title" data-reveal="up">Now pick your slot.</h1>
        <p className="teach-lede" data-reveal="up">
          Thanks — you’re all set on the payment side. Grab a time that works for you
          and we’ll meet 1:1 for the hour. You’ll get a calendar invite straight after.
        </p>

        <a
          className="booked-calendly"
          href={BOOKING.calendly}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal="up"
        >
          Choose a time
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
          </svg>
        </a>

        <p className="teach-foot" data-reveal="up">
          Trouble with the scheduler? <a href="mailto:rahulbonala06@gmail.com">Email me</a>{' '}
          and I’ll send you a time directly. Or head <Link to="/">back to the portfolio</Link>.
        </p>
      </div>
    </div>
  );
};

export default Booked;
