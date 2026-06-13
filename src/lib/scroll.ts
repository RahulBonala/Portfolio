import type Lenis from 'lenis';

/** Singleton holder so route changes can drive the same Lenis instance. */
export const scrollState: { lenis: Lenis | null } = { lenis: null };

export function scrollToTop(immediate = true) {
  if (scrollState.lenis) {
    scrollState.lenis.scrollTo(0, { immediate });
  } else {
    window.scrollTo(0, 0);
  }
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return false;
  if (scrollState.lenis) {
    scrollState.lenis.scrollTo(el as HTMLElement, { offset: -80 });
  } else {
    (el as HTMLElement).scrollIntoView();
  }
  return true;
}
