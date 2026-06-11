import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PaymentButton from './PaymentButton';
import bestAnswerImg from '../assets/bestanswer-logo.webp';
import byocImg from '../assets/byoc-logo.webp';
import './Work.css';

gsap.registerPlugin(ScrollTrigger);

const ARCHIVE = [
  { name: 'Dosth App', kind: 'UX case study — repairs, fares, food donation', live: 'https://dosth-app.vercel.app/', proto: 'http://figma.com/make/kVFaUs3rBUt6CtzwlCzHCb/Dosth-App-Prototype?node-id=0-1&p=f&fullscreen=1' },
  { name: 'Bar App', kind: 'Fintech — digital gold from ₹10', live: 'https://bar-app-iota.vercel.app/', proto: 'https://www.figma.com/make/X9Zdh1fZaQWWpaV9n8AyX6/Bar-App?node-id=0-1&p=f&fullscreen=1' },
  { name: 'iUpgrade', kind: 'DaaS — Apple devices on subscription', live: 'https://i-upgrade.vercel.app/', proto: undefined },
  { name: 'Waggle App', kind: 'Marketplace — trusted dog walkers', live: 'https://waggle-app-pied.vercel.app/', proto: 'https://www.figma.com/make/4FaGz8I3cnyPdCtSFmGpOm/Waggle-Mobile-App-Design?node-id=0-1&p=f&fullscreen=1' },
];

/**
 * SVG diagram for the live sessions — a clean top-down flow:
 * (your project + my AI workflow) -> one hour together -> a written next step.
 * All colors are CSS classes (Work.css) so both themes render correctly.
 */
const CourseVisual = () => (
  <svg className="work-svg course-visual" viewBox="0 0 560 400" role="img" aria-label="Diagram of a live working session: your project plus my AI workflow go into one hour together, and you leave with a written next step">
    <defs>
      <marker id="cv-arrow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path className="cv-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>

    {/* Inputs */}
    <g>
      <rect className="cv-pill cv-pill--accent" x="70" y="36" width="190" height="44" rx="22" />
      <text className="cv-text cv-text--accent" x="165" y="63" textAnchor="middle">your project</text>
      <rect className="cv-pill" x="300" y="36" width="190" height="44" rx="22" />
      <text className="cv-text" x="395" y="63" textAnchor="middle">my ai workflow</text>
    </g>

    {/* Connectors into the hour */}
    <g className="cv-flow">
      <line x1="195" y1="84" x2="243" y2="139" markerEnd="url(#cv-arrow)" />
      <line x1="365" y1="84" x2="317" y2="139" markerEnd="url(#cv-arrow)" />
    </g>

    {/* The hour */}
    <circle className="cv-ring" cx="280" cy="200" r="78" />
    <circle className="cv-core" cx="280" cy="200" r="62" />
    <text className="cv-hour" x="280" y="200" textAnchor="middle">1 hour</text>
    <text className="cv-hour-sub" x="280" y="226" textAnchor="middle">live · together</text>

    {/* Output */}
    <g className="cv-flow">
      <line x1="280" y1="266" x2="280" y2="300" markerEnd="url(#cv-arrow)" />
    </g>
    <rect className="cv-pill cv-pill--accent" x="120" y="312" width="320" height="44" rx="22" />
    <text className="cv-text cv-text--accent" x="280" y="339" textAnchor="middle">a written next step</text>
  </svg>
);

