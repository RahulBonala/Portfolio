import React, { useState, useEffect, useCallback } from 'react';
import './CoursePopup.css';

const CoursePopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [courseInView, setCourseInView] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('coursePopupSeen') === 'true') return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hide popup when course section is in viewport
  useEffect(() => {
    const section = document.getElementById('course-section');
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCourseInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
      localStorage.setItem('coursePopupSeen', 'true');
    }, 5000);
    return () => clearTimeout(timer);
  }, [visible]);

  const close = useCallback(() => {
    setVisible(false);
    localStorage.setItem('coursePopupSeen', 'true');
  }, []);

  const handleCTA = useCallback(() => {
    close();
    setTimeout(() => {
      const section = document.getElementById('course-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [close]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  }, [close]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [visible, close]);

  useEffect(() => {
    if (visible && !courseInView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible, courseInView]);

  // Don't show if: not visible, course section is in view, or already dismissed
  if (!visible || courseInView) return null;

  return (
    <div className="course-popup-overlay" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-labelledby="course-popup-title">
      <div className="course-popup-card">
        <button className="course-popup-close" onClick={close} aria-label="Close popup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="course-popup-badge">Limited Slots</div>

        <h2 id="course-popup-title" className="course-popup-headline">
          Learn Design That Ships.<br />
          <span className="course-popup-accent">From Zero to Live Project — with AI.</span>
        </h2>

        <p className="course-popup-subtext">
          A hands-on 1-hour session (flexible) guiding you through real-world
          design and development using AI tools — the exact workflow used in
          live projects.
        </p>

        <div className="course-popup-price">
          <span className="course-popup-price-old">₹999</span>
          <span className="course-popup-price-new">₹49</span>
          <span className="course-popup-price-save">Save ₹950</span>
        </div>

        <button className="course-popup-cta" onClick={handleCTA}>
          Claim Your Slot
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>

        <p className="course-popup-slots">Only a few bouquet slots left</p>

        <p className="course-popup-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          100% refundable after the session. No risk, all gain.
        </p>

        {/* Auto-dismiss timer bar */}
        <div className="course-popup-timer" aria-hidden="true">
          <div className="course-popup-timer-bar" />
        </div>
      </div>
    </div>
  );
};

export default CoursePopup;
