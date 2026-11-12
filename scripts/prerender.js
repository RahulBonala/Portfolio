// Prerenders each route to its own static HTML file, so first paint (and SEO,
// and no-JS users) get full content per URL. Run after both Vite builds:
//   vite build                                   -> dist/
//   vite build --ssr src/entry-prerender.tsx     -> dist-ssr/
import { readFileSync, writeFileSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://rahulbonala.me';

// Routes to prerender, with their per-route title, description, canonical and
// page-specific JSON-LD, live in src/lib/seo.ts (ROUTE_META) and are read from
// the SSR bundle below, so the pages and this script share one source.
//
// Previously every prerendered page inherited the home page's title,
// description and canonical, so a link to /teach shared anywhere previewed as
// the generic portfolio and every page competed for the same terms. `noindex`
// keeps pages like /review out of the index.

// Entry filename is content-hashed — find it
const entry = readdirSync(resolve(root, 'dist-ssr')).find(
  (f) => f.startsWith('entry-prerender') && f.endsWith('.js')
);
if (!entry) throw new Error('prerender: SSR entry not found in dist-ssr/');
const { render, ROUTE_META: ROUTES, aiAgentsJsonLd } = await import(pathToFileURL(resolve(root, 'dist-ssr', entry)).href);

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
  const url = `${SITE}${route.path}`;
  // The home page keeps its shorter social copy from index.html.
  const isHome = route.path === '/';
  let out = html;

  const swap = (pattern, replacement, what) => {
    if (!pattern.test(out)) {
      throw new Error(`prerender: could not set ${what} for ${route.path}; did index.html change?`);
    }
    out = out.replace(pattern, () => replacement);
  };

  if (route.title) {
    const t = attr(route.title);
    swap(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, 'title');
    if (!isHome) swap(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${t}"`,
      'og:title'
    );
    if (!isHome) swap(
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
    if (!isHome) swap(
      /<meta property="og:description"\s+content="[^"]*"/,
      `<meta property="og:description" content="${d}"`,
      'og:description'
    );
    if (!isHome) swap(
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

  if (route.ogType) {
    swap(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="${attr(route.ogType)}"`,
      'og:type'
    );
  }

  if (route.noindex) {
    swap(
      /<meta name="robots" content="[^"]*"/,
      '<meta name="robots" content="noindex, nofollow"',
      'robots'
    );
  }

  // Page-specific structured data goes where index.html marks it.
  const blocks = [...(route.jsonLd ?? []), ...(route.path === '/work/ai-agents' ? aiAgentsJsonLd() : [])];
  const ld = blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
    .join('\n  ');
  swap(/<!-- route-jsonld -->/, ld, 'route JSON-LD marker');

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
