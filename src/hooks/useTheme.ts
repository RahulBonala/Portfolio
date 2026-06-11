import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Dark is the site's identity and the default. A stored 'light' choice is
 * applied after mount — the initial state must stay 'dark' so client
 * hydration matches the prerendered HTML (the pre-paint script in index.html
 * already set the <html> attribute, so there is no visual flash).
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
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#060607' : '#f7f8fb');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* ignore */ }
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
