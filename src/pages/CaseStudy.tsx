import { useEffect, useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useReveals } from '../hooks/useReveals';
import './CaseStudy.css';

type Figure = { caption: string; needsContent?: boolean };
type Outcome = { metric: string; label: string; method: string };

type Study = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta: { role: string; timeframe: string; stack: string };
  problem: string;
  constraints: string[];
  coreDecision: { decision: string; body: string; rejected: { name: string; why: string }[]; figure: Figure };
  loop: { body: string[]; figure: Figure };
  outcomes: { intro: string; items: Outcome[]; figure: Figure };
  redesign: string[];
  liveHref?: string;
};

const STUDIES: Record<string, Study> = {
  bestanswers: {
    slug: 'bestanswers',
    eyebrow: 'AI Product · Built solo',
    title: 'BestAnswers.AI',
    summary:
      'A multi-agent answer engine: four AI personas debate a question in parallel, and a meta-judge merges the strongest reasoning into one answer with the disagreements left visible.',
    meta: { role: 'Product, design & engineering (solo)', timeframe: 'Personal product · ongoing', stack: 'React · TypeScript · Vite · Tailwind · multi-LLM' },
    problem:
      'Ask a single model and you get one confident voice — and no way to tell a careful answer from a fluent-sounding wrong one. People cope by manually pasting the same prompt into ChatGPT, Claude, and Gemini and eyeballing the differences. That’s slow, and it hides the most useful signal of all: where capable models actually disagree. I wanted a tool where disagreement is the product, not a thing to paper over — so you can trust an answer because you can see what was contested and why one line of reasoning won.',
    constraints: [
      'Solo build — every decision had to be cheap enough for one person to ship and maintain.',
      'Multiple model providers (Gemini, Llama, Mistral) with different latencies and failure modes.',
      'Responses stream at different speeds — the UI can’t assume they arrive together.',
      'A non-technical visitor has to grasp “four AIs argued, here’s the verdict” in seconds.',
    ],
    coreDecision: {
      decision: 'Make the disagreement visible instead of hiding it behind one merged answer.',
      body:
        'The whole bet is that trust comes from transparency. So the verdict is never shown alone — it sits on top of the four persona positions, with the meta-judge’s reasoning for why one won. The hard part was making that legible rather than overwhelming, which is where the rejected directions came in.',
      rejected: [
        { name: 'Single merged answer, sources hidden', why: 'Tested cleanest, but it’s just another confident black box — it throws away the one thing that makes this different.' },
        { name: 'Four columns streaming simultaneously', why: 'Built it; it read as chaos. Four live text streams racing each other is unreadable and stressful, not transparent.' },
        { name: 'Chat-style transcript of the “debate”', why: 'Cute, but it buried the verdict and tripled reading time. Theatre over usefulness.' },
      ],
      figure: { caption: 'NEEDS CONTENT: screenshot of the rejected four-column simultaneous-stream version vs. the shipped sequenced layout', needsContent: true },
    },
    loop: {
      body: [
        'I couldn’t spec the verdict view in a static frame — the feel of it depended entirely on how real model responses behaved at runtime. So I designed it in code. I built the debate view, wired up four live calls, and watched what actually happened.',
        'What happened was the simultaneous-streaming chaos above. Seeing it run told me the sequencing was the real design problem, not the layout. I reworked the order — personas resolve, then the judge speaks — in the same file I’d just been styling. Design decision and implementation were one act, and the running thing corrected the next decision. The hero of this very portfolio is that verdict graph, miniaturised.',
      ],
      figure: { caption: 'NEEDS CONTENT: short screen-capture / GIF of the shipped sequence — personas resolving, then the verdict landing', needsContent: true },
    },
    outcomes: {
      intro: 'BestAnswers.AI is live and built end-to-end by me. Honest status on measurement:',
      items: [
        { metric: 'Live', label: 'shipped and publicly usable', method: 'bestanswersai.com — try it directly' },
        { metric: '4', label: 'models debating per query', method: 'Parallel calls across Gemini, Llama, and Mistral, merged by a meta-judge.' },
        { metric: 'NEEDS CONTENT', label: 'usage or comprehension metric', method: 'NEEDS CONTENT: a real number — e.g. weekly active users, or a small user test on whether the verdict view improved trust/comprehension vs. a single answer.' },
      ],
      figure: { caption: 'NEEDS CONTENT: final shipped verdict screen, annotated', needsContent: true },
    },
    redesign: [
      'Add a “why these four?” affordance — right now the persona choice is implicit; it should be inspectable.',
      'Persist and let users share a verdict as a link, so the transparency travels.',
      'NEEDS CONTENT: one thing a real user actually got confused by, and how I’d fix it.',
    ],
    liveHref: 'https://bestanswersai.com/',
  },
  'smiths-detection': {
    slug: 'smiths-detection',
    eyebrow: 'Enterprise UX · 2023–2026',
    title: 'Smiths Detection — service consoles',
    summary:
      'Design and front-end build of service consoles used daily by maintenance engineers across Europe, APAC, and North America — plus the automation behind the reports those teams relied on.',
    meta: { role: 'UI/UX Designer & Developer', timeframe: 'Jan 2023 – Apr 2026', stack: 'React · Java · Python' },
    problem:
      'Maintenance engineers servicing detection hardware worked across tools that were built for the machines, not the people. Diagnosing an issue meant cross-referencing several screens and a lot of tribal knowledge, which made onboarding slow and errors easy. Leadership wanted consoles that a newer engineer could pick up quickly and that worked consistently across very different regional teams. The brief was effectively: same job, far less friction, measurable enough that support load and satisfaction would move.',
    constraints: [
      'Used daily in the field by engineers, not power users tolerant of rough edges.',
      'Three regions (Europe, APAC, North America) with different workflows and expectations.',
      'Enterprise hardware/data realities — [NEEDS CONTENT: the real technical and security constraints I worked within].',
      'WCAG 2.1 AA required across every shipped surface.',
    ],
    coreDecision: {
      decision: 'NEEDS CONTENT: the single most important design decision (e.g. consolidating N tools into one task-first console, or a particular information hierarchy).',
      body: 'NEEDS CONTENT: 2–4 sentences on what the decision was and why it was the right call for field engineers under time pressure.',
      rejected: [
        { name: 'NEEDS CONTENT: rejected direction 1', why: 'NEEDS CONTENT: why it didn’t survive testing or review.' },
        { name: 'NEEDS CONTENT: rejected direction 2', why: 'NEEDS CONTENT: the tradeoff that ruled it out.' },
      ],
      figure: { caption: 'NEEDS CONTENT: before/after of the console, or the rejected vs. shipped layout', needsContent: true },
    },
    loop: {
      body: [
        'Because I both designed and wrote the React, I could test interaction ideas against real data instead of mockup data — [NEEDS CONTENT: a concrete story where building the thing changed the design].',
        'On the systems side, I automated a recurring reporting task in Python that the team had been doing by hand, cutting a roughly six-hour job to about fifteen minutes. [NEEDS CONTENT: what the report was, how often it ran, who it unblocked.]',
      ],
      figure: { caption: 'NEEDS CONTENT: diagram or screenshot of the reporting automation / the console in use', needsContent: true },
    },
    outcomes: {
      intro: 'Measured outcomes from the shipped work. Each needs its methodology line filled in so the numbers are defensible:',
      items: [
        { metric: '95%', label: 'CSAT across three regions', method: 'NEEDS CONTENT: survey instrument, sample size, time period, and who was surveyed.' },
        { metric: '80%', label: 'faster maintenance workflows', method: 'NEEDS CONTENT: which task, baseline time vs. post-launch time, and how it was measured.' },
        { metric: '70%', label: 'fewer support tickets', method: 'NEEDS CONTENT: ticket categories counted, before/after window, and any confounds.' },
      ],
      figure: { caption: 'NEEDS CONTENT: outcomes chart or dashboard, anonymised as needed', needsContent: true },
    },
    redesign: [
      'NEEDS CONTENT: one honest thing the consoles still got wrong and how I’d approach it now.',
      'NEEDS CONTENT: a place where regional differences were under-served.',
    ],
  },
};

