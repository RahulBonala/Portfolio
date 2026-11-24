import { useEffect, useRef, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useReveals } from '../hooks/useReveals';
import { titleFor } from '../lib/seo';
import { BOOKING } from '../lib/booking';
import { BUSINESS, PRODUCTS } from '../lib/business';
import './CaseStudy.css';

/**
 * /legal/terms, /legal/refunds, /legal/privacy and /legal/contact.
 *
 * The business pages a payment gateway checks before it approves an account.
 * They reuse the case study layout so they read as part of the site, not as a
 * bolted on template.
 *
 * Every promise here is a commitment to a buyer. If the booking flow, the
 * price or the data the site stores changes, update the matching page in the
 * same commit, and bump BUSINESS.policiesUpdated.
 */

type Section = { h: string; body: ReactNode };
type Doc = { eyebrow: string; title: string; intro: ReactNode; sections: Section[] };

const Email = () => (
  <a className="about-inline-link" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
);

const Stepforge = () => (
  <a className="about-inline-link" href="https://stepforge.co/" target="_blank" rel="noopener noreferrer">stepforge.co</a>
);

const OPERATOR = `${BUSINESS.legalName} (${BUSINESS.structure.toLowerCase()}), who runs ${BUSINESS.brand}, an independent software business based in ${BUSINESS.city}, ${BUSINESS.region}, ${BUSINESS.country}`;

