import React from 'react';
import './ProfileSection.css';
import profileImg from '../assets/profile-headshot.jpg';
// import robotImg from '../assets/robot.png';

const ProfileSection: React.FC = () => {
    return (
        <section id="home" className="section profile-section">
            <div className="hero-background-elements">
                {/* Layer 1: The Process Orbit */}
                <div className="orbit-lines">
                    <div className="orbit orbit-1"></div>
                    <div className="orbit orbit-2"></div>
                    <div className="orbit orbit-3"></div>
                    <div className="orbit-dot dot-discover"><span>Discover</span></div>
                    <div className="orbit-dot dot-define"><span>Define</span></div>
                    <div className="orbit-dot dot-ideate"><span>Ideate</span></div>
                    <div className="orbit-dot dot-test"><span>Test</span></div>
                </div>

                {/* Layer 2: The Hybrid Specialist (Cards) */}
                <div className="glass-card code-card">
                    <div className="card-header">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                    </div>
                    <div className="code-content">
                        <div className="code-line"><span className="keyword">const</span> <span className="function">Design</span> = () =&gt; &#123;</div>
                        <div className="code-line indent">  <span className="keyword">return</span> (</div>
                        <div className="code-line indent-2">    &lt;<span className="tag">Magic</span> /&gt;</div>
                        <div className="code-line indent">  );</div>
                        <div className="code-line">&#125;;</div>
                    </div>
                </div>

                <div className="glass-card ui-card">
                    <div className="ui-mockup">
                        <div className="ui-header"></div>
                        <div className="ui-body">
                            <div className="ui-block"></div>
                            <div className="ui-block short"></div>
                            <div className="ui-button"></div>
                        </div>
                    </div>
                </div>

                {/* Layer 3: Metrics Bubbles */}
                <div className="glass-bubble bubble-1">
                    <span className="count">95%</span>
                    <span className="label">CSAT</span>
                </div>
                <div className="glass-bubble bubble-2">
                    <span className="icon">✨</span>
                    <span className="label">AI-Native</span>
                </div>
                <div className="glass-bubble bubble-3">
                    <span className="count">80%</span>
                    <span className="label">Faster</span>
                </div>
            </div>

            <div className="container profile-content">
                <div className="profile-text">

                    <h1>I'm Sri Sai Rahul Bonala</h1>
                    <h2>Product Designer</h2>
                    <p>
                        Product Designer (UI/UX & Developer) with 3+ years of experience unifying
                        design strategy and technical execution to build scalable, AI-native
                        digital products. Expert in rapid prototyping and developing enterprise
                        tools using an integrated workflow of Figma, Java, and Python.
                        Applying data insights to drive a 95% increase in customer satisfaction
                        and reduce workflow times by 90%, delivering intuitive, WCAG-compliant solutions
                        from concept to deployment
                    </p>
                    <p>
                        Skilled in collaborating with cross-functional teams to deliver elegant, user-centric
                        solutions from concept to deployment.
                    </p>
                    <a href="#projects" className="cta-button">View My Work</a>
                </div>
                <div className="profile-image-container">
                    <img src={profileImg} alt="Sri Sai Rahul Bonala" className="profile-image" loading="eager" fetchPriority="high" />
                    {/* <div className="robot-decoration">
                        <img src={robotImg} alt="Robot Mascot" />
                    </div> */}
                </div>
            </div>
            <div className="scroll-down">
                <span>Scroll Down</span>
                <div className="arrow">↓</div>
            </div>
        </section>
    );
};

export default ProfileSection;
