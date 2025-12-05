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
                        This is Sri Sai Rahul Bonala, Currently working as UI/UX Designer and Software Engineer with 3 years of experience
                        designing intuitive, accessible, and high-impact digital interfaces. Proficient in Figma, Sketch, Adobe XD, HTML,
                        CSS, and Java, with expertise in user research, usability testing, and prototyping. Proven success in translating
                        complex requirements into user-centered designs, driving an 85% increase in customer satisfaction and a 40% boost
                        in positive feedback. Skilled in collaborating with cross-functional and global teams to deliver visually engaging,
                        seamless, and user-driven design solutions aligned with business goals.
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
