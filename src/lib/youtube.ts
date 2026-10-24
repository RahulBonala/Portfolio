// The Pay Grade AI YouTube channel, in one place. Used by the home page
// section, the hero, the footer and /teach.
const CHANNEL_URL = 'https://www.youtube.com/channel/UCIfuWTDvEMRy-5Ib68FBcMg';

export const CHANNEL = {
  name: 'Pay Grade AI',
  url: CHANNEL_URL,
  videosUrl: `${CHANNEL_URL}/videos`,
  subscribeUrl: `${CHANNEL_URL}?sub_confirmation=1`,
  /**
   * Where /teach sends "Not ready to book?" visitors. Points at the channel
   * until the course playlist exists; swap in the playlist URL then.
   */
  courseUrl: CHANNEL_URL,
  avatar: '/paygrade-profile-picture.png',
  logo: {
    dark: '/brand/paygrade/logo-horizontal-white.svg',
    light: '/brand/paygrade/logo-horizontal-navy.svg',
  },
  /** Shown in place of a video thumbnail that fails to load. */
  thumbnailFallback: '/brand/paygrade/thumbnail-tag.svg',
} as const;

export type ChannelVideo = { id: string; title: string; published: string };

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * The newest videos, from our own /api/youtube (which reads the RSS feed on
 * the server). Resolves to an empty list on any failure, so the caller only
 * ever has to decide between "some videos" and "none".
 */
export async function fetchLatestVideos(signal?: AbortSignal): Promise<ChannelVideo[]> {
  try {
    const res = await fetch('/api/youtube', { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { videos?: unknown };
    if (!Array.isArray(data.videos)) return [];
    return data.videos
      .filter(
        (v): v is ChannelVideo =>
          typeof v === 'object' && v !== null &&
          VIDEO_ID.test((v as ChannelVideo).id) &&
          typeof (v as ChannelVideo).title === 'string' && (v as ChannelVideo).title.length > 0 &&
          !Number.isNaN(Date.parse((v as ChannelVideo).published))
      )
      .slice(0, 3);
  } catch {
    return [];
  }
}
