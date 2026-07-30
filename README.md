# Portfolio

Personal portfolio for **Sri Sai Rahul Bonala** — Product Designer & Developer (AI-native UI/UX).

Live at [rahulbonala.me](https://rahulbonala.me).

## Tech stack

- React 19 + TypeScript + Vite 7
- react-router (multi-route: home, case studies, /teach) with per-route prerendering + hydration
- GSAP ScrollTrigger + Lenis (scroll choreography); animated SVG debate-graph hero (no 3D runtime)
- Fraunces + Inter + JetBrains Mono (the signature pairing)
- EmailJS for the contact form, Razorpay for session payments

## Scripts

```bash
npm run dev       # local dev server
npm run build     # production build + per-route prerender
npm run lint      # ESLint
npm run test      # booking-gate tests (api/verify-booking.ts)
npm run preview   # preview the production build locally
```

> **Note on `npm run preview`:** it does not implement Vercel's `cleanUrls`, so
> it serves the home page's HTML for `/teach` and the case-study routes. That
> produces hydration warnings that do **not** happen in production. To check the
> prerendered output faithfully, serve `dist/` with something that resolves
> `/teach` → `dist/teach/index.html`.

## Configuration

Copy `.env.example` to `.env.local` and set the same values in Vercel →
Settings → Environment Variables.

| Variable | Required for | If unset |
| --- | --- | --- |
| `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | Contact form | Form falls back to a `mailto:` handoff |
| `RAZORPAY_KEY_SECRET` | **Verifying session payments** | `/teach` falls back to a weak params-only check that a past buyer can replay |
| `CALENDLY_URL` | Keeping the scheduling link out of the public JS bundle | The bundled `BOOKING.calendly` constant is used instead |

Anything prefixed `VITE_` is compiled into the public bundle and visible to
every visitor — never use that prefix for a secret.

## The booking flow

1. `/teach` — the pitch, the intro video, and the Razorpay payment button.
2. Razorpay redirects a buyer back to `/teach` with signed payment params.
3. `api/verify-booking.ts` checks the HMAC signature server-side; only then is
   the scheduling link rendered. The params are then scrubbed from the URL so a
   shared link can't be reused.

To add the session intro video, set `youTubeId` (or `file`) in
`src/lib/booking.ts`. The video section renders nothing until one is set.

## Design system

See [DESIGN-GUIDELINES.md](DESIGN-GUIDELINES.md) for the v3 system — dark editorial tokens, the motion system (reveals, pinning, cursor, preloader), the 3D layer's performance gates, and the anti-pattern list.

That doc is the source of truth for anything visual or content-related on this site. If something on the page conflicts with the guidelines, the guidelines win and the page gets fixed.
