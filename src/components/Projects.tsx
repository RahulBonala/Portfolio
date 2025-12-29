import React from 'react';
import ProjectCard from './ProjectCard';
import dosthImg from '../assets/dosth.png';
import barImg from '../assets/bar-app.png';
import waggleImg from '../assets/waggle-app.png';
import byocImg from '../assets/byoc-logo.png';
import iupgradeImg from '../assets/iupgrade-logo.png';

const Projects: React.FC = () => {
    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <h2 className="section-title">Featured Projects</h2>

                <ProjectCard
                    title="Build Your Own Company"
                    subtitle="(Construct Your Vision, Brick by Brick)"
                    description="Build Your Own Company is a futuristic B2B platform that gamifies the software development lifecycle. It transforms the traditionally opaque, intimidating process of hiring an agency into an intuitive 'construction' experience."
                    image={byocImg}
                    tags={['Gamified Service Architecture', '3D Interactive Configurator', 'Full-Stack Development', 'Strategic Growth Marketing']}
                    webLink="https://build-your-own-company.vercel.app/"
                    fullDetails={
                        <div>
                            <h3>Project Overview</h3>
                            <p>BYOC addresses the core friction points of the agency market: hidden costs, technical confusion, and 'black box' development. The platform utilizes an 'Industrial Cyberpunk' aesthetic to present software building not as a service, but as a manufacturing process.</p>

                            <h3>My Role & Responsibilities</h3>
                            <p>As the Creator & Chief Architect, the role encompassed the end-to-end definition of the business logic and user experience.</p>
                            <ul>
                                <li><strong>Product Strategy:</strong> Defining the 4-Pillar 'Brick' system and the 3-Tier pricing logic.</li>
                                <li><strong>UX/UI Architecture:</strong> Designing the 'Anti-Gravity' 3D configurator and the 'Metro Map' progress tracker.</li>
                                <li><strong>Technical Specification:</strong> Architecting the stack (Next.js, Three.js, PostgreSQL, AWS RDS).</li>
                                <li><strong>Financial Modeling:</strong> Creating the transparent 'Fuel Gauge' billing system.</li>
                            </ul>

                            <h3>The Problem</h3>
                            <ul>
                                <li><strong>The 'Black Box' Quote:</strong> Traditional agencies provide vague estimates.</li>
                                <li><strong>Launch Anxiety:</strong> Founders fear their app will crash due to lack of visibility.</li>
                                <li><strong>The 'Silent' Phase:</strong> Clients feel disconnected during development.</li>
                            </ul>

                            <h3>The Solution</h3>
                            <p>BYOC acts as an automated CTO, guiding the founder through a visual, logic-driven assembly process.</p>
                            <ul>
                                <li><strong>The 3D Configurator:</strong> Users drag 'Bricks' into a glass box to visualize infrastructure.</li>
                                <li><strong>The Founder’s Cockpit:</strong> A 'Metro Map' pipeline tracks progress from Design to Launch.</li>
                                <li><strong>The 'Smart Upsell' Engine:</strong> Real-time monitoring of business health and server capacity.</li>
                            </ul>
                        </div>
                    }
                />

                <ProjectCard
                    title="Dosth App"
                    subtitle="(Your Friend, Your Guide)"
                    description="Dosth is an all-in-one urban app that simplifies daily life by providing on-demand product repairs and an innovative 'Propose Pay' feature for securing emergency rides. It's the single solution for everyday challenges and meaningful social impact."
                    image={dosthImg}
                    tags={['User Flow', 'Journey Mapping', 'Wireframing', 'High-Fidelity Prototyping', 'UI Design', 'UX Writing']}
                    link="http://figma.com/make/kVFaUs3rBUt6CtzwlCzHCb/Dosth-App-Prototype?node-id=0-1&p=f&fullscreen=1"
                    webLink="https://dosth-app.vercel.app/"
                    reverse={true}
                    fullDetails={
                        <div>
                            <h3>Project Overview</h3>
                            <p>Dosth (meaning "friend" in Hindi) is a conceptual mobile application designed to be the ultimate companion for modern urban living. It addresses three critical and often frustrating daily challenges: managing product repairs, finding transportation during high-demand situations, and reducing household food waste.</p>

                            <h3>My Role & Responsibilities</h3>
                            <p>As the sole product designer and conceptualizer for this project, I was responsible for the entire design process from start to finish.</p>
                            <ul>
                                <li>User Research & Problem Definition</li>
                                <li>User Flow & Journey Mapping</li>
                                <li>Wireframing (from low-fidelity sketches to high-fidelity mockups)</li>
                                <li>UI Design & Prototyping in Figma</li>
                                <li>UX Writing</li>
                            </ul>

                            <h3>The Problem</h3>
                            <ul>
                                <li><strong>The Repair Runaround:</strong> Users waste valuable time finding trusted repair shops.</li>
                                <li><strong>The Peak-Hour Trap:</strong> Finding a cab during rush hour is difficult; surge pricing is opaque.</li>
                                <li><strong>The Food Waste Dilemma:</strong> Surplus food is thrown away while others face food insecurity.</li>
                            </ul>

                            <h3>The Solution</h3>
                            <p>Dosth acts as a reliable "friend" in your pocket, providing a single, elegant solution to these problems.</p>
                            <ul>
                                <li><strong>On-Demand Repair Hub:</strong> Manage the entire repair lifecycle from pickup to delivery.</li>
                                <li><strong>'Propose Pay' Emergency Travel:</strong> Users propose a fare to incentivize drivers during emergencies.</li>
                                <li><strong>Community Food Donation:</strong> Connects those with extra food to donation partners.</li>
                            </ul>
                        </div>
                    }
                />

                <ProjectCard
                    title="Bar App"
                    subtitle="(Buy and Sell Gold, Silver)"
                    description="Bar is a mobile-first fintech app that makes investing in 99.99% pure digital gold and silver easy and affordable, starting at just ₹10. It empowers middle-class Indian families to save smartly through goal-based plans for life events."
                    image={barImg}
                    tags={['Wireframing', 'High-Fidelity Prototyping', 'UI Design', 'UX Design']}
                    link="https://www.figma.com/make/X9Zdh1fZaQWWpaV9n8AyX6/Bar-App?node-id=0-1&p=f&fullscreen=1"
                    webLink="https://bar-app-iota.vercel.app/"
                    fullDetails={
                        <div>
                            <h3>Project Overview</h3>
                            <p>Bar is a conceptual mobile application designed to be the definitive platform for modern precious metal investment in India. It addresses traditional challenges like high entry costs and storage risks by offering a simple, secure digital solution.</p>

                            <h3>My Role & Responsibilities</h3>
                            <p>Product Strategist & UX/UI Designer responsible for market analysis, conceptualization, and final UI design.</p>

                            <h3>The Problem</h3>
                            <ul>
                                <li><strong>Affordability Barrier:</strong> High cost of metals makes lump-sum investments difficult.</li>
                                <li><strong>Security Dilemma:</strong> Physical storage risks (theft, purity concerns).</li>
                                <li><strong>Lack of Purposeful Saving:</strong> Existing platforms lack tools for goal-based planning (e.g., weddings).</li>
                            </ul>

                            <h3>The Solution</h3>
                            <ul>
                                <li><strong>Accessible Micro-Investing:</strong> Start investing with as little as ₹10.</li>
                                <li><strong>Goal-Based Wealth Building:</strong> Set goals (e.g., "Child's Wedding") and automate savings via SIPs.</li>
                                <li><strong>Trusted Digital-to-Physical Ecosystem:</strong> Convert digital holdings into physical jewelry with partnered jewelers.</li>
                            </ul>
                        </div>
                    }
                />

                <ProjectCard
                    title="iUpgrade"
                    subtitle="(The Future of Ownership)"
                    description="iUpgrade is a premium Device-as-a-Service (DaaS) platform that replaces the high upfront cost of owning Apple hardware with a flexible, secure subscription model. It combines financial technology with e-commerce to offer a seamless 'Yearly Upgrade' cycle for the modern consumer."
                    image={iupgradeImg}
                    tags={['User Flow', 'Business Model Innovation', 'Full-Stack Development', 'Brand Identity Design', 'Fintech Strategy']}
                    webLink="https://i-upgrade.vercel.app/"
                    reverse={true}
                    fullDetails={
                        <div>
                            <h3>Project Overview</h3>
                            <p>iUpgrade is a conceptual fintech and e-commerce platform designed to disrupt the traditional smartphone retail market. It addresses the growing gap between the aspirational desire for premium technology and prohibitive upfront costs.</p>

                            <h3>My Role & Responsibilities</h3>
                            <p>As the lead product architect and strategist, I orchestrated the end-to-end development of the business and technical ecosystem.</p>
                            <ul>
                                <li><strong>Strategic Planning:</strong> Developed unit economics, pricing models, and 'Yearly Swap' logic.</li>
                                <li><strong>Brand Identity:</strong> Designed the logo, color palette (Cosmic Orange/Titanium), and visual language.</li>
                                <li><strong>UI/UX Design:</strong> Created the high-fidelity web interface focusing on trust and premium aesthetics.</li>
                                <li><strong>Technical Architecture:</strong> Defined security protocols involving Apple Business Manager (ABM).</li>
                            </ul>

                            <h3>The Problem</h3>
                            <ul>
                                <li><strong>The Affordability Barrier:</strong> Flagship devices are too expensive for many consumers.</li>
                                <li><strong>The Depreciation Trap:</strong> Tech hardware loses value immediately upon unboxing.</li>
                                <li><strong>The Resale Friction:</strong> Selling an old device is painful and risky.</li>
                            </ul>

                            <h3>The Solution</h3>
                            <p>iUpgrade acts as a secure bridge between premium hardware and the mass market.</p>
                            <ul>
                                <li><strong>The 'Infinity Cycle' Subscription:</strong> Monthly fee covering device, AppleCare+, and theft protection.</li>
                                <li><strong>Bank-Grade Security Layer:</strong> Video KYC and MDM integration for security.</li>
                                <li><strong>Circular Economy Engine:</strong> Monetizing assets twice (new rental &rarr; refurbished rental).</li>
                            </ul>
                        </div>
                    }
                />

                <ProjectCard
                    title="Waggle App"
                    subtitle="(Pet Care)"
                    description="Waggle is a conceptual mobile app designed to provide peace of mind to busy dog owners by connecting them with vetted, local walkers. The platform serves as a trusted, all-in-one solution for finding, scheduling, and managing pet care."
                    image={waggleImg}
                    tags={['User Flow', 'Journey Mapping', 'Information Architecture', 'Wireframing', 'UX Writing', 'UI Design']}
                    link="https://www.figma.com/make/4FaGz8I3cnyPdCtSFmGpOm/Waggle-Mobile-App-Design?node-id=0-1&p=f&fullscreen=1"
                    webLink="https://waggle-app-pied.vercel.app/"
                    fullDetails={
                        <div>
                            <h3>Project Overview</h3>
                            <p>Waggle is a conceptual mobile application designed to be the definitive platform for modern, convenient pet care. It addresses the anxiety and logistical challenges faced by busy dog owners.</p>

                            <h3>My Role & Responsibilities</h3>
                            <p>Product Strategist & UX/UI Designer responsible for the entire lifecycle from market analysis to final UI.</p>

                            <h3>The Problem</h3>
                            <ul>
                                <li><strong>Trust Barrier:</strong> Letting a stranger into the home and trusting them with a pet.</li>
                                <li><strong>Scheduling Inflexibility:</strong> Finding high-quality walkers on short notice.</li>
                                <li><strong>Owner Guilt:</strong> Anxiety about pets being left alone for long periods.</li>
                            </ul>

                            <h3>The Solution</h3>
                            <ul>
                                <li><strong>Trust & Safety:</strong> Verified profiles, detailed bios, and public ratings.</li>
                                <li><strong>Total Scheduling Flexibility:</strong> Book for specific times, "near you" immediate needs, or recurring schedules.</li>
                                <li><strong>Seamless Experience:</strong> Consolidates search, booking, messaging, and payment.</li>
                            </ul>
                        </div>
                    }
                />
            </div>
        </section>
    );
};

export default Projects;
