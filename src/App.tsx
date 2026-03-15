import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import ProfileSection from './components/ProfileSection';
import ProcessShowcase from './components/ProcessShowcase';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import AboutMe from './components/AboutMe';
import Contact from './components/Contact';
import './App.css';

function App() {
  const mainRef = useRef<HTMLElement>(null);

  // Scroll visibility states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.round(progress)));
      setShowBackToTop(scrollTop > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll<HTMLElement>('.section');
    if (!sections) return;

    sections.forEach((section, index) => {
      if (index === 0) return;
      section.classList.add('fade-in-section');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('visible');
            el.classList.remove('exit-top');
          } else {
            const rect = entry.boundingClientRect;
            if (rect.top < 0) {
              el.classList.add('exit-top');
              el.classList.remove('visible');
            } else {
              el.classList.remove('visible', 'exit-top');
            }
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      {/* Skip to main content — keyboard accessibility */}
      <a href="#home" className="skip-to-content">
        Skip to main content
      </a>

      {/* Scroll progress bar */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />
      <Header />
      <main ref={mainRef}>
        <ProfileSection />
        <ProcessShowcase />
        <Projects />
        <Testimonials />
        <AboutMe />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-name">Sri Sai Rahul Bonala</p>
            <p className="footer-role">Product Designer · UI/UX · Developer</p>
            <div className="footer-links">
              <a href="https://www.linkedin.com/in/rahul-bonala/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <span className="footer-dot">·</span>
              <a href="https://github.com/rahulbonala" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span className="footer-dot">·</span>
              <a href="mailto:rahulbonala2002@gmail.com">Email</a>
              <span className="footer-dot">·</span>
              <a href="#projects">Projects</a>
            </div>
            <div className="footer-availability">
              <span className="footer-avail-dot" aria-hidden="true" />
              <span>Open to full-time opportunities &amp; freelance projects</span>
            </div>
            <p className="footer-copy">&copy; 2023–{new Date().getFullYear()} Sri Sai Rahul Bonala. All rights reserved. Designed &amp; Built with ❤️</p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top of page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;
