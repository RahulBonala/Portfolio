import { useEffect } from 'react';
import Header from './components/Header';
import ProfileSection from './components/ProfileSection';
import Projects from './components/Projects';
import AboutMe from './components/AboutMe';
import Contact from './components/Contact';
import './App.css';

function App() {
  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.add('fade-in-section');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
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
