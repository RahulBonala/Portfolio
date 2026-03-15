import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

// ────────────────────────────────────────────────────────────
// HOW TO SET UP EMAILJS (free tier — 200 emails/month):
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add a new "Email Service" (Gmail recommended) → copy SERVICE_ID
// 3. Create a new "Email Template" with variables:
//    {{from_name}}, {{from_email}}, {{message}}, {{to_name}}
//    → copy TEMPLATE_ID
// 4. Go to Account → API Keys → copy PUBLIC_KEY
// 5. Replace the three placeholder values below:
// ────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';    // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';    // e.g. 'abcDEFghiJKL'

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow-pill">Contact</span>
        </div>
        <h2 className="section-title">Let's Build Something Together</h2>
        <p className="section-subtitle">
          Open to full-time roles, freelance projects, and design collaborations.
        </p>

        <div className="contact-grid">
          {/* ── LEFT: Info Panel ── */}
          <div className="contact-info-panel">
            <div className="contact-availability">
              <span className="avail-dot" />
              <span>Available for opportunities</span>
            </div>

            <h3 className="contact-info-heading">Get In Touch</h3>
            <p className="contact-info-body">
              Whether it's a product design role, a UX collaboration, or an AI-native product idea —
              I'm always open to meaningful conversations. Let's talk.
            </p>

            <div className="contact-links">
              <a href="mailto:rahulbonala2002@gmail.com" className="contact-link-card">
                <div className="clc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div className="clc-text">
                  <strong>Email</strong>
                  <span>rahulbonala2002@gmail.com</span>
                </div>
                <span className="clc-arrow">→</span>
              </a>

              <a href="https://linkedin.com/in/rahul-bonala" target="_blank" rel="noopener noreferrer" className="contact-link-card">
                <div className="clc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                  </svg>
                </div>
                <div className="clc-text">
                  <strong>LinkedIn</strong>
                  <span>linkedin.com/in/rahul-bonala</span>
                </div>
                <span className="clc-arrow">→</span>
              </a>
            </div>

            <div className="contact-response-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Typical response time: within 24 hours
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="contact-form-panel">
            {status === 'success' ? (
              <div className="form-success-state">
                <div className="success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form ref={formRef} className="contact-form-inner" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className={`form-field ${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'filled' : ''}`}>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name" name="name" type="text"
                      value={formData.name} onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required placeholder="Your full name"
                    />
                  </div>
                  <div className={`form-field ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email" name="email" type="email"
                      value={formData.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className={`form-field ${focusedField === 'subject' ? 'focused' : ''} ${formData.subject ? 'filled' : ''}`}>
                  <label htmlFor="subject">What's this about?</label>
                  <select
                    id="subject" name="subject"
                    value={formData.subject} onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="">Select a topic...</option>
                    <option value="Full-Time Role">Full-Time Role / Opportunity</option>
                    <option value="Freelance Project">Freelance / Contract Project</option>
                    <option value="Collaboration">Design Collaboration</option>
                    <option value="Just Saying Hi">Just Saying Hi</option>
                  </select>
                </div>

                <div className={`form-field ${focusedField === 'message' ? 'focused' : ''} ${formData.message ? 'filled' : ''}`}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message" name="message" rows={5}
                    value={formData.message} onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                {status === 'error' && (
                  <div className="form-error-msg">
                    ⚠ Something went wrong. Please try emailing directly at rahulbonala2002@gmail.com
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <><span className="spinner" />Sending...</>
                  ) : (
                    <>Send Message <span className="submit-arrow">→</span></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
