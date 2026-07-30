import { useEffect, useMemo, useRef, useState } from 'react';
import PaymentButton from './PaymentButton';
import { BOOKING, PLAYBOOK } from '../lib/booking';

type Progress = {
  scheduled: boolean;
  downloaded: boolean;
};

type BookingStepsProps =
  | { stage: 'payment' }
  | {
      stage: 'paid';
      verified: boolean;
      paymentId?: string;
      schedulingUrl?: string;
      downloadToken?: string;
      verificationIssue?: 'server' | 'network' | 'unconfigured';
      retrying?: boolean;
      onRetry?: () => void;
    };

type CalendlyApi = {
  initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
};

const EMPTY_PROGRESS: Progress = { scheduled: false, downloaded: false };
const CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

function readProgress(key: string): Progress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? '{}') as Partial<Progress>;
    return { scheduled: value.scheduled === true, downloaded: value.downloaded === true };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function writeProgress(key: string, value: Progress) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Progress is a convenience only; payment access never depends on it.
  }
}

function isSafeCalendlyUrl(value?: string): value is string {
  if (!value) return false;
  try {
    return new URL(value).hostname === 'calendly.com';
  } catch {
    return false;
  }
}

const BookingSteps: React.FC<BookingStepsProps> = (props) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarSectionRef = useRef<HTMLDivElement>(null);
  const progressKey =
    props.stage === 'paid' && props.paymentId
      ? `rb-booking-progress:${props.paymentId}`
      : 'rb-booking-progress:current';
  const [progress, setProgress] = useState<Progress>(() => readProgress(progressKey));
  const [calendarState, setCalendarState] = useState<'loading' | 'ready' | 'error'>('loading');

  const schedulingUrl =
    props.stage === 'paid' && isSafeCalendlyUrl(props.schedulingUrl)
      ? props.schedulingUrl
      : isSafeCalendlyUrl(BOOKING.calendly)
        ? BOOKING.calendly
        : undefined;

  const embedUrl = useMemo(() => {
    if (!schedulingUrl) return undefined;
    const url = new URL(schedulingUrl);
    url.searchParams.set('hide_gdpr_banner', '1');
    return url.toString();
  }, [schedulingUrl]);

  useEffect(() => {
    setProgress(readProgress(progressKey));
  }, [progressKey]);

  useEffect(() => {
    if (props.stage !== 'paid') return;

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://calendly.com' ||
        typeof event.data !== 'object' ||
        event.data === null ||
        (event.data as { event?: unknown }).event !== 'calendly.event_scheduled'
      ) {
        return;
      }

      setProgress((current) => {
        const next = { ...current, scheduled: true };
        writeProgress(progressKey, next);
        return next;
      });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [progressKey, props.stage]);

  useEffect(() => {
    if (props.stage !== 'paid' || !embedUrl || !calendarRef.current) {
      if (props.stage === 'paid') setCalendarState('error');
      return;
    }

    const parentElement = calendarRef.current;
    let disposed = false;
    const getApi = () =>
      (window as Window & { Calendly?: CalendlyApi }).Calendly;

    const render = () => {
      if (disposed) return;
      const api = getApi();
      if (!api) {
        setCalendarState('error');
        return;
      }
      parentElement.replaceChildren();
      api.initInlineWidget({ url: embedUrl, parentElement });
      setCalendarState('ready');
    };

    let script = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT}"]`);
    const onLoad = () => render();
    const onError = () => !disposed && setCalendarState('error');

    setCalendarState('loading');
    if (getApi()) {
      render();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.src = CALENDLY_SCRIPT;
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
    }

    return () => {
      disposed = true;
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
      parentElement.replaceChildren();
    };
  }, [embedUrl, props.stage]);

  const markDownloaded = () => {
    setProgress((current) => {
      const next = { ...current, downloaded: true };
      writeProgress(progressKey, next);
      return next;
    });
  };

  const focusCalendar = () => {
    calendarSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const paid = props.stage === 'paid';
  const downloadToken = paid ? props.downloadToken : undefined;

  return (
    <section className="booking-flow" aria-label="Booking progress">
      <ol className="booking-steps">
        <li className={`booking-step ${paid ? 'is-complete' : 'is-current'}`}>
          <span className="booking-step-number" aria-hidden="true">{paid ? '✓' : '1'}</span>
          <div className="booking-step-copy">
            <span className="booking-step-kicker">{paid ? 'Complete' : 'Step 1'}</span>
            <h3>{paid ? 'Payment received' : `Pay ${BOOKING.price}`}</h3>
            <p>{paid ? 'Your session access is unlocked.' : 'Secure checkout powered by Razorpay.'}</p>
          </div>
          {!paid && <PaymentButton />}
        </li>

        <li className={`booking-step ${!paid ? 'is-locked' : progress.scheduled ? 'is-complete' : 'is-current'}`}>
          <span className="booking-step-number" aria-hidden="true">{progress.scheduled ? '✓' : '2'}</span>
          <div className="booking-step-copy">
            <span className="booking-step-kicker">{progress.scheduled ? 'Complete' : 'Step 2'}</span>
            <h3>{progress.scheduled ? 'Meeting scheduled' : 'Schedule meeting'}</h3>
            <p>{!paid ? 'Available after payment.' : progress.scheduled ? 'Your calendar invite is on its way.' : 'Choose the time that works for you.'}</p>
          </div>
          <button
            type="button"
            className="booking-step-action"
            disabled={!paid || !schedulingUrl}
            onClick={focusCalendar}
          >
            {progress.scheduled ? 'View scheduler' : 'Choose a time'}
          </button>
        </li>

        <li className={`booking-step ${!paid || !downloadToken ? 'is-locked' : progress.downloaded ? 'is-complete' : 'is-current'}`}>
          <span className="booking-step-number" aria-hidden="true">{progress.downloaded ? '✓' : '3'}</span>
          <div className="booking-step-copy">
            <span className="booking-step-kicker">{progress.downloaded ? 'Complete' : 'Step 3'}</span>
            <h3>{progress.downloaded ? 'Playbook downloaded' : 'Download Playbook'}</h3>
            <p>{!paid ? 'Available after payment.' : downloadToken ? `${PLAYBOOK.pages} pages, yours to keep.` : 'Secure access is still being verified.'}</p>
          </div>
          {downloadToken ? (
            <a
              className="booking-step-action"
              href={PLAYBOOK.hrefFor(downloadToken)}
              download={PLAYBOOK.filename}
              onClick={markDownloaded}
            >
              Download PDF
            </a>
          ) : (
            <button type="button" className="booking-step-action" disabled>
              Download PDF
            </button>
          )}
        </li>
      </ol>

      {paid && !props.verified && (
        <div className="booking-verification-note" role="status">
          <p>
            Your payment return was received, but the secure Playbook link could not be prepared yet.
            Scheduling is still available.
          </p>
          {props.onRetry && (
            <button type="button" onClick={props.onRetry} disabled={props.retrying}>
              {props.retrying ? 'Checking…' : 'Retry verification'}
            </button>
          )}
        </div>
      )}

      {paid && (
        <div className="booking-calendar" ref={calendarSectionRef}>
          <div className="booking-calendar-heading">
            <p className="teach-eyebrow">Schedule your session</p>
            <h2>Choose your time</h2>
            <p>Pick a slot below. Calendly sends the confirmation and meeting invite automatically.</p>
          </div>

          {!schedulingUrl ? (
            <div className="booking-calendar-fallback" role="alert">
              <strong>Scheduling is temporarily unavailable.</strong>
              <span>
                Email <a href={`mailto:${BOOKING.email}`}>{BOOKING.email}</a> and your slot will be arranged directly.
              </span>
            </div>
          ) : (
            <>
              {calendarState === 'loading' && <p className="booking-calendar-status" role="status">Loading available times…</p>}
              {calendarState === 'error' && (
                <p className="booking-calendar-status" role="alert">
                  The scheduler could not load here.{' '}
                  <a href={schedulingUrl} target="_blank" rel="noopener noreferrer">Open Calendly in a new tab</a>.
                </p>
              )}
              <div
                ref={calendarRef}
                className="calendly-inline-widget"
                aria-label="Calendly scheduling widget"
              />
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default BookingSteps;
