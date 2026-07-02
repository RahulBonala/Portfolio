import { useRef, useState } from 'react';
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
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const EMAIL = 'rahulbonala06@gmail.com';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', _gotcha: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the mailto link still works
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot filled → bot. Pretend success.
    if (formData._gotcha) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current!, EMAILJS_PUBLIC_KEY);
      setStatus('success');
      setFormData({ name: '', email: '', message: '', _gotcha: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="sec-label">
          <em>005</em> Contact
        </div>

        <h2 className="sec-title contact-title" data-reveal="up">
          Let&apos;s build<br />
          <span className="accent-word">something real.</span>
        </h2>

        <p className="contact-sub" data-reveal="up">
          A role, a freelance project, an AI idea, or a question about the course —
          I read every email and reply within a day.
        </p>

        {/* The frictionless path: one click, or one copy */}
        <div className="contact-direct" data-reveal="up">
          <a href={`mailto:${EMAIL}`} className="contact-email" data-cursor-label="Write">
            {EMAIL}
          </a>
          <button type="button" className="contact-copy" onClick={copyEmail} aria-live="polite">
            {copied ? 'Copied ✓' : 'Copy address'}
          </button>
        </div>

        <div className="contact-grid">
          {/* Form for those who prefer it */}
          <div className="contact-form-panel" data-reveal="up">
            {status === 'success' ? (
              <div className="form-success-state" role="status">
                <span className="form-success-mark" aria-hidden="true">✓</span>
                <h3>Message sent.</h3>
                <p>Thanks for reaching out — you&apos;ll hear from me within 24 hours.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name" name="name" type="text"
                      value={formData.name} onChange={handleChange}
                      required placeholder="Your name" autoComplete="name"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email" name="email" type="email"
                      value={formData.email} onChange={handleChange}
                      required placeholder="you@company.com" autoComplete="email" inputMode="email"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message" name="message" rows={5}
                    value={formData.message} onChange={handleChange}
                    required placeholder="What are we building?"
                  />
                </div>

                {status === 'error' && (
                  <p className="form-error-msg" role="alert">
                    Something went wrong — email me directly at {EMAIL}.
                  </p>
                )}

                {/* Honeypot — hidden from humans, filled by bots */}
                <div className="form-honeypot" aria-hidden="true">
                  <label htmlFor="_gotcha">Leave this field empty</label>
                  <input
                    type="text" id="_gotcha" name="_gotcha"
                    value={formData._gotcha} onChange={handleChange}
                    tabIndex={-1} autoComplete="off"
                  />
                </div>

                <button type="submit" className="form-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Elsewhere */}
          <aside className="contact-aside" data-reveal="up">
            <h3 className="contact-aside-title">Elsewhere</h3>
            <ul className="contact-aside-links">
              <li>
                <a href="https://github.com/rahulbonala" target="_blank" rel="noopener noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/sri-sai-rahul-7b08b51b1/" target="_blank" rel="noopener noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="/resume.pdf" download="Rahul_Bonala_Resume.pdf">
                  Resume (PDF) <span aria-hidden="true">↓</span>
                </a>
              </li>
            </ul>
            <p className="contact-aside-note">
              Bangalore, IST · usually replies before your next coffee.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact;
