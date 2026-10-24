import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const FACTS: { k: string; v: string; href?: string }[] = [
  { k: 'Now', v: 'Product Designer, AI specialist at Ginthi.ai' },
  { k: 'Built', v: 'BestAnswers.AI and Stepforge, solo' },
  { k: 'Teaching', v: 'Zero to Live, 1:1 sessions for new builders' },
  { k: 'Based', v: 'Bangalore, India. Working globally.' },
  { k: 'Channel', v: 'Pay Grade AI, daily AI news on YouTube', href: '#youtube' },
];

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
      {/* Visual layer: a still gradient + grid, nothing moving behind the copy */}
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grid" />
      </div>

      <div className="container hero-content">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-name">Sri Sai Rahul Bonala</span>
          <span className="hero-eyebrow-sep" aria-hidden="true">/</span>
          Portfolio
        </p>

        <h1 className="hero-title">
          <span className="hero-line"><span className="hero-line-inner">Product designer <em>for</em></span></span>
          <span className="hero-line"><span className="hero-line-inner"><em>the</em> AI era<span className="hero-dot">.</span></span></span>
        </h1>

        <p className="hero-sub">
          I design AI-native products and write the code that ships them,
          because handoff is where most good ideas quietly die. Right now
          that&apos;s at Ginthi.ai, where I design and build an AI-powered
          accounts payable platform from Figma to production. On my own I&apos;ve
          shipped BestAnswers.AI, Stepforge and BYOC, and every day I break down
          a new AI tool on my YouTube channel, Pay Grade AI.
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
          {FACTS.map(({ k, v, href }) => (
            <div className="hero-fact" key={k}>
              <dt>{k}</dt>
              <dd>{href ? <a className="hero-fact-link" href={href}>{v}</a> : v}</dd>
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
