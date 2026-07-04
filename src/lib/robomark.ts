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
  '............', // feet rows — drawn as swappable leg groups (stand/walk frames)
  '............',
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

  // Legs: standing pair plus two walk frames (one foot lifted a cell),
  // swapped by is-step-a/is-step-b while the companion walks
  const legsStand = svgEl('g', { class: 'rb-legs rb-legs-stand' });
  legsStand.append(cell(3, 11, 2, 2, 'rb-shell'), cell(7, 11, 2, 2, 'rb-shell'));
  const legsA = svgEl('g', { class: 'rb-legs rb-legs-a' });
  legsA.append(cell(3, 10, 2, 2, 'rb-shell'), cell(7, 11, 2, 2, 'rb-shell'));
  const legsB = svgEl('g', { class: 'rb-legs rb-legs-b' });
  legsB.append(cell(3, 11, 2, 2, 'rb-shell'), cell(7, 10, 2, 2, 'rb-shell'));
  svg.append(legsStand, legsA, legsB);

  return svg;
}

const STATE_CLASSES = [
  'is-asleep',
  'is-greeting',
  'is-cheering',
  'is-pressed',
  'is-blinking',
  'is-walking',
  'is-step-a',
  'is-step-b',
  'is-shy',
];

/** Shared timer bookkeeping: one-shot classes that never re-schedule themselves. */
function timerBag(host: HTMLElement) {
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };
  const flash = (cls: string, ms: number) => {
    host.classList.add(cls);
    later(() => host.classList.remove(cls), ms);
  };
  const clearAll = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
  };
  return { later, flash, clearAll };
}

