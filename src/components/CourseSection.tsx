import React from 'react';
import PaymentButton from './PaymentButton';
import './CourseSection.css';

const SESSION_PRICE = 49;
const CONTACT_LINK = 'mailto:rahulbonala2002@gmail.com';

const steps = [
  {
    num: '01',
    title: 'Pay and book',
    desc: 'Checkout opens here. Pay ₹49 securely.',
  },
  {
    num: '02',
    title: 'Pick a time',
    desc: 'Calendly opens after payment. Choose what works.',
  },
  {
    num: '03',
    title: 'We meet for an hour',
    desc: 'Bring a project, or pick one together. We build something real.',
  },
  {
    num: '04',
    title: 'Refund if it didn\'t help',
    desc: 'If the session wasn\'t worth your time, I\'ll refund it. No questions.',
  },
];

const highlights = [
  'How I actually use AI in a real design workflow',
  'Going from blank canvas to a deployed, working project',
  'The tools, decisions, and trade-offs a working designer makes',
  'Hands-on, not theoretical',
  'A flexible hour that can run longer if your project needs it',
];

const CourseSection: React.FC = () => {

  return (
    <section id="course-section" className="section course-section">
      {/* Background decoration */}
      <div className="course-bg-grid" aria-hidden="true" />
      <div className="course-bg-glow" aria-hidden="true" />

      <div className="container">
        {/* Eyebrow */}
        <div className="section-eyebrow">
          <span className="course-eyebrow-pill">Sessions</span>
        </div>

        {/* Hero */}
        <h2 className="course-headline">A 1-on-1 design session.</h2>
        <p className="course-tagline">
          An hour, your project, and how I'd actually approach it.
        </p>

        {/* What You'll Get */}
        <div className="course-highlights">
          <h3 className="course-subheading">What we'll cover</h3>
          <ul className="course-highlights-list">
            {highlights.map((item, i) => (
              <li key={i} className="course-highlight-item">
                <span className="course-highlight-marker" aria-hidden="true">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Format Details */}
        <div className="course-details-grid">
          <div className="course-detail-card">
            <span className="course-detail-label">Format</span>
            <span className="course-detail-value">1-on-1, online</span>
          </div>
          <div className="course-detail-card">
            <span className="course-detail-label">Duration</span>
            <span className="course-detail-value">~1 hour, flexible</span>
          </div>
          <div className="course-detail-card">
            <span className="course-detail-label">Price</span>
            <span className="course-detail-value">₹{SESSION_PRICE}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="course-steps">
          <h3 className="course-subheading">How it works</h3>
          <div className="course-steps-track">
            {steps.map((step, i) => (
              <div key={i} className="course-step">
                <div className="course-step-num">{step.num}</div>
                <div className="course-step-connector" aria-hidden="true" />
                <div className="course-step-content">
                  <h4 className="course-step-title">{step.title}</h4>
                  <p className="course-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="course-action-block">
          <div className="course-price">
            <span className="course-price-current">
              <span className="course-price-currency">₹</span>
              <span className="course-price-amount">{SESSION_PRICE}</span>
            </span>
            <span className="course-price-label">/ session</span>
          </div>

          <div className="course-action-buttons">
            <PaymentButton />
          </div>
        </div>

        {/* Footer Note */}
        <p className="course-footer-note">
          If the session doesn't help, I'll refund it.{' '}
          <a href={CONTACT_LINK} className="course-contact-link">Questions before booking?</a>
        </p>
      </div>

    </section>
  );
};

export default CourseSection;
