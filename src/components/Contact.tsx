import { useRef, useState } from 'react';
import { RB_EVENTS } from '../lib/robomark';
import './Contact.css';

// The form posts to /api/contact, which stores the message in Supabase.
//
// Two fallbacks, in order, so an enquiry is never silently lost:
//   1. If the endpoint reports it has no database configured, or the request
//      fails outright, we hand off to the visitor's mail client with the
//      message pre-filled.
//   2. The address is shown in full above the form and is one click to copy.
//
// This replaces EmailJS, which had shipped with 'YOUR_SERVICE_ID' placeholders
// and therefore failed on every single submission.

const EMAIL = 'rahulbonala06@gmail.com';

/** Fallback when EmailJS isn't configured: open the visitor's mail client. */
function mailtoHandoff(data: { name: string; email: string; message: string }) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.name || 'the website'}`);
  const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        // Real conversion — the header robot cheers (never on the honeypot path)
        window.dispatchEvent(new Event(RB_EVENTS.celebrate));
        setFormData({ name: '', email: '', message: '', _gotcha: '' });
        setTimeout(() => setStatus('idle'), 5000);
        return;
      }

      // 503 means the database isn't wired up yet. Anything else server-side is
      // still our problem, not the visitor's — either way, hand off to mail so
      // the message reaches Rahul.
      if (res.status >= 500) {
        mailtoHandoff(formData);
        setStatus('idle');
        return;
      }

      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      // Offline or blocked. The mail client still works.
      mailtoHandoff(formData);
      setStatus('idle');
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
          A role, a freelance project, an AI idea, or a question about the course.
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
                <p>Thanks for reaching out. You&apos;ll hear from me within 24 hours.</p>
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
                    Something went wrong. Email me directly at {EMAIL}.
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
