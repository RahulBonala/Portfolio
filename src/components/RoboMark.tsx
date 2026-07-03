import { useEffect, useRef } from 'react';
import { createRoboMark } from '../lib/robomark';
import './RoboMark.css';

/**
 * React wrapper for the framework-free RoboMark core (src/lib/robomark.ts).
 * Mounts once; all state lives in the core as class toggles, so React never
 * re-renders for it. Decorative — the parent link carries the accessible name.
 */
const RoboMark: React.FC = () => {
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bot = createRoboMark(hostRef.current!);
    return () => bot.destroy();
  }, []);

  return <span ref={hostRef} className="robomark" aria-hidden="true" />;
};

export default RoboMark;
