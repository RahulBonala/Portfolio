import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  { k: 'Now', v: 'Product Designer — AI specialist at Ginthi.ai' },
  { k: 'Built', v: 'BestAnswers.AI — multi-agent answer engine' },
  { k: 'Teaching', v: 'AI Tools for Builders — live sessions' },
  { k: 'Based', v: 'Bangalore, India — working globally' },
];

/**
 * Self-referential hero visual: a live miniature of the BestAnswers debate
 * graph — four persona nodes exchange messages and converge on a verdict.
 * Pure SVG + SMIL motion (hidden under prefers-reduced-motion via CSS),
 * theme-aware through CSS custom properties, ≤30% visual weight by design.
 */
const DebateGraph = () => {
  const personas = [
    { id: 'p1', label: 'researcher', x: 120, y: 110 },
    { id: 'p2', label: 'engineer', x: 80, y: 290 },
    { id: 'p3', label: 'friend', x: 150, y: 460 },
    { id: 'p4', label: 'academic', x: 330, y: 60 },
  ];
  const verdict = { x: 560, y: 280 };

  return (
    <svg className="hero-graph" viewBox="0 0 760 560" aria-hidden="true" focusable="false">
      {/* debate edges between personas */}
      <g className="hg-edge hg-edge--debate">
        <path id="hg-d1" d="M 120 110 C 90 180, 85 220, 80 290" />
        <path id="hg-d2" d="M 80 290 C 100 360, 120 400, 150 460" />
        <path id="hg-d3" d="M 120 110 C 190 80, 250 65, 330 60" />
      </g>

      {/* persona → verdict edges */}
      <g className="hg-edge">
        <path id="hg-e1" d="M 120 110 C 300 130, 440 190, 560 280" />
        <path id="hg-e2" d="M 80 290 C 250 290, 410 285, 560 280" />
        <path id="hg-e3" d="M 150 460 C 320 430, 450 360, 560 280" />
        <path id="hg-e4" d="M 330 60 C 430 110, 510 190, 560 280" />
      </g>

      {/* messages travelling toward the verdict (SMIL; hidden under PRM) */}
      <g className="hg-dots">
        {[
          { path: '#hg-e1', dur: '5.2s', begin: '0s' },
          { path: '#hg-e2', dur: '4.6s', begin: '1.4s' },
          { path: '#hg-e3', dur: '5.8s', begin: '2.6s' },
          { path: '#hg-e4', dur: '4.9s', begin: '3.4s' },
        ].map((d, i) => (
          <circle key={i} className="hg-dot" r="3.5">
            <animateMotion dur={d.dur} begin={d.begin} repeatCount="indefinite" rotate="none">
              <mpath href={d.path} />
            </animateMotion>
          </circle>
        ))}
      </g>

      {/* persona nodes */}
      {personas.map((p) => (
        <g key={p.id} className="hg-node">
          <circle cx={p.x} cy={p.y} r="7" className="hg-node-dot" />
          <circle cx={p.x} cy={p.y} r="14" className="hg-node-ring" />
          <text x={p.x + 22} y={p.y + 4} className="hg-label">{p.label}</text>
        </g>
      ))}

      {/* verdict node */}
      <g className="hg-node hg-node--verdict">
        <circle cx={verdict.x} cy={verdict.y} r="11" className="hg-node-dot" />
        <circle cx={verdict.x} cy={verdict.y} r="22" className="hg-node-ring hg-verdict-pulse" />
        <text x={verdict.x + 32} y={verdict.y + 4} className="hg-label hg-label--verdict">verdict</text>
      </g>
    </svg>
  );
};

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Entrance choreography — waits for the preloader wipe on first visit
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap
          .timeline()
          .fromTo('.hero-line-inner', { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 })
          .fromTo('.hero-eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.15)
          .fromTo('.hero-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.3)
          .fromTo('.hero-ctas', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.4)
          .fromTo('.hero-facts > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.05 }, 0.5)
          .fromTo('.hero-scrollhint', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.8);
      };

      let preloaded = false;
      try {
        preloaded = sessionStorage.getItem('rb-preloaded') === '1';
      } catch { /* ignore */ }

      if (preloaded) {
        play();
      } else {
        window.addEventListener('rb:preloader-done', play, { once: true });
        setTimeout(play, 1700); // safety net if the preloader never fires
      }

      // Scene-change on scroll: content drifts up and fades as About arrives
      const hero = sectionRef.current;
      gsap.to('.hero-content', {
        yPercent: -10,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-visual', {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef} aria-label="Introduction">
      {/* Visual layer: gradient + grid + the BestAnswers debate-graph miniature */}
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grid" />
        <DebateGraph />
      </div>

      <div className="container hero-content">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-name">Sri Sai Rahul Bonala</span>
          <span className="hero-eyebrow-sep" aria-hidden="true">/</span>
          Portfolio
        </p>

        <h1 className="hero-title">
          <span className="hero-line"><span className="hero-line-inner">Product</span></span>
          <span className="hero-line"><span className="hero-line-inner">designer <em>for</em></span></span>
          <span className="hero-line"><span className="hero-line-inner"><em>the</em> AI era<span className="hero-dot">.</span></span></span>
        </h1>

        <p className="hero-sub">
          I design AI-native products and write the code that ships them —
          because handoff is where most good ideas quietly die. Right now
          that&apos;s at Ginthi.ai, and on my own products like BestAnswers.AI.
        </p>

        <div className="hero-ctas">
          <a href="#work" className="hero-cta-primary" data-cursor-label="View">
            Selected work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
          <a href="#contact" className="hero-cta-secondary">
            Get in touch
          </a>
        </div>
      </div>

      <div className="hero-facts-wrap">
        <dl className="container hero-facts">
          {FACTS.map(({ k, v }) => (
            <div className="hero-fact" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-scrollhint" aria-hidden="true">
        <span className="hero-scrollhint-line" />
        Scroll
      </div>
    </section>
  );
};

export default Hero;