const FigureSlot = ({ figure }: { figure: Figure }) => (
  <figure className={`cs-figure ${figure.needsContent ? 'cs-figure--placeholder' : ''}`} data-reveal="up">
    <div className="cs-figure-frame" aria-hidden="true">
      <span>Figure</span>
    </div>
    <figcaption>{figure.caption}</figcaption>
  </figure>
);

const CaseStudy: React.FC = () => {
  const { slug } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  const study = slug ? STUDIES[slug] : undefined;

  useEffect(() => {
    if (study) document.title = `${study.title} — Case study · Rahul Bonala`;
  }, [study]);

  if (!study) return <Navigate to="/" replace />;

  return (
    <article className="case" ref={ref}>
      <div className="container case-narrow">
        <Link to="/#work" className="page-back">← Back to work</Link>

        <header className="case-head">
          <p className="case-eyebrow">{study.eyebrow}</p>
          <h1 className="case-title" data-reveal="up">{study.title}</h1>
          <p className="case-summary" data-reveal="up">{study.summary}</p>
          <dl className="case-meta" data-reveal-group>
            <div><dt>Role</dt><dd>{study.meta.role}</dd></div>
            <div><dt>When</dt><dd>{study.meta.timeframe}</dd></div>
            <div><dt>Stack</dt><dd>{study.meta.stack}</dd></div>
          </dl>
          {study.liveHref && (
            <a className="case-live" href={study.liveHref} target="_blank" rel="noopener noreferrer" data-reveal="up">
              Visit the live product
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
        </header>

        <section className="case-section" aria-labelledby="cs-problem">
          <h2 id="cs-problem" className="case-h2" data-reveal="up"><span className="case-h2-n">01</span> Problem</h2>
          <p className="case-body" data-reveal="up">{study.problem}</p>
        </section>

        <section className="case-section" aria-labelledby="cs-constraints">
          <h2 id="cs-constraints" className="case-h2" data-reveal="up"><span className="case-h2-n">02</span> Constraints</h2>
          <ul className="case-list" data-reveal-group>
            {study.constraints.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>

        <section className="case-section" aria-labelledby="cs-decision">
          <h2 id="cs-decision" className="case-h2" data-reveal="up"><span className="case-h2-n">03</span> Core design decision</h2>
          <p className="case-lead" data-reveal="up">{study.coreDecision.decision}</p>
          <p className="case-body" data-reveal="up">{study.coreDecision.body}</p>
          <h3 className="case-h3" data-reveal="up">Directions I rejected</h3>
          <ul className="case-rejected" data-reveal-group>
            {study.coreDecision.rejected.map((r) => (
              <li key={r.name}>
                <span className="case-rejected-name">{r.name}</span>
                <span className="case-rejected-why">{r.why}</span>
              </li>
            ))}
          </ul>
          <FigureSlot figure={study.coreDecision.figure} />
        </section>

        <section className="case-section" aria-labelledby="cs-loop">
          <h2 id="cs-loop" className="case-h2" data-reveal="up"><span className="case-h2-n">04</span> Design ↔ code, in one loop</h2>
          {study.loop.body.map((p, i) => <p className="case-body" data-reveal="up" key={i}>{p}</p>)}
          <FigureSlot figure={study.loop.figure} />
        </section>

        <section className="case-section" id="outcomes" aria-labelledby="cs-outcomes">
          <h2 id="cs-outcomes" className="case-h2" data-reveal="up"><span className="case-h2-n">05</span> What shipped &amp; what it moved</h2>
          <p className="case-body" data-reveal="up">{study.outcomes.intro}</p>
          <dl className="case-outcomes" data-reveal-group>
            {study.outcomes.items.map((o) => (
              <div className="case-outcome" key={o.label}>
                <dt className="case-outcome-metric">{o.metric}</dt>
                <dd>
                  <span className="case-outcome-label">{o.label}</span>
                  <span className="case-outcome-method">{o.method}</span>
                </dd>
              </div>
            ))}
          </dl>
          <FigureSlot figure={study.outcomes.figure} />
        </section>

        <section className="case-section" aria-labelledby="cs-redesign">
          <h2 id="cs-redesign" className="case-h2" data-reveal="up"><span className="case-h2-n">06</span> What I’d redesign today</h2>
          <ul className="case-list" data-reveal-group>
            {study.redesign.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>

        <div className="case-foot" data-reveal="up">
          <Link to="/#work" className="case-foot-link">← All work</Link>
          <Link to="/#contact" className="case-foot-link">Get in touch →</Link>
        </div>
      </div>
    </article>
  );
};

export default CaseStudy;
