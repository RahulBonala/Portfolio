import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import './Projects.css';
import dosthImg from '../assets/dosth.webp';
import barImg from '../assets/bar-app.webp';
import waggleImg from '../assets/waggle-app.webp';
import byocImg from '../assets/byoc-logo.webp';
import iupgradeImg from '../assets/iupgrade-logo.webp';
import bestAnswerImg from '../assets/bestanswer-logo.webp';

const allProjects = [
  {
    id: 1,
    category: 'AI / GenAI',
    title: 'Bestanswers.ai',
    subtitle: 'GenAI Multi-Agent System using Llama 3',
    description: 'BestAnswer.ai eliminates AI hallucination by convening a "Roundtable" of four distinct AI personas to debate every user query — transforming the solitary act of searching into a transparent, multi-perspective consensus event.',
    image: bestAnswerImg,
    tags: ['UI Design', 'AI', 'Multi-Agent Systems', 'Generative AI', 'Real-Time Consensus'],
    webLink: 'https://bestanswersai.com/',
    reverse: true,
    metrics: [
      { value: '4x', label: 'AI perspectives per query' },
      { value: '0%', label: 'Hallucination rate goal' },
      { value: '< 2s', label: 'Consensus response time' },
    ],
    phases: ['Research', 'Architecture', 'UI Design', 'Build', 'Launch'],
    role: 'Creator & Chief Architect — end-to-end product strategy, UX design, and technical specification.',
    problem: 'Single AI models hallucinate with high confidence. Users waste time cross-checking ChatGPT, Claude, and Gemini manually. Each model has inherent biases.',
    solution: 'A Council of 4 AI personas (Researcher, Engineer, Friend, Academic) debate simultaneously. A Supreme Judge meta-layer merges the strongest logic into one Master Answer with a transparent Verdict Badge.',
    figmaLink: undefined,
    fullDetails: (
      <div>
        <h3>The Problem</h3>
        <ul>
          <li><strong>The Hallucination Hazard:</strong> Single AI models invent facts with high confidence.</li>
          <li><strong>The Tab Fatigue:</strong> Users manually cross-check between ChatGPT, Claude, and Gemini.</li>
          <li><strong>The Bias Trap:</strong> Individual models have specific leanings — too creative or too rigid.</li>
        </ul>
        <h3>The Solution</h3>
        <ul>
          <li><strong>Council of 4:</strong> Parallel queries to Gemini (Google), Llama (Meta), and Mistral (Open Source).</li>
          <li><strong>Supreme Judge:</strong> Meta-layer AI critiques all four drafts and merges the strongest logic.</li>
          <li><strong>Verdict Badge:</strong> Transparent UI declaring the debate winner and why.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 2,
    category: 'Full-Stack',
    title: 'Build Your Own Company',
    subtitle: 'Construct Your Vision, Brick by Brick',
    description: 'A futuristic B2B platform that gamifies the software development lifecycle — transforming the opaque agency experience into an intuitive "construction" experience with full cost transparency.',
    image: byocImg,
    tags: ['Gamified UX', '3D Configurator', 'Full-Stack', 'B2B SaaS'],
    webLink: 'https://build-your-own-company.vercel.app/',
    reverse: false,
    metrics: [
      { value: '4', label: 'Transparent pricing pillars' },
      { value: '3D', label: 'Interactive configurator' },
      { value: '100%', label: 'Cost visibility' },
    ],
    phases: ['Discovery', 'Business Model', 'UX Design', 'Build', 'Launch'],
    role: 'Creator & Chief Architect — 4-pillar brick system, 3D configurator UX, and full-stack architecture.',
    problem: '"Black box" agency quotes, founder anxiety about reliability, and total disconnect during development sprints.',
    solution: 'A 3D drag-and-drop configurator, Metro Map pipeline tracker, and Smart Upsell Engine that acts as an automated CTO.',
    figmaLink: undefined,
    fullDetails: (
      <div>
        <h3>The Problem</h3>
        <ul>
          <li><strong>The Black Box Quote:</strong> Traditional agencies provide vague estimates.</li>
          <li><strong>Launch Anxiety:</strong> Founders fear crash due to lack of visibility.</li>
          <li><strong>The Silent Phase:</strong> Clients feel disconnected during development.</li>
        </ul>
        <h3>The Solution</h3>
        <ul>
          <li><strong>3D Configurator:</strong> Users drag "Bricks" into a glass box to visualize infrastructure.</li>
          <li><strong>Founder's Cockpit:</strong> Metro Map pipeline tracking from Design to Launch.</li>
          <li><strong>Smart Upsell Engine:</strong> Real-time business health monitoring.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    category: 'UI/UX Design',
    title: 'Dosth App',
    subtitle: 'Your Friend, Your Guide',
    description: 'An all-in-one urban app simplifying daily life with on-demand product repairs and an innovative "Propose Pay" feature for emergency rides — one solution for everyday urban challenges.',
    image: dosthImg,
    tags: ['User Flow', 'Journey Mapping', 'Wireframing', 'High-Fidelity UI', 'UX Writing'],
    link: 'http://figma.com/make/kVFaUs3rBUt6CtzwlCzHCb/Dosth-App-Prototype?node-id=0-1&p=f&fullscreen=1',
    webLink: 'https://dosth-app.vercel.app/',
    reverse: true,
    metrics: [
      { value: '3', label: 'Urban problems solved' },
      { value: 'E2E', label: 'Full design process' },
      { value: 'Figma', label: 'Live prototype' },
    ],
    phases: ['Research', 'Define', 'Wireframe', 'Prototype', 'Test'],
    role: 'Sole Product Designer — end-to-end from research through high-fidelity prototype.',
    problem: 'Users waste time finding repair shops, face opaque surge pricing during rush hours, and have no easy way to donate surplus food.',
    solution: 'On-Demand Repair Hub + Propose Pay emergency travel (user sets the fare) + Community Food Donation connector.',
    figmaLink: 'http://figma.com/make/kVFaUs3rBUt6CtzwlCzHCb/Dosth-App-Prototype?node-id=0-1&p=f&fullscreen=1',
    isScreenshot: true,
    fullDetails: (
      <div>
        <h3>The Problem</h3>
        <ul>
          <li><strong>The Repair Runaround:</strong> Users waste time finding trusted repair shops.</li>
          <li><strong>The Peak-Hour Trap:</strong> Finding a cab during rush hour is painful.</li>
          <li><strong>Food Waste Dilemma:</strong> Surplus food thrown away while others face insecurity.</li>
        </ul>
        <h3>The Solution</h3>
        <ul>
          <li><strong>On-Demand Repair Hub:</strong> Manage entire repair lifecycle from pickup to delivery.</li>
          <li><strong>Propose Pay Travel:</strong> User proposes a fare to incentivize drivers during emergencies.</li>
          <li><strong>Community Food Donation:</strong> Connects surplus food to donation partners.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 4,
    category: 'Fintech',
    title: 'Bar App',
    subtitle: 'Buy and Sell Gold & Silver',
    description: 'A mobile-first fintech app making 99.99% pure digital gold and silver investment accessible from ₹10 — empowering middle-class Indian families through goal-based savings plans.',
    image: barImg,
    tags: ['Wireframing', 'High-Fidelity UI', 'UX Design', 'Fintech'],
    link: 'https://www.figma.com/make/X9Zdh1fZaQWWpaV9n8AyX6/Bar-App?node-id=0-1&p=f&fullscreen=1',
    webLink: 'https://bar-app-iota.vercel.app/',
    reverse: false,
    metrics: [
      { value: '₹10', label: 'Minimum investment' },
      { value: '99.99%', label: 'Purity guaranteed' },
      { value: 'Goal', label: 'Based savings' },
    ],
    phases: ['Market Research', 'Define', 'Wireframe', 'UI Design', 'Prototype'],
    role: 'Product Strategist & UX/UI Designer — market analysis, conceptualisation, and final UI.',
    problem: 'High entry cost, physical storage risks (theft, purity), and no purpose-driven savings tools for life events like weddings.',
    solution: 'Micro-investing from ₹10, goal-based wealth building with automated SIPs, and a trusted digital-to-physical ecosystem.',
    figmaLink: 'https://www.figma.com/make/X9Zdh1fZaQWWpaV9n8AyX6/Bar-App?node-id=0-1&p=f&fullscreen=1',
    isScreenshot: true,
    fullDetails: (
      <div>
        <h3>The Problem</h3>
        <ul>
          <li><strong>Affordability Barrier:</strong> High cost makes lump-sum investments difficult.</li>
          <li><strong>Security Dilemma:</strong> Physical storage risks including theft and purity concerns.</li>
          <li><strong>Lack of Purpose:</strong> No goal-based planning tools for life events.</li>
        </ul>
        <h3>The Solution</h3>
        <ul>
          <li><strong>Accessible Micro-Investing:</strong> Start investing with as little as ₹10.</li>
          <li><strong>Goal-Based Wealth Building:</strong> Automate savings via SIPs for specific goals.</li>
          <li><strong>Trusted Digital-to-Physical:</strong> Convert digital holdings to physical jewelry.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 5,
    category: 'Full-Stack',
    title: 'iUpgrade',
    subtitle: 'The Future of Ownership',
    description: 'A premium Device-as-a-Service (DaaS) platform replacing high upfront Apple hardware costs with a flexible subscription model — combining fintech and e-commerce for a seamless yearly upgrade cycle.',
    image: iupgradeImg,
    tags: ['DaaS Model', 'Brand Identity', 'Full-Stack', 'Fintech Strategy'],
    webLink: 'https://i-upgrade.vercel.app/',
    reverse: true,
    metrics: [
      { value: 'DaaS', label: 'Device-as-a-Service' },
      { value: 'ABM', label: 'Apple Business Manager' },
      { value: '2x', label: 'Asset monetisation' },
    ],
    phases: ['Strategy', 'Brand Design', 'UX Design', 'Tech Arch', 'Launch'],
    role: 'Lead Product Architect — unit economics, brand identity (Cosmic Orange / Titanium), UI/UX, and security protocols.',
    problem: 'Flagship devices too expensive, rapid depreciation trap, and painful resale friction.',
    solution: 'Infinity Cycle subscription (device + AppleCare+ + theft protection), Bank-Grade Video KYC, and a Circular Economy Engine.',
    figmaLink: undefined,
    fullDetails: (
      <div>
        <h3>The Problem</h3>
        <ul>
          <li><strong>Affordability Barrier:</strong> Flagship devices priced out of reach for many.</li>
          <li><strong>Depreciation Trap:</strong> Hardware loses value immediately upon unboxing.</li>
          <li><strong>Resale Friction:</strong> Selling an old device is painful and risky.</li>
        </ul>
        <h3>The Solution</h3>
        <ul>
          <li><strong>Infinity Cycle:</strong> Monthly fee covering device, AppleCare+, and protection.</li>
          <li><strong>Bank-Grade Security:</strong> Video KYC and MDM integration.</li>
          <li><strong>Circular Economy:</strong> Monetizing assets twice — new rental then refurbished.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 6,
    category: 'UI/UX Design',
    title: 'Waggle App',
    subtitle: 'Pet Care, Simplified',
    description: 'A conceptual mobile app connecting busy dog owners with vetted local walkers — a trusted, all-in-one platform for finding, scheduling, and managing pet care with full transparency.',
    image: waggleImg,
    tags: ['User Flow', 'Journey Mapping', 'Information Architecture', 'UI Design'],
    link: 'https://www.figma.com/make/4FaGz8I3cnyPdCtSFmGpOm/Waggle-Mobile-App-Design?node-id=0-1&p=f&fullscreen=1',
    webLink: 'https://waggle-app-pied.vercel.app/',
    reverse: false,
    metrics: [
      { value: '100%', label: 'Verified walkers' },
      { value: 'Live', label: 'GPS tracking' },
      { value: '5★', label: 'Rating system' },
    ],
    phases: ['Research', 'IA', 'Wireframe', 'UI Design', 'Prototype'],
    role: 'Product Strategist & UX/UI Designer — full lifecycle from market analysis to final UI.',
    problem: 'Trust barrier with strangers, scheduling inflexibility, and owner anxiety about pets left alone.',
    solution: 'Verified profiles, flexible scheduling (near you / recurring), and a seamless search + booking + messaging + payment experience.',
    figmaLink: 'https://www.figma.com/make/4FaGz8I3cnyPdCtSFmGpOm/Waggle-Mobile-App-Design?node-id=0-1&p=f&fullscreen=1',
    isScreenshot: true,
    fullDetails: (
      <div>
        <h3>The Problem</h3>
        <ul>
          <li><strong>Trust Barrier:</strong> Letting a stranger in with your pet.</li>
          <li><strong>Scheduling Inflexibility:</strong> Finding quality walkers on short notice.</li>
          <li><strong>Owner Guilt:</strong> Anxiety about pets alone for long periods.</li>
        </ul>
        <h3>The Solution</h3>
        <ul>
          <li><strong>Trust & Safety:</strong> Verified profiles, detailed bios, and public ratings.</li>
          <li><strong>Total Flexibility:</strong> Book specific times, near-you immediate, or recurring.</li>
          <li><strong>Seamless Experience:</strong> Search, booking, messaging, and payment in one.</li>
        </ul>
      </div>
    ),
  },
];

const CATEGORIES = ['All', 'UI/UX Design', 'Full-Stack', 'AI / GenAI', 'Fintech'];

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow-pill">Work</span>
        </div>
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">
          End-to-end case studies — from research and strategy through design and shipped code.
        </p>

        {/* Filter Bar */}
        <div className="project-filter-bar" role="tablist" aria-label="Filter projects by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className="filter-count">
                  {allProjects.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="projects-grid">
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              {...project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
