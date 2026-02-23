import React from 'react';
import './ProfileSection.css';
import profileImg from '../assets/profile-headshot.jpg';

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
                    <div className="hero-eyebrow">
                        <span className="eyebrow-dot" />
                        <span>Available for opportunities</span>
                    </div>

                    <h1>
                        I'm Sri Sai<br />
                        <span className="name-highlight">Rahul Bonala</span>
                    </h1>

                    <div className="role-badge">
                        <span className="role-icon">✦</span>
                        <h2>Product Designer</h2>
                    </div>

                    <p className="hero-tagline">
                        UI/UX & Developer with <strong>3+ years</strong> bridging design strategy and
                        technical execution — building AI-native digital products that are fast,
                        scalable, and WCAG-compliant.
                    </p>

                    <div className="hero-badges">
                        <span className="badge"><span>🎯</span> 95% CSAT</span>
                        <span className="badge"><span>⚡</span> 90% Faster Workflows</span>
                        <span className="badge"><span>🤖</span> AI-Native</span>
                        <span className="badge"><span>♿</span> WCAG</span>
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
                    </div>
                </div>

                {/* ── RIGHT: Image Column ── */}
                <div className="profile-image-wrapper">
                    {/* Floating stat chips — clipped to this column only */}
                    <div className="stat-chip chip-top-left">
                        <span className="chip-icon">🎨</span>
                        <div>
                            <strong>3+ Years</strong>
                            <span>Experience</span>
                        </div>
                    </div>

                    <div className="stat-chip chip-top-right">
                        <span className="chip-icon">🌍</span>
                        <div>
                            <strong>Global</strong>
                            <span>Reach</span>
                        </div>
                    </div>

                    <div className="image-frame">
                        <img
                            src={profileImg}
                            alt="Sri Sai Rahul Bonala — Product Designer"
                            className="profile-image"
                            loading="eager"
                            fetchPriority="high"
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

            {/* Scroll indicator */}
            <div className="scroll-indicator" aria-hidden="true">
                <div className="scroll-line" />
                <span>Scroll</span>
            </div>
        </section>
    );
};

export default ProfileSection;
