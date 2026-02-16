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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, stop observing for better performance
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    // Use ref-based querying instead of document.querySelectorAll
    const sections = mainRef.current?.querySelectorAll('.section');
    sections?.forEach((section, index) => {
      section.classList.add('fade-in-section');
      // Add stagger delay based on section index
      (section as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
      observer.observe(section);
    });

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
          <p>Designed & Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
