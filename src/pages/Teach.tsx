import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';
import SessionVideo from '../components/SessionVideo';
import SessionValue from '../components/SessionValue';
import Testimonials from '../components/Testimonials';
import { BOOKING } from '../lib/booking';
import { useReveals } from '../hooks/useReveals';
import './Teach.css';

/** The brief overview beside the video: what the hour is actually spent on. */
const PHASES = [
  { name: 'Define', what: 'pressure-test the idea' },
  { name: 'Design', what: 'plan it, then see it' },
  { name: 'Develop', what: 'AI writes the code' },
  { name: 'Deploy', what: 'live on the internet' },
];

const STEPS = [
  { n: '01', t: 'You bring an idea', d: 'Any idea, however rough. Don’t have one? I’ll help you find a simple one in the first five minutes, so we can get moving.' },
  { n: '02', t: 'We take it to a live URL', d: 'Screen-shared, 1:1. Define, design, develop, deploy: the whole path, with free AI tools, using your idea as the example.' },
  { n: '03', t: 'You leave able to do it again', d: 'The Playbook and every prompt we used, so the next one you build, you build without me.' },
];

const Teach: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'Zero to Live: turn your idea into a website in an hour · Rahul Bonala';
  }, []);

  return (
    <div className="teach" ref={ref}>
      <div className="container">
        <Link to="/" className="page-back">← Back to portfolio</Link>

        {/* Hero: copy left, the portrait video in the space beside it. A tall
            9:16 clip below the headline left a big empty column and pushed the
            rest of the page down; putting it here fills that space and lifts
            everything below it into view sooner. */}
        <header className="teach-head">
          <div className="teach-head-copy">
            <p className="teach-eyebrow">AI Builders by Rahul · Zero to Live</p>
            <h1 className="teach-title" data-reveal="up">Turn your idea into a live website. In one hour.</h1>
            <p className="teach-lede" data-reveal="up">
              A live, one-on-one session where I show you the complete path, from a rough
              idea in your head to a real website on the internet. Using free AI tools.
              Without writing a single line of code yourself.
            </p>

            <ol className="teach-phases" data-reveal="up" aria-label="The four phases of a session">
              {PHASES.map((p, i) => (
                <li key={p.name}>
                  <span className="teach-phase-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="teach-phase-name">{p.name}</span>
                  <span className="teach-phase-what">{p.what}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="teach-head-video" data-reveal="up">
            <SessionVideo variant="bare" />
            <p className="teach-head-video-cap">A minute on how the hour actually runs.</p>
          </div>
        </header>

        <ol className="teach-steps" data-reveal-group>
          {STEPS.map((s) => (
            <li className="teach-step" key={s.n}>
              <span className="teach-step-n">{s.n}</span>
              <h2 className="teach-step-t">{s.t}</h2>
              <p className="teach-step-d">{s.d}</p>
            </li>
          ))}
        </ol>

        {/* The concrete deliverables, immediately before the price — so the
            value is fully stated at the moment the cost appears. */}
        <SessionValue />

        {/* Renders nothing until an approved review exists. */}
        <Testimonials />

        <section className="teach-book" data-reveal="up" aria-labelledby="teach-book-h">
          <div className="teach-book-copy">
            <h2 id="teach-book-h" className="teach-book-title">Book a session</h2>
            <div className="teach-price-row">
              <p className="teach-price"><span className="teach-price-num">{BOOKING.price}</span> per session</p>
              <span className="teach-slots">{BOOKING.slotsLabel}</span>
            </div>
            <p className="teach-book-note">
              Pay below and you’ll be taken straight to the scheduler to pick your time.
              Full refund if it didn’t help. The pitch is the work, not the price.
            </p>
          </div>
          <div className="teach-book-action">
            <PaymentButton />
          </div>
        </section>

        <p className="teach-foot">
          Questions first? <a href={`mailto:${BOOKING.email}`}>Email me</a>. I reply within a day.
        </p>
      </div>
    </div>
  );
};

export default Teach;
