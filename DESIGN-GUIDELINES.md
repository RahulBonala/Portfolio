# Design Guidelines

The reference for working on this portfolio. Captures the system as it stands, the principles behind it, and the patterns to keep adding things in keeping with the rest. Internal-facing — written for me (or anyone helping me) to follow when adding new sections, projects, or components.

> The rule that matters more than any other is on this page: **don't make it look like AI slop**. Every other rule is downstream of that.

---

## Table of contents

1. [Voice and principles](#1-voice-and-principles)
2. [Foundations (design tokens)](#2-foundations-design-tokens)
3. [Theme system](#3-theme-system)
4. [Component patterns](#4-component-patterns)
5. [Motion](#5-motion)
6. [Accessibility](#6-accessibility)
7. [File structure and naming](#7-file-structure-and-naming)
8. [Anti-patterns (what not to add)](#8-anti-patterns-what-not-to-add)
9. [Adding a new section: a checklist](#9-adding-a-new-section-a-checklist)

---

## 1. Voice and principles

These are the controlling rules. If a rule below conflicts with one of these, the principle wins.

### Specificity over abstraction

> "Service consoles used by maintenance engineers across Europe, APAC, and North America" — yes.
>
> "Global Reach" — no.

Use real numbers, real places, real names, real teams, real dates. Specificity is the single biggest signal that a portfolio was made by a person, not a template.

### One signature, not twelve

Pick *one* distinctive moment per page and let everything else be quiet. The hero gradient on my name is the signature for now. If a new signature gets added (custom typeface for headlines, an editorial photo treatment, a scroll-pinned case study), the *previous* signature gets dialled back. Two signatures fighting for attention reads as a template, not a designer.

### Restraint over multiplication

Fewer animations. Less gradient. Fewer chips. Fewer pulses. One pulsing availability dot exists site-wide (in the footer). One gradient text exists site-wide (the hero name). Adding a second of either requires removing one elsewhere.

### First-person, conversational, no buzzwords

Write the way I'd talk to a senior designer over coffee. Past tense for shipped work. First person. No "AI-native", "scalable", "WCAG-compliant" used as buzzwords (mention the actual standard with the actual context, e.g. "WCAG 2.1 AA across every shipped surface" — fine because it's specific).

### Long-form where it matters

A project card description should be one or two sentences. The expanded case study can be an essay. Slide-deck "Problem / Solution / Outcome" boxes everywhere is a template tell. Real prose is the alternative.

---

## 2. Foundations (design tokens)

All tokens live in [src/index.css](src/index.css). When in doubt, **always** prefer a CSS variable over a hardcoded hex value. The only exceptions are the locked-dark sections — see [Section 3](#3-theme-system).

### Brand colours

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--primary-color` | `#4f46e5` | `#818cf8` | Active nav state, CTAs, links, focus rings, eyebrow pill text |
| `--primary-light` | `#6366f1` | `#a5b4fc` | Gradient stops, hover states |
| `--primary-dark` | `#3730a3` | `#6366f1` | Active button hover, deeper accents |
| `--primary-contrast` | `#ffffff` | `#0a0b10` | Text on top of `--primary-color` (button labels) |
| `--accent-color` | `#ec4899` (pink) | `#f472b6` | Reserved. Use sparingly, currently only in hero blob |

### Surfaces

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg-color` | `#f8f9ff` | `#0a0b10` | Page background |
| `--surface-color` | `#ffffff` | `#12141c` | Cards, header pill, contact form panel |
| `--surface-subtle` | `#f1f5f9` | `#161922` | Slightly recessed surfaces — Projects section bg, contact section bg, About skill panel bg |
| `--surface-elevated` | `#ffffff` | `#1a1d27` | Reserved for raised elements |
| `--border-color` | `#e2e8f0` | `rgba(255, 255, 255, 0.08)` | Default 1px borders |
| `--border-subtle` | `rgba(15, 23, 42, 0.06)` | `rgba(255, 255, 255, 0.04)` | Internal dividers |
| `--overlay-color` | `rgba(15, 23, 42, 0.55)` | `rgba(0, 0, 0, 0.7)` | Modal backdrops |

### Text

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--text-color` | `#0f172a` | `#f1f5f9` | Headings, primary body |
| `--text-secondary` | `#334155` | `#cbd5e1` | Body paragraphs, button labels |
| `--text-muted` | `#64748b` | `#94a3b8` | Captions, metadata, subdued labels |
| `--text-faint` | `#94a3b8` | `#64748b` | Decorative labels, "Outcome" label, dot separators |

### Typography

- **Body & UI**: `Plus Jakarta Sans` (variable, weights 200..800, both italic axes). Loaded from Google Fonts in [index.html](index.html).
- **Mono**: `Fira Code` (weights 400, 500). Reserved for: tool chips, metric numbers, period labels, step numbers.
- **Display**: same as body — keep it as one face. Variable axis lets headings animate weight smoothly if needed.

Type scale (in `:root`):

```
--text-xs:   0.75rem   /* 12px — labels only, never body */
--text-sm:   0.875rem  /* 14px — secondary UI text */
--text-base: 1rem      /* 16px — body */
--text-md:   1.125rem  /* 18px — lead paragraphs */
--text-lg:   1.25rem   /* 20px — subheadings */
--text-xl:   1.5rem    /* 24px — section subheadings */
--text-2xl:  2rem      /* 32px — section titles */
--text-3xl:  2.5rem    /* 40px — hero heading */
--text-4xl:  3rem      /* 48px — display */
```

In practice most headings use `clamp(min, vw, max)` so they scale fluidly. Example: `clamp(2.2rem, 4.5vw, 3.6rem)` on the hero h1.

Line heights:

```
--leading-tight:   1.25  /* headings */
--leading-snug:    1.4   /* sub-headings */
--leading-normal:  1.6   /* UI text */
--leading-relaxed: 1.75  /* body paragraphs */
--leading-loose:   1.9   /* long-form */
```

### Spacing, radius, shadows

```
/* Radii */
--radius-sm: 8px     /* tags, chips, small buttons */
--radius-md: 14px    /* form fields, cards */
--radius-lg: 20px    /* large cards, modals */
--radius-xl: 28px    /* hero image frame */

/* Container */
.container { max-width: 1160px; padding: 0 28px; }
@media (max-width: 600px) { padding: 0 18px; }

/* Section padding */
.section { padding: 80px 0 72px; }
@media (max-width: 768px) { padding: 60px 0 52px; }
@media (max-width: 480px) { padding: 48px 0 40px; }

/* Shadows — already factor in dark theme via the data-theme override */
--shadow-sm:   /* hairline */
--shadow-md:   /* cards */
--shadow-lg:   /* raised cards on hover, modals */
--shadow-glow: 0 8px 24px rgba(99, 102, 241, 0.3)  /* primary CTA only */
```

### Transitions

```
--transition-fast:  0.2s cubic-bezier(0.16, 1, 0.3, 1)   /* color, opacity */
--transition-med:   0.35s cubic-bezier(0.16, 1, 0.3, 1)  /* card hover, modals */
--transition-slow:  0.6s cubic-bezier(0.16, 1, 0.3, 1)   /* scroll reveal */
--transition-theme: 0.35s ease                            /* light↔dark swap */
```

The cubic-bezier `(0.16, 1, 0.3, 1)` is the house easing. Apple-flavoured. Don't introduce a new easing without removing one.

---

## 3. Theme system

### How it works

- `<html>` carries `data-theme="light"` or `data-theme="dark"`.
- The `useTheme` hook ([src/hooks/useTheme.ts](src/hooks/useTheme.ts)) sets the attribute and persists to `localStorage('portfolio-theme')`. First visit falls back to `prefers-color-scheme`.
- An inline script in [index.html](index.html) runs *before first paint* to apply the persisted/preferred theme — prevents the dreaded flash of wrong theme.
- Cross-tab sync: when the user toggles in another tab, a `storage` event handler in `useTheme` updates this tab too.
- Toggle UI lives in [Header.tsx](src/components/Header.tsx) — single sun/moon icon button. No animation beyond a 15° hover rotate.

### Locked-dark sections

Two sections are *intentionally* dark in both themes:

- **Testimonials** — dark gradient bg, deliberate visual contrast against the surrounding light flow
- **Course (Sessions)** — dark editorial feel, treated as a "moment" in the page

These sections **do not bind to CSS variables.** They use hardcoded dark colours and `rgba(255,255,255,...)` whites directly. Don't try to "fix" them by swapping to vars — they're locked dark on purpose.

If you add a new section that should be locked-dark, follow the same pattern: hardcoded dark surface (e.g. `#0d0d0d`), `rgba(255,255,255, alpha)` text values for opacity layering, no `var(--text-color)`.

---

## 4. Component patterns

### Section

Every page section follows this skeleton:

```tsx
<section id="my-section" className="section my-section">
  <div className="container">
    <div className="section-eyebrow">
      <span className="eyebrow-pill">Label</span>
    </div>
    <h2 className="section-title">A title in sentence case.</h2>
    <p className="section-subtitle">A short, specific subtitle.</p>

    {/* section content */}
  </div>
</section>
```

- The `id` must match the corresponding nav button in [Header.tsx](src/components/Header.tsx).
- `className="section"` is required — the App-level IntersectionObserver scrolls-reveal it for free.
- The eyebrow pill is the only place a single-word label sits in small caps. Don't introduce a second label style.
- Section titles are sentence case ("Selected work"), not title case ("Selected Work").

### Eyebrow pill

```css
.eyebrow-pill {
  background: color-mix(in srgb, var(--primary-color) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--primary-color) 20%, transparent);
  border-radius: 100px;
  padding: 5px 16px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-color);
}
```

For dark sections, see `.course-eyebrow-pill` in [CourseSection.css](src/components/CourseSection.css).

### Cards

Three card flavours are in use; pick the closest one.

- **Project card** ([ProjectCard.css](src/components/ProjectCard.css)): two-column layout with image + content, hover lift, supports a `reverse` prop.
- **Outcome / fit card** ([CourseSection.css](src/components/CourseSection.css)): vertical, numbered, lighter weight. Used inside the Course section.
- **Key fact card** ([AboutMe.css](src/components/AboutMe.css)): label + value, no decoration.

All cards share:

```css
background: var(--surface-color);  /* or surface-subtle for nested */
border: 1px solid var(--border-color);
border-radius: var(--radius-md);   /* 14px */
box-shadow: var(--shadow-sm);
transition: border-color, transform, box-shadow;
```

Hover: lift `-2px` to `-4px`, border softens to `color-mix(... primary 20-30%)`, shadow steps up one tier (`sm → md` or `md → lg`). Never more than that.

### Buttons

| Style | Class pattern | When to use |
|---|---|---|
| Primary (gradient) | `.cta-primary`, `.btn-primary`, `.submit-btn` | The single most important CTA on a screen — "View My Work", "Send Message" |
| Secondary (outlined) | `.cta-secondary` | Companion to primary — "Get In Touch" alongside "View My Work" |
| Outline (ghost) | `.btn-outline`, `.read-more-btn` | Tertiary — "Read Full Case Study", "Live Prototype" |
| Pill / nav | `.nav-link`, `.session-pill__main` | Navigation, not action |

Primary uses the indigo gradient and `--shadow-glow`. **Only one primary CTA per visual region.** If a section has two equally important actions, both go secondary.

### Form fields

Pattern in [Contact.css](src/components/Contact.css). Key behaviour:

- Resting: `1.5px solid var(--border-color)`, `var(--surface-subtle)` background.
- Focus: border `var(--primary-color)`, soft glow `0 0 0 3px color-mix(in srgb, var(--primary-color) 15%, transparent)`, background flips to `var(--surface-color)`.
- Custom select arrow uses an inline SVG `data:` URL so it looks consistent across OSes.
- Honeypot field: absolutely positioned at `-9999px`, `aria-hidden`, never visible to humans.

---

## 5. Motion

### Scroll reveal

Every `.section` (except the hero) gets `.fade-in-section` applied by [App.tsx](src/App.tsx). Three classes drive it:

- `.fade-in-section` — opacity 0, `translateY(20px)`, ready to reveal
- `.fade-in-section.visible` — opacity 1, in place — added on intersection
- `.fade-in-section.exit-top` — opacity 0, `translateY(-16px)` — added when scrolled past upward

Duration is `0.6s`. Travel is `20px`. Don't increase either.

### Hover micro-motion

- Cards: `translateY(-2px)` to `translateY(-4px)`
- Buttons: `translateY(-1px)` to `translateY(-2px)`
- Icons inside CTAs: `translateX(2px)` to `translateX(4px)`

Anything bigger reads as a toy.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` is honoured everywhere. The shared block in [src/index.css](src/index.css) shortens all transition durations to `0.01ms` and disables `transform` and animations. Per-component overrides exist where the default block isn't enough — see SessionPill.css and CourseSection.css.

When you add a new component with motion, **always** add a `@media (prefers-reduced-motion: reduce)` block that flattens it. Verify by toggling "Reduce motion" in macOS Accessibility settings or DevTools → Rendering → Emulate CSS prefers-reduced-motion.

---

## 6. Accessibility

A new component is not "done" until each of these is true.

- [ ] Wrapped in a semantic landmark (`<section>`, `<aside>`, `<nav>`, `<footer>`, `<main>`).
- [ ] Every interactive element has either visible text or an `aria-label`.
- [ ] `aria-current="page"` on the active nav item, `aria-expanded` on disclosure buttons (mobile menu, FAQ accordion), `aria-modal="true"` on dialogs.
- [ ] All decorative SVGs carry `aria-hidden="true"` so screen readers skip them.
- [ ] Focus-visible state visible on every button, link, input, textarea, select. The default in [src/index.css](src/index.css) gives `3px solid var(--primary-color)` outline + `box-shadow: 0 0 0 6px color-mix(... primary 18%)` glow.
- [ ] Touch targets ≥ 44×44 effective. The `.icon-btn::after` pseudo-element trick in [Header.css](src/components/Header.css) extends a smaller visual button to a 44px tap target.
- [ ] Colour contrast ≥ WCAG AA in both themes. Test with the Stark plugin or DevTools accessibility panel. The text tokens are tuned for this; if you introduce a new colour pair, verify it.
- [ ] Keyboard `Escape` closes any modal-style overlay (mobile nav, Figma modal, FAQ if it ever blocks scroll).
- [ ] `prefers-reduced-motion: reduce` flattens all motion in this component.
- [ ] `<img>` has descriptive `alt` text. Decorative images use `alt=""`.

The skip-to-content link at the top of [App.tsx](src/App.tsx) is non-negotiable — never remove it.

---

## 7. File structure and naming

```
Portfolio/
├── DESIGN-GUIDELINES.md     <- you are here
├── README.md
├── index.html               <- SEO, fonts, theme bootstrap script
├── public/                  <- favicon, og image, resume.pdf, robots.txt, sitemap.xml
├── scripts/
│   └── convert3.js          <- only ESM script (CJS variants were removed)
└── src/
    ├── main.tsx
    ├── App.tsx              <- composes sections, scroll reveal, footer
    ├── App.css
    ├── index.css            <- design tokens (light + dark)
    ├── custom.d.ts
    ├── vite-env.d.ts
    ├── assets/              <- images imported into components
    ├── hooks/
    │   └── useTheme.ts
    └── components/
        ├── Header.tsx + .css
        ├── ProfileSection.tsx + .css
        ├── SkillsTicker.tsx + .css
        ├── ProcessShowcase.tsx + .css
        ├── Projects.tsx + .css
        ├── ProjectCard.tsx + .css
        ├── Testimonials.tsx + .css
        ├── AboutMe.tsx + .css
        ├── CourseSection.tsx + .css
        ├── PaymentButton.tsx
        ├── SessionPill.tsx + .css
        └── Contact.tsx + .css
```

### Conventions

- One component per file, default export, PascalCase filename.
- Sibling `.css` file with the same name. CSS class names are kebab-case, scoped by a component-prefixed root class (`session-pill__main`, `course-fit--yes`). BEM-ish: `block__element--modifier`. Only enforce prefixing on new components — older ones use looser flat names; don't refactor without reason.
- Hooks in `src/hooks/`, prefix `use`.
- Static images go in `src/assets/` if imported into components (Vite will hash and cache-bust them) or `public/` if served at a stable URL (resume.pdf, og-image.png).
- A new full-width page section: one `.tsx` + `.css` pair under `src/components/`, mounted in `App.tsx`, with `id="..."` matching a nav entry in `Header.tsx`.

---

## 8. Anti-patterns (what NOT to add)

These are banned because they make the site read as AI-generated. Each has a one-sentence why so future me understands the reasoning, not just the rule.

- **Custom cursor (dot + ring)** — single most overused designer-portfolio cliché of 2024–26; everyone's AI agent ships one.
- **Magnetic buttons** — same energy. The button pulling toward the cursor by 6px doesn't help anyone.
- **"Now playing / Now reading / Now learning" widget** — a Linear-clone trope. Fine on a personal blog where it's actually updated; meaningless on a portfolio.
- **Marquee scrolling text in the footer** — done to death.
- **Real-time clock** — same. (The skills ticker is a different thing — it's content, not chrome, and it sits inside the hero rather than scrolling page furniture.)
- **Command palette / `g h` keyboard shortcuts overlay** — designer-portfolio template default. We don't have enough surfaces to navigate to justify it.
- **Glassmorphism as a section motif** — fine sparingly (header pill, stat chips on hero, FAQ accordion's selected state). Banned as the *primary* texture of a section.
- **Decorative emoji in metric badges or fact lists** — `🎯 95% CSAT`, `🌍 Global Reach`, `🚀 Superpower` are template tells. Replace with specific text or a small inline SVG.
- **Urgency badges, struck-through prices, "X% OFF" loud markers, fake-scarcity slot cards** — Shopify upsell aesthetic; never on a designer's portfolio.
- **Sparkle bullets** (`✦`, `⚠`) — the same AI-template glyphs appear on every Bolt/Cursor-built landing page. Use plain bullets, em-dashes, or numbers.
- **More than one pulsing availability dot site-wide** — the canonical one is in the footer. Adding one to the hero AND the contact section AND the nav is the diagnostic for "this was generated".
- **Gradient text on every heading** — ours lives only on the hero name (`.name-highlight`). Adding a second gradient heading anywhere requires removing this one.
- **Auto-popups / countdown-driven modals on first visit** — the old `CoursePopup.tsx` was deleted for a reason. If a modal must exist, it triggers on user action, not a timer.
- **"AI-native" or other buzzwords** in copy — see [Voice and principles](#1-voice-and-principles).

If a future trend appears that we're tempted by, run it against the principles in Section 1 first. If we can't justify it specifically, it doesn't get in.

---

## 9. Adding a new section: a checklist

When you build a new `<MySection />`:

- [ ] Filename is PascalCase. CSS sibling exists.
- [ ] Wrapped in `<section id="..." className="section my-section">`.
- [ ] `id` added to `sectionIds` in [Header.tsx](src/components/Header.tsx) so the active-nav observer picks it up.
- [ ] If the nav should link to it, add an entry to `navLinks` in [Header.tsx](src/components/Header.tsx).
- [ ] Mounted inside `<main>` in [App.tsx](src/App.tsx) at the correct order in the page flow.
- [ ] Eyebrow pill present, section title in sentence case, subtitle is one specific sentence.
- [ ] All colour values are CSS variables (or, if it's a locked-dark section, hardcoded dark values with a comment explaining why).
- [ ] No decorative emoji. No sparkle bullets. No gradient text. No pulse dots.
- [ ] One primary CTA at most. Subsequent CTAs are secondary or outline.
- [ ] All motion respects `prefers-reduced-motion: reduce`.
- [ ] Accessibility checklist in Section 6 ticks every box.
- [ ] Build (`npm run build`) and lint (`npm run lint`) pass clean. Pulled the trigger? Verify in both light and dark themes before committing.

---

## When this doc is wrong

If during a future change something here turns out to be stale, update the doc at the same time as the code. A guideline that's out of sync with the code is worse than no guideline. Don't accumulate drift.
