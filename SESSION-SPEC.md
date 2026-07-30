# "Zero to Live" — 1-on-1 session spec

> **Decisions settled (2026-07-30).** Name: **Zero to Live**, under the brand
> **AI Builders by Rahul** — both already appear in the Playbook PDF and the
> social poster, so the site now matches the print. Price: **₹99**. Palette:
> **the portfolio's existing dark theme** (see "Design system" below). The
> WhatsApp community and direct-access promises are removed until those
> channels exist.

Reference document for the paid 1-on-1 session sold from this site. Written
from Rahul's build specification v1.0. This is the source of truth for what
the session **is**; `src/lib/booking.ts` is the source of truth for what the
site **says**, and the two must not drift.

---

## 1. The offer in one line

A live, one-on-one, 60-minute session where a beginner brings an idea and
watches it become a real website on the internet, using free AI tools, without
writing a line of code themselves.

**It is not** a course, a bootcamp, a recording, or a done-for-you build.

## 2. Who it's for

College students and early-career tech people in India, roughly 18–26.

- They've heard of ChatGPT, maybe Figma.
- They do **not** know what a PRD is, what GitHub does, or what "deploy" means.
- They may have coding classes but have never shipped anything real.

**What they feel:** curious but overwhelmed; they've seen a hundred AI tools on
Twitter and don't know which to use; slightly embarrassed about not knowing
basics.

**What they fear:** wasting time, being talked down to, being sold to,
discovering halfway that it's too technical for them.

**Design consequence:** warm, plain-spoken, no jargon. Every technical term
explained in the same sentence it appears in. Nothing that makes the reader
feel stupid.

## 3. Why it's worth paying for

The information is free on YouTube. The value is elsewhere:

1. **Live and personal** — you can interrupt, slow down, ask "wait, what does
   that mean?"
2. **Your actual idea** — not a generic demo project.
3. **A complete path, not a fragment** — YouTube gives you one tool; this gives
   the whole chain from idea to live URL.
4. **Support doesn't end at 60 minutes** — Playbook PDF, community, direct
   WhatsApp access.
5. **Language flexibility** — English primary, Telugu whenever it aids
   understanding.

The page sells **the path and the person**, not the tools.

## 4. The four-phase framework

Every project follows the same four phases. Learn it once, build anything.

| # | Phase | Colour | What happens | Time |
|---|---|---|---|---|
| 01 | **Define** | `#C2410C` orange | AI-check whether the idea exists, who'd use it, what to build first. Output: a named idea and a one-line pitch. | ~10 min |
| 02 | **Design** | `#1D4ED8` blue | Write a PRD, then turn it into real screens with AI. Output: a blueprint and a visual prototype of every page. | ~15 min |
| 03 | **Develop** | `#7C3AED` purple | Hand the plan to Google Antigravity; it writes the code. Rahul shows how to guide it, correct it, and fix errors using AI. | ~20 min |
| 04 | **Deploy** | `#047857` green | Publish free on Vercel. Output: a real link that works on any device, anywhere. | ~5 min |

## 5. How the hour is spent

| Time | What happens |
|---|---|
| 0–5 min | Intros. They share their idea, or we find one together. Explain what's coming so nothing catches them off guard. |
| 5–15 min | **Define.** Open Claude or Gemini, pressure-test the idea live. Unique? Who's it for? First three features? |
| 15–30 min | **Design.** Write the full PRD in Gemini, feed it to Google Stitch, watch the screens generate. |
| 30–50 min | **Develop.** Antigravity builds the site from the PRD. Show how to review, correct, and fix breakage. |
| 50–58 min | **Deploy.** Push to GitHub, deploy on Vercel. A real live link appears. |
| 58–60 min | Questions, next steps, the Playbook. |

**60 minutes is the plan, not a hard stop.** If they need longer to understand
something, it takes longer. Better they leave clear than leave on time.

**Tools used:** Claude, Gemini, Google Stitch, Antigravity, GitHub, Vercel —
all on free tiers sufficient for the whole session.

## 6. What they take away

1. **The complete path, seen once end to end** — one continuous pipeline from
   idea to live URL, using their own idea.
2. **The AI Builder's Playbook** — 15-page PDF, every step written out, every
   tool linked, 7 copy-paste prompts. Theirs to keep.
3. **Every prompt, ready to use** — exact wording that gets good results at
   each stage. Fill in the brackets, paste, done.
4. **The skill of fixing things themselves** — the most valuable part: take any
   error, paste it into AI, get it fixed. Never stuck again.
5. ~~Community access — "AI Builders by Rahul" on WhatsApp~~ — **removed from
   the site** until the group exists.
6. ~~Rahul, after the session — direct message access~~ — **removed from the
   site** until a WhatsApp channel actually exists. Do not re-add a promise
   before the thing behind it is real.

## 7. What they'll be able to do afterwards

- Validate any idea with AI in ten minutes
- Write a PRD that AI can build from
- Generate designed screens without knowing design tools
- Direct an AI coding tool to build a complete website
- Read an error, understand it, and fix it using AI
- Save work properly so it's never lost
- Publish a live site for free, with a shareable link
- Do all of it again, alone, for any idea

