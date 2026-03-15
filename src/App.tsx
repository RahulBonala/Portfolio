import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll<HTMLElement>('.section');
    if (!sections) return;

    sections.forEach((section) => {
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
              <a href="mailto:rahulbonala2002@gmail.com">Email</a>
              <span className="footer-dot">·</span>
              <a href="#projects">Projects</a>
            </div>
            <p className="footer-copy">&copy; {new Date().getFullYear()} Sri Sai Rahul Bonala. All rights reserved. Designed &amp; Built with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
