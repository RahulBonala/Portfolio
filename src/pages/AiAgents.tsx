import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveals } from '../hooks/useReveals';
import { AI_AGENT_PROJECTS, titleFor } from '../lib/seo';
import './CaseStudy.css';

/** /work/ai-agents: a hub of the AI agent projects, with links to each case study and live app. */
const AiAgents: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = titleFor('/work/ai-agents');
  }, []);

  return (
    <article className="case" ref={ref}>
      <div className="container case-narrow">
        <Link to="/#work" className="page-back">← Back to work</Link>

        <header className="case-head">
          <p className="case-eyebrow">AI agents · Case studies</p>
          <h1 className="case-title" data-reveal="up">AI agent application examples</h1>
          <p className="case-summary" data-reveal="up">
            Real AI agent applications designed and built by Rahul Bonala, a product designer and
            AI builder in Bengaluru. Each one is live, and each entry explains what the agents
            actually do, with a case study where one exists.
          </p>
        </header>

        {AI_AGENT_PROJECTS.map((p, i) => (
          <section className="case-section" key={p.name} aria-labelledby={`agent-${i}`}>
            <h2 id={`agent-${i}`} className="case-h2" data-reveal="up">
              <span className="case-h2-n">{String(i + 1).padStart(2, '0')}</span> {p.name}
            </h2>
            <p className="case-body" data-reveal="up">{p.summary}</p>
            <h3 className="case-h3" data-reveal="up">What the agents do</h3>
            <p className="case-body" data-reveal="up">{p.agents}</p>
            <p className="case-body" data-reveal="up">
              {p.caseStudy && (
                <>
                  <Link className="about-inline-link" to={p.caseStudy}>Read the {p.name} case study</Link>
                  {' · '}
                </>
              )}
              <a className="about-inline-link" href={p.live} target="_blank" rel="noopener noreferrer">
                Open {p.name}
              </a>
            </p>
          </section>
        ))}

        <div className="case-foot" data-reveal="up">
          <Link to="/#work" className="case-foot-link">← All work</Link>
          <Link to="/#contact" className="case-foot-link">Get in touch →</Link>
        </div>
      </div>
    </article>
  );
};

export default AiAgents;
