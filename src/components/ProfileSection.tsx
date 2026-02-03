import React from 'react';
import './ProfileSection.css';
import profileImg from '../assets/profile-headshot.jpg';
// import robotImg from '../assets/robot.png';

const ProfileSection: React.FC = () => {
    return (
        <section id="home" className="section profile-section">
            <div className="container profile-content">
                <div className="profile-text">

                    <h1>I'm Sri Sai Rahul Bonala</h1>
                    <h2>Experience Designer</h2>
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
                    <img src={profileImg} alt="Sri Sai Rahul Bonala" className="profile-image" />
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
