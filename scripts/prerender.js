// Injects the prerendered app HTML into dist/index.html after both builds:
//   vite build                                   -> dist/
//   vite build --ssr src/entry-prerender.tsx     -> dist-ssr/
// Run via `npm run build`. Makes first paint independent of JS execution.
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Entry filename is content-hashed — find it
const entry = readdirSync(resolve(root, 'dist-ssr')).find(
  (f) => f.startsWith('entry-prerender') && f.endsWith('.js')
);
if (!entry) throw new Error('prerender: SSR entry not found in dist-ssr/');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr', entry)).href);
const appHtml = render();

const indexPath = resolve(root, 'dist/index.html');
const html = readFileSync(indexPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error('prerender: #root marker not found in dist/index.html');
}
writeFileSync(indexPath, html.replace(marker, `<div id="root">${appHtml}</div>`));
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerender: injected ${Math.round(appHtml.length / 1024)} KiB of static HTML into dist/index.html`);
