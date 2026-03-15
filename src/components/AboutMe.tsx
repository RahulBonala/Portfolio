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
      'Redesigned Service Console Interface → 80% maintenance time reduction',
      'Global CSAT uplift to 95% across Europe, APAC, North America, Middle East',
      'Automated Python pipeline → reduced 6-hour reports to 15 minutes',
      'Complete UI redesign in Java/HTML/CSS → 40% increase in positive feedback during FY25',
      '3 usability tests → 70% fewer customer support requests',
      'Led client sessions in Wiesbaden, Germany for product adoption',
    ],
  },
  {
    period: 'Sep 2019 – May 2023',
    role: 'B.Tech — Electronics & Instrumentation Engineering',
    org: 'SASTRA University',
    type: 'edu',
    color: '#8b5cf6',
    highlights: [
      'CGPA: 8/10',
      'Robotics & IoT projects — Raspberry Pi, OpenCV, C',
      'Strong foundation in systems thinking and engineering logic',
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
        <h2 className="section-title">The Person Behind the Work</h2>
        <p className="section-subtitle">
          AI-native designer and developer — 3+ years bridging strategy, design, and technical execution.
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
                <span className="kf-icon">📍</span>
                <div>
                  <strong>Based in</strong>
                  <span>India · Open to Global Remote</span>
                </div>
              </div>
              <div className="key-fact">
                <span className="kf-icon">🌐</span>
                <div>
                  <strong>Experience</strong>
                  <span>Europe, APAC, North America, Middle East</span>
                </div>
              </div>
              <div className="key-fact">
                <span className="kf-icon">🚀</span>
                <div>
                  <strong>Superpower</strong>
                  <span>Design + Code + AI in one person</span>
                </div>
              </div>
              <div className="key-fact">
                <span className="kf-icon">♿</span>
                <div>
                  <strong>Standards</strong>
                  <span>WCAG 2.1 AA compliant designs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
