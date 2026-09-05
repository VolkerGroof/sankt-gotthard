'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import AudioGuide from './AudioGuide';

type Props = {
  titleKey: string;
  file: string;
  exists: boolean;
  /** Optional override shown in the fullscreen lightbox instead of `file`. */
  lightboxFile?: string;
  lightboxExists?: boolean;
  /** Optional URL to a narration audio file; shows a speaker button on the frame. */
  audioSrc?: string;
  layout?: 'single' | 'pair';
};

export default function PictureFrame({
  titleKey,
  file,
  exists,
  lightboxFile,
  lightboxExists,
  audioSrc,
  layout = 'single',
}: Props) {
  const t = useTranslations();
  const ui = useTranslations('ui');
  const title = t(titleKey);
  const [open, setOpen] = useState(false);

  // Lock body scroll while the lightbox is open and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const figureWidth =
    layout === 'pair'
      ? 'w-full max-w-[min(720px,44vw)]'
      : 'w-full max-w-[min(960px,72vw)]';

  const imgMaxH = layout === 'pair' ? 'max-h-[62vh]' : 'max-h-[72vh]';

  const variantClass = layout === 'pair' ? 'pf-pair' : 'pf-single';

  return (
    <>
      <figure
        className={`group flex cursor-zoom-in flex-col items-center ${variantClass} ${figureWidth}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${title} — ${ui('open')}`}
      >
        <div
          className="relative w-full rounded-[2px] shadow-frame transition-transform group-hover:scale-[1.01]"
          style={{
            padding: '14px',
            background:
              'linear-gradient(140deg, #d9b56a 0%, #c9a14a 38%, #8c6e2c 100%)',
          }}
        >
          {audioSrc && (
            <div className="absolute left-full top-1/2 z-10 -translate-y-1/2 pl-3">
              <AudioGuide src={audioSrc} />
            </div>
          )}
          <div
            className={`relative flex w-full items-center justify-center bg-gallery-mat ${
              layout === 'pair' ? 'aspect-[16/9]' : ''
            }`}
            style={{ padding: '24px' }}
          >
            {exists ? (
              <img
                src={`/pictures/${file}`}
                alt={title}
                className={`block max-h-full max-w-full ${
                  layout === 'pair' ? 'h-full w-full' : imgMaxH
                } object-contain`}
                style={{
                  width: layout === 'pair' ? '100%' : 'auto',
                  height: layout === 'pair' ? '100%' : 'auto',
                }}
              />
            ) : (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-neutral-300 text-neutral-700">
                <span className="font-display text-xl italic">
                  {ui('missingImage')}
                </span>
                <span className="mt-2 font-body text-sm">{file}</span>
              </div>
            )}
          </div>
        </div>
        <figcaption className="mt-3 max-w-[28rem] text-center font-display text-lg italic leading-snug text-gallery-ink sm:mt-5 sm:text-2xl">
          {title}
        </figcaption>
      </figure>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <PictureLightbox
            file={lightboxFile ?? file}
            title={title}
            exists={lightboxFile ? !!lightboxExists : exists}
            onClose={() => setOpen(false)}
            closeLabel={ui('close')}
          />,
          document.body,
        )}
    </>
  );
}

function PictureLightbox({
  file,
  title,
  exists,
  onClose,
  closeLabel,
}: {
  file: string;
  title: string;
  exists: boolean;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="picture-lightbox fixed inset-0 z-[100] flex cursor-zoom-out flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div
        className="relative flex max-h-[88vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-[2px] shadow-frame"
          style={{
            padding: '18px',
            background:
              'linear-gradient(140deg, #d9b56a 0%, #c9a14a 38%, #8c6e2c 100%)',
          }}
        >
          <div
            className="relative flex aspect-[16/9] items-center justify-center bg-gallery-mat"
            style={{ padding: '28px', width: 'min(80vw, 1200px)' }}
          >
            {exists ? (
              <img
                src={`/pictures/${file}`}
                alt={title}
                className="block h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-neutral-700">
                {file}
              </div>
            )}
          </div>
        </div>
        <p className="mt-5 max-w-[80vw] text-center font-display text-2xl italic leading-snug text-[#f3e8cf] sm:text-3xl">
          {title}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        title={closeLabel}
        className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/90 transition-colors hover:bg-white/10"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
    </div>
  );
}
