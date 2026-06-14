# Portfolio

Personal portfolio for **Sri Sai Rahul Bonala** — Product Designer & Developer (AI-native UI/UX).

Live at [rahulbonala.me](https://rahulbonala.me).

## Tech stack

- React 19 + TypeScript + Vite 7
- react-router (multi-route: home, case studies, /teach) with per-route prerendering + hydration
- GSAP ScrollTrigger + Lenis (scroll choreography); animated SVG debate-graph hero (no 3D runtime)
- Syne + Plus Jakarta Sans + Fira Code
- EmailJS for the contact form, Razorpay for session payments

## Scripts

```bash
npm run dev       # local dev server
npm run build     # production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # preview the production build locally
```

## Design system

See [DESIGN-GUIDELINES.md](DESIGN-GUIDELINES.md) for the v3 system — dark editorial tokens, the motion system (reveals, pinning, cursor, preloader), the 3D layer's performance gates, and the anti-pattern list.

That doc is the source of truth for anything visual or content-related on this site. If something on the page conflicts with the guidelines, the guidelines win and the page gets fixed.