export function createRoboMark(host: HTMLElement, opts: RoboMarkOptions = {}): RoboMarkHandle {
  host.classList.add('robomark');
  host.replaceChildren(buildSprite());
  const eyes = host.querySelector<SVGGElement>('.rb-eyes')!;

  const { later, flash, clearAll } = timerBag(host);

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
    clearAll();
    host.classList.remove(...STATE_CLASSES);
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

// ────────────────────────────────────────────────────────────────
// Companion mode — the same robot travels with the cursor.
// ────────────────────────────────────────────────────────────────

export interface RoboCompanionOptions {
  /** Height in px — integer multiples of 13 keep the pixels crisp (default 52). */
  size?: number;
  /** Trail offset from the pointer so the robot never covers what you point at. */
  offsetX?: number;
  offsetY?: number;
}

const LERP = 0.14; // follow weight: heavy enough to trail, light enough to keep up
const STEP_EVERY_PX = 14; // one walk frame per 14px travelled — motion is input-driven
const WALK_MIN_DIST = 4; // closer than this it settles instead of shuffling
const EDGE_PAD = 8;

/**
 * The cursor companion: the trademark robot trails the pointer with a
 * little weight, walks (alternating pixel feet) while it travels, flips
 * to face its direction, and looks up at the cursor when it rests.
 *
 * Every frame of motion is caused by pointer input — the walk cycle
 * advances per pixel travelled, not per tick, so a still cursor means a
 * still robot (the rAF loop stops entirely once it settles). Fine-pointer
 * devices only; never created under reduced motion; pointer-events: none
 * so it can never block a click.
 */
export function createRoboCompanion(
  host: HTMLElement,
  opts: RoboCompanionOptions = {}
): RoboMarkHandle {
  const size = opts.size ?? 52;
  const offsetX = opts.offsetX ?? 26;
  const offsetY = opts.offsetY ?? 20;
  const width = Math.round((size * COLS) / ROWS);

  host.classList.add('robomark', 'robo-companion');
  host.style.height = `${size}px`;
  host.hidden = true; // appears on the first pointer move
  host.replaceChildren(buildSprite());
  const eyes = host.querySelector<SVGGElement>('.rb-eyes')!;

  const { flash, clearAll } = timerBag(host);

  let dynamic: Array<() => void> | null = null;
  let raf = 0;
  let active = false;
  let px = 0;
  let py = 0;
  let x = 0;
  let y = 0;
  let stepAcc = 0;
  let stepParity = false;
  let facingLeft = false;
  let walking = false;
  let ex = 0;
  let ey = 0;
  let lastMove = performance.now();
  let ready = false; // activation waits for the preloader's entrance beat
  let sawMove = false;

  const listen = (
    target: Window | Document | Element,
    type: string,
    fn: EventListener,
    options?: AddEventListenerOptions
  ) => {
    target.addEventListener(type, fn, options);
    dynamic!.push(() => target.removeEventListener(type, fn));
  };

  const viewport = () => {
    const root = document.documentElement;
    return {
      w: window.innerWidth || root.clientWidth || root.getBoundingClientRect().width,
      h: window.innerHeight || root.clientHeight || root.getBoundingClientRect().height,
    };
  };

  const targetPos = (): [number, number] => {
    const { w, h } = viewport();
    // Near the right/bottom edges, step to the pointer's other side instead
    // of letting the clamp slide the robot under what's being pointed at
    let tx = px + offsetX;
    if (tx + width > w - EDGE_PAD) tx = px - offsetX - width;
    let ty = py + offsetY;
    if (ty + size > h - EDGE_PAD) ty = py - offsetY - size;
    return [
      Math.min(Math.max(tx, EDGE_PAD), Math.max(EDGE_PAD, w - width - EDGE_PAD)),
      Math.min(Math.max(ty, EDGE_PAD), Math.max(EDGE_PAD, h - size - EDGE_PAD)),
    ];
  };

  const place = () => {
    host.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  };

  const setWalking = (next: boolean) => {
    if (walking === next) return;
    walking = next;
    host.classList.toggle('is-walking', next);
    if (!next) {
      host.classList.remove('is-step-a', 'is-step-b');
      stepAcc = 0;
    }
  };

  const setFacing = (left: boolean) => {
    if (facingLeft === left) return;
    facingLeft = left;
    host.style.setProperty('--rb-face', left ? '-1' : '1');
  };

  const setEyes = (nex: number, ney: number) => {
    if (nex === ex && ney === ey) return;
    ex = nex;
    ey = ney;
    eyes.style.transform = `translate(${ex}px, ${ey}px)`;
  };

  /** Resting: look toward the cursor (mirrored when the sprite is flipped). */
  const lookAtPointer = () => {
    const dx = px - (x + width / 2);
    const dy = py - (y + size / 2);
    let nex = dx < -18 ? -1 : dx > 18 ? 1 : 0;
    if (facingLeft) nex = -nex;
    setEyes(nex, dy > 20 ? 1 : 0);
  };

  const loop = () => {
    const [tx, ty] = targetPos();
    const dx = tx - x;
    const dy = ty - y;
    const dist = Math.hypot(dx, dy);

    if (dist < 0.5) {
      x = tx;
      y = ty;
      place();
      setWalking(false);
      lookAtPointer();
      raf = 0; // settled — the loop stops until the pointer moves again
      return;
    }

    const mx = dx * LERP;
    const my = dy * LERP;
    x += mx;
    y += my;
    place();

    if (mx < -0.4) setFacing(true);
    else if (mx > 0.4) setFacing(false);

    setWalking(dist > WALK_MIN_DIST);
    if (walking) {
      stepAcc += Math.hypot(mx, my);
      if (stepAcc >= STEP_EVERY_PX) {
        stepAcc = 0;
        stepParity = !stepParity;
        host.classList.toggle('is-step-a', stepParity);
        host.classList.toggle('is-step-b', !stepParity);
      }
      setEyes(1, 0); // eyes forward, into the direction of travel
    } else {
      lookAtPointer();
    }

    raf = requestAnimationFrame(loop);
  };

  // One wave per session across BOTH bots: whichever is live first greets,
  // and the shared key makes the other skip (choreography, not a double wave)
  const greet = () => {
    try {
      if (sessionStorage.getItem(GREETED_KEY) === '1') return;
      sessionStorage.setItem(GREETED_KEY, '1');
    } catch {
      /* sessionStorage unavailable — greet every load, still one-shot */
    }
    flash('is-greeting', GREET_MS);
  };

  const wake = () => {
    lastMove = performance.now();
    host.classList.remove('is-asleep');
  };

  const activate = () => {
    if (active) return;
    active = true;
    host.hidden = false;
    [x, y] = targetPos(); // first appearance: snap beside the cursor, no walk-in
    place();
    lookAtPointer();
    greet();
  };

  const onMove = (e: Event) => {
    const p = e as PointerEvent;
    px = p.clientX;
    py = p.clientY;
    wake();
    if (!ready) {
      sawMove = true; // remember there is a pointer; appear once the preloader ends
      return;
    }
    if (!active) activate();
    if (!raf) raf = requestAnimationFrame(loop);
  };

  function setup() {
    if (dynamic) return;
    if (reduced.matches || !finePointer.matches) return;
    dynamic = [];

    // Never appear behind (or greet under) the preloader: activation waits
    // for the same entrance beat the hero uses
    try {
      ready = sessionStorage.getItem('rb-preloaded') === '1';
    } catch {
      ready = false; // the preloader will still dispatch its event
    }
    if (!ready) {
      listen(
        window,
        'rb:preloader-done',
        () => {
          ready = true;
          if (sawMove) {
            activate();
            if (!raf) raf = requestAnimationFrame(loop);
          }
        },
        { once: true }
      );
    }

    listen(window, 'pointermove', onMove, { passive: true });

    // Tactile echo: the companion flinches on any press (a press is also activity)
    listen(
      window,
      'pointerdown',
      () => {
        wake();
        if (active) flash('is-pressed', PRESS_MS);
      },
      { passive: true }
    );

    // Typing and scroll-reading count as activity too — the companion must
    // not doze off next to a user who is working
    listen(window, 'keydown', wake, { passive: true });
    listen(window, 'scroll', wake, { passive: true });
    listen(window, 'touchstart', wake, { passive: true });

    // Shy: step out of the way whenever a text field has focus, so it never
    // sits on top of what's being typed
    const TEXT_FIELDS = 'input, textarea, select, [contenteditable="true"]';
    listen(document, 'focusin', (e) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(TEXT_FIELDS)) host.classList.add('is-shy');
    });
    listen(document, 'focusout', () => host.classList.remove('is-shy'));

    // Cheer on real conversions, queued while the tab is hidden
    let cheerQueued = false;
    listen(window, RB_EVENTS.celebrate, () => {
      if (!active) return;
      if (document.hidden) {
        cheerQueued = true;
        return;
      }
      flash('is-cheering', CHEER_MS);
    });
    listen(document, 'visibilitychange', () => {
      if (!document.hidden && cheerQueued) {
        cheerQueued = false;
        flash('is-cheering', CHEER_MS);
      }
    });

    // Sleep after 45s without pointer travel; any move wakes it (see onMove)
    const idleTimer = window.setInterval(() => {
      if (document.hidden || !active) return;
      if (performance.now() - lastMove > SLEEP_AFTER_MS) host.classList.add('is-asleep');
    }, IDLE_POLL_MS);
    dynamic.push(() => window.clearInterval(idleTimer));
  }

  function teardown() {
    if (!dynamic) return;
    dynamic.forEach((fn) => fn());
    dynamic = null;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    clearAll();
    host.classList.remove(...STATE_CLASSES);
    host.hidden = true;
    active = false;
    walking = false;
    ready = false;
    sawMove = false;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const onGateChange = () => (reduced.matches || !finePointer.matches ? teardown() : setup());
  setup();
  reduced.addEventListener('change', onGateChange);
  finePointer.addEventListener('change', onGateChange);

  return {
    destroy() {
      teardown();
      reduced.removeEventListener('change', onGateChange);
      finePointer.removeEventListener('change', onGateChange);
      host.replaceChildren();
      host.classList.remove('robomark', 'robo-companion');
    },
  };
}
