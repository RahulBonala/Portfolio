import React, { useEffect, useState, useCallback } from 'react';
import './SessionPill.css';

const STORAGE_KEY = 'sessionPillDismissed';

const SessionPill: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  // Visibility logic: appear after the user has scrolled past the hero,
  // hide once the Course section is in view or scrolled past.
  useEffect(() => {
    if (dismissed) return;
    const course = document.getElementById('course-section');
    if (!course) return;

    const update = () => {
      const rect = course.getBoundingClientRect();
      const courseAhead = rect.top > window.innerHeight * 0.9;
      setVisible(window.scrollY > 600 && courseAhead);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [dismissed]);

  const scrollToCourse = useCallback(() => {
    const course = document.getElementById('course-section');
    if (course) course.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const dismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* sessionStorage unavailable — still hide the pill for this view */
    }
    setDismissed(true);
  }, []);

  if (dismissed) return null;

  return (
    <aside
      className={`session-pill ${visible ? 'is-visible' : ''}`}
      aria-label="Book a session shortcut"
    >
      <button
        type="button"
        className="session-pill__main"
        onClick={scrollToCourse}
        aria-label="Jump to the Sessions section"
      >
        <svg
          className="session-pill__icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Book a session</span>
        <svg
          className="session-pill__arrow"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        className="session-pill__dismiss"
        onClick={dismiss}
        aria-label="Dismiss"
        title="Dismiss"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </aside>
  );
};

export default SessionPill;
