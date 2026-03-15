import React, { useState, useEffect, useCallback } from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Senior Manager',
    role: 'Smiths Detection, UK',
    initials: 'SM',
    color: '#6366f1',
    quote: 'Rahul consistently delivers beyond expectations. His ability to translate complex operational data into clean, intuitive interfaces reduced our maintenance team\'s training time by weeks. The service console redesign was a breakthrough.',
    metric: '80% faster maintenance workflows',
  },
  {
    name: 'Product Stakeholder',
    role: 'Europe Operations, Smiths Detection',
    initials: 'PS',
    color: '#8b5cf6',
    quote: 'What sets Rahul apart is his understanding of both design and engineering. He doesn\'t just hand over pretty screens — he participates in technical reviews and ensures every design is actually buildable and scalable.',
    metric: '95% CSAT across 4 regions',
  },
  {
    name: 'Cross-Functional Team Lead',
    role: 'APAC Region, Smiths Detection',
    initials: 'TL',
    color: '#ec4899',
    quote: 'Rahul automated our internal reporting pipeline in Python, cutting 6-hour manual tasks to 15 minutes. That\'s not a typical skill for a designer — it shows a rare combination of analytical and creative thinking.',
    metric: '90% reduction in manual effort',
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow-pill">Social Proof</span>
        </div>
        <h2 className="section-title">Impact in Their Words</h2>
        <p className="section-subtitle">Feedback from colleagues and stakeholders at Smiths Detection.</p>

        <div className="testimonials-wrapper"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="testimonial-card" key={activeIndex}>
            <div className="testimonial-quote-icon" aria-hidden="true">"</div>
            <blockquote className="testimonial-text">
              {testimonials[activeIndex].quote}
            </blockquote>
            <div className="testimonial-metric">
              <span className="metric-badge">✦ {testimonials[activeIndex].metric}</span>
            </div>
            <div className="testimonial-author">
              <div
                className="author-avatar"
                style={{ background: testimonials[activeIndex].color }}
              >
                {testimonials[activeIndex].initials}
              </div>
              <div className="author-info">
                <strong className="author-name">{testimonials[activeIndex].name}</strong>
                <span className="author-role">{testimonials[activeIndex].role}</span>
              </div>
            </div>
          </div>

          <div className="testimonial-controls">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Side previews */}
          <div className="testimonial-nav">
            <button
              className="tnav-btn"
              onClick={() => setActiveIndex(i => (i - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              className="tnav-btn"
              onClick={next}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        {/* Stats row below */}
        <div className="impact-stats-row">
          {[
            { value: '95%', label: 'CSAT Score', sub: 'Global customer satisfaction' },
            { value: '80%', label: 'Faster Workflows', sub: 'Maintenance time reduction' },
            { value: '3+', label: 'Years Experience', sub: 'Industry product design' },
            { value: '70%', label: 'Fewer Support Tickets', sub: 'Post usability testing' },
          ].map((stat, i) => (
            <div className="impact-stat" key={i}>
              <strong className="impact-value">{stat.value}</strong>
              <span className="impact-label">{stat.label}</span>
              <span className="impact-sub">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
