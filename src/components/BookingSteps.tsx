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
  initInlineWidget: (options: { url: string; parentElement: HTMLElement; inlineStyles?: boolean }) => void;
};

const EMPTY_PROGRESS: Progress = { scheduled: false, downloaded: false };
const CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

let calendlyPromise: Promise<CalendlyApi> | null = null;

function loadCalendly(): Promise<CalendlyApi> {
  if (calendlyPromise) return calendlyPromise;

  const getApi = () => (window as Window & { Calendly?: CalendlyApi }).Calendly;
  if (getApi()) {
    calendlyPromise = Promise.resolve(getApi()!);
    return calendlyPromise;
  }

  calendlyPromise = new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT}"]`);
    
    const onLoad = () => {
      const api = getApi();
      if (api) resolve(api);
      else {
        calendlyPromise = null;
        reject(new Error('Calendly API not found'));
      }
    };
    
    const onError = () => {
      calendlyPromise = null;
      reject(new Error('Failed to load Calendly script'));
    };

    if (script) {
      // If script is already in DOM, it might have loaded or failed.
      if (script.getAttribute('data-loaded') === 'true') {
        onLoad();
      } else {
        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
      }
    } else {
      script = document.createElement('script');
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.addEventListener('load', () => {
        script!.setAttribute('data-loaded', 'true');
        onLoad();
      });
      script.addEventListener('error', onError);
      document.body.appendChild(script);
    }
  });

  return calendlyPromise;
}

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
  const [calendarRetryCount, setCalendarRetryCount] = useState(0);

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

    const tryRender = async () => {
      try {
        setCalendarState('loading');
        const api = await loadCalendly();
        if (disposed) return;

        parentElement.replaceChildren();
        api.initInlineWidget({ url: embedUrl, parentElement, inlineStyles: true });

        const iframe = parentElement.querySelector('iframe');
        if (iframe) {
          let isLoaded = false;
          const timeout = setTimeout(() => {
            if (!disposed && !isLoaded) {
              setCalendarState('error');
            }
          }, 10000);

          iframe.addEventListener('load', () => {
            isLoaded = true;
            clearTimeout(timeout);
            if (!disposed) setCalendarState('ready');
          });
        } else {
          setCalendarState('ready');
        }
      } catch {
        if (!disposed) setCalendarState('error');
      }
    };

    tryRender();

    return () => {
      disposed = true;
      parentElement.replaceChildren();
    };
  }, [embedUrl, props.stage, calendarRetryCount]);

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
                  <button type="button" className="booking-calendar-retry" onClick={() => setCalendarRetryCount(c => c + 1)}>Retry</button> or{' '}
                  <a href={schedulingUrl} target="_blank" rel="noopener noreferrer">open Calendly in a new tab</a>.
                </p>
              )}
              {calendarState === 'ready' && (
                <p className="booking-calendar-status" role="status">
                  <a href={schedulingUrl} target="_blank" rel="noopener noreferrer">Open Calendly in a new tab</a>
                </p>
              )}
              <div
                ref={calendarRef}
                className="booking-calendar-embed"
                data-auto-load="false"
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
