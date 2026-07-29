import { BOOKING, SESSION_STAGES, SESSION_GUARANTEES } from '../lib/booking';
import './SessionValue.css';

/**
 * "Here's exactly what you get" — the section that has to do the selling.
 *
 * A visitor who arrived cold has one question: is an hour of this person's
 * time worth the money? Three vague steps don't answer it. Concrete artefacts
 * (a recording, a written note, a prompt pack) and the before/after work that
 * surrounds the call do — they show the hour is the middle of the deliverable,
 * not the whole of it.
 *
 * Content lives in src/lib/booking.ts so the promises stay in one place and
 * can't drift from what the Calendly booking page says.
 */
const SessionValue: React.FC = () => (
  <section className="session-value" aria-labelledby="session-value-h">
    <div className="session-value-head">
      <h2 id="session-value-h" className="session-value-title" data-reveal="up">
        What you actually get
      </h2>
      <p className="session-value-lede" data-reveal="up">
        The call is {BOOKING.durationMinutes} minutes — a plan, not a hard stop. If you need
        longer to understand something, we take longer. I’d rather you left clear than
        left on time.
      </p>
    </div>

    <ol className="session-stages" data-reveal-group>
      {SESSION_STAGES.map((stage) => (
        <li className="session-stage" key={stage.when}>
          <div className="session-stage-head">
            <span className="session-stage-when">{stage.when}</span>
            <h3 className="session-stage-label">{stage.label}</h3>
            <p className="session-stage-note">{stage.note}</p>
          </div>
          <ul className="session-stage-items">
            {stage.items.map((item) => (
              <li key={item}>
                <svg
                  className="session-tick"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>

    <ul className="session-guarantees" data-reveal-group>
      {SESSION_GUARANTEES.map((g) => (
        <li className="session-guarantee" key={g.title}>
          <h3 className="session-guarantee-title">{g.title}</h3>
          <p className="session-guarantee-body">{g.body}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default SessionValue;
