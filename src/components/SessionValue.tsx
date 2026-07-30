import { BOOKING, SESSION_STAGES, SESSION_GUARANTEES, PLAYBOOK } from '../lib/booking';
import './SessionValue.css';

/**
 * "Here's exactly what you get" — the section that has to do the selling.
 *
 * A visitor who arrived cold has one question: is an hour of this person's
 * time worth the money? Three vague steps don't answer it. Concrete artefacts
 * (the Playbook, the prompts, the community) and the before/after work that
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
        The call is {BOOKING.durationMinutes} minutes. That’s a plan, not a hard stop. If you
        need longer to understand something, we take longer. I’d rather you left clear
        than left on time.
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

    {/* The Playbook is the one deliverable a visitor can check before paying.
        Letting them read it up front is the strongest proof the session is
        real, and it costs nothing to give away. */}
    <a className="playbook-peek" href={PLAYBOOK.href} target="_blank" rel="noopener noreferrer" data-reveal="up">
      <span className="playbook-peek-icon" aria-hidden="true">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </span>
      <span className="playbook-peek-text">
        <strong>Read the Playbook before you book</strong>
        <span>All {PLAYBOOK.pages} pages, free, no email required. If it’s useful on its own, the session will be too.</span>
      </span>
      <svg className="playbook-peek-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
      </svg>
    </a>

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
