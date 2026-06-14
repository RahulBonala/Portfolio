import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

function applyTheme(theme: Theme) {
  const el = document.documentElement;
  el.setAttribute('data-theme', theme);
  el.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#060607' : '#f7f8fb');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch { /* ignore */ }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Dark is the default and the identity. A stored 'light' choice is applied
 * after mount — initial state stays 'dark' so client hydration matches the
 * prerendered HTML (the pre-paint script in index.html sets the attribute).
 *
 * Toggling cross-fades the whole document via the View Transitions API where
 * supported; otherwise a short CSS colour transition. Instant under reduced motion.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration sync with localStorage
        setThemeState(stored);
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => unknown;
      };

      if (prefersReducedMotion()) {
        applyTheme(next);
        return next;
      }

      if (typeof doc.startViewTransition === 'function') {
        doc.startViewTransition(() => {
          flushSync(() => {
            applyTheme(next);
            setThemeState(next);
          });
        });
        return current; // the transition callback commits the real change
      }

      // Fallback: enable a brief colour transition, then swap
      const root = document.documentElement;
      root.classList.add('theme-anim');
      window.setTimeout(() => root.classList.remove('theme-anim'), 420);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
