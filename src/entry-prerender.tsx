import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Build-time prerender entry — see scripts/prerender.js */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
