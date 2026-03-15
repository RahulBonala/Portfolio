import React, { useState } from 'react';
import './ProcessShowcase.css';

const steps = [
  {
    number: '01',
    phase: 'Discover',
    diamond: 'diverge',
    color: '#6366f1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Research & Discovery',
    tools: ['User Interviews', 'Heuristic Audits', 'Competitive Analysis', 'Analytics Review'],
    outcome: 'Validated problem statement backed by real user pain points and data.',
    detail: 'I use a mixed-methods approach: qualitative interviews (5–8 users per round) combined with quantitative signals from analytics. Every assumption gets challenged before a single pixel is drawn.',
  },
  {
    number: '02',
    phase: 'Define',
    diamond: 'converge',
    color: '#8b5cf6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: 'Synthesise & Define',
    tools: ['Affinity Mapping', 'Jobs-to-be-Done', 'Journey Maps', 'How Might We'],
    outcome: 'A sharp, agreed-upon design brief with measurable success metrics.',
    detail: 'I translate raw research into clear opportunity spaces using JTBD frameworks. The output is a one-page brief that aligns stakeholders, engineers, and business goals — no ambiguity allowed.',
  },
  {
    number: '03',
    phase: 'Design',
    diamond: 'diverge',
    color: '#ec4899',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Ideate & Prototype',
    tools: ['Figma', 'Crazy 8s', 'Component Systems', 'WCAG Checks'],
    outcome: 'High-fidelity, interactive prototype validated against real user flows.',
    detail: 'I prototype at the speed of thought — low-fi sketches in 30 min, hi-fi Figma in hours. Every component is built for a design system first, an isolated screen second.',
  },
  {
    number: '04',
    phase: 'Deliver',
    diamond: 'converge',
    color: '#10b981',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    title: 'Test & Ship',
    tools: ['Usability Testing', 'A/B Testing', 'Dev Handoff', 'Post-Launch Metrics'],
    outcome: 'Shipped product with measurable uplift in CSAT, task completion, and retention.',
    detail: 'I run 3–5 moderated usability tests per sprint, document findings in Confluence, and sit in on sprint reviews. I write dev-ready specs with interaction notes, edge cases, and accessibility annotations.',
  },
];

const ProcessShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="section process-section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow-pill">My Process</span>
        </div>
        <h2 className="section-title">How I Design</h2>
        <p className="section-subtitle">
          A Double Diamond approach — structured enough to be rigorous, flexible enough to move fast.
        </p>

        {/* Step Progress Tracker */}
        <div className="step-track" role="tablist" aria-label="Design process steps">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              {/* Connector line between steps */}
              {i > 0 && (
                <div className={`step-connector ${i <= activeStep ? 'passed' : ''}`} aria-hidden="true" />
              )}

              {/* Step Node */}
              <button
                role="tab"
                aria-selected={i === activeStep}
                className={`step-node ${i === activeStep ? 'active' : ''} ${i < activeStep ? 'completed' : ''}`}
                style={{ '--step-color': step.color } as React.CSSProperties}
                onClick={() => setActiveStep(i)}
                aria-label={`Step ${step.number}: ${step.phase}`}
              >
                {/* Number badge */}
                <div className="step-number-badge">
                  {i < activeStep ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Icon */}
                <div className="step-icon" aria-hidden="true">
                  {step.icon}
                </div>

                {/* Label */}
                <span className="step-label">{step.phase}</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Step Detail Card */}
        <div className="process-card" key={activeStep}>
          <div className="process-card-header" style={{ '--step-color': steps[activeStep].color } as React.CSSProperties}>
            <div className="process-icon-wrap">{steps[activeStep].icon}</div>
            <div>
              <p className="process-phase-label">Phase {steps[activeStep].number} · {steps[activeStep].phase}</p>
              <h3 className="process-card-title">{steps[activeStep].title}</h3>
            </div>
          </div>

          <p className="process-card-detail">{steps[activeStep].detail}</p>

          <div className="process-card-row">
            <div className="process-tools">
              <p className="process-row-label">Tools & Methods</p>
              <div className="process-chips">
                {steps[activeStep].tools.map((tool, i) => (
                  <span className="process-chip" key={i}>{tool}</span>
                ))}
              </div>
            </div>
            <div className="process-outcome">
              <p className="process-row-label">Outcome</p>
              <p className="process-outcome-text">✦ {steps[activeStep].outcome}</p>
            </div>
          </div>

          <div className="process-nav">
            {steps.map((_, i) => (
              <button
                key={i}
                className={`process-nav-dot ${i === activeStep ? 'active' : ''}`}
                onClick={() => setActiveStep(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessShowcase;
