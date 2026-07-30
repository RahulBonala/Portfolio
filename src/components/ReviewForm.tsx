import { useState } from 'react';
import './ReviewForm.css';

/**
 * Review form, used in two places:
 *
 *   /teach/booked — right after payment, with the token that unlocks the
 *                   Playbook, so the review is tied to that payment.
 *   /review       — the shareable link Rahul sends after a session, where
 *                   there is no token because the ask happens days later.
 *
 * Submissions are held for approval either way, and the copy says so plainly.
 * Telling someone their words are live when they aren't is a small lie that
 * costs trust the moment they check.
 */
type Props = {
  /** Present only on the post-payment page. */
  token?: string;
  /** `inline` collapses behind a button; `standalone` is always open. */
  variant?: 'inline' | 'standalone';
};

const ReviewForm: React.FC<Props> = ({ token, variant = 'inline' }) => {
  const [form, setForm] = useState({ name: '', role: '', rating: 5, body: '', _gotcha: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error' | 'rate_limited'>('idle');
  const [open, setOpen] = useState(variant === 'standalone');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // `token` is omitted entirely when absent, which is what tells the
        // server to treat this as an invite rather than a buyer review.
        body: JSON.stringify(token ? { ...form, token } : form),
      });
      if (res.ok) setStatus('done');
      else setStatus(res.status === 429 ? 'rate_limited' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="review-done" role="status">
        <span aria-hidden="true">✓</span>
        <p>Thank you — that means a lot. I read every one before it goes up.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="review-open" onClick={() => setOpen(true)}>
        Had your session? Leave a review
      </button>
    );
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <h3 className="review-form-title">How was it?</h3>
      <p className="review-form-note">
        Every review is read before it goes up, so nothing appears on the site
        until I&apos;ve seen it. Say what actually happened, including the parts
        that didn&apos;t work.
      </p>

      <div className="review-row">
        <label className="review-field">
          <span>Your name</span>
          <input
            type="text" required maxLength={60} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="How you'd like to be credited"
          />
        </label>
        <label className="review-field">
          <span>What you do <em>(optional)</em></span>
          <input
            type="text" maxLength={60} value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Student, developer, founder…"
          />
        </label>
      </div>

      <fieldset className="review-rating">
        <legend>Rating</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={form.rating >= n ? 'is-on' : ''}>
            <input
              type="radio" name="rating" value={n}
              checked={form.rating === n}
              onChange={() => setForm({ ...form, rating: n })}
            />
            <span aria-hidden="true">★</span>
            <span className="sr-only">{n} star{n > 1 ? 's' : ''}</span>
          </label>
        ))}
      </fieldset>

      <label className="review-field">
        <span>Your review</span>
        <textarea
          required minLength={10} maxLength={600} rows={4} value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="What did you build? What clicked?"
        />
      </label>

      {status === 'error' && (
        <p className="review-error" role="alert">
          That didn’t save. Try once more, or email it to me and I’ll add it.
        </p>
      )}

      {status === 'rate_limited' && (
        <p className="review-error" role="alert">
          That’s a few reviews from here already today. If that wasn’t you, email
          it to me instead and I’ll add it myself.
        </p>
      )}

      {/* Honeypot — hidden from humans, filled by bots */}
      <div className="review-honeypot" aria-hidden="true">
        <label htmlFor="review-gotcha">Leave this field empty</label>
        <input
          type="text" id="review-gotcha" tabIndex={-1} autoComplete="off"
          value={form._gotcha}
          onChange={(e) => setForm({ ...form, _gotcha: e.target.value })}
        />
      </div>

      <button type="submit" className="review-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send review'}
      </button>
    </form>
  );
};

export default ReviewForm;
