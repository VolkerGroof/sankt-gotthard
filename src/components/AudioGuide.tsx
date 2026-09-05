'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  src: string;
};

/**
 * Small circular play/pause control with a speaker icon, intended to be
 * absolutely positioned on the top-right of a PictureFrame. Owns its own
 * <audio> element; clicking the button toggles playback. The click is
 * `stopPropagation`'d so the surrounding picture-click (which opens the
 * lightbox) does NOT also fire.
 */
export default function AudioGuide({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const ui = useTranslations('ui');

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPauseOrEnd = () => setPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPauseOrEnd);
    a.addEventListener('ended', onPauseOrEnd);
    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPauseOrEnd);
      a.removeEventListener('ended', onPauseOrEnd);
      // Stop playback when this component unmounts (e.g., navigating away).
      try {
        a.pause();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {
        /* ignore autoplay errors */
      });
    } else {
      a.pause();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) a.play().catch(() => {});
      else a.pause();
    }
  };

  const label = playing ? ui('audioGuidePause') : ui('audioGuidePlay');

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-label={label}
        title={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gallery-ink/15 bg-gallery-mat/95 text-gallery-ink shadow-sm transition-colors hover:border-gallery-crimson/60 hover:text-gallery-crimson"
      >
        {playing ? (
          // Speaker with sound waves
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M11 5 6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        ) : (
          // Plain speaker (idle)
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M11 5 6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          </svg>
        )}
      </button>
    </>
  );
}
