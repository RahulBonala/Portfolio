import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BOOKING } from '../lib/booking';
import './BookCta.css';

/**
 * Persistent "Book a session" action, fixed in the bottom-right corner.
 * It's the always-visible path to the course/booking page for anyone who
 * lands on the portfolio (e.g. from the video) and doesn't know where to book.
 *
 * Shown on every route EXCEPT the booking flow itself (/teach, /teach/booked) —
 * no point offering "go book" while you're already on the booking page.
 */
const BookCta: React.FC = () => {
  const { pathname } = useLocation();
  const [shown, setShown] = useState(false);

  const onBookingFlow = pathname === BOOKING.route || pathname.startsWith('/teach');

  // Gentle entrance shortly after load (skipped visually under reduced motion
  // via CSS, but we still mount it so it's always reachable).
  useEffect(() => {
    if (onBookingFlow) return;
    const t = setTimeout(() => setShown(true), 600);
    return () => clearTimeout(t);
  }, [onBookingFlow]);

  if (onBookingFlow) return null;

  return (
    <div className={`book-cta ${shown ? 'is-shown' : ''}`}>
      <span className="book-cta-tag" aria-hidden="true">{BOOKING.slotsLabel}</span>
      <Link to={BOOKING.route} className="book-cta-btn" aria-label={`Book a 1:1 session — ${BOOKING.slotsLabel}`}>
        <span className="book-cta-dot" aria-hidden="true" />
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="book-cta-label">Book a session</span>
      </Link>
    </div>
  );
};

export default BookCta;
