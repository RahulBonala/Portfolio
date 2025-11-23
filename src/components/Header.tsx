import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-content">
                <div className="logo" onClick={() => scrollToSection('home')}>
                    <h1>Rahul Bonala</h1>
                </div>
                <nav className="nav">
                    <ul>
                        <li onClick={() => scrollToSection('home')}>Home</li>
                        <li onClick={() => scrollToSection('projects')}>Projects</li>
                        <li onClick={() => scrollToSection('about')}>About Me</li>
                        <li onClick={() => scrollToSection('contact')}>Contact</li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
