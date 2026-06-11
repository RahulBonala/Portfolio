import { useEffect, useState } from 'react';
import './Preloader.css';

const SESSION_KEY = 'rb-preloaded';
const MAX_DURATION = 900; // well under the 2s budget; keeps LCP early

/**
 * Branded loading screen. Counts up while the page settles, then wipes away.
 * Shows once per session; skipped entirely for reduced-motion users.
 */
const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  // Starts 'done' so client hydration matches the prerendered HTML (which has
  // no preloader); the mount effect below switches it on for first visits.
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('done');

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    } catch { /* sessionStorage unavailable */ }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Intentional post-hydration activation: the server HTML must not contain
    // the preloader, so it can only switch on after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase('loading');
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;

    document.body.style.overflow = 'hidden';
    const start = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MAX_DURATION);
      // ease-out curve so the counter feels like it's settling, not ticking linearly
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase('exiting');
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    document.body.style.overflow = '';
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch { /* ignore */ }
    window.dispatchEvent(new Event('rb:preloader-done')); // lets the hero start its entrance
    const t = setTimeout(() => setPhase('done'), 500); // matches CSS wipe duration
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className={`preloader ${phase === 'exiting' ? 'preloader--exit' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <span className="preloader-mark">RB</span>
        <span className="preloader-tag">Design &times; Code &times; AI</span>
      </div>
      <span className="preloader-count">{progress.toString().padStart(3, '0')}</span>
    </div>
  );
};

export default Preloader;
