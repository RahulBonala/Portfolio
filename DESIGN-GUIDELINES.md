# Design Guidelines — v3 (futuristic editorial, dark-first)

The reference for working on this portfolio after the 2026 redesign. A dark-first editorial system positioning Rahul as a **product designer & developer specialising in AI-native UI/UX** (currently at Ginthi.ai). A light theme exists as a toggle; dark is the default and the identity.

> The controlling rule is unchanged: **don't make it look like AI slop.** Every other rule is downstream of that. The redesign dodges the 2026 slop palette (dark + purple/cyan glow + glassmorphism + bento grids) on purpose.

---

## 1. Voice and principles

- **Specificity over abstraction.** Real numbers, real employers, real stacks — but never name client companies or partner organisations that should stay private. Describe that work qualitatively instead.
- **One signature per page.** The signature is the Syne display type + electric lime on near-black. Everything else stays quiet (neutral grays, hairlines).
- **First person, conversational, no buzzwords.** Past tense for shipped work.
- **Honest claims only.** Metrics shown (95% CSAT, 80% faster workflows, 70% fewer tickets) come from verified Smiths Detection work. Don't invent numbers for work that doesn't have them — describe scope qualitatively instead.

## 2. Tokens

All tokens live in [src/index.css](src/index.css). Two themes: **dark (default)** = near-black + electric lime; **light** = off-white + the v2 indigo (`#4f46e5`). The toggle lives in the header; `useTheme` ([src/hooks/useTheme.ts](src/hooks/useTheme.ts)) persists the choice and a pre-paint script in index.html prevents flash. Never hardcode a theme color — everything (including the SVG diagrams and the three.js scene) reads the CSS variables.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#060607` | Page background |
| `--bg-raised` / `--bg-panel` | `#0c0c0e` / `#101013` | Cards, media frames, inputs |
| `--ink` | `#f2f2ef` | Headings, primary text |
| `--ink-secondary / -muted / -faint` | alpha steps of ink | Body / captions / decorative |
| `--hairline` / `--hairline-strong` | white @ 10% / 18% | All borders and rules |
| `--accent` | `#c8f542` (electric lime) | The one accent. CTAs, labels, meters, highlights |
| `--accent-ink` | `#0a0c02` | Text on top of accent |

Fonts: **Syne** (700/800, display, always uppercase for headings), **Plus Jakarta Sans** (body), **Fira Code** (mono labels). Loaded from Google Fonts in [index.html](index.html).

Type rules:
- Section headings use `.sec-title`; sized with `clamp()` floors small enough that the longest single word fits a 375px viewport (Syne 800 is an extended face — always test "ENGINEER", "SOMETHING", "BESTANSWERS.AI").
- Mono eyebrow labels (`.sec-label`) number the sections: `001 / About`.

## 3. Motion system

- **Lenis** smooth scroll, driven by the GSAP ticker (set up in [src/App.tsx](src/App.tsx)). Anchor clicks route through `lenis.scrollTo`.
- **Global reveal**: any element with `data-reveal` (`up | left | right | scale`) animates in once via ScrollTrigger; `data-reveal-group` staggers direct children. Ease is `expo.out` — never linear.
- **Scene changes**: hero content/visual scrub out on scroll; Work media + giant indexes parallax at different speeds; Approach pins and swaps beliefs **strictly sequentially** — never crossfade them, overlapping statements read as broken (desktop only via `gsap.matchMedia`; narrow viewports get a static stacked list).
- **Custom cursor** ([Cursor.tsx](src/components/Cursor.tsx)): an accent dot that expands over interactives, `data-cursor-label` adds a word. Fine-pointer devices only. (v2 banned this; v3 ships it deliberately as part of the futuristic direction — keep it restrained, never add trails/physics.)
- **Preloader** ([Preloader.tsx](src/components/Preloader.tsx)): once per session, hard cap well under 2s, dispatches `rb:preloader-done` which the hero intro waits for.
- **RoboMark** (framework-free core [robomark.ts](src/lib/robomark.ts)): the pixel-robot trademark. The header mark reverted to plain text + the original accent status dot — the robot is **not** in the header; it lives only as the roaming cursor companion below. The core still exports `createRoboMark` (a static-mount mode) for future placements (other sites, a footer, a 404 page) — it isn't wired to anything in this repo today. Every animation is a one-shot class toggle with `step-end` timing (pixel idiom — discrete frames, no eased glides, structurally cannot loop); the chest pixel **never pulses** (BookCta keeps the site's one pulse). Ambient blink exists behind a flag and ships OFF.
- **RoboCompanion** ([RoboCompanion.tsx](src/components/RoboCompanion.tsx), same core): the only instance of the mark that currently ships — it trails the cursor with a lerp weight, walks in 2-frame pixel steps, flips to face its direction, looks up at the pointer when it rests, sleeps after 45s of no activity (pointer, keys, or scroll — typing counts), flinches on press, cheers on `rb:celebrate` (real conversions: contact form sent, booking landed). The line against purposeless motion: **the walk cycle advances per pixel travelled, never per tick** — a still cursor is a still robot, and the rAF loop stops entirely once it settles. Choreography rules: it never appears before `rb:preloader-done`; it greets with one wave per session; it goes *shy* (steps out, discrete fade) whenever a text field has focus so it never sits on what's being typed; near the right/bottom viewport edges it steps to the pointer's other side rather than sliding under the target; asleep it dims to 55%. It deliberately stays put when the pointer leaves the window — the cursor dot *is* the pointer so it must vanish, a companion waits. `pointer-events: none` always; z-index 840 (under BookCta and header, over content); fine-pointer devices only; never created under reduced motion (touch/reduced users see no mascot at all — the trademark is presently companion-only). Do not add speech bubbles, sounds, or hover-triggered stunts to it — following is its whole job.
- **Reduced motion**: every system (Lenis, reveals, pin, cursor, preloader, 3D) checks `prefers-reduced-motion` and turns itself off. Content must be fully readable with zero JS animation.

