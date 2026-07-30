import { useState } from 'react';
import './ReviewForm.css';

/**
 * Review form, shown only on the post-payment page.
 *
 * It takes the same token that unlocks the Playbook and sends it with the
 * review, so the server can tie the testimonial to a real payment. That is
 * the whole anti-spam design: there is no way to reach this form, or the
 * endpoint behind it, without having paid.
 *
 * Submissions are held for approval, and the copy says so plainly — telling
 * someone their words are live when they aren't is a small lie that costs
 * trust when they check.
 */
type Props = { token: string };

const ReviewForm: React.FC<Props> = ({ token }) => {
  const [form, setForm] = useState({ name: '', role: '', rating: 5, body: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [open, setOpen] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      });
      setStatus(res.ok ? 'done' : 'error');
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
        Only people who booked can leave one, so every review here is from someone
        who actually sat through a session. I approve them before they appear.
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

      <button type="submit" className="review-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send review'}
      </button>
    </form>
  );
};

export default ReviewForm;