> The goal isn't that they watched Rahul build something. It's that they can
> now build things.

## 8. Honest limits — state these plainly

Being straight about this matters more than filling slots.

| It **is** | It is **not** |
|---|---|
| A live, personal walkthrough of the whole process | Not recorded — it's live, and Rahul doesn't record it |
| Focused on their real idea, at their pace | Not a finished product for them — a simple version to teach the method |
| Every tool explained from zero | Not a coding class — it's about directing AI, not writing code |
| Practical: they watch it happen, not slides about it | Not a group class — one person per session, always |
| English, with Telugu whenever it helps | Not a guarantee their idea will succeed |

**Not for:** people who already build and deploy web apps regularly, want
someone to build their product for them, want a recorded course, or aren't
willing to try it themselves afterwards.

## 9. Credibility

Rahul is a product designer who has built and launched **six live products
using exactly this process**, without writing code manually:

| Project | What it is |
|---|---|
| iUpgrade | Apple device rental platform |
| Waggle India | Pet care marketplace — book trusted caretakers |
| Dosth | Urban services platform |
| Bar | Digital gold & silver investment app |
| BYOC | Build-your-own-company agency configurator |
| Speak It. Make It. | Voice-to-checklist app with affiliate integration |

The point: he knows how to code but deliberately built these without writing it
by hand. If he can do it this way, so can they. He also knows where it breaks —
tools crash, code errors, deployments fail — and shows how to handle each.

## 10. Logistics

- **Weekends only** (he has a full-time job midweek)
- **60 minutes**, soft limit, 15–30 min buffer between bookings
- **Google Meet**, one person per session
- **English**, with Telugu on request
- **₹99** — matches the Razorpay button

## 11. Voice

First person ("I'll show you", "we'll build"). Short sentences, plain words.
No hype, no "transform your life", no manufactured urgency. "Limited slots" is
true — state it plainly, don't add countdown timers. Confident but humble: the
credibility comes from the work, not the claims.

---

## Implementation notes — differences from what's already built

The build spec was written before the current booking flow existed. Three
places where the repo already does something different, and deliberately:

### 1. Payment verification — keep what's in the repo

The spec's §3.3 proposes a `localStorage` flag set from `?payment=success`,
and correctly notes it "is not real payment verification… anyone technical
could bypass it."

**The repo already has the stronger version.** `api/verify-booking.ts` checks
the HMAC-SHA256 signature Razorpay puts on the redirect, using the key secret
server-side, and the params are scrubbed from the URL afterwards so a shared
link can't be replayed. It costs nothing extra to run and doesn't need the
"if abuse appears, move to webhooks" follow-up.

Use the existing flow. Don't replace it with the localStorage unlock.

### 2. Route naming

The spec says `/session` with callback `…/session?payment=success`. The repo
uses `/teach` (the pitch) and `/teach/booked` (post-payment). Either is fine,
but **the Razorpay button's redirect URL must match whichever is chosen**, and
`scripts/prerender.js` + `public/sitemap.xml` must be updated together. Adding
`/session` as the public route and redirecting `/teach` → `/session` is the
cleaner option if the "Zero to Live" name is the one being marketed.

### 3. Design system — resolved: keep the portfolio's dark theme

The spec asked for a warm cream page (`--paper: #FBFAF7`) to match the
Playbook and poster. The decision was to **stay dark**, for three reasons:

1. `DESIGN-GUIDELINES.md` is explicit that the guidelines win and the page
   gets fixed — /teach is a page of this portfolio, not a separate microsite.
2. The brand thread that actually carries across poster, Playbook and site is
   the burnt orange, and that is already shared: the poster's `#C2410C` is
   *identical* to the portfolio's light-theme accent.
3. Forcing one route into a different theme fights the pre-paint theme script
   in `index.html` and the user's stored preference. The most likely outcome
   is a flash of the wrong theme on the single page that matters most.

The light theme already exists behind the header toggle and is close to the
poster (`--bg: #f7f8fb` vs `#FBFAF7`), so anyone who prefers it can switch.
Revisit only if /teach becomes a standalone landing page off its own domain.

### 4. Open items

- ~~Playbook PDF~~ — **done, and it is a paid deliverable.** The file lives in
  `api/_assets/playbook.pdf`, deliberately NOT in `public/`, and is streamed by
  `/api/playbook` only to a caller holding a short-lived token minted after a
  verified payment. It appears on `/teach/booked` and nowhere else.
  `scripts/check-links.mjs` fails the build if the PDF ever reappears under
  `dist/`, which is the mistake that would quietly give the product away.
- ~~Session video~~ — **done.** `/session-intro.mp4`, 464×832 (portrait 9:16),
  H.264 baseline, 5.1 MB, self-hosted with `preload="metadata"`.
- **No poster frame yet.** Without one the browser paints the first frame once
  metadata loads, which is fine but not chosen. Add a still to
  `SESSION_VIDEO.poster` if the first frame is unflattering.
- The 4:5 poster still needs a **1200×630 crop** for `og:image` — a 4:5 image
  crops badly in link previews.
- "Speak It. Make It." is not currently in the portfolio's project list.
