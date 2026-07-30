import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';
import SessionVideo from '../components/SessionVideo';
import SessionValue from '../components/SessionValue';
import { BOOKING } from '../lib/booking';
import { useReveals } from '../hooks/useReveals';
import './Teach.css';

const STEPS = [
  { n: '01', t: 'You bring an idea', d: 'Any idea — however rough. Don’t have one? I’ll help you find a simple one in the first five minutes, so we can get moving.' },
  { n: '02', t: 'We take it to a live URL', d: 'Screen-shared, 1:1. Define, design, develop, deploy — the whole path, with free AI tools, using your idea as the example.' },
  { n: '03', t: 'You leave able to do it again', d: 'The Playbook, every prompt we used, and the community — so the next one you build, you build without me.' },
];

const Teach: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'AI Tools for Builders — Live sessions · Rahul Bonala';
  }, []);

  return (
    <div className="teach" ref={ref}>
      <div className="container">
        <Link to="/" className="page-back">← Back to portfolio</Link>

        <header className="teach-head">
          <p className="teach-eyebrow">AI Tools for Builders</p>
          <h1 className="teach-title" data-reveal="up">Turn your idea into a live website. In one hour.</h1>
          <p className="teach-lede" data-reveal="up">
            A live, one-on-one session where I show you the complete path — from a rough
            idea in your head to a real website on the internet. Using free AI tools.
            Without writing a single line of code yourself.
          </p>
        </header>

        {/* Sits above the steps: someone arriving cold from an ad needs to see
            what the hour looks like before they'll read how it's structured. */}
        <SessionVideo />

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

        <section className="teach-book" data-reveal="up" aria-labelledby="teach-book-h">
          <div className="teach-book-copy">
            <h2 id="teach-book-h" className="teach-book-title">Book a session</h2>
            <div className="teach-price-row">
              <p className="teach-price"><span className="teach-price-num">{BOOKING.price}</span> per session</p>
              <span className="teach-slots">{BOOKING.slotsLabel}</span>
            </div>
            <p className="teach-book-note">
              Pay below and you’ll be taken straight to the scheduler to pick your time.
              Full refund if it didn’t help — the pitch is the work, not the price.
            </p>
          </div>
          <div className="teach-book-action">
            <PaymentButton />
          </div>
        </section>

        <p className="teach-foot">
          Questions first? <a href={`mailto:${BOOKING.email}`}>Email me</a> — I reply within a day.
        </p>
      </div>
    </div>
  );
};

export default Teach;
