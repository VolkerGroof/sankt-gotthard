'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import enTimed from '@/data/transcript.en.timed.json';
import deTimed from '@/data/transcript.de.timed.json';

const SEP = '   ·   ';
const TRANSCRIPTS = { en: enTimed, de: deTimed } as const;
type LocaleKey = keyof typeof TRANSCRIPTS;

const TICK_MS = 80;
const WINDOW = 90; // single-line sliding window of characters

type Props = {
  textClassName?: string;
};

/**
 * Inline streaming caption + play/pause control, intended to live inside a
 * room's bottom nav between the prev and next links.
 *
 * Reads playback position from `window.__sgPlayer` (the YouTube IFrame player
 * exposed by BackgroundAudio) and walks a sliding `WINDOW`-character window
 * across the active locale's transcript.
 */
export default function WallText({ textClassName }: Props = {}) {
  const locale = useLocale() as LocaleKey;
  const data = TRANSCRIPTS[locale] ?? TRANSCRIPTS.en;
  const { source, totalChars, totalSeconds } = useMemo(() => {
    const src = (data.sentences as { text: string }[])
      .map((s) => s.text)
      .join(SEP);
    return { source: src, totalChars: src.length, totalSeconds: data.totalSeconds };
  }, [data]);

  const [charPos, setCharPos] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const posRef = useRef(0);

  // Re-anchor charPos to the new locale's source on language flip.
  useEffect(() => {
    const p = window.__sgPlayer;
    let target = 0;
    if (p && typeof p.getCurrentTime === 'function') {
      try {
        const t = p.getCurrentTime();
        if (typeof t === 'number' && Number.isFinite(t)) {
          target = Math.max(
            0,
            Math.min(totalChars, Math.floor((t / totalSeconds) * totalChars)),
          );
        }
      } catch {
        /* not ready */
      }
    }
    posRef.current = target;
    setCharPos(target);
  }, [locale, totalChars, totalSeconds]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const tick = () => {
      if (cancelled) return;
      const p = window.__sgPlayer;
      let target = 0;
      let playing = false;
      if (p && typeof p.getCurrentTime === 'function') {
        try {
          const t = p.getCurrentTime();
          if (typeof t === 'number' && Number.isFinite(t)) {
            target = Math.max(
              0,
              Math.min(totalChars, Math.floor((t / totalSeconds) * totalChars)),
            );
          }
        } catch {
          /* not ready */
        }
        try {
          const s = p.getPlayerState?.();
          playing = s === 1 || s === 3;
        } catch {
          /* not ready */
        }
      }
      if (target > posRef.current) {
        posRef.current += 1;
        setCharPos(posRef.current);
      } else if (target < posRef.current) {
        posRef.current = target;
        setCharPos(target);
      }
      setIsPlaying((prev) => (prev !== playing ? playing : prev));
      timer = window.setTimeout(tick, TICK_MS);
    };
    tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [totalChars, totalSeconds]);

  const visible = source.slice(Math.max(0, charPos - WINDOW), charPos);

  const togglePlay = () => {
    const p = window.__sgPlayer;
    if (!p) return;
    try {
      if (isPlaying) p.pauseVideo();
      else p.playVideo();
    } catch {
      /* not ready */
    }
  };

  const ui = useTranslations('ui');
  const label = isPlaying ? ui('pause') : ui('play');

  return (
    <div
      className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-hidden"
      aria-live="polite"
    >
      <p
        className={`pointer-events-none ${
          textClassName ??
          'whitespace-nowrap text-center font-display text-[15px] italic leading-tight text-gallery-ink/80'
        }`}
      >
        {visible}
        <span
          aria-hidden
          className="ml-0.5 inline-block w-[2px] animate-pulse bg-gallery-crimson align-baseline"
          style={{ height: '0.9em' }}
        />
      </p>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={label}
        title={label}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current/20 bg-transparent text-current hover:text-gallery-crimson"
      >
        {isPlaying ? (
          <svg width="10" height="12" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
            <rect x="1" y="1" width="4" height="14" rx="0.5" />
            <rect x="9" y="1" width="4" height="14" rx="0.5" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
            <path d="M2 1.5v13l11-6.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
