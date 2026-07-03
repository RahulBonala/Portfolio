/**
 * RoboMark — Rahul's pixel-robot trademark (unit RB-01).
 *
 * Framework-free core: zero dependencies, themed entirely through CSS
 * variables (with baked fallbacks), and every animation is a one-shot
 * class toggle — no state ever re-schedules itself, so an endless loop
 * is impossible by construction. Portable to any site: copy this file
 * plus RoboMark.css and call `createRoboMark(hostElement)`.
 *
 * States (all one-shot or input-driven):
 *  - greet   — waves once per session, ~800ms after `rb:preloader-done`
 *  - gaze    — eyes snap toward the pointer in whole cells (fine pointer only)
 *  - sleep   — lids close after 45s of inactivity; any input wakes it
 *  - cheer   — hops on `rb:celebrate` (real conversions only)
 *  - press   — squashes while its host link is pressed
 *  - blink   — theme toggle only; ambient blink exists behind a flag, OFF
 *
 * Reduced motion: the machinery never attaches — the robot renders as a
 * static, fully visible mark (RoboMark.css has an independent backstop).
 */

export const RB_EVENTS = {
  /** Dispatched by real conversions (message sent, session booked). */
  celebrate: 'rb:celebrate',
} as const;

export interface RoboMarkOptions {
  /**
   * Ambient blink (randomized 8–14s). Pre-nominated as the first cut per
   * the design guidelines' no-purposeless-motion rule — off by default;
   * gaze + greet + the theme blink carry liveness.
   */
  blink?: boolean;
}

export interface RoboMarkHandle {
  destroy(): void;
}

const COLS = 12;
const ROWS = 13;

/**
 * Shell (i → currentColor) and visor (v → --bot-visor/--bg) only.
 * The accent features (antenna tip, eyes, chest pixel) and the wave arm
 * are separate named elements so states can address them.
 * Trademark features: taller-than-wide 12×13, right-shoulder antenna,
 * notched cap corner at (9,2), wraparound visor, neck step, chest pixel.
 */
const SPRITE = [
  '............', // antenna tip (8,0) drawn separately in accent
  '........i...', // antenna stem
  '..iiiiiii...', // cap top — (9,2) intentionally missing: the corner notch
  '..iiiiiiii..',
  '..vvvvvvvv..', // visor band — the eyes float on top of it
  '..vvvvvvvv..',
  '..vvvvvvvv..',
  '..iiiiiiii..', // chin
  '...iiiiii...', // body, one cell narrower than the head: the neck step
  '...iiiiii...', // chest pixel (6,9) drawn separately in accent
  '...iiiiii...',
  '...ii..ii...', // feet
  '...ii..ii...',
];

const SVG_NS = 'http://www.w3.org/2000/svg';

const SLEEP_AFTER_MS = 45_000;
const IDLE_POLL_MS = 5_000;
const GREET_DELAY_MS = 800;
const GREET_MS = 1_500;
const CHEER_MS = 1_000;
const PRESS_MS = 220;
const BLINK_MS = 140;
const GREETED_KEY = 'rb-mascot-greeted';

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {}
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function cell(x: number, y: number, w: number, h: number, cls: string) {
  return svgEl('rect', {
    x: String(x),
    y: String(y),
    width: String(w),
    height: String(h),
    class: cls,
  });
}

