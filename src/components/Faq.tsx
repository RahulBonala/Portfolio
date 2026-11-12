import { Link } from 'react-router-dom';
import { PORTFOLIO_FAQ } from '../lib/seo';
import './Faq.css';

/**
 * Visible FAQ. The same items feed the FAQPage JSON-LD that
 * scripts/prerender.js writes into the home page, so the schema never
 * describes text a visitor can't read.
 */
const Faq: React.FC = () => (
  <section id="faq" className="section faq" aria-labelledby="faq-title">
    <div className="container">
      <div className="sec-label">
        <em>007</em> FAQ
      </div>
      <h2 id="faq-title" className="sec-title" data-reveal="up">
        Frequently asked questions
      </h2>
      <div className="faq-list" data-reveal-group>
        {PORTFOLIO_FAQ.map((f) => (
          <details className="faq-item" key={f.q}>
            <summary className="faq-q">{f.q}</summary>
            <div className="faq-a">
              <p>{f.a}</p>
              {f.links && (
                <p className="faq-links">
                  {f.links.map((l) =>
                    l.href.startsWith('/') ? (
                      <Link key={l.href} to={l.href}>{l.label}</Link>
                    ) : (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                    )
                  )}
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
