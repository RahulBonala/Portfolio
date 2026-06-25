import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';
import { BOOKING } from '../lib/booking';
import { useReveals } from '../hooks/useReveals';
import './Teach.css';

const STEPS = [
  { n: '01', t: 'You bring a real project', d: 'A screen you’re stuck on, a feature you want to ship faster, an AI idea you haven’t started. Not a toy exercise — the actual thing.' },
  { n: '02', t: 'We build for an hour, live', d: 'Screen-shared, 1:1. My actual workflow — Figma, AI tools, and code where it matters. We move your project forward, together.' },
  { n: '03', t: 'You leave with a written note', d: 'A short summary: what we figured out, what to do next, and links to everything I referenced so you can keep going.' },
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
          <h1 className="teach-title" data-reveal="up">Not a video library. A working session.</h1>
          <p className="teach-lede" data-reveal="up">
            Once or twice a week I block an hour to build with someone — designer,
            developer, or founder — on their own project, using the AI workflow I use
            every day. It isn’t a course you watch. It’s an hour where we ship
            something together.
          </p>
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
          Questions first? <a href="mailto:rahulbonala06@gmail.com">Email me</a> — I reply within a day.
        </p>
      </div>
    </div>
  );
};

export default Teach;