## 4. The 3D layer

[HeroScene.tsx](src/components/three/HeroScene.tsx) renders a multi-agent particle network (R3F). Rules:

- Lazy-loaded (`React.lazy` + `requestIdleCallback`) so it never blocks LCP; the `three` chunk is split in [vite.config.ts](vite.config.ts).
- Gated on WebGL support, `prefers-reduced-motion`, and `saveData`. Fallback is the static SVG constellation + CSS gradient/grid already in place.
- Node count scales with device (`hardwareConcurrency` / `deviceMemory` / width); an FPS governor drops pixel ratio if below ~45fps.
- 3D is structural (it's the identity metaphor), not decoration. Don't add more scenes without a reason this strong.

## 5. Accessibility (unchanged, non-negotiable)

Skip link, focus-visible rings (accent), `aria-label` on icon-only controls, `aria-expanded`/`aria-current` where relevant, decorative SVGs `aria-hidden`, 44px touch targets, WCAG AA contrast (lime on near-black passes; lime is never used for body text), Escape closes the mobile menu, honeypot on the form.

## 6. Anti-patterns (updated)

Still banned: gradient rainbows, glassmorphism as a motif, decorative emoji, sparkle bullets, urgency/discount markers, auto-popups, more than one pulsing dot (the canonical one lives in the footer), "AI-native"-style buzzwords in copy, endless purposeless loops.

Consciously un-banned in v3 (they serve the direction, keep them tasteful): the custom cursor, the preloader, uppercase display type, the giant outline index numbers.

## 7. Files

```
src/
├── App.tsx              — composition, Lenis + global reveal system, footer
├── index.css            — tokens + base + .sec-label/.sec-title
├── lib/robomark.ts      — framework-free pixel-robot core (the trademark)
└── components/
    ├── Preloader.tsx    — branded load, once per session
    ├── Cursor.tsx       — custom cursor
    ├── RoboCompanion.tsx — the pixel robot travelling with the cursor (fine pointer only; the only place it currently appears)
    ├── Header.tsx       — fixed bar + full-screen mobile menu
    ├── Hero.tsx         — 3D hero + intro choreography + facts strip
    ├── three/HeroScene.tsx — lazy R3F particle network
    ├── About.tsx        — statement, prose, numbers, timeline
    ├── Work.tsx         — 3 project worlds + archive (data inline)
    ├── Skills.tsx       — segment-meter specimen rows
    ├── Approach.tsx     — pinned manifesto + quotes
    ├── Contact.tsx      — direct email + EmailJS form
    └── PaymentButton.tsx — Razorpay (used in the course world)
```

Conventions: PascalCase component + sibling `.css`, kebab-case classes prefixed by component, every new section gets a `sec-label` index and an entry in `NAV_LINKS` in [Header.tsx](src/components/Header.tsx).

## 8. Adding anything new — checklist

- [ ] Uses tokens only; the single accent stays single.
- [ ] `data-reveal` for entrances; respects reduced motion.
- [ ] No horizontal overflow at 375px (test the longest word).
- [ ] Build + lint pass.
- [ ] If this doc is now wrong, update it in the same commit.