function buildSprite(): SVGSVGElement {
  const svg = svgEl('svg', {
    viewBox: `0 0 ${COLS} ${ROWS}`,
    'shape-rendering': 'crispEdges',
    'aria-hidden': 'true',
    focusable: 'false',
  });

  // Shell + visor: horizontal runs merged into single rects (no seams)
  for (let y = 0; y < ROWS; y++) {
    const row = SPRITE[y];
    let x = 0;
    while (x < COLS) {
      const code = row[x];
      if (code === '.') {
        x++;
        continue;
      }
      let end = x;
      while (end + 1 < COLS && row[end + 1] === code) end++;
      svg.appendChild(cell(x, y, end - x + 1, 1, code === 'v' ? 'rb-visor' : 'rb-shell'));
      x = end + 1;
    }
  }

  // Antenna tip and chest status pixel — accent, and the chest pixel is
  // static always: BookCta's dot keeps the site's one pulse.
  svg.appendChild(cell(8, 0, 1, 1, 'rb-acc rb-tip'));
  svg.appendChild(cell(6, 9, 1, 1, 'rb-acc rb-core'));

  // Eyes: open 2×2 pair plus closed 2×1 lids, swapped by class
  const eyes = svgEl('g', { class: 'rb-eyes' });
  const open = svgEl('g', { class: 'rb-eyes-open' });
  open.append(cell(3, 4, 2, 2, 'rb-acc'), cell(7, 4, 2, 2, 'rb-acc'));
  const lids = svgEl('g', { class: 'rb-eyes-lid' });
  lids.append(cell(3, 5, 2, 1, 'rb-acc'), cell(7, 5, 2, 1, 'rb-acc'));
  eyes.append(open, lids);
  svg.appendChild(eyes);

  // Wave arm: two pre-built frames, visible only during greet/cheer
  const armUp = svgEl('g', { class: 'rb-arm rb-arm-up' });
  armUp.append(cell(9, 8, 1, 1, 'rb-shell'), cell(10, 7, 1, 1, 'rb-shell'), cell(10, 6, 1, 1, 'rb-shell'));
  const armOut = svgEl('g', { class: 'rb-arm rb-arm-out' });
  armOut.append(cell(9, 8, 1, 1, 'rb-shell'), cell(10, 8, 1, 1, 'rb-shell'), cell(11, 8, 1, 1, 'rb-shell'));
  svg.append(armUp, armOut);

  return svg;
}

