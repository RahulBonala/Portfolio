import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveals } from '../hooks/useReveals';
import { titleFor } from '../lib/seo';
import './CaseStudy.css';

/**
 * /work/stepforge. Every statement here is taken from the Stepforge repo
 * (README, docs/AI-PIPELINE.md, the landing page and legal copy). No user
 * counts or outcomes are claimed because none are published yet.
 */
const HOW = [
  'You drop in a resume as a PDF, Word, Pages, ODT, RTF or plain text file, or a photo of a printed page.',
  'Text is extracted in your own browser tab with pdf.js, or OCR for images, so the resume is not uploaded unless you choose a cloud feature.',
  'A deterministic parser turns headings, dates, contacts and sections into structured data. A validation gate scores the result and drops anything it cannot type, rather than guessing.',
  'You review every extracted role, project and skill, with a strength score and confidence flags. Optional AI suggestions appear side by side with Accept and Reject controls.',
  'You pick one of 33 designs, then download the portfolio as one self-contained HTML file or publish it to a shareable Stepforge link.',
  'The same resume then feeds an 8 step career guide: roles your experience already supports, transferable skills, best-fit industries, a target role, a gap check against a real job description, pivot paths, a repositioned resume and a 30 day search plan.',
];

const DECISIONS = [
  {
    t: 'A parser, not a model, reads the resume',
    d: 'A regex cannot invent an employer. The deterministic parser keeps about 89% of the text and numbers across a 46 resume test corpus, and AI only steps in when the parse is uncertain or you ask for polish.',
  },
  {
    t: 'AI is opt in and grounded',
    d: 'AI is off by default. It may sharpen how an achievement reads, but it is prevented from adding a qualification, employer, metric or technology the resume does not contain, and identity and contact fields are protected. Career results show the resume line each claim came from.',
  },
  {
    t: 'You own the output',
    d: 'Most candidates have a resume but no personal site, because builders ask for layout work, hosting fees or lock in. Stepforge gives you one HTML file with no runtime JavaScript dependencies that you can host on GitHub Pages, Vercel, Netlify or your own domain.',
  },
  {
    t: 'Honest numbers only',
    d: 'Salary, demand and difficulty figures in the career guide are labelled as estimates to check against your own market, and the landing page shows no testimonials until real people leave reviews.',
  },
  {
    t: 'It has to work on the phone people own',
    d: 'People upload resumes from whatever phone they have, so the build targets older browser engines, and CI runs accessibility, responsive, print and old engine checks on every release.',
  },
];

const STACK = 'React · TypeScript · Vite · Tailwind · pdf.js · tesseract.js · Supabase · Vercel Functions · Gemini · Razorpay';

const StepforgeStudy: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = titleFor('/work/stepforge');
  }, []);

  return (
    <article className="case" ref={ref}>
      <div className="container case-narrow">
        <Link to="/#work" className="page-back">← Back to work</Link>

        <header className="case-head">
          <p className="case-eyebrow">SaaS · Built solo · Case study</p>
          <h1 className="case-title" data-reveal="up">Stepforge: resume to portfolio website</h1>
          <p className="case-summary" data-reveal="up">
            Stepforge turns the resume you already have into a portfolio website you own and a
            grounded career plan. Rahul Bonala designed and built it end to end: product, interface,
            parser and infrastructure.
          </p>
          <dl className="case-meta" data-reveal-group>
            <div><dt>Role</dt><dd>Product, design &amp; engineering (solo)</dd></div>
            <div><dt>When</dt><dd>Personal product · ongoing</dd></div>
            <div><dt>Stack</dt><dd>{STACK}</dd></div>
          </dl>
          <a className="case-live" href="https://stepforge.co/" target="_blank" rel="noopener noreferrer" data-reveal="up">
            Visit Stepforge
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </header>

        <section className="case-section" aria-labelledby="sf-problem">
          <h2 id="sf-problem" className="case-h2" data-reveal="up"><span className="case-h2-n">01</span> Problem</h2>
          <p className="case-body" data-reveal="up">
            Most job seekers keep an up to date resume, but very few have a portfolio. Website
            builders ask for layout work, ongoing hosting fees or platform lock in, and resume tools
            often generate achievements you then have to fact check yourself. I wanted the resume
            people already maintain to become a fast portfolio they own, without anything being
            made up along the way.
          </p>
        </section>

        <section className="case-section" aria-labelledby="sf-how">
          <h2 id="sf-how" className="case-h2" data-reveal="up"><span className="case-h2-n">02</span> How Stepforge converts a resume into a portfolio</h2>
          <ol className="case-list" data-reveal-group>
            {HOW.map((h) => <li key={h}>{h}</li>)}
          </ol>
        </section>

        <section className="case-section" aria-labelledby="sf-decisions">
          <h2 id="sf-decisions" className="case-h2" data-reveal="up"><span className="case-h2-n">03</span> Design decisions</h2>
          <ul className="case-rejected" data-reveal-group>
            {DECISIONS.map((d) => (
              <li key={d.t}>
                <span className="case-rejected-name">{d.t}</span>
                <span className="case-rejected-why">{d.d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="case-section" aria-labelledby="sf-stack">
          <h2 id="sf-stack" className="case-h2" data-reveal="up"><span className="case-h2-n">04</span> Stack</h2>
          <p className="case-body" data-reveal="up">
            A React and TypeScript single page app built with Vite and Tailwind. pdf.js and
            tesseract.js run extraction in the browser. Supabase handles accounts and published
            portfolios, Vercel Functions keep AI keys, prompts and quota on the server, Gemini
            powers the optional AI steps, and Razorpay takes the one off payment for a custom link.
          </p>
        </section>

        <section className="case-section" aria-labelledby="sf-try">
          <h2 id="sf-try" className="case-h2" data-reveal="up"><span className="case-h2-n">05</span> Try it</h2>
          <p className="case-body" data-reveal="up">
            Upload your resume at <a className="about-inline-link" href="https://stepforge.co/" target="_blank" rel="noopener noreferrer">stepforge.co</a>,
            preview the designs, and download your portfolio as HTML or publish it on your own link.
            For more AI work, see the <Link className="about-inline-link" to="/work/ai-agents">AI agent application examples</Link>.
          </p>
        </section>

        <div className="case-foot" data-reveal="up">
          <Link to="/#work" className="case-foot-link">← All work</Link>
          <Link to="/#contact" className="case-foot-link">Get in touch →</Link>
        </div>
      </div>
    </article>
  );
};

export default StepforgeStudy;
