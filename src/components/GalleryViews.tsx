'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import WallText from './WallText';

export type GalleryPicture = {
  id: string;
  titleKey: string;
  file: string;
  exists: boolean;
};

type Props = {
  pictures: GalleryPicture[];
  prevSlug: string;
  prevNameKey: string;
  titleKey: string;
};

export default function GalleryViews({
  pictures,
  prevSlug,
  prevNameKey,
  titleKey,
}: Props) {
  const t = useTranslations();
  const ui = useTranslations('ui');

  return (
    <main className="relative isolate flex min-h-[calc(100vh-7rem)] flex-col overflow-hidden bg-[#6f1f24] text-[#f1e2b8]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#3a1115]/80 to-transparent"
      />

      <header className="relative z-10 px-6 pt-10 pb-6 text-center sm:px-10">
        <h1
          className="font-display text-4xl uppercase tracking-[0.25em] sm:text-5xl"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}
        >
          {t(titleKey)}
        </h1>
        <div className="mx-auto mt-4 h-px w-24 bg-[#c9a14a]" />
      </header>

      <RowView pictures={pictures} />

      <nav className="relative z-10 flex items-center gap-6 border-t border-white/10 bg-[#3a1115]/70 px-6 py-5 font-body text-base text-[#f1e2b8] backdrop-blur-sm sm:px-12">
        <div className="flex-1 min-w-0">
          <Link
            href={`/exhibition/${prevSlug}`}
            className="group inline-flex flex-col items-start hover:text-white"
          >
            <span className="text-xs uppercase tracking-[0.25em] opacity-70">
              ← {ui('prev')}
            </span>
            <span className="font-display text-lg italic">{t(prevNameKey)}</span>
          </Link>
        </div>
        <WallText textClassName="whitespace-nowrap text-center font-display text-[15px] italic leading-tight text-[#f1e2b8]/85" />
        <div className="flex-1 min-w-0 text-right">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.25em] text-[#f1e2b8]/80 hover:text-white"
          >
            {ui('exitExhibition')} →
          </Link>
        </div>
      </nav>
    </main>
  );
}

/* ───────────────────────── ROW VIEW ───────────────────────── */

function RowView({ pictures }: { pictures: GalleryPicture[] }) {
  const t = useTranslations();
  const ui = useTranslations('ui');
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[5.25rem] -z-10 h-44"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(70,40,15,0.55) 0 2px, transparent 2px 30px), repeating-linear-gradient(-45deg, rgba(90,55,20,0.45) 0 2px, transparent 2px 30px), linear-gradient(180deg, rgba(170,120,70,0.55) 0%, rgba(90,55,25,0.85) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[10.75rem] -z-10 h-[2px] bg-[#1d0708]"
      />
      <section className="relative z-10 flex-1 overflow-x-auto overflow-y-hidden px-10 pb-12">
        <div className="flex h-full items-center gap-12 pr-12">
          {pictures.map((p) => (
            <figure
              key={p.id}
              className="flex shrink-0 flex-col items-center"
              style={{ width: 260 }}
            >
              <FlatFrame title={t(p.titleKey)} file={p.file} exists={p.exists} missingLabel={ui('missingImage')} />
              <figcaption
                className="mt-4 max-w-[14rem] text-center font-display text-base italic leading-snug"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
              >
                {t(p.titleKey)}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

function FlatFrame({
  title,
  file,
  exists,
  missingLabel,
}: {
  title: string;
  file: string;
  exists: boolean;
  missingLabel: string;
}) {
  return (
    <div
      className="relative w-full rounded-[2px]"
      style={{
        padding: '12px',
        background:
          'linear-gradient(140deg, #e8c674 0%, #c9a14a 40%, #8c6e2c 100%)',
        boxShadow:
          '0 18px 30px -10px rgba(0,0,0,0.55), 0 4px 10px -2px rgba(0,0,0,0.45)',
      }}
    >
      <div
        className="relative flex aspect-[16/9] w-full items-center justify-center bg-[#f3e8cf]"
        style={{ padding: '12px' }}
      >
        {exists ? (
          <img src={`/pictures/${file}`} alt={title} className="block h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-300 text-xs text-neutral-700">
            <span>{missingLabel}</span>
            <span className="mt-1 font-mono">{file}</span>
          </div>
        )}
      </div>
    </div>
  );
}

