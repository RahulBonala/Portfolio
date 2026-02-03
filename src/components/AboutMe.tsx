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
                            I am an <strong>AI-Native Product Designer</strong> who bridges design strategy with technical execution. I don't just design interfaces; I architect intelligent systems where aesthetics and logic converge.
                        </p>

                        <div className="experience-item">
                            <h4>UI/UX Designer | Smiths Detection</h4>
                            <span className="date">Jan 2023 – Present</span>
                            <ul>
                                <li>Streamlined the user experience (UX) across 3 major projects by translating actionable data insights into data-driven
                                    UI design decisions </li>
                                <li>Global customer satisfaction increased by 95% across Europe, North America, Asia-Pacific, and the Middle East by
                                    deploying timely and visually consistent UI enhancements </li>
                                <li>Engineered a Service Console Interface for airport technicians that reduced maintenance time by 80%, improved
                                    diagnostic accuracy, and simplified complex workflows </li>
                                <li>Executed complete UI redesign using Java, HTML, and CSS, resulting in a 40% increase in positive user feedback </li>
                                during FY25
                                <li>Conducted 3 comprehensive usability tests, analyzing user feedback to implement key enhancements that
                                    decreased customer support requests by 70% </li>
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
                            <h4>Design & Prototyping</h4>
                            <div className="skill-tags">
                                <span>Figma (Advanced)</span>
                                <span>Adobe XD</span>
                                <span>Sketch</span>
                                <span>Photoshop</span>
                                <span>Framer</span>
                                <span>Webflow</span>
                                <span>Lottie</span>
                                <span>Miro</span>
                                <span>Loveable</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>UI Strategy & Research</h4>
                            <div className="skill-tags">
                                <span>Design Systems</span>
                                <span>Information Architecture (IA)</span>
                                <span>Interaction Design</span>
                                <span>Micro-interactions</span>
                                <span>End-to-End Prototyping</span>
                                <span>WCAG Accessibility</span>
                                <span>User Research</span>
                                <span>Usability Testing</span>
                                <span>Complex Data Visualization</span>
                                <span>Journey Mapping</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>Technical & Development</h4>
                            <div className="skill-tags">
                                <span>HTML/CSS</span>
                                <span>Java</span>
                                <span>Python</span>
                                <span>JSF</span>
                                <span>PrimeFaces</span>
                                <span>Git</span>
                                <span>Storybook (Concepts)</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>AI & Emerging Tech</h4>
                            <div className="skill-tags">
                                <span>AI-Native Workflows</span>
                                <span>Prompt Engineering (Copilot, Gemini, ChatGPT, Claude, Midjourney)</span>
                                <span>Figma AI</span>
                                <span>Antigravity</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>Methodologies & Domain</h4>
                            <div className="skill-tags">
                                <span>Agile/Scrum</span>
                                <span>SDLC</span>
                                <span>Design Thinking</span>
                                <span>SaaS Product Design</span>
                                <span>Control Tower Interfaces</span>
                                <span>Cross-Functional Leadership</span>
                            </div>
                        </div>

                        <div className="skills-category">
                            <h4>Project Tools</h4>
                            <div className="skill-tags">
                                <span>Jira</span>
                                <span>Confluence</span>
                                <span>MS Office</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
