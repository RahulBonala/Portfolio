import React, { useState, useEffect } from 'react';

interface CalendarButtonProps {
  isPaid: boolean;
  calendarLink: string;
}

const CalendarButton: React.FC<CalendarButtonProps> = ({ isPaid: propIsPaid, calendarLink }) => {
  const [isPaid, setIsPaid] = useState(propIsPaid);

  useEffect(() => {
    const alreadyPaid = localStorage.getItem('coursePaid') === 'true';
    if (alreadyPaid) setIsPaid(true);
  }, []);

  useEffect(() => {
    if (propIsPaid) setIsPaid(true);
  }, [propIsPaid]);

  return (
    <div
      className="course-calendar-wrap"
      title={!isPaid ? 'Complete payment above to unlock your slot' : ''}
    >
      <button
        disabled={!isPaid}
        onClick={() => window.open(calendarLink, '_blank')}
        className={`course-calendar-btn ${isPaid ? 'course-calendar-btn--active' : 'course-calendar-btn--locked'}`}
      >
        {isPaid ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Your Slot
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Book Your Slot (Locked)
          </>
        )}
      </button>
      {!isPaid && (
        <p className="course-calendar-hint">Complete payment first to unlock</p>
      )}
    </div>
  );
};

export default CalendarButton;
