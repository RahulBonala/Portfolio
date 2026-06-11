import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Approach.css';

gsap.registerPlugin(ScrollTrigger);

const BELIEFS = [
  {
    index: 'I',
    line: 'Design and code are one job.',
    sub: 'I do both ends myself, so nothing gets lost in translation. The screens I draw are the screens I ship.',
  },
  {
    index: 'II',
    line: 'AI is not a feature. It is the workflow.',
    sub: 'I build AI products, ship with AI tools daily, and teach others to do the same. That loop is the edge.',
  },
  {
    index: 'III',
    line: 'Speed is a feature. Taste is the moat.',
    sub: 'Anyone can generate ten options in a minute now. Knowing which one to keep — that is the job.',
  },
];

const QUOTES = [
  {
    quote:
      'What sets Rahul apart is his understanding of both design and engineering. He doesn’t just hand over pretty screens — he ensures every design is actually buildable and scalable.',
    who: 'Product Stakeholder, Europe Operations — Smiths Detection',
  },
  {
    quote:
      'Rahul automated our internal reporting pipeline in Python, cutting 6-hour manual tasks to 15 minutes. A rare combination of analytical and creative thinking.',
    who: 'Cross-Functional Team Lead, APAC — Smiths Detection',
  },
];

const Approach: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Desktop: pin the stage and crossfade beliefs as the user scrolls through.
  // Mobile / reduced motion: beliefs simply stack and reveal normally.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const beliefs = gsap.utils.toArray<HTMLElement>('.approach-belief');
      // Absolute children anchor to the container's padding box, so the
      // gutter must be re-applied as left/right offsets
      gsap.set(beliefs, {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 'var(--gutter)',
        right: 'var(--gutter)',
        opacity: 0,
        yPercent: 6,
      });
      gsap.set(beliefs[0], { opacity: 1, yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.approach-stage',
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.6,
        },
      });

      beliefs.forEach((b, i) => {
        if (i === 0) return;
        tl.to(beliefs[i - 1], { opacity: 0, yPercent: -6, duration: 1, ease: 'power2.in' }, i)
          .fromTo(b, { opacity: 0, yPercent: 6 }, { opacity: 1, yPercent: 0, duration: 1, ease: 'power2.out' }, i + 0.35);
      });

      return () => {
        gsap.set(beliefs, { clearProps: 'all' });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="approach" className="section approach" ref={sectionRef}>
      <div className="container">
        <div className="sec-label">
          <em>004</em> Approach
        </div>
      </div>

      <div className="approach-stage">
        <div className="container approach-stage-inner">
          {BELIEFS.map(({ index, line, sub }) => (
            <div className="approach-belief" key={index}>
              <span className="approach-belief-index" aria-hidden="true">{index}</span>
              <h3 className="approach-belief-line">{line}</h3>
              <p className="approach-belief-sub">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container approach-quotes" data-reveal-group>
        {QUOTES.map(({ quote, who }) => (
          <blockquote className="approach-quote" key={who}>
            <p>“{quote}”</p>
            <cite>{who}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default Approach;
