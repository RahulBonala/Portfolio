import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BOOKING } from '../lib/booking';
import { checkBookingAccess, type BookingAccess } from '../lib/payment';
import { RB_EVENTS } from '../lib/robomark';
import BookingSteps from '../components/BookingSteps';
import ReviewForm from '../components/ReviewForm';
import { useReveals } from '../hooks/useReveals';
import './Teach.css';

/**
 * Reached via the Razorpay payment button's success-redirect (configured in
 * the dashboard to point here).
 *
 * The scheduling link is the thing being sold, so it is NOT rendered until the
 * payment behind this visit has been checked — see src/lib/payment.ts. Anyone
 * arriving without a valid payment gets pointed at the booking page instead.
 */
const Booked: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [access, setAccess] = useState<BookingAccess>({ state: 'checking' });
  const [retrying, setRetrying] = useState(false);
  useReveals(ref);

  useEffect(() => {
    let cancelled = false;
    // There's no URL to read during the build-time prerender; the real check
    // runs on the client, which is also the only place the gate matters.
    checkBookingAccess(window.location.search).then((result) => {
      if (!cancelled) setAccess(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (access.state === 'granted') {
      document.title = 'Payment received. Pick your slot · Rahul Bonala';
      // A booking landed — the header robot cheers
      window.dispatchEvent(new Event(RB_EVENTS.celebrate));
    } else if (access.state === 'denied') {
      document.title = 'Book a session · Rahul Bonala';
    }
  }, [access.state]);

  const retryVerification = async () => {
    setRetrying(true);
    const result = await checkBookingAccess(window.location.search);
    setAccess(result);
    setRetrying(false);
  };

  if (access.state === 'checking') {
    return (
      <div className="teach booked" ref={ref}>
        <div className="container booked-inner">
          <p className="teach-eyebrow" role="status">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  if (access.state === 'denied') {
    return (
      <div className="teach booked" ref={ref}>
        <div className="container booked-inner">
          <p className="teach-eyebrow">Nothing to confirm yet</p>
          <h1 className="teach-title" data-reveal="up">Let&apos;s get you booked.</h1>
          <p className="teach-lede" data-reveal="up">
            This is where the scheduling link appears once a session is paid for, and
            we couldn&apos;t match this visit to a payment. If you haven&apos;t booked
            yet, start here. It takes a minute.
          </p>

          <Link className="booked-calendly" to={BOOKING.route} data-reveal="up">
            Book a session for {BOOKING.price}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>

          <p className="teach-foot" data-reveal="up">
            Already paid and landed here by mistake?{' '}
            <a href={`mailto:${BOOKING.email}`}>Email me</a> with your payment id
            and I&apos;ll send you a time directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="teach booked" ref={ref}>
      <div className="container booked-inner">
        <span className="booked-mark" aria-hidden="true">✓</span>
        <p className="teach-eyebrow">Payment received</p>
        <h1 className="teach-title" data-reveal="up">Now pick your slot.</h1>
        <p className="teach-lede" data-reveal="up">
          Thanks, you’re all set on the payment side. Grab a time that works for you
          and we’ll meet 1:1 for the hour. You’ll get a calendar invite straight after.
        </p>

        <BookingSteps
          stage="paid"
          verified={access.verified}
          paymentId={access.paymentId}
          schedulingUrl={access.schedulingUrl}
          downloadToken={access.downloadToken}
          verificationIssue={access.verificationIssue}
          retrying={retrying}
          onRetry={retryVerification}
        />

        {/* Same token as the download: only a real buyer can review. */}
        {access.downloadToken && <ReviewForm token={access.downloadToken} />}

        <p className="teach-foot" data-reveal="up">
          Trouble with the scheduler, or need the Playbook again?{' '}
          <a href={`mailto:${BOOKING.email}`}>Email me</a> and I’ll sort it out.
          Or head <Link to="/">back to the portfolio</Link>.
        </p>
      </div>
    </div>
  );
};

export default Booked;
