import { useEffect, useState } from 'react';
import { CHANNEL, fetchLatestVideos, type ChannelVideo } from '../lib/youtube';
import './YouTube.css';

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** The YouTube logo glyph, in YouTube red. */
const YouTubeGlyph = () => (
  <svg className="yt-glyph" width="22" height="16" viewBox="0 0 28 20" aria-hidden="true" focusable="false">
    <path fill="#FF0000" d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9Z" />
    <path fill="#FFFFFF" d="m11.2 14.3 7.3-4.3-7.3-4.3v8.6Z" />
  </svg>
);

const ExternalArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

const VideoCard: React.FC<{ video: ChannelVideo }> = ({ video }) => {
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
  return (
    <li>
      <a
        className="yt-video"
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-label="Watch"
      >
        <span className="yt-video-thumb">
          <img
            src={thumb}
            alt=""
            width="480"
            height="360"
            loading="lazy"
            decoding="async"
            onError={() => setThumb(CHANNEL.thumbnailFallback)}
            className={thumb === CHANNEL.thumbnailFallback ? 'is-fallback' : undefined}
          />
        </span>
        <span className="yt-video-body">
          <span className="yt-video-title">{video.title}</span>
          <time className="yt-video-date" dateTime={video.published}>
            {dateFormat.format(new Date(video.published))}
          </time>
          <span className="visually-hidden"> (opens YouTube in a new tab)</span>
        </span>
      </a>
    </li>
  );
};

const YouTube: React.FC = () => {
  // Empty until /api/youtube answers. The channel card stands on its own, so
  // a slow or failed feed never leaves an empty or broken row behind.
  const [videos, setVideos] = useState<ChannelVideo[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchLatestVideos(controller.signal).then((list) => {
      if (!controller.signal.aborted) setVideos(list);
    });
    return () => controller.abort();
  }, []);

  return (
    <section id="youtube" className="section yt" aria-labelledby="yt-title">
      <div className="container">
        <div className="sec-label">
          <em>003</em> YouTube
        </div>
        <h2 id="yt-title" className="sec-title" data-reveal="up">
          I read the AI news<br />
          <span className="accent-word">so you don&apos;t have to.</span>
        </h2>
        <p className="yt-lede" data-reveal="up">
          Pay Grade AI is my YouTube channel. Every day: one short video on a new AI
          model or tool, what changed, what it costs, and what it means for your work.
          Longer videos test the tools and build with them.
        </p>

        <div className={`yt-grid ${videos.length ? 'has-videos' : ''}`}>
          <div className="yt-channel" data-reveal="up">
            <div className="yt-channel-head">
              <img
                className="yt-avatar"
                src={CHANNEL.avatar}
                alt=""
                width="400"
                height="400"
                loading="lazy"
                decoding="async"
              />
              <div className="yt-channel-id">
                <p className="yt-channel-kicker"><YouTubeGlyph /> YouTube channel</p>
                <h3 className="yt-channel-name">
                  <img className="yt-logo yt-logo--dark" src={CHANNEL.logo.dark} alt={CHANNEL.name} width="1273" height="193" loading="lazy" decoding="async" />
                  <img className="yt-logo yt-logo--light" src={CHANNEL.logo.light} alt="" aria-hidden="true" width="1273" height="193" loading="lazy" decoding="async" />
                </h3>
              </div>
            </div>
            <p className="yt-channel-line">Daily AI news. Weekly deep dives.</p>
            <div className="yt-channel-actions">
              <a
                className="yt-btn yt-btn--primary"
                href={CHANNEL.subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Subscribe"
              >
                Subscribe on YouTube
                <ExternalArrow />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
              <a
                className="yt-btn yt-btn--secondary"
                href={CHANNEL.videosUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch the latest
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          {videos.length > 0 && (
            <div className="yt-videos">
              <p className="yt-videos-label">Latest videos</p>
              <ul className="yt-video-list">
                {videos.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default YouTube;
