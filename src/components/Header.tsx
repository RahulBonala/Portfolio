import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';
import './Header.css';

const NAV_LINKS = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'work', label: 'Work', index: '02' },
  { id: 'skills', label: 'Skills', index: '03' },
  { id: 'approach', label: 'Approach', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const ids = ['home', ...NAV_LINKS.map((l) => l.id)];
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-bar">
        <a href="#home" className="header-mark" aria-label="Rahul Bonala — back to top">
          <span className="header-mark-name">Rahul Bonala</span>
          <span className="header-mark-status" aria-hidden="true" />
        </a>

        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <ul>
            {NAV_LINKS.map(({ id, label, index }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`header-link ${activeSection === id ? 'active' : ''}`}
                  aria-current={activeSection === id ? 'page' : undefined}
                >
                  <span className="header-link-index">{index}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-theme"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <a href="/resume.pdf" download="Rahul_Bonala_Resume.pdf" className="header-resume" aria-label="Download resume">
            <span className="header-resume-label">Resume</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>

          <button
            className={`header-burger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        <nav aria-label="Mobile navigation">
          <ul>
            {NAV_LINKS.map(({ id, label, index }, i) => (
              <li key={id} style={{ transitionDelay: isMenuOpen ? `${0.08 + i * 0.05}s` : '0s' }}>
                <a href={`#${id}`} onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
                  <span className="menu-overlay-index">{index}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-overlay-foot">
          <a href="https://github.com/rahulbonala" target="_blank" rel="noopener noreferrer" tabIndex={isMenuOpen ? 0 : -1}>GitHub</a>
          <a href="https://www.linkedin.com/in/sri-sai-rahul-7b08b51b1/" target="_blank" rel="noopener noreferrer" tabIndex={isMenuOpen ? 0 : -1}>LinkedIn</a>
          <a href="mailto:rahulbonala06@gmail.com" tabIndex={isMenuOpen ? 0 : -1}>Email</a>
          <a href="/resume.pdf" download="Rahul_Bonala_Resume.pdf" tabIndex={isMenuOpen ? 0 : -1}>Resume</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
