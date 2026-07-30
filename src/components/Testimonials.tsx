import { useEffect, useState } from 'react';
import './Testimonials.css';

/**
 * Published reviews, shown on the home page above the contact section and
 * again on /teach under the review form.
 *
 * Renders nothing at all until there is at least one — an empty "what people
 * say" heading is worse than no section, because it advertises that nobody
 * has said anything yet.
 *
 * Fetched on the client rather than baked into the prerender so a new review
 * appears without a redeploy. The endpoint returns only the display name,
 * role, rating and body; buyer emails and payment ids never leave the
 * database.
 */
type Review = {
  name: string;
  role: string | null;
  rating: number;
  body: string;
  date: string;
};

type Props = {
  /**
   * `page` supplies its own section spacing and container, so an empty list
   * leaves no padded gap behind. `bare` expects the page to place it inside
   * an existing container.
   */
  variant?: 'page' | 'bare';
};

/**
 * The review count at which the wrapping grid becomes one scrolling row.
 * Below this a marquee reads as a bug rather than a design: three cards
 * looping through a wide viewport just looks like something broke.
 */
const MARQUEE_FROM = 5;

/**
 * Seconds each card takes to cross its own width. This sets the speed, not
 * the total loop time, so twenty reviews scroll at the same pace as five
 * instead of racing.
 */
const SECONDS_PER_CARD = 7;

/**
 * Dev-only preview. /api/reviews is a serverless function, and vite's dev
 * server does not run it, so this section is invisible under `npm run dev`
 * whatever the database holds. `?reviews=8` fabricates that many so the grid,
 * the scrolling row and the switch between them can be checked locally.
 * import.meta.env.DEV is a build-time constant, so none of this reaches
 * production.
 */
function previewReviews(): Review[] | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null;
  const asked = Number(new URLSearchParams(window.location.search).get('reviews'));
  if (!Number.isInteger(asked) || asked < 1) return null;

  return Array.from({ length: Math.min(asked, 40) }, (_, i) => ({
    name: `Sample person ${i + 1}`,
    role: ['Student', 'Founder', 'Developer', null][i % 4],
    rating: 5 - (i % 3),
    body:
      `Sample review ${i + 1}, here to check the layout. Long enough to show ` +
      'how a real paragraph of a few sentences sits inside the card.',
    date: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));
}

const Testimonials: React.FC<Props> = ({ variant = 'bare' }) => {
  const [reviews, setReviews] = useState<Review[]>(() => previewReviews() ?? []);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (previewReviews()) return;

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

  const scrolling = reviews.length >= MARQUEE_FROM;

  // The scrolling row renders the same cards twice. The animation travels
  // exactly half the track, so the second copy is what sits in the gap the
  // first one leaves and the loop has no visible seam. The copy is hidden
  // from assistive tech, which should hear each review once.
  const card = (r: Review, copy: boolean) => (
    <li
      className={copy ? 'testimonial is-copy' : 'testimonial'}
      key={`${copy ? 'copy-' : ''}${r.name}-${r.date}`}
      aria-hidden={copy || undefined}
    >
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
  );

  const inner = (
    <>
      <h2 id="testimonials-h" className="testimonials-title" data-reveal="up">
        What people said afterwards
      </h2>
      <p className="testimonials-note" data-reveal="up">
        Every one of these is from someone who booked and sat through a session.
      </p>

      {scrolling ? (
        <>
          <div className="testimonials-marquee" data-reveal="up">
            <ul
              className="testimonials-track"
              style={{
                animationDuration: `${reviews.length * SECONDS_PER_CARD}s`,
                // Left unset while running so the hover-to-pause rule in CSS
                // still wins; an inline 'running' would override it.
                animationPlayState: paused ? 'paused' : undefined,
              }}
            >
              {reviews.map((r) => card(r, false))}
              {reviews.map((r) => card(r, true))}
            </ul>
          </div>

          {/* Hovering pauses the row, but that leaves out anyone not using a
              pointer, so the control is explicit as well. */}
          <button
            type="button"
            className="testimonials-pause"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? 'Resume scrolling' : 'Pause scrolling'}
          </button>
        </>
      ) : (
        <ul className="testimonials-list" data-reveal-group>
          {reviews.map((r) => card(r, false))}
        </ul>
      )}
    </>
  );

  if (variant === 'page') {
    return (
      <section className="testimonials testimonials-page" aria-labelledby="testimonials-h">
        <div className="container">{inner}</div>
      </section>
    );
  }

  return (
    <section className="testimonials" aria-labelledby="testimonials-h">
      {inner}
    </section>
  );
};

export default Testimonials;
