/**
 * The newest Pay Grade AI videos, for the YouTube section on the home page.
 *
 *   GET /api/youtube → { videos: [{ id, title, published }] } (at most 3)
 *
 * The channel's public RSS feed is read here, on the server, so the browser
 * never talks to youtube.com on page load. The response is cached at Vercel's
 * edge for half an hour, so a daily upload shows up the same day without a
 * redeploy and the feed is hit a few dozen times a day at most.
 *
 * A failure is never an error to the page: it gets an empty list, which the
 * section reads as "show the channel card on its own".
 */

type Req = { method?: string };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
};

export type FeedVideo = { id: string; title: string; published: string };

const CHANNEL_ID = 'UCIfuWTDvEMRy-5Ib68FBcMg';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const LIMIT = 3;

/** YouTube video ids are 11 url-safe base64 characters. */
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Warm-instance cache, so a burst of cold CDN misses costs one feed fetch. */
let memo: { at: number; videos: FeedVideo[] } | null = null;
const MEMO_MS = 10 * 60 * 1000;

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function tag(entry: string, name: string): string {
  const match = entry.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decodeXml(match[1]) : '';
}

/**
 * Pulls the newest entries out of the Atom feed. A regex is enough here: the
 * feed's shape is fixed by YouTube, and anything that doesn't match exactly
 * (a bad id, a missing title, an unparseable date) is dropped, not guessed.
 */
export function parseFeed(xml: string, limit = LIMIT): FeedVideo[] {
  const videos: FeedVideo[] = [];
  for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = tag(entry, 'yt:videoId');
    const title = tag(entry, 'title').slice(0, 200);
    const published = tag(entry, 'published');
    if (!VIDEO_ID.test(id) || !title || Number.isNaN(Date.parse(published))) continue;
    videos.push({ id, title, published: new Date(published).toISOString() });
  }
  return videos
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
    .slice(0, limit);
}

async function loadVideos(): Promise<FeedVideo[]> {
  if (memo && Date.now() - memo.at < MEMO_MS) return memo.videos;
  const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`feed responded ${res.status}`);
  const videos = parseFeed(await res.text());
  memo = { at: Date.now(), videos };
  return videos;
}

export default async function handler(req: Req, res: Res) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ videos: [] });
  }

  try {
    const videos = await loadVideos();
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json({ videos });
  } catch (err) {
    console.error('youtube feed failed', err instanceof Error ? err.message : err);
    // Short cache so a YouTube blip doesn't hide the videos for long.
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=120');
    return res.status(200).json({ videos: memo?.videos ?? [] });
  }
}
