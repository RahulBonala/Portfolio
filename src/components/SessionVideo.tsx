import { useState } from 'react';
import { SESSION_VIDEO, hasSessionVideo } from '../lib/booking';
import './SessionVideo.css';

/** The four phases, straight from the Playbook — the video walks through these. */
const PHASES = ['Define', 'Design', 'Develop', 'Deploy'] as const;

type Props = {
  /**
   * 'section' — standalone block with its own heading and caption.
   * 'bare'    — just the player, for when the surrounding page already
   *             supplies the heading (the /teach hero does).
   */
  variant?: 'section' | 'bare';
};

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
const SessionVideo: React.FC<Props> = ({ variant = 'section' }) => {
  const [playing, setPlaying] = useState(false);

  if (!hasSessionVideo) return null;

  const { youTubeId, file, aspect, poster, title, caption } = SESSION_VIDEO;

  // A phone-shot clip is taller than it is wide. Sizing the frame from the
  // real aspect ratio is what stops the player cropping or letterboxing it,
  // and `is-portrait` caps the width so it doesn't tower down the page.
  const portrait = aspect === '9 / 16';

  // youtube-nocookie.com is the privacy-preserving host; the params trim the
  // end-screen clutter that would otherwise advertise unrelated channels.
  const embedSrc = youTubeId
    ? `https://www.youtube-nocookie.com/embed/${youTubeId}?autoplay=1&rel=0&modestbranding=1`
    : '';

  // YouTube generates thumbnails for every video, so the facade has a poster
  // even when none was configured.
  const facadePoster = poster || (youTubeId ? `https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg` : '');

  const frame = (
    <div
      className={`session-video-frame ${portrait ? 'is-portrait' : ''}`}
      style={{ aspectRatio: aspect }}
    >
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
  );

  // In the /teach hero the page already carries the H1 and the lede, so the
  // player is rendered on its own rather than repeating a heading beside one.
  if (variant === 'bare') return frame;

  return (
    <section
      className={`session-video ${portrait ? 'is-portrait-layout' : ''}`}
      data-reveal="up"
      aria-labelledby="session-video-h"
    >
      <div className="session-video-copy">
        <h2 id="session-video-h" className="session-video-title">{title}</h2>
        {caption && <p className="session-video-caption">{caption}</p>}
        <ol className="session-video-phases" aria-label="The four phases of a session">
          {PHASES.map((p, i) => (
            <li key={p}>
              <span className="session-video-phase-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {p}
            </li>
          ))}
        </ol>
      </div>

      {frame}
    </section>
  );
};

export default SessionVideo;
