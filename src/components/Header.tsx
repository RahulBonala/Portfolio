import React, { useState, useEffect, useCallback } from 'react';
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
        <a href="#home" className="header-mark" aria-label="Back to top">
          <span className="header-mark-initials">RB</span>
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
          <a href="/resume.pdf" download="Rahul_Bonala_Resume.pdf" className="header-resume">
            Resume
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
          <a href="mailto:rahulbonala2002@gmail.com" tabIndex={isMenuOpen ? 0 : -1}>Email</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