export function createRoboMark(host: HTMLElement, opts: RoboMarkOptions = {}): RoboMarkHandle {
  host.classList.add('robomark');
  host.replaceChildren(buildSprite());
  const eyes = host.querySelector<SVGGElement>('.rb-eyes')!;

  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  /** One-shot class: added now, dropped after ms. Never re-schedules itself. */
  const flash = (cls: string, ms: number) => {
    host.classList.add(cls);
    later(() => host.classList.remove(cls), ms);
  };

  // ── Dynamics attach/detach as a unit so reduced-motion can flip live ──
  let dynamic: Array<() => void> | null = null;

  const listen = (
    target: Window | Document | Element,
    type: string,
    fn: EventListener,
    options?: AddEventListenerOptions
  ) => {
    target.addEventListener(type, fn, options);
    dynamic!.push(() => target.removeEventListener(type, fn));
  };

  function setupDynamics() {
    if (dynamic) return;
    dynamic = [];

    let asleep = false;
    let inView = true;
    let lastActive = performance.now();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
      });
      io.observe(host);
      dynamic.push(() => io.disconnect());
    }

    const wake = () => {
      lastActive = performance.now();
      if (asleep) {
        asleep = false;
        host.classList.remove('is-asleep');
      }
    };

    // ── gaze: eyes snap toward the pointer in whole grid cells ──
    if (window.matchMedia('(pointer: fine)').matches) {
      let pmx = 0;
      let pmy = 0;
      let raf = 0;
      let ex = 0;
      let ey = 0;
      const applyGaze = () => {
        raf = 0;
        if (asleep || !inView) return;
        const r = host.getBoundingClientRect();
        const dx = pmx - (r.left + r.width / 2);
        const dy = pmy - (r.top + r.height / 2);
        const nex = dx < -24 ? -1 : dx > 24 ? 1 : 0;
        const ney = dy > 32 ? 1 : 0;
        if (nex !== ex || ney !== ey) {
          ex = nex;
          ey = ney;
          // Inside the SVG, 1 CSS px = 1 viewBox unit = one grid cell
          eyes.style.transform = `translate(${ex}px, ${ey}px)`;
        }
      };
      listen(
        window,
        'pointermove',
        (e) => {
          pmx = (e as PointerEvent).clientX;
          pmy = (e as PointerEvent).clientY;
          wake();
          if (!raf) raf = requestAnimationFrame(applyGaze);
        },
        { passive: true }
      );
      dynamic.push(() => {
        if (raf) cancelAnimationFrame(raf);
        eyes.style.transform = '';
      });
    }

    // ── sleep: 45s without input; any input wakes ──
    (['pointerdown', 'keydown', 'scroll', 'touchstart'] as const).forEach((type) =>
      listen(window, type, wake, { passive: true })
    );
    const idleTimer = window.setInterval(() => {
      if (document.hidden || asleep || !inView) return;
      if (performance.now() - lastActive > SLEEP_AFTER_MS) {
        asleep = true;
        host.classList.add('is-asleep');
      }
    }, IDLE_POLL_MS);
    dynamic.push(() => window.clearInterval(idleTimer));

    // ── greet: once per session, after the preloader's entrance beat ──
    const greet = () => {
      try {
        if (sessionStorage.getItem(GREETED_KEY) === '1') return;
        sessionStorage.setItem(GREETED_KEY, '1');
      } catch {
        /* sessionStorage unavailable — greet every load, still one-shot */
      }
      flash('is-greeting', GREET_MS);
    };
    let preloaded = false;
    try {
      preloaded = sessionStorage.getItem('rb-preloaded') === '1';
    } catch {
      /* ignore */
    }
    if (preloaded) {
      later(greet, GREET_DELAY_MS);
    } else {
      listen(window, 'rb:preloader-done', () => later(greet, GREET_DELAY_MS), { once: true });
    }

    // ── cheer: real conversions only; queued if the tab is hidden ──
    let cheerQueued = false;
    const cheer = () => {
      if (document.hidden) {
        cheerQueued = true;
        return;
      }
      flash('is-cheering', CHEER_MS);
    };
    listen(window, RB_EVENTS.celebrate, cheer);
    listen(document, 'visibilitychange', () => {
      if (!document.hidden && cheerQueued) {
        cheerQueued = false;
        flash('is-cheering', CHEER_MS);
      }
    });

    // ── press: squash while the host link/button is pressed ──
    const pressHost = host.closest('a, button') ?? host;
    listen(pressHost, 'pointerdown', () => flash('is-pressed', PRESS_MS), { passive: true });
    listen(pressHost, 'keydown', (e) => {
      const key = (e as KeyboardEvent).key;
      if (key === 'Enter' || key === ' ') flash('is-pressed', PRESS_MS);
    });

    // ── blink on theme toggle: showcases the token swap, single frame ──
    const themeObserver = new MutationObserver((mutations) => {
      const current = document.documentElement.getAttribute('data-theme');
      if (mutations.some((m) => m.oldValue !== current)) flash('is-blinking', BLINK_MS);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
      attributeOldValue: true,
    });
    dynamic.push(() => themeObserver.disconnect());

    // ── ambient blink: OFF unless a page opts in (see RoboMarkOptions) ──
    if (opts.blink) {
      const scheduleBlink = () =>
        later(() => {
          if (!document.hidden && !asleep && inView) flash('is-blinking', BLINK_MS);
          scheduleBlink();
        }, 8_000 + Math.random() * 6_000);
      scheduleBlink();
    }
  }

  function teardownDynamics() {
    if (!dynamic) return;
    dynamic.forEach((fn) => fn());
    dynamic = null;
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
    host.classList.remove('is-asleep', 'is-greeting', 'is-cheering', 'is-pressed', 'is-blinking');
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onReducedChange = () => (reduced.matches ? teardownDynamics() : setupDynamics());
  if (!reduced.matches) setupDynamics();
  reduced.addEventListener('change', onReducedChange);

  return {
    destroy() {
      teardownDynamics();
      reduced.removeEventListener('change', onReducedChange);
      host.replaceChildren();
      host.classList.remove('robomark');
    },
  };
}
