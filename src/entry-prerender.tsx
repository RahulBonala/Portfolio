import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

/** Build-time prerender entry — see scripts/prerender.js */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

// Per-route metadata for scripts/prerender.js (one source with the pages).
export { ROUTE_META, aiAgentsJsonLd } from './lib/seo';
