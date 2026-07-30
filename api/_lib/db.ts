/**
 * Minimal Supabase (PostgREST) client for the serverless functions.
 *
 * Deliberately hand-rolled rather than pulling in @supabase/supabase-js: the
 * three tables here need insert, select and upsert and nothing else, and a
 * dependency-free module cannot accidentally be imported by client code and
 * drag the service-role key anywhere near the browser bundle.
 *
 * SUPABASE_SERVICE_ROLE_KEY bypasses row-level security entirely. It must
 * never carry a VITE_ prefix and must never be returned in a response body.
 */

const URL_ENV = 'SUPABASE_URL';
const KEY_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

export function dbConfigured(): boolean {
  return Boolean(process.env[URL_ENV] && process.env[KEY_ENV]);
}

function endpoint(table: string, query = ''): string {
  const base = (process.env[URL_ENV] ?? '').replace(/\/+$/, '');
  return `${base}/rest/v1/${table}${query}`;
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const key = process.env[KEY_ENV] ?? '';
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export class DbError extends Error {
  // Written as an explicit field rather than a constructor parameter property:
  // Node's strip-only type removal (which the test runner uses to execute these
  // sources directly) rejects parameter properties.
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'DbError';
    this.status = status;
  }
}

async function request(url: string, init: RequestInit): Promise<unknown> {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    // The body can echo column names and constraint details. Log it for
    // debugging but never let it reach the caller's response.
    console.error('db request failed', res.status, text.slice(0, 400));
    throw new DbError('database_request_failed', res.status);
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Insert one row. `onConflict` turns it into an idempotent upsert. */
export async function insert<T extends Record<string, unknown>>(
  table: string,
  row: T,
  opts: { onConflict?: string } = {}
): Promise<void> {
  const query = opts.onConflict ? `?on_conflict=${encodeURIComponent(opts.onConflict)}` : '';
  await request(endpoint(table, query), {
    method: 'POST',
    headers: headers({
      // merge-duplicates makes a repeated verification (a refresh, a retry)
      // update the existing row instead of failing on the unique constraint.
      Prefer: opts.onConflict ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal',
    }),
    body: JSON.stringify(row),
  });
}

/** Select rows with a raw PostgREST query string, e.g. `?status=eq.approved`. */
export async function select<T>(table: string, query: string): Promise<T[]> {
  const rows = await request(endpoint(table, query), { method: 'GET', headers: headers() });
  return Array.isArray(rows) ? (rows as T[]) : [];
}
