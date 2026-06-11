import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

const HeroScene = lazy(() => import('./three/HeroScene'));

gsap.registerPlugin(ScrollTrigger);

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

const FACTS = [
  { k: 'Now', v: 'Leading the Flipkart → CureFoods frontend migration' },
  { k: 'Built', v: 'BestAnswers.AI — multi-agent answer engine' },
  { k: 'Teaching', v: 'AI Tools for Builders — live course' },
  { k: 'Based', v: 'Bangalore, India — working globally' },
];

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [show3D, setShow3D] = useState(false);

  // Mount the 3D scene only after the page is idle, and only on capable
  // devices — everyone else keeps the CSS/SVG fallback already in place.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData || !supportsWebGL()) return;

    let cancelled = false;
    const mount = () => {
      if (!cancelled) setShow3D(true);
    };
    const useIdle = 'requestIdleCallback' in window;
    const handle = useIdle
      ? window.requestIdleCallback(mount, { timeout: 1500 })
      : window.setTimeout(mount, 600);

    return () => {
      cancelled = true;
      if (useIdle) {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, []);

  // Entrance choreography — waits for the preloader wipe on first visit
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ paused: true });
      intro
        .fromTo('.hero-line-inner', { yPercent: 112 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 })
        .fromTo('.hero-eyebrow', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.25)
        .fromTo('.hero-sub', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.5)
        .fromTo('.hero-ctas', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.62)
        .fromTo('.hero-facts > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07 }, 0.75)
        .fromTo('.hero-scrollhint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.1);

      let played = false;
      const play = () => {
        if (!played) {
          played = true;
          intro.play();
        }
      };

      let preloaded = false;
      try {
        preloaded = sessionStorage.getItem('rb-preloaded') === '1';
      } catch { /* ignore */ }

      if (preloaded) {
        play();
      } else {
        window.addEventListener('rb:preloader-done', play, { once: true });
        // Safety net in case the preloader never fires (e.g. storage blocked)
        setTimeout(play, 2400);
      }

      // Scene-change on scroll: content drifts up and fades as About arrives
      const hero = sectionRef.current;
      gsap.to('.hero-content', {
        yPercent: -14,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-visual', {
        scale: 1.12,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef} aria-label="Introduction">
      {/* Visual layer: CSS gradient + grid always on; WebGL network on top when capable */}
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grid" />
        {/* Static SVG constellation — the graceful fallback when WebGL is off */}
        {!show3D && (
          <svg className="hero-fallback-net" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
            <g stroke="rgba(242,242,239,0.12)" strokeWidth="1">
              <line x1="120" y1="160" x2="320" y2="90" /><line x1="320" y1="90" x2="520" y2="180" />
              <line x1="520" y1="180" x2="730" y2="120" /><line x1="320" y1="90" x2="420" y2="300" />
              <line x1="120" y1="160" x2="240" y2="380" /><line x1="240" y1="380" x2="420" y2="300" />
              <line x1="420" y1="300" x2="640" y2="360" /><line x1="640" y1="360" x2="730" y2="120" />
              <line x1="640" y1="360" x2="780" y2="480" /><line x1="240" y1="380" x2="380" y2="510" />
              <line x1="380" y1="510" x2="600" y2="470" /><line x1="600" y1="470" x2="780" y2="480" />
            </g>
            <g fill="#c8f542">
              <circle cx="120" cy="160" r="3.5" /><circle cx="320" cy="90" r="2.5" />
              <circle cx="520" cy="180" r="3" /><circle cx="730" cy="120" r="2.5" />
              <circle cx="420" cy="300" r="4" /><circle cx="240" cy="380" r="2.5" />
              <circle cx="640" cy="360" r="3" /><circle cx="780" cy="480" r="2.5" />
              <circle cx="380" cy="510" r="3" /><circle cx="600" cy="470" r="2.5" />
            </g>
          </svg>
        )}
        {show3D && (
          <Suspense fallback={null}>
            <div className="hero-canvas">
              <HeroScene />
            </div>
          </Suspense>
        )}
      </div>

      <div className="container hero-content">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-name">Sri Sai Rahul Bonala</span>
          <span className="hero-eyebrow-sep" aria-hidden="true">/</span>
          Portfolio
        </p>

        <h1 className="hero-title">
          <span className="hero-line"><span className="hero-line-inner">Frontend</span></span>
          <span className="hero-line"><span className="hero-line-inner">engineer <em>for</em></span></span>
          <span className="hero-line"><span className="hero-line-inner"><em>the</em> AI era<span className="hero-dot">.</span></span></span>
        </h1>

        <p className="hero-sub">
          I build production interfaces at scale — currently leading a live
          platform migration from Flipkart&apos;s stack to CureFoods&apos; own —
          and I ship AI products of my own, like BestAnswers.AI.
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
