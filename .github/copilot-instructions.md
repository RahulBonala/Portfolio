<!-- Copilot instructions for AI coding agents working on this repo -->
# Project Snapshot

This is a small single-page portfolio built with React + TypeScript + Vite. The app is component-driven: `src/App.tsx` composes section components from `src/components/` and each component typically has a sibling CSS file (e.g. `Header.tsx` + `Header.css`). There is no backend — assets live in `src/assets` and are imported directly into components.

**Why this structure:** simple, static portfolio that favors small, focused components and per-component CSS for easy styling and animation control.

## Essential Files & Commands
- **Dev server:** `npm run dev` — runs Vite with HMR.
- **Build:** `npm run build` — runs `tsc -b` then `vite build` (note: TypeScript project references are used).
- **Lint:** `npm run lint` — runs ESLint across the codebase.
- **Entry points:** `src/main.tsx`, `src/App.tsx`.
- **Components dir:** `src/components/` — contains UI sections like `Header`, `Projects`, `ProfileSection`, `AboutMe`, `Contact`.

## Project-specific patterns & conventions (do these)
- Component files use PascalCase and are exported as default React functional components (`Foo.tsx`). Put related styles in `Foo.css` and import at top of the TSX file.
- Sections intended for intersection-based fade-in use the class `section`. When adding a new page section, give it `className="section"` and an `id` matching navigation (e.g., `id="projects"`) so `Header` navigation and the intersection observer in `App.tsx` work automatically.
- Import static images from `src/assets` and pass them as props to components (see `Projects.tsx` and `ProjectCard.tsx`).
- `ProjectCard` accepts `fullDetails` as a `ReactNode`, `reverse` boolean to flip layout, and supports `link` for external prototypes — reuse this pattern for similar content cards.
- Navigation uses `document.getElementById(...).scrollIntoView({ behavior: 'smooth' })` in `Header.tsx`. Use `id` attributes on target sections to integrate with the header.

## TypeScript & Build notes
- The `build` script runs `tsc -b` first: keep `tsconfig.app.json` and `tsconfig.node.json` consistent when adding path or type changes.
- Module type is `module` in `package.json`; imports sometimes include extensions (e.g., `import App from './App.tsx'`) — follow the existing import style when editing files.

## ESLint & formatting
- ESLint is configured in the repo (see `eslint.config.js`). Use `npm run lint` to catch style and common issues. The project currently uses a minimal ESLint setup; do not add type-aware lint rules unless updating `tsconfig.*` references accordingly.

## What not to change lightly
- Do not remove the `section` class or change the intersection observer threshold without checking visual behavior — the fade-in flow depends on the DOM classes added in `App.tsx`.
- Avoid changing navigation semantics in `Header.tsx` (click handlers scroll by id). If you refactor navigation, update all `id` targets.

## Quick examples
- Add a new section component:

```tsx
// src/components/NewSection.tsx
export default function NewSection(){
  return <section id="new" className="section">{/* content */}</section>
}
```

- Use `ProjectCard` pattern for long-form project entries (see `src/components/Projects.tsx`).

## Integration points & external links
- External prototypes are linked directly in `Projects.tsx` (Figma URLs). There are no backend API calls; treat the app as static when changing build/deployment.

---
If anything above is unclear or you'd like more detail (routing additions, adding unit tests, or CI hints), tell me what to expand and I'll update this file.