const DOCS: Record<string, Doc> = {
  terms: {
    eyebrow: 'Legal · Terms and conditions',
    title: 'Terms and conditions',
    intro: (
      <>
        These terms cover your use of rahulbonala.me and anything you buy on it. The site is
        run by {OPERATOR} (&ldquo;I&rdquo;, &ldquo;me&rdquo;). By using the site or paying
        for a session you agree to these terms.
      </>
    ),
    sections: [
      {
        h: 'What I sell',
        body: (
          <>
            <p className="case-body">
              This is a software business. It builds and sells SaaS products, each on its own
              site and under the terms and policies published there:
            </p>
            <ul className="case-list">
              {PRODUCTS.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong> ({p.category}): {p.summary}{' '}
                  <a className="about-inline-link" href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.url.replace(/^https:\/\//, '').replace(/\/$/, '')}
                  </a>
                </li>
              ))}
            </ul>
            <p className="case-body">
              These terms cover what is sold on rahulbonala.me itself:
            </p>
            <ul className="case-list">
              <li>
                <strong>Zero to Live</strong>: a {BOOKING.durationMinutes} minute, one to one,
                live online training session in building and deploying software with AI
                tools, sold on <Link className="about-inline-link" to="/teach">rahulbonala.me/teach</Link> for {BOOKING.price} per
                session. It includes the AI Builder&apos;s Playbook (a PDF) and the prompts used
                in the session.
              </li>
            </ul>
          </>
        ),
      },
      {
        h: 'Payment',
        body: (
          <p className="case-body">
            Prices are shown in Indian Rupees (INR). Payments are processed by Razorpay. I never
            see or store your card, UPI or bank details. Your session is confirmed once the
            payment succeeds and the site has verified it.
          </p>
        ),
      },
      {
        h: 'Delivery',
        body: (
          <p className="case-body">
            Everything sold here is delivered online. Nothing is shipped. After payment you are
            taken straight to a scheduler to pick a time, and the session runs over Google Meet
            with screen sharing. The Playbook is available to download right after payment.
          </p>
        ),
      },
      {
        h: 'Scheduling and rescheduling',
        body: (
          <ul className="case-list">
            <li>You choose your slot from the times shown in the scheduler after payment.</li>
            <li>
              You can reschedule up to 24 hours before the start time, using the link in your
              confirmation email or by emailing <Email />.
            </li>
            <li>
              If I have to move a session, I will offer you a new time. If none suits you, you
              get a full refund.
            </li>
            <li>
              Cancellations and refunds are covered by the <Link className="about-inline-link" to="/legal/refunds">refund and cancellation policy</Link>.
            </li>
          </ul>
        ),
      },
      {
        h: 'What you own',
        body: (
          <p className="case-body">
            Anything you build during a session is yours. The Playbook and the prompts are for
            your own use. Please do not resell or republish them. The design, code and content of
            this site belong to me unless stated otherwise.
          </p>
        ),
      },
      {
        h: 'Third party tools',
        body: (
          <p className="case-body">
            Sessions use free third party AI and hosting tools. Their features, limits and
            pricing are set by those providers and can change. Any account you create with them
            is between you and that provider.
          </p>
        ),
      },
      {
        h: 'Liability',
        body: (
          <p className="case-body">
            I teach and build with care, but the site and the sessions are provided as described,
            without any other guarantee. To the extent the law allows, my total liability for any
            claim about a purchase is limited to the amount you paid for it.
          </p>
        ),
      },
      {
        h: 'Governing law',
        body: (
          <p className="case-body">
            These terms are governed by the laws of India. Any dispute is subject to the courts
            of {BUSINESS.city}, {BUSINESS.region}.
          </p>
        ),
      },
      {
        h: 'Changes and contact',
        body: (
          <p className="case-body">
            I may update these terms. The date below shows the latest version, and a purchase is
            covered by the terms in force when you made it. Questions: <Email />.
          </p>
        ),
      },
    ],
  },

  refunds: {
    eyebrow: 'Legal · Refunds and cancellations',
    title: 'Refund and cancellation policy',
    intro: (
      <>
        This policy covers Zero to Live sessions bought on rahulbonala.me, sold by{' '}
        {BUSINESS.legalName}. The short version: if the session didn&apos;t help, you get your
        money back.
      </>
    ),
    sections: [
      {
        h: 'If the session didn’t help',
        body: (
          <p className="case-body">
            Email <Email /> within 7 days after your session and tell me it didn&apos;t help.
            You get a full refund. You don&apos;t have to justify it.
          </p>
        ),
      },
      {
        h: 'Cancelling before the session',
        body: (
          <ul className="case-list">
            <li>Cancel at least 24 hours before the start time: full refund.</li>
            <li>Paid but never picked a slot: full refund on request, within 30 days of payment.</li>
            <li>
              Cancelling with less than 24 hours&apos; notice: I will offer you one new slot
              instead of a refund.
            </li>
          </ul>
        ),
      },
      {
        h: 'If I cancel',
        body: (
          <p className="case-body">
            If I cancel or can&apos;t run a session, you choose between a new time and a full
            refund.
          </p>
        ),
      },
      {
        h: 'How to ask for a refund',
        body: (
          <p className="case-body">
            Email <Email /> from the address you paid with, and include the Razorpay payment ID
            from your receipt if you have it. I reply within 2 business days.
          </p>
        ),
      },
      {
        h: 'When the money arrives',
        body: (
          <p className="case-body">
            Approved refunds are issued through Razorpay to the original payment method within 5
            to 7 business days. Your bank may take a few more days to show it.
          </p>
        ),
      },
      {
        h: 'Product purchases',
        body: (
          <p className="case-body">
            Each software product (for example Stepforge, on <Stepforge />) is sold on its own
            site. Refunds for a product are handled under the policy published on that site.
          </p>
        ),
      },
    ],
  },

  privacy: {
    eyebrow: 'Legal · Privacy',
    title: 'Privacy policy',
    intro: (
      <>
        This policy explains what rahulbonala.me collects, why, and what you can ask me to do
        with it. The site is run by {OPERATOR}, who is responsible for your data here.
      </>
    ),
    sections: [
      {
        h: 'What I collect',
        body: (
          <ul className="case-list">
            <li><strong>Contact form</strong>: your name, email address and message, so I can reply.</li>
            <li>
              <strong>Bookings</strong>: the name, email address and phone number you give
              Razorpay at checkout, the payment ID and amount, your scheduled time, and, if
              you arrived through a tagged link, where you came from (for example YouTube).
            </li>
            <li>
              <strong>Reviews</strong>: the display name, role, rating and text you choose to
              publish, and an optional email address that is never shown publicly.
            </li>
          </ul>
        ),
      },
      {
        h: 'What I don’t collect',
        body: (
          <p className="case-body">
            I never see or store card, UPI or bank details; Razorpay handles those. The site runs
            no advertising trackers and no third party analytics, and I never sell your data.
          </p>
        ),
      },
      {
        h: 'Services that process your data',
        body: (
          <ul className="case-list">
            <li><strong>Razorpay</strong>, for payments.</li>
            <li><strong>Calendly</strong>, for scheduling your session.</li>
            <li><strong>Google Meet</strong>, for the live session.</li>
            <li><strong>Supabase</strong>, the database that stores the records above.</li>
            <li><strong>Vercel</strong>, which hosts the site and keeps standard server logs.</li>
            <li>
              <strong>YouTube</strong>, through the privacy enhanced player, which loads only
              when you press play on a video.
            </li>
          </ul>
        ),
      },
      {
        h: 'Storage in your browser',
        body: (
          <p className="case-body">
            The site saves your light or dark theme choice, and keeps a few short lived flags
            (for example, that you have already seen the intro animation, or that your payment
            was verified) in your browser. None of these identify you or are shared.
          </p>
        ),
      },
      {
        h: 'How long I keep it',
        body: (
          <p className="case-body">
            Booking and payment records are kept as long as tax and accounting rules require.
            Contact messages and reviews are kept until you ask me to delete them.
          </p>
        ),
      },
      {
        h: 'Your rights',
        body: (
          <p className="case-body">
            You can ask to see, correct or delete the data I hold about you, or withdraw consent
            for follow up emails, in line with Indian law, including the Digital Personal Data
            Protection Act, 2023. Email <Email /> and I will respond within 30 days.
          </p>
        ),
      },
    ],
  },

  contact: {
    eyebrow: 'Legal · Contact',
    title: 'Contact',
    intro: (
      <>
        Questions about a purchase, a refund, your data or anything else on this site? Get in
        touch using the details below.
      </>
    ),
    sections: [
      {
        h: 'Business details',
        body: (
          <dl className="case-meta">
            <div><dt>Operated by</dt><dd>{BUSINESS.legalName} ({BUSINESS.structure.toLowerCase()})</dd></div>
            <div><dt>Business</dt><dd>{BUSINESS.description}: software products and software training</dd></div>
            <div><dt>Email</dt><dd><Email /></dd></div>
            {BUSINESS.phone && <div><dt>Phone</dt><dd>{BUSINESS.phone}</dd></div>}
            <div>
              <dt>Location</dt>
              <dd>{BUSINESS.address || `${BUSINESS.city}, ${BUSINESS.region}, ${BUSINESS.country}`}</dd>
            </div>
          </dl>
        ),
      },
      {
        h: 'Response times',
        body: (
          <p className="case-body">
            I reply to email within 2 business days. For a session you have already paid for,
            include your Razorpay payment ID so I can find your booking quickly.
          </p>
        ),
      },
      {
        h: 'Other ways to reach me',
        body: (
          <p className="case-body">
            Use the <Link className="about-inline-link" to="/#contact">contact form</Link> on the home
            page, or message me on <a className="about-inline-link" href="https://www.linkedin.com/in/sri-sai-rahul-7b08b51b1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
            For Stepforge support, see <Stepforge />.
          </p>
        ),
      },
    ],
  },
};

