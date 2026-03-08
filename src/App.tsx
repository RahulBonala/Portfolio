import { useEffect, useRef } from 'react';
import Header from './components/Header';
import ProfileSection from './components/ProfileSection';
import Projects from './components/Projects';
import AboutMe from './components/AboutMe';
import Contact from './components/Contact';
import './App.css';

function App() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll<HTMLElement>('.section');
    if (!sections) return;

    // Add base class to all sections
    sections.forEach((section) => {
      section.classList.add('fade-in-section');
    });

    // Bidirectional IntersectionObserver:
    // - When entering from bottom  → add "visible", remove "exit-top"
    // - When exiting through top   → add "exit-top", remove "visible"
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('visible');
            el.classList.remove('exit-top');
          } else {
            // Determine if it exited through the top
            const rect = entry.boundingClientRect;
            if (rect.top < 0) {
              el.classList.add('exit-top');
              el.classList.remove('visible');
            } else {
              // Exited through the bottom (scrolled back up past it)
              el.classList.remove('visible', 'exit-top');
            }
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Header />
      <main ref={mainRef}>
        <ProfileSection />
        <Projects />
        <AboutMe />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Sri Sai Rahul Bonala. All rights reserved.</p>
          <p>Designed &amp; Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
