# Portfolio Studio — Build Plan (v1)

**Status:** Draft — waiting for Rahul's approval before any code is written.
**Date:** 2026-07-18

---

## 1. What we are building (v1 only)

A web app where a user:

1. **Uploads a resume** (PDF).
2. The app **parses it with code only — no AI** — into structured data.
3. The user sees a **review screen** showing every extracted field, editable, with anything the parser was unsure about clearly flagged.
4. User clicks **Generate Portfolio** → sees their portfolio rendered in Template 1.
5. **Previous / Next arrows** switch between 12 templates. Content stays identical; only the design changes.
6. User clicks **Download HTML** → gets one self-contained `.html` file that opens perfectly in Chrome with no internet, and can be pasted into a WordPress Custom HTML block.

**Explicitly OUT of v1** (later phases): payments, Google sign-in, shareable links, LLM parsing in the UI, section-level Lego mixing, DOCX upload (see open decision #3), PDF-file export (we get PDF free via the print stylesheet — user prints the HTML to PDF from the browser).

The LLM fallback is **designed but not active** in v1: the code defines one `Parser` interface with two implementations — `heuristicParser` (built and used) and `llmParser` (empty stub behind a feature flag, off). When we later decide the heuristic parser isn't enough for messy resumes, we switch the flag — no rewrite.

---

## 2. Repository

You asked for a **brand-new repo** under your GitHub account. Two things you should know:

- **My session is currently scoped to `rahulbonala/portfolio` only.** I can attempt to create a new repo via the GitHub API, but pushing code to it may be blocked until you add it to the session (there's an "add repo" flow for that).
- Until you confirm, this plan lives on the branch `claude/portfolio-studio-resume-srh4v3` of your existing Portfolio repo.

**Proposed repo name: `portfolio-studio`** (clear, searchable, says what it is).
Alternatives: `folio-studio`, `resume2folio`, `studiofolio`.

**→ Open decision #1: approve the name, and either (a) I attempt to create it + you add it to the session, or (b) you create the empty repo in the GitHub UI and add it here — then I push everything.**

---

## 3. Tech stack

Chosen to match what you already work with (your current portfolio is Vite + React + TypeScript):

| Layer | Choice | Why |
|---|---|---|
| App framework | **Vite + React 19 + TypeScript (strict)** | Same stack as your existing repo; fast; v1 is 100% client-side so we don't need a server framework yet |
| Styling (app UI) | **Tailwind CSS v4** | The "extension to reduce lines of code" you asked for; utility classes keep component code short |
| Styling (exported portfolios) | **Plain inlined CSS, generated from design tokens** | The downloaded file must be self-contained — no Tailwind runtime, no CDN links, zero external requests |
| PDF text extraction | **pdfjs-dist** (Mozilla's PDF.js) | Runs fully in the browser — the resume never leaves the user's machine in v1, which is also a privacy selling point |
| State | React state + **localStorage** | Resume data and chosen template survive a page refresh; no backend needed |
| Testing | **Vitest** (unit) + **Playwright** (end-to-end, Chromium is pre-installed here) | Covers the parser and the full user flow |
| Hosting (when ready) | Vercel free tier | Static output, zero cost |

**Fonts — one important constraint:** a truly offline single-file export cannot load Google Fonts. v1 templates use **curated system font stacks** (e.g. Georgia/Charter for serif templates, system-ui/Inter-fallback for sans). Embedded base64 font subsets can come later for premium templates. This is the honest trade-off for "opens anywhere, zero external requests."

---

## 4. Architecture — the one decision everything hangs on

**One render path.** Every template is a pure function:

```
render(resumeJSON, templateTokens) → complete HTML string (CSS inlined)
```

- The **preview** on screen is an `<iframe>` showing exactly that string.
- The **download** is exactly that string saved to a file.

Preview and download can never drift apart, because they are the same bytes. This is what makes "zero bug" even approachable: what you see is literally what you download.

**Data flow:**

```
PDF upload
  → pdfjs-dist: text + position + font size/weight per line
  → heuristic parser: sections → entities → ResumeData JSON (+ confidence per field)
  → Review/Edit screen (user fixes mistakes, confirms)
  → render(ResumeData, tokens[i]) → iframe preview
  → prev/next changes i, re-renders — content untouched
  → Download = save the current HTML string
```

---

## 5. Data model

Based on the open **JSON Resume** standard (jsonresume.org), extended with what our product needs:

```ts
interface ResumeData {
  basics: { name; label; email; phone; url; summary; location; profiles[] }
  work:      Array<{ company; position; startDate; endDate; summary; highlights[]; technologies[] }>
  education: Array<{ institution; area; studyType; startDate; endDate; score }>
  skills:    Array<{ category; items[] }>
  projects:  Array<{ name; description; highlights[]; url; technologies[] }>
  certificates: Array<{ name; issuer; date }>
  meta: {
    confidence: Record<fieldPath, number>   // 0–1 per extracted field; <0.7 gets flagged in review UI
    sectionOrder: string[]                  // future Lego phase uses this
    templateId: string                      // currently selected template
  }
}
```

Maps directly onto your five portfolio pages: **Home/Hero** (basics), **Experience** (work), **Study** (education + certificates), **Case Studies** (projects), **Contact/Footer** (basics.email/phone/profiles).

---

## 6. The no-AI parser (the hard part — spec'd honestly)

### Pipeline stages

1. **Extraction** — pdfjs-dist gives every text item with x/y position, font size, font name. We reconstruct lines, detect 1-column vs 2-column layouts by clustering x-positions, and read in correct order.
2. **Section detection** — a header lexicon with synonyms, e.g. Experience = {experience, work history, employment, professional background…}, Education = {education, academics, qualifications…}, plus signals: short line + larger/bolder font + preceded by whitespace. Everything between two headers belongs to the first header's section.
3. **Entity extraction per section** —
   - *Contact:* regexes for email, phone (international formats), URLs (LinkedIn/GitHub/Behance recognized specially).
   - *Name:* largest font on page 1 / first non-contact line — cross-checked against email local-part.
   - *Dates:* one dedicated date-range parser ("Jan 2022 – Present", "2019–2023", "03/2020 - 07/2021"…). This single utility gets the heaviest unit testing in the codebase.
   - *Work entries:* split on date-range anchors; classify title vs company by casing/known-suffix heuristics (Ltd, Inc, Technologies…); bullets = lines starting with •, –, ▪ or hanging indents.
   - *Skills:* split on commas/pipes/bullets; group by sub-headings when present.
4. **Confidence scoring** — every field gets 0–1. Weak signals (e.g. couldn't tell company from title) score low and get a yellow flag in the review screen. **The parser never silently guesses — it guesses loudly.**
5. **Fallback interface** — `llmParser` stub implements the same interface, behind `VITE_ENABLE_LLM_FALLBACK` (off). Not reachable from the UI in v1.

### Honest accuracy expectation

Heuristics will land roughly **70–85% field accuracy on clean single/two-column resumes**, worse on heavily designed ones. That is exactly why the review screen exists and why we test against a corpus (below) instead of promising magic. Your own resume is test case #1 — the plan's first acceptance gate is parsing it correctly.

### Test corpus

`/test-corpus/` with 10–15 resumes: yours + synthetic ones covering 1-column, 2-column, serif/sans, dense/sparse, EU/US date formats, fresher (no experience) and senior (long experience). Each has a hand-written `expected.json`. A script scores the parser field-by-field against them — **parser accuracy becomes a number we track, not a feeling.**

---

## 7. Review & Edit screen

- Form mirrors `ResumeData`: every section, every entry, add/remove/reorder buttons.
- Fields with confidence < 0.7 highlighted with a "please check this" marker.
- Raw extracted text viewable side-by-side (so the user can copy-paste anything we missed).
- "Generate Portfolio" button → gallery.
- All edits saved to localStorage on every keystroke (refresh-safe).

---

## 8. Templates — 12 at launch

Whole-template switching only (your call, correct one). Prev/next arrows, template name + number shown, keyboard ← → also works. The 15-archetype token system we designed earlier gets regenerated into the repo as `templates/tokens.json` (the chat files didn't survive the container restart — the design decisions did, in this plan and in my context).

Launch 12, prioritized by audience coverage:

| # | Template | Audience / feel |
|---|---|---|
| 1 | **Midnight Terminal** | Developers — dark slate, teal accents, tech pills (the golden reference we already rendered once) |
| 2 | **Plain Prose** | Minimalists — text-first, generous whitespace, no decoration |
| 3 | **Serif Authority** | CA / HR / legal / consulting — light, serif, credential-forward |
| 4 | **Case Study Editorial** | Product managers — narrative project blocks, big numbers for outcomes |
| 5 | **Spark** | Students / freshers — friendly color pop, education-first section order |
| 6 | **Conversion** | Marketers — bold headline, metric cards, strong CTA footer |
| 7 | **Swiss Grid** | Designers — strict grid, oversized type, high contrast |
| 8 | **Soft Studio** | Creatives — warm neutrals, rounded cards, gentle shadows |
| 9 | **Mono Ledger** | Data / finance — monospace accents, table-like experience rows |
| 10 | **Gradient Field** | Modern generalist — subtle gradient hero, glassy cards |
| 11 | **Ink & Paper** | Academics / writers — book-like typography, footnote styling |
| 12 | **Slate Corporate** | Enterprise roles — navy/gray, conservative, ATS-adjacent look |

Every template must pass the same gate: correct at 360px / 768px / 1440px widths, clean print stylesheet (that's the PDF export), zero external requests, valid HTML, and renders sensibly with *missing data* (no projects, no photo, one job only — real resumes are incomplete).

Templates 13–15 become post-launch weekly drops, as agreed.

---

## 9. The two advisory agents + automated gates

Your "every line reviewed" requirement, implemented practically:

**Agent A — Parser Auditor.** After every parser-related milestone: reviews extraction/section/entity code for logic errors and edge cases, runs the corpus scorer, and reports accuracy numbers + specific failure cases. Verdict blocks the milestone until addressed.

**Agent B — Render Auditor.** After every template/engine milestone: reviews render code, validates exported HTML (self-contained check: literally zero `http` references in output), takes Playwright screenshots of every template at 3 widths + print mode, and reports visual defects.

Both run as independent review agents with fresh eyes (they don't see my reasoning, only the code and the outputs — that's what makes them auditors rather than rubber stamps).

**Automated gates on every commit:** TypeScript strict mode, ESLint, Vitest unit tests (date parser, section detector, entity extractors), Playwright e2e of the full journey: upload → review → edit a field → generate → arrow through all 12 templates → download → open downloaded file → assert content present and no network requests.

---

## 10. Milestones

| ID | Deliverable | Acceptance gate |
|---|---|---|
| **M0** | Repo scaffold: Vite+React+TS+Tailwind, CI (lint/typecheck/test), `tokens.json` + design reference regenerated into repo | `npm run dev` works; CI green on empty test suite |
| **M1** | Render engine + Template 1 (Midnight Terminal) fed by hand-written sample `ResumeData` | Output matches the golden-file quality bar; Agent B passes it |
| **M2** | PDF upload + heuristic parser + confidence scores | Your resume parses with all sections found; corpus scorer ≥ 80% on clean resumes; Agent A passes it |
| **M3** | Review/Edit screen + localStorage persistence | Edit any field → regenerate → change visible in preview after refresh |
| **M4** | Gallery: templates 2–6, prev/next switching, Download HTML | Downloaded file opens offline in Chrome, works in WordPress Custom HTML block; full Playwright e2e green |
| **M5** | Templates 7–12 + corpus hardening + both agents' full audit | All 12 pass the template gate; e2e covers all 12 |

Order matters: **M1 before M2** — proving the engine renders beautifully comes first, because that's the product's wow moment; parsing feeds it.

After M5 you test with real resumes, and *then* we take the call on: LLM fallback activation, payments, share links.

---

## 11. Repo structure

```
portfolio-studio/
├── src/
│   ├── app/            # routes: upload, review, gallery
│   ├── components/     # app UI (Tailwind)
│   ├── parser/
│   │   ├── extract.ts     # pdfjs text+position extraction
│   │   ├── sections.ts    # header lexicon + segmentation
│   │   ├── entities/      # dates.ts, contacts.ts, work.ts, skills.ts…
│   │   ├── confidence.ts
│   │   └── index.ts       # Parser interface + heuristicParser + llmParser stub
│   ├── engine/
│   │   ├── render.ts      # (ResumeData, Tokens) → HTML string
│   │   └── sections/      # hero, experience, education, projects, contact renderers
│   ├── templates/
│   │   ├── tokens.json    # all 15 archetypes (12 active)
│   │   └── css/           # per-archetype CSS generators
│   ├── schema/            # ResumeData types + validators
│   └── store/             # localStorage persistence
├── test-corpus/           # resumes + expected.json + scorer
├── e2e/                   # Playwright journeys
└── docs/                  # this plan, design reference, decisions log
```

---

## 12. Risks — stated plainly

1. **Parser accuracy is the #1 risk.** 70–85% heuristic accuracy is real; the review screen absorbs it, but if real-world resumes score worse, the LLM fallback flag is the designed escape hatch — a decision, not a rebuild.
2. **"Zero bug" is a test matrix, not a promise.** 12 templates × 3 widths × print × missing-data cases = the actual QA surface. The gates in §8–9 are how we approach it honestly.
3. **Fonts limit visual flair in v1.** System stacks only. Embedded font subsets are a known, planned upgrade.
4. **Scanned/image PDFs won't parse** (no text layer). v1 detects this and tells the user clearly instead of failing silently. OCR is out of scope.
5. **Repo scope.** Code can't reach a new repo until it's added to this session (see §2).

---

## 13. Open decisions — need your call

1. **Repo:** name `portfolio-studio` OK? Who creates it — me via API (then you add it to the session) or you in the GitHub UI?
2. **Launch gate:** all 12 templates before you test (M5), or you start testing at M4 with 6 while I build the rest? *(My recommendation: test at M4 — your feedback on 6 will improve the other 6.)*
3. **DOCX upload:** PDF-only for v1, or add `.docx` support (one extra library, ~a day)? *(My recommendation: PDF-only v1; DOCX right after.)*

Reply with your calls on these three and "approved" (or your changes), and I start with M0.
