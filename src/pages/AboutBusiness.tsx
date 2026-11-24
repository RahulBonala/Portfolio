import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveals } from '../hooks/useReveals';
import { titleFor } from '../lib/seo';
import { BOOKING } from '../lib/booking';
import { BUSINESS, PRODUCTS } from '../lib/business';
import './CaseStudy.css';

/**
 * /about: the business, as opposed to the person (the home page's About
 * section covers the person).
 *
 * This is the page a payment gateway or a new customer reads to answer "what
 * is this business and what does it sell?". The product list comes from
 * PRODUCTS in src/lib/business.ts, so launching a new product is one entry
 * there, not an edit here.
 */
const PRINCIPLES = [
  {
    t: 'One maker, end to end',
    d: 'Every product is designed, built and run by me. There is no agency and no outsourcing: the person who answers your email wrote the code.',
  },
  {
    t: 'Software you can start in one step',
    d: 'Each product is a web app. You open it in a browser and start, with nothing to install, and you only pay for what you choose to unlock.',
  },
  {
    t: 'Honest by default',
    d: 'No invented numbers, no fake reviews, and AI that is not allowed to make things up about you. If a product estimates something, it says so.',
  },
  {
    t: 'You own the output',
    d: 'What a product makes for you is yours to keep, export and host wherever you like.',
  },
];

const AboutBusiness: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = titleFor('/about');
  }, []);

  return (
    <article className="case" ref={ref}>
      <div className="container case-narrow">
        <Link to="/" className="page-back">← Back to home</Link>

        <header className="case-head">
          <p className="case-eyebrow">About · {BUSINESS.category}</p>
          <h1 className="case-title" data-reveal="up">Rahul Bonala builds SaaS products.</h1>
          <p className="case-summary" data-reveal="up">
            Rahul Bonala is an independent software business run by {BUSINESS.legalName} in{' '}
            {BUSINESS.city}, {BUSINESS.country}. It designs, builds and sells software as a
            service: web apps you sign up for and use in your browser. Every product is live on
            its own site and sold by the same owner, and more are on the way.
          </p>
          <dl className="case-meta" data-reveal-group>
            <div><dt>Business</dt><dd>{BUSINESS.description}</dd></div>
            <div><dt>Operated by</dt><dd>{BUSINESS.legalName} ({BUSINESS.structure.toLowerCase()})</dd></div>
            <div><dt>Based in</dt><dd>{BUSINESS.city}, {BUSINESS.region}, {BUSINESS.country}</dd></div>
          </dl>
        </header>

        <section className="case-section" aria-labelledby="ab-products">
          <h2 id="ab-products" className="case-h2" data-reveal="up"><span className="case-h2-n">01</span> Products</h2>
          <ul className="case-rejected" data-reveal-group>
            {PRODUCTS.map((p) => (
              <li key={p.name}>
                <span className="case-rejected-name is-kept">
                  {p.name}
                  <span className="case-tag">{p.category} · {p.status}</span>
                </span>
                <span className="case-rejected-why">
                  {p.summary}
                  {p.pricing && <> {p.pricing}</>}{' '}
                  <a className="about-inline-link" href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.url.replace(/^https:\/\//, '').replace(/\/$/, '')}
                  </a>
                  {p.caseStudy && (
                    <> · <Link className="about-inline-link" to={p.caseStudy}>Case study</Link></>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="case-section" aria-labelledby="ab-how">
          <h2 id="ab-how" className="case-h2" data-reveal="up"><span className="case-h2-n">02</span> How the products work</h2>
          <ul className="case-rejected" data-reveal-group>
            {PRINCIPLES.map((p) => (
              <li key={p.t}>
                <span className="case-rejected-name is-kept">{p.t}</span>
                <span className="case-rejected-why">{p.d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="case-section" aria-labelledby="ab-buy">
          <h2 id="ab-buy" className="case-h2" data-reveal="up"><span className="case-h2-n">03</span> Buying and support</h2>
          <p className="case-body" data-reveal="up">
            Each product is sold on its own site, and every payment is processed securely by
            Razorpay to the same business. Alongside the products, I run{' '}
            <Link className="about-inline-link" to="/teach">Zero to Live</Link>, a{' '}
            {BOOKING.durationMinutes} minute 1:1 training session ({BOOKING.price}) that teaches
            the same workflow I use to build them: taking an idea to a live web app with AI
            tools. Support for every product comes from me directly, at{' '}
            <a className="about-inline-link" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
          </p>
        </section>

        <section className="case-section" aria-labelledby="ab-founder">
          <h2 id="ab-founder" className="case-h2" data-reveal="up"><span className="case-h2-n">04</span> Who builds it</h2>
          <p className="case-body" data-reveal="up">
            I&apos;m {BUSINESS.legalName}, a product designer and software developer. I spent
            three years designing and building service consoles used across three continents at
            Smiths Detection, and I now design and build an AI platform at Ginthi.ai. These
            products are mine: I design the thing, then I build the thing. More about my
            background is on the <Link className="about-inline-link" to="/#about">home page</Link>.
          </p>
        </section>

        <section className="case-section" aria-labelledby="ab-policies">
          <h2 id="ab-policies" className="case-h2" data-reveal="up"><span className="case-h2-n">05</span> Policies</h2>
          <p className="case-body" data-reveal="up">
            Purchases on this site are covered by the{' '}
            <Link className="about-inline-link" to="/legal/terms">terms and conditions</Link>, the{' '}
            <Link className="about-inline-link" to="/legal/refunds">refund and cancellation policy</Link> and
            the <Link className="about-inline-link" to="/legal/privacy">privacy policy</Link>. Each
            product publishes its own policies on its site.
          </p>
        </section>

        <div className="case-foot" data-reveal="up">
          <Link to="/#work" className="case-foot-link">← See the products</Link>
          <Link to="/legal/contact" className="case-foot-link">Contact us →</Link>
        </div>
      </div>
    </article>
  );
};

export default AboutBusiness;
