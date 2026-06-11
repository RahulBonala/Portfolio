# Design Guidelines — v3 (futuristic editorial, dark only)

The reference for working on this portfolio after the 2026 redesign. The previous light/dark "product designer" system was replaced wholesale with a dark editorial system positioning Rahul as a **frontend developer with deep AI expertise**.

> The controlling rule is unchanged: **don't make it look like AI slop.** Every other rule is downstream of that. The redesign dodges the 2026 slop palette (dark + purple/cyan glow + glassmorphism + bento grids) on purpose.

---

## 1. Voice and principles

- **Specificity over abstraction.** Real numbers, real employers, real stacks. "Leading the Flipkart → CureFoods frontend migration" — yes. "Production impact at scale" alone — no.
- **One signature per page.** The signature is the Syne display type + electric lime on near-black. Everything else stays quiet (neutral grays, hairlines).
- **First person, conversational, no buzzwords.** Past tense for shipped work.
- **Honest claims only.** Metrics shown (95% CSAT, 80% faster workflows, 70% fewer tickets) come from verified Smiths Detection work. Don't invent numbers for work that doesn't have them — describe scope qualitatively instead (see the CureFoods copy).

## 2. Tokens

All tokens live in [src/index.css](src/index.css). Single dark theme — there is no light mode and no theme toggle.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#060607` | Page background |
| `--bg-raised` / `--bg-panel` | `#0c0c0e` / `#101013` | Cards, media frames, inputs |
| `--ink` | `#f2f2ef` | Headings, primary text |
| `--ink-secondary / -muted / -faint` | alpha steps of ink | Body / captions / decorative |
| `--hairline` / `--hairline-strong` | white @ 10% / 18% | All borders and rules |
| `--accent` | `#c8f542` (electric lime) | The one accent. CTAs, labels, meters, highlights |
| `--accent-ink` | `#0a0c02` | Text on top of accent |

Fonts: **Syne** (600–800, display, always uppercase for headings), **Plus Jakarta Sans** (body), **Fira Code** (mono labels). Loaded from Google Fonts in [index.html](index.html).

Type rules:
- Section headings use `.sec-title`; sized with `clamp()` floors small enough that the longest single word fits a 375px viewport (Syne 800 is an extended face — always test "ENGINEER", "SOMETHING", "BESTANSWERS.AI").
- Mono eyebrow labels (`.sec-label`) number the sections: `001 / About`.

## 3. Motion system

- **Lenis** smooth scroll, driven by the GSAP ticker (set up in [src/App.tsx](src/App.tsx)). Anchor clicks route through `lenis.scrollTo`.
- **Global reveal**: any element with `data-reveal` (`up | left | right | scale`) animates in once via ScrollTrigger; `data-reveal-group` staggers direct children. Ease is `expo.out` — never linear.
- **Scene changes**: hero content/visual scrub out on scroll; Work media + giant indexes parallax at different speeds; Approach pins and crossfades beliefs (desktop only via `gsap.matchMedia`).
- **Custom cursor** ([Cursor.tsx](src/components/Cursor.tsx)): an accent dot that expands over interactives, `data-cursor-label` adds a word. Fine-pointer devices only. (v2 banned this; v3 ships it deliberately as part of the futuristic direction — keep it restrained, never add trails/physics.)
- **Preloader** ([Preloader.tsx](src/components/Preloader.tsx)): once per session, hard cap well under 2s, dispatches `rb:preloader-done` which the hero intro waits for.
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
└── components/
    ├── Preloader.tsx    — branded load, once per session
    ├── Cursor.tsx       — custom cursor
    ├── Header.tsx       — fixed bar + full-screen mobile menu
    ├── Hero.tsx         — 3D hero + intro choreography + facts strip
    ├── three/HeroScene.tsx — lazy R3F particle network
    ├── About.tsx        — statement, prose, numbers, timeline
    ├── Work.tsx         — 4 project worlds + archive (data inline)
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
