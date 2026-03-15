import React, { useState, useEffect, useCallback } from 'react';
import './Header.css';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track active section via IntersectionObserver
    useEffect(() => {
        const sectionIds = ['home', 'process', 'projects', 'about', 'contact'];
        const observers: IntersectionObserver[] = [];

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.4 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    }, []);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    // Close menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'process', label: 'Process' },
        { id: 'projects', label: 'Projects' },
        { id: 'about', label: 'About' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-pill">
                {/* Nav links */}
                <nav className={`nav ${isMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
                    <ul>
                        {navLinks.map(({ id, label }) => (
                            <li key={id}>
                                <button
                                    className={`nav-link ${activeSection === id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(id)}
                                    aria-current={activeSection === id ? 'page' : undefined}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Separator */}
                <span className="nav-separator" aria-hidden="true" />

                {/* Social Icons */}
                <div className="nav-icons">
                    <a
                        href="/resume.pdf"
                        download="Rahul_Bonala_Resume.pdf"
                        className="resume-btn"
                        aria-label="Download Resume"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Resume
                    </a>
                    <a
                        href="https://www.linkedin.com/in/rahul-bonala/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn"
                        aria-label="LinkedIn profile"
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a
                        href="mailto:rahulbonala2002@gmail.com"
                        className="icon-btn"
                        aria-label="Send email"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </a>
                </div>

                {/* Hamburger — mobile only */}
                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>
            </div>

            {/* Mobile overlay */}
            {isMenuOpen && <div className="nav-overlay" onClick={() => setIsMenuOpen(false)} />}
        </header>
    );
};

export default Header;
