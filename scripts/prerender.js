// Prerenders each route to its own static HTML file, so first paint (and SEO,
// and no-JS users) get full content per URL. Run after both Vite builds:
//   vite build                                   -> dist/
//   vite build --ssr src/entry-prerender.tsx     -> dist-ssr/
import { readFileSync, writeFileSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://rahulbonala.me';

// Routes to prerender → output path under dist/.
//
// `title` / `description` are per-route: previously every prerendered page
// inherited the home page's title, description and canonical, so a link to
// /teach shared anywhere (LinkedIn, WhatsApp, an ad) previewed as the generic
// portfolio and every page competed with the others in search for the same
// terms. `noindex` keeps post-payment pages out of the index.
const ROUTES = [
  {
    path: '/',
    out: 'index.html',
    // Home keeps the template's own tags — they're already written for it.
  },
  {
    path: '/work/bestanswers',
    out: 'work/bestanswers/index.html',
    title: 'BestAnswers.AI case study · Rahul Bonala',
    description:
      'How I built a multi-agent answer engine: four AI personas debate in parallel and a meta-judge merges the strongest reasoning, with the disagreements left visible.',
  },
  {
    path: '/work/smiths-detection',
    out: 'work/smiths-detection/index.html',
    title: 'Smiths Detection service consoles: a case study · Rahul Bonala',
    description:
      'Designing and building service consoles used daily by maintenance engineers across Europe, APAC and North America. 95% CSAT, 80% faster workflows, 70% fewer support tickets.',
  },
  {
    path: '/teach',
    out: 'teach/index.html',
    title: 'Zero to Live: turn your idea into a website in an hour · Rahul Bonala',
    description:
      'Turn your idea into a live website in about 60 minutes. A one-on-one session using free AI tools, with zero coding. You leave with the 15-page AI Builder’s Playbook and every prompt, able to do it again yourself.',
  },
  {
    path: '/review',
    out: 'review/index.html',
    title: 'Leave a review · Zero to Live',
    description: 'Tell me how your Zero to Live session went.',
    // A link to hand out, not a page to be found. Indexing it would invite
    // drive-by submissions the moderation queue exists to absorb.
    noindex: true,
  },
  {
    path: '/teach/booked',
    out: 'teach/booked/index.html',
    title: 'Payment received. Pick your slot · Rahul Bonala',
    description: 'Choose a time for your 1:1 session.',
    noindex: true,
  },
];

// Entry filename is content-hashed — find it
const entry = readdirSync(resolve(root, 'dist-ssr')).find(
  (f) => f.startsWith('entry-prerender') && f.endsWith('.js')
);
if (!entry) throw new Error('prerender: SSR entry not found in dist-ssr/');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr', entry)).href);

const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error('prerender: #root marker not found in dist/index.html');
}

/** Escapes a string for use inside a double-quoted HTML attribute. */
const attr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Rewrites the per-page tags in the template's <head>.
 *
 * Each replacement asserts it actually matched — a silent no-op here would
 * ship a page carrying the wrong canonical, which is exactly the bug this
 * function exists to fix.
 */
function applyMeta(html, route) {
  if (!route.title && !route.description && !route.noindex) return html;

  const url = `${SITE}${route.path}`;
  let out = html;

  const swap = (pattern, replacement, what) => {
    if (!pattern.test(out)) {
      throw new Error(`prerender: could not set ${what} for ${route.path}; did index.html change?`);
    }
    out = out.replace(pattern, replacement);
  };

  if (route.title) {
    const t = attr(route.title);
    swap(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, 'title');
    swap(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${t}"`,
      'og:title'
    );
    swap(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${t}"`,
      'twitter:title'
    );
  }

  if (route.description) {
    const d = attr(route.description);
    swap(
      /<meta name="description"\s+content="[^"]*"/,
      `<meta name="description" content="${d}"`,
      'description'
    );
    swap(
      /<meta property="og:description"\s+content="[^"]*"/,
      `<meta property="og:description" content="${d}"`,
      'og:description'
    );
    swap(
      /<meta name="twitter:description"\s+content="[^"]*"/,
      `<meta name="twitter:description" content="${d}"`,
      'twitter:description'
    );
  }

  swap(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${attr(url)}"`,
    'canonical'
  );
  swap(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${attr(url)}"`,
    'og:url'
  );

  if (route.noindex) {
    out = out.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
  }

  return out;
}

for (const route of ROUTES) {
  const appHtml = render(route.path);
  const html = applyMeta(template, route).replace(marker, `<div id="root">${appHtml}</div>`);
  const outPath = resolve(root, 'dist', route.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerender: ${route.path} → dist/${route.out} (${Math.round(appHtml.length / 1024)} KiB)`);
}

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
