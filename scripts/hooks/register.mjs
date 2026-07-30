// Entry point for `node --import ./scripts/hooks/register.mjs`.
import { register } from 'node:module';
register('./ts-resolve.mjs', import.meta.url);
