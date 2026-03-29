import React, { useState, useEffect, useCallback } from 'react';
import './CourseBanner.css';

const CourseFab: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);

  useEffect(() => {
    const courseSection = document.getElementById('course-section');
    if (!courseSection) return;

    let courseInView = false;

    const update = () => {
      setFabVisible(!courseInView);
      if (courseInView) setExpanded(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        courseInView = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 }
    );

    observer.observe(courseSection);
    update();

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToCourse = useCallback(() => {
    const section = document.getElementById('course-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setExpanded(false);
  }, []);

  return (
    <div
      className={`course-fab ${fabVisible ? 'course-fab--visible' : ''} ${expanded ? 'course-fab--expanded' : ''}`}
      role="complementary"
      aria-label="Course promotion"
    >
      {expanded && (
        <div className="course-fab__card">
          <div className="course-fab__card-header">
            <span className="course-fab__badge">95% OFF</span>
            <button className="course-fab__card-close" onClick={() => setExpanded(false)} aria-label="Collapse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <h3 className="course-fab__title">Zero → Live Project with AI</h3>
          <p className="course-fab__desc">1-on-1 hands-on session. Real workflow, real result.</p>
          <div className="course-fab__price">
            <span className="course-fab__price-old">₹999</span>
            <span className="course-fab__price-new">₹49</span>
          </div>
          <button className="course-fab__cta" onClick={scrollToCourse}>
            View Details & Register
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <p className="course-fab__refund">100% refundable after session</p>
        </div>
      )}

      <button
        className="course-fab__trigger"
        onClick={expanded ? scrollToCourse : () => setExpanded(true)}
        aria-label={expanded ? 'Go to course section' : 'View course details'}
        aria-expanded={expanded}
      >
        <span className="course-fab__trigger-dot" aria-hidden="true" />
        <span className="course-fab__trigger-text">
          <span className="course-fab__trigger-label">Course</span>
          <span className="course-fab__trigger-price">₹49</span>
        </span>
        <svg className="course-fab__trigger-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </div>
  );
};

export default CourseFab;
