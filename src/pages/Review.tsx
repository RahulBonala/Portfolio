import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import { useReveals } from '../hooks/useReveals';
import './Teach.css';

/**
 * The shareable review link: rahulbonala.me/review
 *
 * Sent to someone a few days after their session, when the payment token that
 * gated the post-payment form has long expired. It is therefore an open form,
 * and what it submits publishes immediately, so the endpoint behind it strips
 * URLs from the body and carries a honeypot plus per-IP rate limiting.
 *
 * Deliberately noindex (see scripts/prerender.js): it is a link to hand out,
 * not a page to be found. Indexing it would invite exactly the drive-by
 * submissions those defences exist to absorb.
 */
const Review: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'Leave a review · Zero to Live';
  }, []);

  return (
    <div className="teach booked" ref={ref}>
      <div className="container booked-inner">
        <p className="teach-eyebrow">AI Builders by Rahul</p>
        <h1 className="teach-title" data-reveal="up">How was your session?</h1>
        <p className="teach-lede" data-reveal="up">
          If we spent an hour together taking your idea to a live website, I&apos;d
          love to hear how it went. It takes a minute, and it genuinely helps the
          next person decide whether this is for them.
        </p>

        <ReviewForm variant="standalone" />

        <p className="teach-foot" data-reveal="up">
          Would rather just tell me directly?{' '}
          <a href="mailto:rahulbonala06@gmail.com">Email me</a>. Or head{' '}
          <Link to="/teach">back to the session page</Link>.
        </p>
      </div>
    </div>
  );
};

export default Review;
