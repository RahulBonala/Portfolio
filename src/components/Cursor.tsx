import { useEffect, useRef } from 'react';
import './Cursor.css';

/**
 * Custom cursor: a small dot that trails the pointer and expands over
 * interactive elements (links, buttons, [data-cursor]). Desktop-pointer
 * only — touch devices and reduced-motion users never see it.
 */
const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dot = dotRef.current;
    if (!finePointer || reduced || !dot) return;

    document.documentElement.classList.add('has-custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    let visible = false;

    const loop = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        dot.classList.add('cursor--visible');
      }
      const interactive = (e.target as HTMLElement).closest(
        'a, button, input, textarea, select, [data-cursor]'
      );
      const label = interactive?.getAttribute('data-cursor-label') ?? '';
      dot.dataset.label = label;
      dot.classList.toggle('cursor--hover', !!interactive);
      dot.classList.toggle('cursor--label', !!label);
    };

    const onLeave = () => {
      visible = false;
      dot.classList.remove('cursor--visible');
    };

    const onDown = () => dot.classList.add('cursor--down');
    const onUp = () => dot.classList.remove('cursor--down');

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={dotRef} className="cursor" aria-hidden="true" />;
};

export default Cursor;
