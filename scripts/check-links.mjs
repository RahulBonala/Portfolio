/**
 * Audits the built site for the failure modes that are invisible in review:
 * links to files that don't exist, secrets compiled into the bundle, and
 * external links missing rel="noopener".
 *
 * Runs against dist/ after a build:  node scripts/check-links.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

if (!existsSync(dist)) {
  console.error('check-links: dist/ not found — run `npm run build` first.');
  process.exit(1);
}

/** Every file under dist/, as site-absolute paths. */
function walk(dir, base = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = `${base}/${name}`;
    if (statSync(full).isDirectory()) out.push(...walk(full, rel));
    else out.push(rel);
  }
  return out;
}
const files = new Set(walk(dist));

const htmlFiles = [...files].filter((f) => f.endsWith('.html'));
const jsFiles = [...files].filter((f) => f.endsWith('.js'));

// ── 1. Internal links and assets resolve to something real ────────────────
// Routes are served by the SPA rewrite, so they don't need a matching file;
// anything with a file extension does.
const KNOWN_ROUTES = new Set(['/', '/teach', '/teach/booked', '/work/bestanswers', '/work/smiths-detection']);

for (const page of htmlFiles) {
  const html = readFileSync(join(dist, page), 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)].map((m) => m[1]);

  for (const ref of new Set(refs)) {
    if (KNOWN_ROUTES.has(ref)) continue;
    const hasExtension = /\.[a-z0-9]+$/i.test(ref);
    if (!hasExtension) continue; // a route, handled by the rewrite
    if (!files.has(ref)) fail(`${page} → missing file: ${ref}`);
  }
}

// ── 2. No secrets in the shipped bundle ───────────────────────────────────
// A Razorpay key secret or a live key id in client JS would be a real leak.
const SECRET_PATTERNS = [
  [/rzp_live_[A-Za-z0-9]+/, 'Razorpay LIVE key id'],
  [/rzp_test_[A-Za-z0-9]+/, 'Razorpay test key id'],
  [/RAZORPAY_KEY_SECRET\s*[:=]\s*["'][^"']+["']/, 'hardcoded Razorpay secret'],
  [/sk_live_[A-Za-z0-9]+/, 'Stripe live secret'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
];
for (const f of [...jsFiles, ...htmlFiles]) {
  const body = readFileSync(join(dist, f), 'utf8');
  for (const [re, label] of SECRET_PATTERNS) {
    if (re.test(body)) fail(`${f} contains a ${label}`);
  }
}

// ── 3. External links open safely ─────────────────────────────────────────
for (const page of htmlFiles) {
  const html = readFileSync(join(dist, page), 'utf8');
  for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
    if (!/target="_blank"/.test(tag)) continue;
    if (!/rel="[^"]*noopener/.test(tag)) {
      fail(`${page} → target="_blank" without rel="noopener": ${tag.slice(0, 100)}`);
    }
  }
}

// ── 4. The post-payment page must not ship the scheduling link ────────────
const bookedPage = '/teach/booked/index.html';
if (files.has(bookedPage)) {
  const html = readFileSync(join(dist, bookedPage), 'utf8');
  if (/calendly\.com/.test(html)) {
    fail(`${bookedPage} exposes the scheduling link in prerendered HTML`);
  }
}

// ── 5. Free downloads exist and are non-trivial ───────────────────────────
const PROMISED = ['/resume.pdf'];
for (const p of PROMISED) {
  if (!files.has(p)) fail(`promised download missing: ${p}`);
  else {
    const bytes = statSync(join(dist, p)).size;
    if (bytes < 1024) fail(`${p} is suspiciously small (${bytes} bytes)`);
    else notes.push(`${p} — ${(bytes / 1024).toFixed(0)} KB`);
  }
}

// ── 5b. PAID assets must NOT be published ─────────────────────────────────
// The Playbook is sold, not given away. If it ever lands in dist/ it is
// served at a public URL and can never be un-shared, so this fails the build.
for (const f of files) {
  if (/playbook/i.test(f)) fail(`paid asset published at a public URL: ${f}`);
}
if (!existsSync(resolve(root, 'api/_assets/playbook.pdf'))) {
  fail('api/_assets/playbook.pdf is missing — /api/playbook would 500 for buyers');
} else {
  notes.push(`api/_assets/playbook.pdf (private) — ${(statSync(resolve(root, 'api/_assets/playbook.pdf')).size / 1024).toFixed(0)} KB`);
}

// ── 6. Media referenced by the page exists ────────────────────────────────
for (const page of htmlFiles) {
  const html = readFileSync(join(dist, page), 'utf8');
  for (const m of html.matchAll(/<source[^>]+src="(\/[^"]+)"/g)) {
    if (!files.has(m[1])) fail(`${page} → missing media: ${m[1]}`);
    else notes.push(`${m[1]} — ${(statSync(join(dist, m[1])).size / 1024 / 1024).toFixed(1)} MB`);
  }
}

for (const n of [...new Set(notes)]) console.log(`  · ${n}`);
if (problems.length) {
  console.error(`\ncheck-links: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`\ncheck-links: OK — ${htmlFiles.length} pages, ${files.size} files, no broken links or leaked secrets`);