const PROJECTS = [
  {
    index: '01',
    meta: 'AI Product · Live',
    title: 'BestAnswers.AI',
    tagline: 'Four AIs argue. You get the strongest answer.',
    story:
      'Ask one model and you get one confident voice — right or wrong. BestAnswers.AI convenes four AI personas (Researcher, Engineer, Friend, Academic), lets them debate in parallel, and a meta-judge merges the strongest reasoning into a single answer with the disagreements left visible. Trust through transparent disagreement, not single-source confidence.',
    points: [
      'Multi-agent debate architecture — parallel calls across Gemini, Llama, and Mistral',
      'Meta-judge consensus layer with a transparent verdict on why an answer won',
      'Built solo, end to end: product strategy, UI, and architecture',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Multi-LLM'],
    links: [{ label: 'Visit live site', href: 'https://bestanswersai.com/' }],
    visual: <img src={bestAnswerImg} alt="BestAnswers.AI interface" loading="lazy" decoding="async" width="600" height="400" />,
  },
  {
    index: '02',
    meta: 'AI Agents · Experiment',
    title: 'BYOC — SDLC Agents',
    tagline: 'What if the agency was software?',
    story:
      'Build Your Own Company turns the software delivery lifecycle into a product. Configure what your product needs brick by brick — auth, payments, dashboards — watch the cost update in real time, then follow the build through a metro-map of SDLC phases. Underneath, AI agents carry the work through those phases autonomously.',
    points: [
      'AI agents mapped to SDLC phases — plan, design, build, test, ship',
      'Interactive 3D-style configurator and a metro-map pipeline tracker',
      'Honesty about cost as the core product idea — no black-box quotes',
    ],
    stack: ['React', 'TypeScript', 'AI agents', 'Node'],
    links: [{ label: 'Visit live site', href: 'https://build-your-own-company.vercel.app/' }],
    visual: <img src={byocImg} alt="Build Your Own Company configurator" loading="lazy" decoding="async" width="600" height="400" />,
  },
  {
    index: '03',
    meta: 'Teaching · Live Sessions',
    title: 'AI Tools for Builders',
    tagline: 'Not a video library. A working session.',
    story:
      'Once or twice a week I block an hour to build with someone — designer, developer, or founder — on their project, using the AI workflow I use daily. It isn’t a course you watch; it’s an hour where we ship something together. Afterwards you get a short written note: what we figured out, what to do next, and links to everything I referenced.',
    points: [
      'You bring a real project; we move it forward together for an hour',
      'My actual workflow — Figma, AI tools, and code where it matters',
      'Full refund if it didn’t help. The pitch is the work, not the price.',
    ],
    stack: ['1:1 · live', '₹49 per session', 'Calendly after checkout'],
    links: [],
    visual: <CourseVisual />,
    booking: true,
  },
];

const Work: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: media drifts slower than scroll; giant index drifts faster
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.work-media-inner').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 7 },
          {
            yPercent: -7,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
      gsap.utils.toArray<HTMLElement>('.work-index').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 30 },
          {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="section work" ref={sectionRef}>
      <div className="container">
        <div className="sec-label">
          <em>002</em> Selected work
        </div>
        <h2 className="sec-title" data-reveal="up">
          Three things<br />
          <span className="accent-word">worth your time.</span>
        </h2>
      </div>

      <div className="work-list">
        {PROJECTS.map((p, i) => (
          <article className={`work-item ${i % 2 === 1 ? 'work-item--flip' : ''}`} key={p.title}>
            <span className="work-index" aria-hidden="true">{p.index}</span>
            <div className="container work-item-grid">
              <div className="work-media" data-reveal={i % 2 === 1 ? 'right' : 'left'}>
                <div className="work-media-inner">{p.visual}</div>
              </div>

              <div className="work-info">
                <p className="work-meta" data-reveal="up">{p.meta}</p>
                <h3 className="work-title" data-reveal="up">{p.title}</h3>
                <p className="work-tagline" data-reveal="up">{p.tagline}</p>
                <p className="work-story" data-reveal="up">{p.story}</p>

                <ul className="work-points" data-reveal-group>
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>

                <div className="work-stack" data-reveal="up">
                  {p.stack.map((s) => (
                    <span className="work-chip" key={s}>{s}</span>
                  ))}
                </div>

                <div className="work-actions" data-reveal="up">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="work-link"
                      data-cursor-label="Open"
                      {...(l.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {l.label}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  ))}
                  {p.booking && (
                    <div className="work-booking">
                      <PaymentButton />
                      <p className="work-booking-note">₹49 · Calendly opens right after payment · full refund if it didn’t help</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Archive — earlier design work, still live */}
      <div className="container work-archive">
        <h3 className="work-archive-title" data-reveal="up">From the archive</h3>
        <ul className="work-archive-list" data-reveal-group>
          {ARCHIVE.map((a) => (
            <li className="work-archive-row" key={a.name}>
              <span className="work-archive-name">{a.name}</span>
              <span className="work-archive-kind">{a.kind}</span>
              <span className="work-archive-links">
                <a href={a.live} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} — live site (opens in new tab)`}>Live ↗</a>
                {a.proto && (
                  <a href={a.proto} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} — Figma prototype (opens in new tab)`}>Prototype ↗</a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Work;
