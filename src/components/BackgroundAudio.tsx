'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const VIDEO_ID = 'rZPMtMG7mE0';

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  seekTo: (sec: number, allowSeekAhead: boolean) => void;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    __sgPlayer?: YTPlayer | null;
    YT?: {
      Player: new (
        el: string | HTMLElement,
        opts: Record<string, unknown>,
      ) => YTPlayer;
    };
  }
}

export default function BackgroundAudio() {
  const playerRef = useRef<YTPlayer | null>(null);
  const [muted, setMuted] = useState(false);
  const [active, setActive] = useState(false);
  const ui = useTranslations('ui');

  useEffect(() => {
    if (!document.getElementById('sg-yt-api')) {
      const tag = document.createElement('script');
      tag.id = 'sg-yt-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    // Was audio playing before this mount (e.g., before a locale switch)?
    const wasPlaying = sessionStorage.getItem('sgAudioPlaying') === '1';
    const savedTime = parseFloat(sessionStorage.getItem('sgAudioTime') || '0');

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('sg-yt-player', {
        videoId: VIDEO_ID,
        height: '1',
        width: '1',
        playerVars: {
          // If audio was already running, autoplay muted on remount; we'll
          // unmute + seek in onReady. Browsers allow muted autoplay without a
          // fresh user gesture, which is what survives a locale switch.
          autoplay: wasPlaying ? 1 : 0,
          mute: wasPlaying ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          loop: 1,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            window.__sgPlayer = e.target;
            if (wasPlaying) {
              try {
                if (Number.isFinite(savedTime) && savedTime > 0) {
                  e.target.seekTo(savedTime, true);
                }
                e.target.unMute();
                e.target.setVolume(60);
                e.target.playVideo();
                setMuted(false);
                setActive(true);
              } catch {
                /* ignore — first tick will retry */
              }
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const onEnter = () => {
      const p = playerRef.current;
      if (!p) return;
      try {
        p.unMute();
        p.setVolume(60);
        p.playVideo();
        setMuted(false);
        setActive(true);
        sessionStorage.setItem('sgAudioPlaying', '1');
      } catch {
        /* ignore — player not ready */
      }
    };
    window.addEventListener('sg:enter', onEnter);

    // Persist current playback to sessionStorage so a locale-switch remount
    // can resume from the same place.
    const persistId = window.setInterval(() => {
      const p = playerRef.current;
      if (!p || typeof p.getCurrentTime !== 'function') return;
      try {
        const state = p.getPlayerState?.();
        const t = p.getCurrentTime();
        if (state === 1 || state === 3) {
          sessionStorage.setItem('sgAudioPlaying', '1');
        } else if (state === 2 || state === 0) {
          sessionStorage.setItem('sgAudioPlaying', '0');
        }
        if (Number.isFinite(t)) {
          sessionStorage.setItem('sgAudioTime', String(t));
        }
      } catch {
        /* not ready */
      }
    }, 800);

    return () => {
      window.removeEventListener('sg:enter', onEnter);
      window.clearInterval(persistId);
    };
  }, []);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div id="sg-yt-player" />
      </div>
      {active && (
        <button
          type="button"
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gallery-ink/15 bg-gallery-bg/90 text-gallery-ink shadow-frame backdrop-blur-sm transition-colors hover:bg-gallery-mat"
          aria-label={muted ? ui('soundOn') : ui('soundOff')}
          title={muted ? ui('soundOn') : ui('soundOff')}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
