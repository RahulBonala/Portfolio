/**
 * Remaps a relative `./x.js` import to `./x.ts` when only the TypeScript
 * source exists.
 *
 * Production code in api/ imports with a `.js` extension because that is what
 * Vercel's bundler and NodeNext resolution expect. Node's type stripping does
 * not perform that remap, so without this the tests would fail on an import
 * style that is correct in deployment. Test-time only; nothing shipped changes.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && specifier.endsWith('.js') && context.parentURL) {
    try {
      const asTs = new URL(specifier.replace(/\.js$/, '.ts'), context.parentURL);
      if (existsSync(fileURLToPath(asTs))) return next(asTs.href, context);
    } catch {
      /* fall through to default resolution */
    }
  }
  return next(specifier, context);
}
