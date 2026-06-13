// Prerenders each route to its own static HTML file, so first paint (and SEO,
// and no-JS users) get full content per URL. Run after both Vite builds:
//   vite build                                   -> dist/
//   vite build --ssr src/entry-prerender.tsx     -> dist-ssr/
import { readFileSync, writeFileSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Routes to prerender → output path under dist/
const ROUTES = [
  { path: '/', out: 'index.html' },
  { path: '/work/bestanswers', out: 'work/bestanswers/index.html' },
  { path: '/work/smiths-detection', out: 'work/smiths-detection/index.html' },
  { path: '/teach', out: 'teach/index.html' },
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

for (const route of ROUTES) {
  const appHtml = render(route.path);
  const html = template.replace(marker, `<div id="root">${appHtml}</div>`);
  const outPath = resolve(root, 'dist', route.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerender: ${route.path} → dist/${route.out} (${Math.round(appHtml.length / 1024)} KiB)`);
}

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
