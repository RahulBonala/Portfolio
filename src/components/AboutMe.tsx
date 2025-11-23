import React from 'react';
import './AboutMe.css';

const AboutMe: React.FC = () => {
    return (
        <section id="about" className="section about-section">
            <div className="container">
                <h2 className="section-title">About Me</h2>

                <div className="about-content">
                    <div className="about-column">
                        <h3>My Journey</h3>
                        <p>
                            As a passionate developer and designer, I've spent the last several years honing my skills in creating digital
                            experiences that are both beautiful and functional. My journey began with a curiosity about how things work, which
                            evolved into a deep passion for building solutions that make a real impact.
                        </p>

                        <div className="experience-item">
                            <h4>UI/UX Designer | Smiths Detection</h4>
                            <span className="date">Jan 2023 – Present</span>
                            <ul>
                                <li>Streamlined the user experience (UX) across 3 major projects by translating actionable data insights into data-driven
                                    UI design decisions </li>
                                <li>Global customer satisfaction increased by 85% across Europe, North America, Asia-Pacific, and the Middle East by
                                    deploying timely and visually consistent UI enhancements </li>
                                <li>Engineered a Service Console Interface for airport technicians that reduced maintenance time by 30%, improved
                                    diagnostic accuracy, and simplified complex workflows </li>
                                <li>Executed complete UI redesign using Java, HTML, and CSS, resulting in a 40% increase in positive user feedback </li>
                                during FY25
                                <li>Conducted 3 comprehensive usability tests, analyzing user feedback to implement key enhancements that
                                    decreased customer support requests by 30% </li>
                                <li>Automated internal data visualization and project tracking processes using Python, which reduced manual effort by
                                    90%, decreased data errors by 95%, and increased overall team efficiency by 70% </li>
                                <li>Accelerated design insights and decision-making by reducing manual data processing time from 6 hours to just 15
                                    minutes through targeted automation </li>
                                <li>Led client-facing engagements in Wiesbaden, Germany, including product demonstrations, UI/hardware feedback
                                    sessions, and end-user training for airport personnel to drive product adoption </li>
                                <li>Partnered with developers and product managers to align UX strategy with technical feasibility, ensuring consistent
                                    design quality and system reliability across all releases </li>
                                <li>Developed internal UI/UX documentation and accessibility standards to establish consistent, high-quality user
                                    experience across all company platforms </li>
                                <li>Created detailed wireframes, high-fidelity prototypes, and visual mockups aligned with user feedback and core
                                    business requirements </li>
                            </ul>
                        </div>

                        <div className="experience-item">
                            <h4>Bachelor of Technology | SASTRA University</h4>
                            <span className="date">Sep 2019 – May 2023</span>
                            <p>Electronics & Instrumentation Engineering (CGPA: 8/10)</p>
                        </div>
                    </div>

                    <div className="about-column">
                        <h3>Skills & Expertise</h3>

                        <div className="skills-category">
                            <h4>Design Tools</h4>
                            <div className="skill-tags">
                                <span>Figma</span>
                                <span>Sketch</span>
                                <span>Adobe XD</span>
                                <span>Photoshop</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>Web Technologies</h4>
                            <div className="skill-tags">
                                <span>HTML</span>
                                <span>CSS</span>
                                <span>Java</span>
                                <span>React</span>
                                <span>JavaScript</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>Core Areas</h4>
                            <div className="skill-tags">
                                <span>User Experience Design</span>
                                <span>Information Architecture</span>
                                <span>Accessibility (WCAG)</span>
                                <span>User Research</span>
                                <span>Prototyping</span>
                                <span>Wireframing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
