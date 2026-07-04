import { useEffect, useRef } from 'react';
import { createRoboCompanion } from '../lib/robomark';
import './RoboMark.css';
import './RoboCompanion.css';

/**
 * The travelling RoboMark: trails the cursor with a little weight, walks
 * while it moves, rests and looks up at the pointer when you stop.
 * Fine-pointer devices only; never appears under reduced motion; all
 * logic lives in the framework-free core (src/lib/robomark.ts).
 */
const RoboCompanion: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bot = createRoboCompanion(hostRef.current!);
    return () => bot.destroy();
  }, []);

  return <div ref={hostRef} className="robomark robo-companion" hidden aria-hidden="true" />;
};

export default RoboCompanion;