const LEGAL_SLUGS = Object.keys(DOCS);

const Legal: React.FC = () => {
  const { doc = '' } = useParams();
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  const page = DOCS[doc];

  useEffect(() => {
    if (page) document.title = titleFor(`/legal/${doc}`);
  }, [doc, page]);

  if (!page) return <Navigate to="/" replace />;

  return (
    <article className="case" ref={ref}>
      <div className="container case-narrow">
        <Link to="/" className="page-back">← Back to home</Link>

        <header className="case-head">
          <p className="case-eyebrow">{page.eyebrow}</p>
          <h1 className="case-title" data-reveal="up">{page.title}</h1>
          <p className="case-summary" data-reveal="up">{page.intro}</p>
        </header>

        {page.sections.map((s, i) => (
          <section className="case-section" key={s.h} aria-labelledby={`legal-${doc}-${i}`}>
            <h2 id={`legal-${doc}-${i}`} className="case-h2" data-reveal="up">
              <span className="case-h2-n">{String(i + 1).padStart(2, '0')}</span> {s.h}
            </h2>
            <div data-reveal="up">{s.body}</div>
          </section>
        ))}

        <p className="case-body" data-reveal="up">Last updated {BUSINESS.policiesUpdated}.</p>

        <nav className="case-foot" aria-label="Policies" data-reveal="up">
          {LEGAL_SLUGS.filter((s) => s !== doc).map((s) => (
            <Link key={s} to={`/legal/${s}`} className="case-foot-link">{DOCS[s].title} →</Link>
          ))}
        </nav>
      </div>
    </article>
  );
};

export default Legal;
