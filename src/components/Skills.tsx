import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const SEGMENTS = 24;

type Skill = { name: string; note: string; level: number };
type Domain = { domain: string; skills: Skill[] };

const DOMAINS: Domain[] = [
  {
    domain: 'Frontend core',
    skills: [
      { name: 'React', note: 'Daily driver — production apps and migrations', level: 0.92 },
      { name: 'TypeScript', note: 'Every project, strict mode on', level: 0.86 },
      { name: 'CSS & Motion', note: 'GSAP, scroll choreography, layout systems', level: 0.88 },
      { name: 'Three.js / R3F', note: 'Structural 3D — this page included', level: 0.66 },
    ],
  },
  {
    domain: 'AI & tooling',
    skills: [
      { name: 'AI-assisted shipping', note: 'Claude, Copilot, agents — my default workflow', level: 0.95 },
      { name: 'Multi-LLM systems', note: 'Orchestration and consensus — BestAnswers.AI', level: 0.8 },
      { name: 'Agent design', note: 'SDLC agents, prompts as product surface', level: 0.78 },
    ],
  },
  {
    domain: 'Design',
    skills: [
      { name: 'Figma', note: 'From wireframe to dev-ready spec', level: 0.94 },
      { name: 'Design systems', note: 'Tokens, components, documentation', level: 0.85 },
      { name: 'Accessibility', note: 'WCAG 2.1 AA on every shipped surface', level: 0.88 },
    ],
  },
  {
    domain: 'Systems',
    skills: [
      { name: 'Python', note: 'Automation — 6-hour reports down to 15 minutes', level: 0.74 },
      { name: 'Java', note: 'Production backends at Smiths Detection', level: 0.7 },
      { name: 'Node & APIs', note: 'REST services, integration glue', level: 0.72 },
    ],
  },
];

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Each meter fills to its level when it scrolls into view — felt, not read
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skill-meter').forEach((meter) => {
        const lit = meter.querySelectorAll('.skill-seg--lit');
        gsap.fromTo(
          lit,
          { opacity: 0.12, scaleY: 0.4 },
          {
            opacity: 1,
            scaleY: 1,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.028,
            scrollTrigger: { trigger: meter, start: 'top 90%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="section skills" ref={sectionRef}>
      <div className="container">
        <div className="sec-label">
          <em>003</em> Skills
        </div>
        <h2 className="sec-title" data-reveal="up">
          Range,<br />
          <span className="accent-word">with receipts.</span>
        </h2>
        <p className="skills-sub" data-reveal="up">
          Every bar below maps to shipped work, not a self-assessment quiz.
        </p>

        {DOMAINS.map(({ domain, skills }) => (
          <div className="skills-domain" key={domain}>
            <h3 className="skills-domain-name" data-reveal="up">{domain}</h3>
            <ul>
              {skills.map(({ name, note, level }) => (
                <li className="skill-row" key={name} data-reveal="up">
                  <span className="skill-name">{name}</span>
                  <span className="skill-note">{note}</span>
                  <span
                    className="skill-meter"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(level * 100)}
                    aria-label={`${name} proficiency`}
                  >
                    {Array.from({ length: SEGMENTS }, (_, i) => (
                      <span
                        key={i}
                        className={`skill-seg ${i < Math.round(level * SEGMENTS) ? 'skill-seg--lit' : ''}`}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
