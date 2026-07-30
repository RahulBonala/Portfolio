import { useEffect, useState } from 'react';
import './Testimonials.css';

/**
 * Approved reviews from people who paid for a session.
 *
 * Renders nothing at all until there is at least one — an empty "what people
 * say" heading is worse than no section, because it advertises that nobody
 * has said anything yet.
 *
 * Fetched on the client rather than baked into the prerender so a newly
 * approved review appears without a redeploy. The endpoint returns only the
 * display name, role, rating and body; buyer emails and payment ids never
 * leave the database.
 */
type Review = {
  name: string;
  role: string | null;
  rating: number;
  body: string;
  date: string;
};

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d: { reviews?: Review[] }) => {
        if (!cancelled && Array.isArray(d.reviews)) setReviews(d.reviews);
      })
      .catch(() => {
        /* No reviews endpoint yet, or offline — the section stays hidden. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="testimonials" aria-labelledby="testimonials-h">
      <h2 id="testimonials-h" className="testimonials-title" data-reveal="up">
        What people said afterwards
      </h2>
      <p className="testimonials-note" data-reveal="up">
        Every one of these is from someone who booked and sat through a session.
      </p>

      <ul className="testimonials-list" data-reveal-group>
        {reviews.map((r) => (
          <li className="testimonial" key={`${r.name}-${r.date}`}>
            <p className="testimonial-rating" aria-label={`${r.rating} out of 5`}>
              <span aria-hidden="true">{'★'.repeat(r.rating)}</span>
              <span className="testimonial-rating-off" aria-hidden="true">
                {'★'.repeat(5 - r.rating)}
              </span>
            </p>
            <blockquote className="testimonial-body">{r.body}</blockquote>
            <p className="testimonial-who">
              <strong>{r.name}</strong>
              {r.role && <span>{r.role}</span>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Testimonials;
