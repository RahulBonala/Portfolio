import React, { useState, useEffect } from 'react';
import PaymentButton from './PaymentButton';
import CalendarButton from './CalendarButton';
import './CourseSection.css';

const ORIGINAL_PRICE = 999;
const DISCOUNTED_PRICE = 49;
const DISCOUNT_PERCENT = Math.round(((ORIGINAL_PRICE - DISCOUNTED_PRICE) / ORIGINAL_PRICE) * 100);
const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/eCbnBfbL';
const CALENDLY_LINK = 'https://calendly.com/rahulbonala06/30min';
const CONTACT_LINK = 'mailto:rahulbonala2002@gmail.com';

const steps = [
  {
    num: '01',
    title: 'Click Pay & Book',
    desc: 'One click takes you to secure Razorpay payment',
  },
  {
    num: '02',
    title: 'Complete Payment',
    desc: 'Pay ₹49 securely — you\'re automatically redirected next',
  },
  {
    num: '03',
    title: 'Pick Your Slot',
    desc: 'Calendly opens automatically — choose a time that works',
  },
  {
    num: '04',
    title: 'Session Happens',
    desc: 'We build, we learn, we ship — together',
  },
  {
    num: '05',
    title: '100% Refund Available',
    desc: "If you're not satisfied after the session — full refund, no drama",
  },
];

const highlights = [
  'Understand how AI fits into a real design workflow',
  'Go from blank canvas → a live, deployed project',
  'Tools, decisions, and thinking a working designer uses daily',
  'Hands-on guidance — not just theory',
  'Flexible 1-hour session (can extend based on your progress)',
];

const CourseSection: React.FC = () => {
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('session_paid') === 'true') {
      setHasPaid(true);
    }
  }, []);

  return (
    <section id="course-section" className="section course-section">
      {/* Background decoration */}
      <div className="course-bg-grid" aria-hidden="true" />
      <div className="course-bg-glow" aria-hidden="true" />

      <div className="container">
        {/* Eyebrow */}
        <div className="section-eyebrow">
          <span className="course-eyebrow-pill">
            <span className="course-eyebrow-dot" aria-hidden="true" />
            Live Course
          </span>
        </div>

        {/* Hero */}
        <h2 className="course-headline">
          Zero to Live Project <span className="course-headline-accent">with AI</span>
        </h2>
        <p className="course-tagline">
          Not a tutorial. A real workflow. A real result.
        </p>

        {/* What You'll Get */}
        <div className="course-highlights">
          <h3 className="course-subheading">What You'll Get</h3>
          <ul className="course-highlights-list">
            {highlights.map((item, i) => (
              <li key={i} className="course-highlight-item">
                <span className="course-highlight-marker" aria-hidden="true">&#x2726;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Format Details */}
        <div className="course-details-grid">
          <div className="course-detail-card">
            <span className="course-detail-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <span className="course-detail-label">Format</span>
            <span className="course-detail-value">1-on-1 Session</span>
          </div>
          <div className="course-detail-card">
            <span className="course-detail-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <span className="course-detail-label">Duration</span>
            <span className="course-detail-value">1 Hour (Flexible)</span>
          </div>
          <div className="course-detail-card">
            <span className="course-detail-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </span>
            <span className="course-detail-label">Mode</span>
            <span className="course-detail-value">Online</span>
          </div>
          <div className="course-detail-card">
            <span className="course-detail-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </span>
            <span className="course-detail-label">Slots</span>
            <span className="course-detail-value">Limited (Bouquet)</span>
          </div>
        </div>

        {/* Trust / Safety */}
        <div className="course-trust">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>
            <strong>100% Refundable</strong> after the session — if you don't feel it was worth it,
            you get your money back. No questions asked.
          </span>
        </div>

        {/* Steps */}
        <div className="course-steps">
          <h3 className="course-subheading">How It Works</h3>
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

        {/* Payment + Calendar */}
        <div className="course-action-block">
          <div className="course-price">
            <span className="course-price-original">
              <span className="course-price-original-currency">₹</span>
              {ORIGINAL_PRICE}
            </span>
            <span className="course-price-current">
              <span className="course-price-currency">₹</span>
              <span className="course-price-amount">{DISCOUNTED_PRICE}</span>
            </span>
            <span className="course-price-label">/ session</span>
            <span className="course-price-badge">{DISCOUNT_PERCENT}% OFF</span>
          </div>
          <p className="course-price-savings">
            You save ₹{(ORIGINAL_PRICE - DISCOUNTED_PRICE).toLocaleString('en-IN')} on this session
          </p>

          <div className="course-action-buttons">
            {hasPaid ? (
              <CalendarButton calendarLink={CALENDLY_LINK} />
            ) : (
              <PaymentButton paymentLink={RAZORPAY_PAYMENT_LINK} />
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="course-footer-note">
          Questions? Reach out before booking — happy to clarify anything.{' '}
          <a href={CONTACT_LINK} className="course-contact-link">Get in touch</a>
        </p>
      </div>

    </section>
  );
};

export default CourseSection;
