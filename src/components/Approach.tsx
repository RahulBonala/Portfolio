import './Approach.css';

/**
 * One principle, expanded with a concrete example — no scroll-jacking,
 * no pinned stage. Flows as a normal block. The anonymous testimonial
 * quotes were removed (no named, permissioned references available yet —
 * see [NEEDS CONTENT] below).
 */
const Approach: React.FC = () => {
  return (
    <section id="approach" className="section approach">
      <div className="container">
        <div className="sec-label">
          <em>004</em> Approach
        </div>

        <h2 className="approach-line" data-reveal="up">
          Design and code are <span className="approach-accent">one job.</span>
        </h2>

        <div className="approach-body" data-reveal="up">
          <p>
            Most teams split the work: a designer hands a mockup to an engineer, and
            the gap between them is where intent leaks out — the spacing drifts, the
            empty state never gets built, the animation that made the idea legible
            gets dropped for time. I close that gap by doing both ends myself.
          </p>
          <p>
            BestAnswers.AI is the clearest example. The core idea — four AI personas
            arguing, then a judge merging the strongest reasoning — only works if you
            can <em>see</em> the disagreement. I couldn&apos;t spec that in a static
            frame, so I designed it in code: built the debate view, watched four real
            model responses land, found that simultaneous streaming read as chaos,
            and redesigned the sequencing right there in the same file. Design
            decision and implementation were the same act. The verdict graph in this
            page&apos;s hero is that same idea, miniaturised.
          </p>
          <p className="approach-note">
            {/* [NEEDS CONTENT: optional — one measured outcome from BestAnswers
                (e.g. user-tested comprehension lift, or usage number) to close
                this paragraph with a number rather than a claim] */}
            That loop — design a little, build a little, let the running thing correct
            the next decision — is how everything here gets made.
          </p>
        </div>

        {/* [NEEDS CONTENT: named testimonials — name + title + company +
            explicit permission to publish. Until provided, no quotes render
            here (anonymous ones were removed per the audit). */}
      </div>
    </section>
  );
};

export default Approach;
