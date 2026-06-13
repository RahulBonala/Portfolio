import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { scrollState, scrollToTop, scrollToHash } from './lib/scroll';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';
import Teach from './pages/Teach';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scrolls to top (or to the hash target) on every route change. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Let the new page lay out before measuring hash targets
    requestAnimationFrame(() => {
      if (hash && scrollToHash(hash)) return;
      scrollToTop();
      ScrollTrigger.refresh();
    });
  }, [pathname, hash]);

  return null;
}

function App() {
  // Smooth scroll (Lenis) driven by the GSAP ticker, keeping ScrollTrigger in sync
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.115 });
    scrollState.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchor links go through Lenis so smooth scroll and
    // ScrollTrigger agree; router links are left to react-router.
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
      scrollState.lenis = null;
    };
  }, []);

  // Debounced refresh keeps ScrollTrigger positions correct across viewport
  // resizes and orientation changes (the audit's "resize blackout" class).
  useEffect(() => {
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return (
    <div className="App">
      {/* Skip to main content — keyboard accessibility */}
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>

      <Preloader />
      <Cursor />
      <ScrollManager />
      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/teach" element={<Teach />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p className="footer-name">Sri Sai Rahul Bonala</p>
          <p className="footer-role">Product Designer · Developer · Teacher</p>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/sri-sai-rahul-7b08b51b1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="footer-dot" aria-hidden="true">·</span>
            <a href="https://github.com/rahulbonala" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="footer-dot" aria-hidden="true">·</span>
            <a href="mailto:rahulbonala06@gmail.com">Email</a>
            <span className="footer-dot" aria-hidden="true">·</span>
            <Link to="/teach">Live sessions</Link>
          </div>
          <p className="footer-copy">&copy; 2023–{new Date().getFullYear()} Sri Sai Rahul Bonala. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
