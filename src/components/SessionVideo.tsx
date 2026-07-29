import { useState } from 'react';
import { SESSION_VIDEO, hasSessionVideo } from '../lib/booking';
import './SessionVideo.css';

/**
 * The 1:1 session's intro video — the single most important asset for paid
 * traffic, because someone arriving from an ad has no idea what an hour with
 * you is actually like.
 *
 * Renders nothing at all until a video is configured in src/lib/booking.ts,
 * so the page never shows an empty player.
 *
 * The YouTube path is click-to-load: until the visitor presses play we render
 * a poster and a play button, not an iframe. That means no third-party frame
 * (and no YouTube cookie) on page load, and it keeps the video off the
 * critical path — a facade weighs a few KB where the embed weighs ~800.
 */
const SessionVideo: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  if (!hasSessionVideo) return null;

  const { youTubeId, file, poster, title, caption } = SESSION_VIDEO;

  // youtube-nocookie.com is the privacy-preserving host; the params trim the
  // end-screen clutter that would otherwise advertise unrelated channels.
  const embedSrc = youTubeId
    ? `https://www.youtube-nocookie.com/embed/${youTubeId}?autoplay=1&rel=0&modestbranding=1`
    : '';

  // YouTube generates thumbnails for every video, so the facade has a poster
  // even when none was configured.
  const facadePoster = poster || (youTubeId ? `https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg` : '');

  return (
    <section className="session-video" data-reveal="up" aria-labelledby="session-video-h">
      <h2 id="session-video-h" className="session-video-title">{title}</h2>
      {caption && <p className="session-video-caption">{caption}</p>}

      <div className="session-video-frame">
        {file ? (
          <video
            className="session-video-player"
            controls
            preload="metadata"
            poster={poster || undefined}
            playsInline
          >
            <source src={file} type="video/mp4" />
            Your browser can’t play this video.{' '}
            <a href={file} download>Download it instead</a>.
          </video>
        ) : playing ? (
          <iframe
            className="session-video-player"
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="session-video-facade"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            style={facadePoster ? { backgroundImage: `url(${facadePoster})` } : undefined}
          >
            <span className="session-video-play" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
};

export default SessionVideo;
