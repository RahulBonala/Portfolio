import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveals } from '../hooks/useReveals';
import { titleFor } from '../lib/seo';
import { PROFILES, COMPANY } from '../lib/profiles';
import './CaseStudy.css';

/**
 * Press, interviews, podcasts and features. Add an entry here as each one goes
 * live; the section only renders once there is at least one. Independent
 * coverage is what search engines (and Wikidata) look for, so link the
 * original article, not a repost.
 */
type Mention = { outlet: string; title: string; href: string; date: string };
const PRESS: Mention[] = [];

/**
 * Written to be copied as is by anyone writing about Rahul (event pages,
 * podcast notes, articles), so every mention uses the same name and facts.
 */
const SHORT_BIO =
  'Rahul Bonala (Sri Sai Rahul Bonala) is a product designer and AI builder based in Bengaluru, India. ' +
  'Rahul is the product designer and AI specialist at Gintic.ai and the founder of BestAnswersAI, ' +
  'a multi agent AI answer engine, and Stepforge, a resume to portfolio and career planning app. ' +
  'Before Gintic.ai, Rahul designed and built the service consoles maintenance engineers at Smiths Detection ' +
  'use across Europe, APAC and North America.';

/** /about: the canonical "who is Rahul Bonala" page. Facts only, all sourced from the rest of the site. */
const AboutPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = titleFor('/about');
  }, []);

  let n = 0;
  const num = () => String(++n).padStart(2, '0');

  return (
    <article className="case" ref={ref}>
      <div className="container case-narrow">
        <Link to="/" className="page-back">← Home</Link>

        <header className="case-head">
          <p className="case-eyebrow">About</p>
          <h1 className="case-title" data-reveal="up">Rahul Bonala</h1>
          <p className="case-summary" data-reveal="up">
            Rahul Bonala is a product designer and AI builder in Bengaluru, India. Rahul designs
            AI products and writes the code that ships them, at{' '}
            <a className="about-inline-link" href={COMPANY.href} target="_blank" rel="noopener noreferrer">
              {COMPANY.name}
            </a>{' '}
            and on the two products Rahul founded: BestAnswersAI and Stepforge.
          </p>

          <dl className="case-meta" data-reveal="up">
            <div><dt>Full name</dt><dd>Sri Sai Rahul Bonala</dd></div>
            <div><dt>Role</dt><dd>Product Designer &amp; AI Builder</dd></div>
            <div><dt>Company</dt><dd>{COMPANY.name}</dd></div>
            <div><dt>Founder of</dt><dd>BestAnswersAI, Stepforge</dd></div>
            <div><dt>Based in</dt><dd>Bengaluru, India</dd></div>
            <div><dt>Education</dt><dd>SASTRA University</dd></div>
          </dl>
        </header>

        <section className="case-section" aria-labelledby="about-now">
          <h2 id="about-now" className="case-h2" data-reveal="up">
            <span className="case-h2-n">{num()}</span> What I do now
          </h2>
          <p className="case-body" data-reveal="up">
            I&apos;m the product designer and AI specialist at{' '}
            <a className="about-inline-link" href={COMPANY.href} target="_blank" rel="noopener noreferrer">
              {COMPANY.name}
            </a>
            . I own design and front-end build for its web platform, taking features from concept
            through interface to shipped React, and I build the AI tooling that lets a small team
            move quickly. Designing and developing the same surface means there&apos;s no handoff to
            lose intent in.
          </p>
        </section>

        <section className="case-section" aria-labelledby="about-built">
          <h2 id="about-built" className="case-h2" data-reveal="up">
            <span className="case-h2-n">{num()}</span> What I&apos;ve built
          </h2>
          <h3 className="case-h3" data-reveal="up">BestAnswersAI</h3>
          <p className="case-body" data-reveal="up">
            A multi agent AI answer engine. You ask once, four AI agents answer in parallel, and a
            judge agent merges the strongest points into one best answer.{' '}
            <Link className="about-inline-link" to="/work/bestanswers">Case study</Link>
            {' · '}
            <a className="about-inline-link" href="https://bestanswersai.com/" target="_blank" rel="noopener noreferrer">
              bestanswersai.com
            </a>
          </p>
          <h3 className="case-h3" data-reveal="up">Stepforge</h3>
          <p className="case-body" data-reveal="up">
            Turns the resume you already have into a portfolio website you own, then uses the same
            resume to plan the job search, citing the resume line behind every claim.{' '}
            <Link className="about-inline-link" to="/work/stepforge">Case study</Link>
            {' · '}
            <a className="about-inline-link" href="https://stepforge.co/" target="_blank" rel="noopener noreferrer">
              stepforge.co
            </a>
          </p>
          <p className="case-body" data-reveal="up">
            More, including BYOC, on the{' '}
            <Link className="about-inline-link" to="/work/ai-agents">AI agents page</Link>.
          </p>
        </section>

        <section className="case-section" aria-labelledby="about-before">
          <h2 id="about-before" className="case-h2" data-reveal="up">
            <span className="case-h2-n">{num()}</span> Before
          </h2>
          <h3 className="case-h3" data-reveal="up">Smiths Detection, 2023 to 2026</h3>
          <p className="case-body" data-reveal="up">
            As UI/UX designer and developer, I designed and built the service consoles maintenance
            engineers use every day across Europe, APAC and North America, with React in front and
            Java and Python behind. The work reached 95% CSAT across three regions, 80% faster
            maintenance workflows and 70% fewer support tickets.{' '}
            <Link className="about-inline-link" to="/work/smiths-detection">Case study</Link>
          </p>
          <h3 className="case-h3" data-reveal="up">SASTRA University, 2019 to 2023</h3>
          <p className="case-body" data-reveal="up">
            B.Tech in Electronics and Instrumentation. Robotics and IoT on Raspberry Pi, OpenCV and
            embedded C: systems thinking that still shapes how I build.
          </p>
        </section>

        <section className="case-section" aria-labelledby="about-teach">
          <h2 id="about-teach" className="case-h2" data-reveal="up">
            <span className="case-h2-n">{num()}</span> Teaching
          </h2>
          <p className="case-body" data-reveal="up">
            I run <Link className="about-inline-link" to="/teach">Zero to Live</Link>, one hour 1:1
            sessions where someone with an idea and no code leaves with a live website they built
            themselves, and I publish build walkthroughs on YouTube.
          </p>
        </section>

        {PRESS.length > 0 && (
          <section className="case-section" aria-labelledby="about-press">
            <h2 id="about-press" className="case-h2" data-reveal="up">
              <span className="case-h2-n">{num()}</span> Press and mentions
            </h2>
            <ul className="case-list" data-reveal="up">
              {PRESS.map((m) => (
                <li key={m.href}>
                  <a className="about-inline-link" href={m.href} target="_blank" rel="noopener noreferrer">
                    {m.title}
                  </a>
                  {`, ${m.outlet}, ${m.date}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="case-section" aria-labelledby="about-bio">
          <h2 id="about-bio" className="case-h2" data-reveal="up">
            <span className="case-h2-n">{num()}</span> Short bio
          </h2>
          <p className="case-body" data-reveal="up">
            For event pages, podcasts and articles, please use this as written:
          </p>
          <blockquote className="case-quote" data-reveal="up">{SHORT_BIO}</blockquote>
        </section>

        <section className="case-section" aria-labelledby="about-profiles">
          <h2 id="about-profiles" className="case-h2" data-reveal="up">
            <span className="case-h2-n">{num()}</span> Official profiles
          </h2>
          <p className="case-body" data-reveal="up">
            These are the only accounts I run. Anything else using my name isn&apos;t me.
          </p>
          <ul className="case-list" data-reveal="up">
            {PROFILES.map((p) => (
              <li key={p.href}>
                <a className="about-inline-link" href={p.href} target="_blank" rel="noopener me noreferrer">
                  {p.label}
                </a>
                {` · ${p.handle}`}
              </li>
            ))}
          </ul>
        </section>

        <div className="case-foot" data-reveal="up">
          <Link to="/#work" className="case-foot-link">← See the work</Link>
          <Link to="/#contact" className="case-foot-link">Get in touch →</Link>
        </div>
      </div>
    </article>
  );
};

export default AboutPage;
