import React from 'react';
import './SkillsTicker.css';

// Skills taken from portfolio — matches all listed tools and technologies
const SKILLS = [
    'Figma',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Python',
    'Java',
    'TypeScript',
    'Node.js',
    'SQL',
    'REST APIs',
    'Git',
    'UI/UX Design',
    'Framer',
    'WCAG',
    'AI/ML',
];

const SkillsTicker: React.FC = () => {
    // Triple-duplicate to guarantee no gap on any screen width
    const items = [...SKILLS, ...SKILLS, ...SKILLS];

    return (
        <div className="skills-ticker" aria-label="Skills">
            <div className="ticker-fade-left" aria-hidden="true" />
            <div className="ticker-fade-right" aria-hidden="true" />
            <div className="ticker-track" aria-hidden="true">
                {items.map((skill, i) => (
                    <span className="ticker-item" key={i}>
                        <span className="ticker-dot">·</span>
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillsTicker;
