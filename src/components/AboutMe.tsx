import React, { useState } from 'react';
import './AboutMe.css';

const skillCategories = [
  {
    label: 'Design & Prototyping',
    icon: '🎨',
    skills: ['Figma (Advanced)', 'Adobe XD', 'Sketch', 'Photoshop', 'Framer', 'Webflow', 'Lottie', 'Miro'],
  },
  {
    label: 'UX Strategy & Research',
    icon: '🔍',
    skills: ['Design Systems', 'Information Architecture', 'Interaction Design', 'Micro-interactions', 'WCAG Accessibility', 'User Research', 'Usability Testing', 'Journey Mapping'],
  },
  {
    label: 'Technical & Dev',
    icon: '⚙️',
    skills: ['HTML/CSS', 'Java', 'Python', 'React', 'JSF', 'PrimeFaces', 'Git', 'REST APIs'],
  },
  {
    label: 'AI & Emerging Tech',
    icon: '🤖',
    skills: ['AI-Native Workflows', 'Prompt Engineering', 'Figma AI', 'Copilot', 'Gemini', 'Claude', 'Midjourney'],
  },
  {
    label: 'Methodologies',
    icon: '📐',
    skills: ['Agile/Scrum', 'Design Thinking', 'SDLC', 'SaaS Product Design', 'Cross-Functional Leadership'],
  },
  {
    label: 'Project Tools',
    icon: '🛠️',
    skills: ['Jira', 'Confluence', 'MS Office', 'Storybook'],
  },
];

const timelineItems = [
  {
    period: 'Jan 2023 – Present',
    role: 'UI/UX Designer',
    org: 'Smiths Detection',
    type: 'work',
    color: '#6366f1',
    highlights: [
      'Redesigned the Service Console — engineers now finish maintenance in a fifth of the time',
      'Held global CSAT at 95% across Europe, APAC, North America, and the Middle East',
      'Automated the team\'s Python reporting pipeline — six hours of work, down to fifteen minutes',
      'Rebuilt the FY25 UI in Java/HTML/CSS — 40% lift in positive user feedback',
      'Ran three rounds of usability testing — 70% drop in support requests',
      'Led product adoption sessions for clients in Wiesbaden, Germany',
    ],
  },
  {
    period: 'Sep 2019 – May 2023',
    role: 'B.Tech, Electronics & Instrumentation Engineering',
    org: 'SASTRA University',
    type: 'edu',
    color: '#8b5cf6',
    highlights: [
      'CGPA: 8/10',
      'Robotics and IoT projects on Raspberry Pi, OpenCV, and embedded C',
      'A foundation in systems thinking that still shapes how I design',
    ],
  },
];

const AboutMe: React.FC = () => {
  const [activeSkillCat, setActiveSkillCat] = useState(0);

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow-pill">About</span>
        </div>
        <h2 className="section-title">What I make, why I make it</h2>
        <p className="section-subtitle">
          Three years at Smiths Detection in Bangalore. I design the screens engineers
          use every day, and I write the code behind them.
        </p>

        <div className="about-grid">
          {/* ── LEFT: Timeline ── */}
          <div className="about-left">
            <h3 className="about-col-title">Journey</h3>
            <div className="timeline">
              {timelineItems.map((item, i) => (
                <div className="timeline-item" key={i} style={{ '--tl-color': item.color } as React.CSSProperties}>
                  <div className="tl-dot" />
                  <div className="tl-content">
                    <div className="tl-header">
                      <div className="tl-type-badge" data-type={item.type}>
                        {item.type === 'work' ? '💼 Work' : '🎓 Education'}
                      </div>
                      <span className="tl-period">{item.period}</span>
                    </div>
                    <h4 className="tl-role">{item.role}</h4>
                    <p className="tl-org">{item.org}</p>
                    <ul className="tl-highlights">
                      {item.highlights.map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Skills ── */}
          <div className="about-right">
            <h3 className="about-col-title">Skills & Expertise</h3>

            {/* Skill Category Tabs */}
            <div className="skill-category-tabs">
              {skillCategories.map((cat, i) => (
                <button
                  key={i}
                  className={`skill-cat-btn ${i === activeSkillCat ? 'active' : ''}`}
                  onClick={() => setActiveSkillCat(i)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Active Category Skills */}
            <div className="skill-tags-panel" key={activeSkillCat}>
              <div className="skill-tags-grid">
                {skillCategories[activeSkillCat].skills.map((skill, i) => (
                  <span
                    className="skill-tag"
                    key={i}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Facts */}
            <div className="about-key-facts">
              <div className="key-fact">
                <span className="kf-label">Based in</span>
                <span className="kf-value">Bangalore, India · Open to global remote</span>
              </div>
              <div className="key-fact">
                <span className="kf-label">Experience</span>
                <span className="kf-value">Europe, APAC, North America, Middle East</span>
              </div>
              <div className="key-fact">
                <span className="kf-label">Strength</span>
                <span className="kf-value">Design, and the production code that runs it</span>
              </div>
              <div className="key-fact">
                <span className="kf-label">Standards</span>
                <span className="kf-value">WCAG 2.1 AA across every shipped surface</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
