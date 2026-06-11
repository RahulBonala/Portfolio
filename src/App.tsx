import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Approach from './components/Approach';
import Contact from './components/Contact';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Smooth scroll (Lenis) driven by the GSAP ticker, keeping ScrollTrigger in sync
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.115 });
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links go through Lenis so smooth scroll and ScrollTrigger agree
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Global scroll-reveal system: any [data-reveal] element animates in once.
  // Parents with [data-reveal-group] stagger their direct children instead.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal || 'up';
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: dir === 'up' ? 56 : 0,
            x: dir === 'left' ? -56 : dir === 'right' ? 56 : 0,
            scale: dir === 'scale' ? 0.94 : 1,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
            delay: Number(el.dataset.revealDelay || 0),
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.fromTo(
          group.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: group, start: 'top 86%', once: true },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="App" ref={rootRef}>
      {/* Skip to main content — keyboard accessibility */}
      <a href="#home" className="skip-to-content">
        Skip to main content
      </a>

      <Preloader />
      <Cursor />
      <Header />

      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Approach />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p className="footer-name">Sri Sai Rahul Bonala</p>
          <p className="footer-role">Product Designer · Developer · Teacher</p>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/sri-sai-rahul-7b08b51b1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="footer-dot">·</span>
            <a href="https://github.com/rahulbonala" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="footer-dot">·</span>
            <a href="mailto:rahulbonala2002@gmail.com">Email</a>
            <span className="footer-dot">·</span>
            <a href="#work">Work</a>
          </div>
          <div className="footer-availability">
            <span className="footer-avail-dot" aria-hidden="true" />
            <span>Open to roles, freelance, and collaborations. Bangalore — remote anywhere.</span>
          </div>
          <p className="footer-copy">&copy; 2023–{new Date().getFullYear()} Sri Sai Rahul Bonala. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
