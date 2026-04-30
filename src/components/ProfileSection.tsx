import React from 'react';
import './ProfileSection.css';
import profileImg from '../assets/profile-headshot.jpg';
import SkillsTicker from './SkillsTicker';

const ProfileSection: React.FC = () => {
    return (
        <section id="home" className="section profile-section">
            {/* Pure CSS background — no elements floating over text */}
            <div className="hero-bg" aria-hidden="true">
                <div className="hero-bg-gradient" />
                <div className="hero-bg-grid" />
                <div className="hero-blob blob-1" />
                <div className="hero-blob blob-2" />
            </div>

            <div className="container profile-content">
                {/* ── LEFT: Text Column ── */}
                <div className="profile-text">
                    <h1>
                        I'm Sri Sai<br />
                        <span className="name-highlight">Rahul Bonala</span>
                    </h1>

                    <div className="role-badge">
                        <h2>Product Designer</h2>
                    </div>

                    <p className="hero-tagline">
                        I design and ship operational software at <strong>Smiths Detection</strong> &mdash;
                        service consoles and dashboards used daily across Europe, APAC, and North America.
                        I also write the React, Java, and Python that runs behind those screens, because
                        handoff is where most good ideas quietly die.
                    </p>

                    <div className="hero-badges">
                        <span className="badge">95% CSAT</span>
                        <span className="badge">80% Faster Maintenance</span>
                        <span className="badge">90% Less Manual Work</span>
                        <span className="badge">WCAG 2.1 AA</span>
                    </div>

                    <div className="hero-tools">
                        <span className="tools-label">Core tools:</span>
                        <span className="tool-chip">Figma</span>
                        <span className="tool-chip">Java</span>
                        <span className="tool-chip">Python</span>
                        <span className="tool-chip">React</span>
                    </div>

                    <div className="hero-cta-group">
                        <a href="#projects" className="cta-button cta-primary">
                            View My Work
                            <span className="cta-arrow">→</span>
                        </a>
                        <a href="#contact" className="cta-button cta-secondary">
                            Get In Touch
                        </a>
                        <a href="/resume.pdf" download="Rahul_Bonala_Resume.pdf" className="cta-button cta-resume">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Resume
                        </a>
                    </div>
                </div>

                {/* ── RIGHT: Image Column ── */}
                <div className="profile-image-wrapper">
                    <div className="stat-chip chip-top-right">
                        <div>
                            <strong>Bangalore</strong>
                            <span>Wiesbaden · Frankfurt</span>
                        </div>
                    </div>

                    <div className="image-frame">
                        <img
                            src={profileImg}
                            alt="Sri Sai Rahul Bonala, Product Designer — professional headshot"
                            className="profile-image"
                            loading="eager"
                            fetchPriority="high"
                            decoding="sync"
                            width="380"
                            height="420"
                        />
                    </div>

                    <div className="stat-chip chip-bottom">
                        <div className="chip-dots">
                            <span className="chip-dot dot-r" />
                            <span className="chip-dot dot-y" />
                            <span className="chip-dot dot-g" />
                        </div>
                        <div>
                            <strong>Smiths Detection</strong>
                            <span>UI/UX Designer · 2023–Present</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Ticker */}
            <div className="profile-ticker-wrapper">
                <SkillsTicker />
            </div>

            {/* Scroll indicator — sits above the ticker */}
            <div className="scroll-indicator-wrap" aria-hidden="true">
                <div className="scroll-indicator">
                    <div className="scroll-line" />
                    <span>Scroll</span>
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;
