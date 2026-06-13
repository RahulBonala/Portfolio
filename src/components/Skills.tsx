import { Link } from 'react-router-dom';
import './Skills.css';

const ProofIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

type Receipt = {
  skill: string;
  claim: string;
  proof: string;
  href: string;
  /** internal = same-tab route/anchor; external = new tab */
  external?: boolean;
};

type Group = { domain: string; rows: Receipt[] };

// Each row is a claim backed by something a visitor can open and check.
const GROUPS: Group[] = [
  {
    domain: 'Design',
    rows: [
      {
        skill: 'Product & UI/UX design',
        claim: 'Took a multi-agent AI product from blank canvas to shipped interface, solo.',
        proof: 'BestAnswers.AI case study',
        href: '/work/bestanswers',
      },
      {
        skill: 'Design systems',
        claim: 'Service consoles built on a shared component system used across three regions.',
        proof: 'Smiths Detection case study',
        href: '/work/smiths-detection',
      },
      {
        skill: 'Accessibility',
        claim: 'This site: keyboard-navigable, AA contrast, reduced-motion honoured.',
        proof: 'Read the source',
        href: 'https://github.com/rahulbonala',
        external: true,
      },
    ],
  },
  {
    domain: 'Engineering',
    rows: [
      {
        skill: 'React + TypeScript',
        claim: 'Production single-page apps and this prerendered, hydrated portfolio.',
        proof: 'BestAnswers.AI — live',
        href: 'https://bestanswersai.com/',
        external: true,
      },
      {
        skill: 'Interaction & motion',
        claim: 'GSAP scroll choreography and an SVG debate graph, no heavy 3D runtime.',
        proof: 'You’re looking at it — top of page',
        href: '#home',
      },
      {
        skill: 'Automation & systems',
        claim: 'Python pipeline that cut a recurring 6-hour reporting task to ~15 minutes.',
        proof: 'Smiths Detection case study',
        href: '/work/smiths-detection',
      },
    ],
  },
  {
    domain: 'AI',
    rows: [
      {
        skill: 'Multi-agent systems',
        claim: 'Four LLM personas debating in parallel, merged by a meta-judge.',
        proof: 'BestAnswers.AI — live',
        href: 'https://bestanswersai.com/',
        external: true,
      },
      {
        skill: 'Agentic workflows',
        claim: 'AI agents mapped to SDLC phases in an interactive build configurator.',
        proof: 'Build Your Own Company — live',
        href: 'https://build-your-own-company.vercel.app/',
        external: true,
      },
      {
        skill: 'Teaching the workflow',
        claim: 'Live 1:1 sessions building real projects with the AI workflow I use daily.',
        proof: 'AI Tools for Builders',
        href: '/teach',
      },
    ],
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="sec-label">
          <em>003</em> Receipts
        </div>
        <h2 className="sec-title" data-reveal="up">
          Claims,<br />
          <span className="accent-word">with proof.</span>
        </h2>
        <p className="skills-sub" data-reveal="up">
          No percentages, no progress bars — every line links to the shipped thing that backs it.
        </p>

        {GROUPS.map(({ domain, rows }) => (
          <div className="receipt-group" key={domain}>
            <h3 className="receipt-group-name" data-reveal="up">{domain}</h3>
            <ul data-reveal-group>
              {rows.map((r) => (
                <li className="receipt-row" key={r.skill}>
                  <span className="receipt-skill">{r.skill}</span>
                  <span className="receipt-claim">{r.claim}</span>
                  {r.href.startsWith('/') ? (
                    <Link className="receipt-proof" to={r.href}>
                      {r.proof}
                      <ProofIcon />
                    </Link>
                  ) : (
                    <a
                      className="receipt-proof"
                      href={r.href}
                      {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {r.proof}
                      <ProofIcon />
                    </a>
                  )}
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
