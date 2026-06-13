import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveal system for a page. Motion rules (audit-driven):
 * duration ≤ 0.4s, travel ≤ 24px, trigger at 85% viewport, stagger ≤ 60ms.
 * Content is readable well within ~300ms of entering view, and is fully
 * visible with no JS animation under prefers-reduced-motion.
 */
export function useReveals(scope: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal || 'up';
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: dir === 'up' ? 24 : 0,
            x: dir === 'left' ? -24 : dir === 'right' ? 24 : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.fromTo(
          group.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.06,
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);
}
