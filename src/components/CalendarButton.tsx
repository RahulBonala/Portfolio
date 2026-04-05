import React from 'react';

interface CalendarButtonProps {
  calendarLink: string;
}

const CalendarButton: React.FC<CalendarButtonProps> = ({ calendarLink }) => {
  return (
    <div className="course-calendar-wrap">
      <a
        href={calendarLink}
        target="_blank"
        rel="noopener noreferrer"
        className="course-calendar-btn course-calendar-btn--active"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Book Another Slot
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
      <p className="course-calendar-hint">You've already paid — book your session directly</p>
    </div>
  );
};

export default CalendarButton;
