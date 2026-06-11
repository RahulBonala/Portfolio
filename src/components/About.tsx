import profileImg from '../assets/profile-headshot.jpg';
import './About.css';

const NUMBERS = [
  { value: '95%', label: 'CSAT held across four regions' },
  { value: '80%', label: 'faster maintenance workflows shipped' },
  { value: '70%', label: 'drop in support tickets after testing' },
  { value: '3+', label: 'years shipping production software' },
];

const TIMELINE = [
  {
    period: 'Now',
    role: 'Product Designer — AI specialist (UI/UX)',
    org: 'Ginthi.ai',
    note: 'I design and build Ginthi’s web platforms end to end — the interfaces, the code behind them, and the AI tooling that keeps both moving fast. Day to day that means working closely with the team to ship on schedule without letting the customer experience slip.',
  },
  {
    period: 'Jan 2023 – Apr 2026',
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
          Handoff is where good ideas die.
          <br />
          <span className="about-statement-accent">So I stopped handing off.</span>
        </h2>

        <div className="about-grid">
          <div className="about-prose" data-reveal="up">
            <p>
              I started as a designer at Smiths Detection, drawing the service consoles
              that maintenance engineers across Europe, APAC, and North America use every
              day. Then I noticed the pattern: the distance between a design and the
              shipped thing is where quality leaks out. So I learned to close it myself —
              first the React in front, then the Java and Python behind it.
            </p>
            <p>
              That habit compounded. Today I&apos;m the product designer and AI
              specialist at Ginthi.ai, designing and developing a live platform with
              production traffic flowing the whole time — the kind of work where
              mistakes show up in front of real users, not in mockups. Nights and
              weekends, I build with AI: BestAnswers.AI puts four models in a room
              and makes them argue before you get an answer.
            </p>
            <p>
              And because the fastest way to sharpen a workflow is to teach it, I run{' '}
              <strong>AI Tools for Builders</strong> — live sessions where designers and
              developers learn to ship with AI the way I do daily.
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

        {/* Verified outcomes from shipped work */}
        <dl className="about-numbers" data-reveal-group>
          {NUMBERS.map(({ value, label }) => (
            <div className="about-number" key={label}>
              <dt className="about-number-value">{value}</dt>
              <dd className="about-number-label">{label}</dd>
            </div>
          ))}
        </dl>

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
