import { Link } from 'react-router-dom';
import profileImg from '../assets/profile-headshot.jpg';
import './About.css';

// Every performance metric links to the case-study section that proves it.
// `context` is the one-line methodology shown on hover / for screen readers.
const NUMBERS = [
  {
    value: '95%',
    label: 'CSAT across three regions',
    href: '/work/smiths-detection#outcomes',
    context: 'See how this was measured — Smiths Detection case study',
  },
  {
    value: '80%',
    label: 'faster maintenance workflows',
    href: '/work/smiths-detection#outcomes',
    context: 'See how this was measured — Smiths Detection case study',
  },
  {
    value: '70%',
    label: 'fewer support tickets',
    href: '/work/smiths-detection#outcomes',
    context: 'See how this was measured — Smiths Detection case study',
  },
];

const TIMELINE = [
  {
    period: 'Now',
    role: 'Product Designer — AI specialist (UI/UX)',
    org: 'Ginthi.ai',
    note: 'I own design and front-end build for Ginthi’s web platform — taking features from concept through interface to shipped React, and building the AI tooling that lets a small team move quickly. Designing and developing the same surface means there’s no handoff to lose intent in.',
  },
  {
    period: '2023 – 2026',
    role: 'UI/UX Designer & Developer',
    org: 'Smiths Detection',
    note: 'Designed and built service consoles used daily by engineers across Europe, APAC, and North America. React, Java, and Python behind the screens.',
  },
  {
    period: '2019 – 2023',
    role: 'B.Tech, Electronics & Instrumentation',
    org: 'SASTRA University',
    note: 'Robotics and IoT on Raspberry Pi, OpenCV, and embedded C. Systems thinking that still shapes how I build.',
  },
];

const About: React.FC = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="sec-label">
          <em>001</em> About
        </div>

        <h2 className="about-statement" data-reveal="up">
          I design the thing,
          <br />
          <span className="about-statement-accent">then I build the thing.</span>
        </h2>

        <div className="about-grid">
          <div className="about-prose" data-reveal="up">
            <p>
              I started as a designer at Smiths Detection, drawing the service consoles
              that maintenance engineers across Europe, APAC, and North America use every
              day. Then I noticed where quality leaks out — the distance between a design
              and the shipped thing. So I learned to close it myself: first the React in
              front, then the Java and Python behind it.
            </p>
            <p>
              That habit compounded. Today I&apos;m the product designer and AI
              specialist at Ginthi.ai, designing and developing a live platform with
              production traffic flowing the whole time. Nights and weekends, I build
              with AI: BestAnswers.AI puts four models in a room and makes them argue
              before you get an answer.
            </p>
            <p>
              And because the fastest way to sharpen a workflow is to teach it, I run{' '}
              <Link to="/teach" className="about-inline-link">AI Tools for Builders</Link>{' '}
              — live sessions where designers and developers learn to ship with AI the
              way I do daily.
            </p>
          </div>

          <figure className="about-photo" data-reveal="scale">
            <img
              src={profileImg}
              alt="Sri Sai Rahul Bonala — portrait"
              loading="lazy"
              decoding="async"
              width="374"
              height="450"
            />
            <figcaption>
              <span>Bangalore, IST</span>
              <span>Remote anywhere</span>
            </figcaption>
          </figure>
        </div>

        {/* Verified outcomes — each links to the section that substantiates it */}
        <div className="about-numbers" data-reveal-group>
          {NUMBERS.map(({ value, label, href, context }) => (
            <Link className="about-number" key={label} to={href} title={context}>
              <span className="about-number-value">{value}</span>
              <span className="about-number-label">
                {label}
                <span className="about-number-cue" aria-hidden="true">See how →</span>
              </span>
            </Link>
          ))}
        </div>

        <ol className="about-timeline" data-reveal-group>
          {TIMELINE.map(({ period, role, org, note }) => (
            <li className="about-tl-item" key={org}>
              <span className="about-tl-period">{period}</span>
              <div>
                <h3 className="about-tl-role">{role}</h3>
                <p className="about-tl-org">{org}</p>
                <p className="about-tl-note">{note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default About;
