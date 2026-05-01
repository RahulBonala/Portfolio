import React, { useState } from 'react';
import PaymentButton from './PaymentButton';
import './CourseSection.css';

const SESSION_PRICE = 49;
const CONTACT_LINK = 'mailto:rahulbonala2002@gmail.com';

const outcomes = [
  {
    title: 'A working session, not a lecture',
    body: 'You bring a project. We work on it together for the hour. I think out loud, you ask questions, we move something forward.',
  },
  {
    title: 'My actual workflow, on your problem',
    body: "Figma, AI tools, and code where it matters. Not a sanitised tutorial — the messy real thing, mapped to whatever you're stuck on.",
  },
  {
    title: 'A clear next step, in writing',
    body: 'After we hang up, you get a short note from me: what we figured out, what to do next, links to anything I referenced.',
  },
];

const goodFit = [
  "You're a designer or founder stuck mid-project",
  'You want a senior eye on something specific',
  "You'd rather build than watch a tutorial",
];

const notFit = [
  "You're looking for a structured course",
  'You want me to design it for you',
  'You\u2019re brand-new to design (start with the fundamentals first)',
];

const steps = [
  {
    num: '01',
    title: 'Pay and book',
    desc: 'Checkout opens here. Pay \u20B949 securely.',
  },
  {
    num: '02',
    title: 'Pick a time',
    desc: 'Calendly opens right after payment. Pick what works.',
  },
  {
    num: '03',
    title: 'We meet for an hour',
    desc: 'Bring your project. Or pick one together on the call.',
  },
  {
    num: '04',
    title: 'Refund if it didn\u2019t help',
    desc: "Full refund, no questions. The pitch is the work, not the price.",
  },
];

const faqs = [
  {
    q: 'What if we run over the hour?',
    a: 'I usually block 90 minutes for a one-hour session. We finish what you came for; I don\u2019t rush you out.',
  },
  {
    q: "I don't have a project yet — is this still useful?",
    a: 'Yes. We can pick something live: review your portfolio, plan a project from scratch, or work through a real interview-style brief together.',
  },
  {
    q: 'Timezones?',
    a: "I'm in Bangalore (IST). I run sessions before work or on weekends \u2014 Calendly only shows times that work for both of us.",
  },
  {
    q: 'Can I record the session?',
    a: 'Yes, please do. Whatever helps you reference what we did later.',
  },
];

const CourseSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
        <h2 className="course-headline">Spend an hour on your project.</h2>
        <p className="course-tagline">
          One-on-one. Whatever you&apos;re stuck on. &#8377;{SESSION_PRICE}.
        </p>

        {/* Personal note */}
        <div className="course-intro">
          <p>
            Hi, I&apos;m Rahul. I design and ship operational software at Smiths Detection,
            and once or twice a week I block out an hour to sit with someone on whatever
            they&apos;re working on. It isn&apos;t a course or a tutorial &mdash; it&apos;s
            an actual working session on your project, using the tools and approach I
            use every day.
          </p>
          <p>
            If we don&apos;t make real progress in that hour, I refund the &#8377;{SESSION_PRICE}.
            That&apos;s the entire pitch.
          </p>
          <p className="course-intro-signature">&mdash; Rahul</p>
        </div>

        {/* Outcomes */}
        <div className="course-outcomes">
          <h3 className="course-subheading">What an hour buys you</h3>
          <div className="course-outcome-grid">
            {outcomes.map((o, i) => (
              <div key={i} className="course-outcome">
                <span className="course-outcome-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="course-outcome-title">{o.title}</h4>
                <p className="course-outcome-body">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fit / Not fit */}
        <div className="course-fit-block">
          <div className="course-fit course-fit--yes">
            <span className="course-fit-label">A good fit if</span>
            <ul>
              {goodFit.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="course-fit course-fit--no">
            <span className="course-fit-label">Not a fit if</span>
            <ul>
              {notFit.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
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

        {/* Booking */}
        <div className="course-action-block">
          <div className="course-price">
            <span className="course-price-current">
              <span className="course-price-currency">&#8377;</span>
              <span className="course-price-amount">{SESSION_PRICE}</span>
            </span>
            <span className="course-price-label">/ one session</span>
          </div>
          <p className="course-price-note">
            One-time payment. Calendly opens immediately after.
          </p>

          <div className="course-action-buttons">
            <PaymentButton />
          </div>

          <p className="course-action-trust">
            Refund if it didn&apos;t help. I read every booking note.
          </p>
        </div>

        {/* FAQ */}
        <div className="course-faq">
          <h3 className="course-subheading">Questions, briefly answered</h3>
          <div className="course-faq-list">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`course-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="course-faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="course-faq-q">{f.q}</span>
                    <span className="course-faq-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div className="course-faq-answer" hidden={!isOpen}>
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <p className="course-footer-note">
          Still on the fence?{' '}
          <a href={CONTACT_LINK} className="course-contact-link">
            Send a quick email
          </a>{' '}
          and I&apos;ll answer before you book.
        </p>
      </div>
    </section>
  );
};

export default CourseSection;
