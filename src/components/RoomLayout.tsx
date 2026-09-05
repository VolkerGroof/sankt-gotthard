import fs from 'node:fs';
import path from 'node:path';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { adjacent, type Stop } from '@/data/exhibition';
import PictureFrame from './PictureFrame';

type Props = {
  stop: Stop;
};

function fileExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', 'pictures', file));
  } catch {
    return false;
  }
}

export default function RoomLayout({ stop }: Props) {
  const t = useTranslations();
  const ui = useTranslations('ui');
  const locale = useLocale() as 'de' | 'en';
  const { prev, next } = adjacent(stop.slug);
  const isSingle = stop.pictures.length === 1;

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      <header className="room-header px-6 pt-4 pb-2 text-center sm:pt-8 sm:pb-4">
        <h1 className="font-display text-3xl uppercase tracking-[0.25em] text-gallery-ink sm:text-5xl">
          {t(stop.nameKey)}
        </h1>
        <div className="mx-auto mt-2 h-px w-20 bg-gallery-crimson sm:mt-4 sm:w-24" />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-4 pb-1 sm:px-6 sm:pb-3">
        <div
          className={
            isSingle
              ? 'flex w-full items-center justify-center'
              : 'pair-row flex w-full flex-nowrap items-center justify-center gap-3 sm:gap-12 lg:gap-20'
          }
        >
          {stop.pictures.map((p) => {
            const audioFile = p.audio?.[locale];
            return (
              <PictureFrame
                key={p.id}
                titleKey={p.titleKey}
                file={p.file}
                exists={fileExists(p.file)}
                lightboxFile={p.lightboxFile}
                lightboxExists={p.lightboxFile ? fileExists(p.lightboxFile) : undefined}
                audioSrc={audioFile ? `/audio/${audioFile}` : undefined}
                layout={isSingle ? 'single' : 'pair'}
              />
            );
          })}
        </div>

        {next && (
          <Link
            href={`/exhibition/${next.slug}`}
            aria-label={`${ui('next')} — ${t(next.nameKey)}`}
            title={`${ui('next')} — ${t(next.nameKey)}`}
            className="mt-2 inline-flex items-center justify-center p-2 text-gallery-crimson transition-colors hover:text-gallery-ink sm:mt-4"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        )}
      </section>

      <nav className="flex items-center justify-between gap-4 border-t border-gallery-ink/10 bg-gallery-bg/70 px-6 py-5 font-body text-base text-gallery-ink backdrop-blur-sm sm:px-12">
        <div className="flex-1">
          {prev ? (
            <Link
              href={`/exhibition/${prev.slug}`}
              className="group inline-flex flex-col items-start text-gallery-crimson hover:text-gallery-ink"
            >
              <span className="text-xs uppercase tracking-[0.25em] opacity-70">
                ← {ui('prev')}
              </span>
              <span className="font-display text-lg italic">{t(prev.nameKey)}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.25em] text-gallery-ink/70 hover:text-gallery-crimson"
            >
              ← {ui('exitExhibition')}
            </Link>
          )}
        </div>

        <div className="flex-1 text-right">
          {next ? (
            <Link
              href={`/exhibition/${next.slug}`}
              className="group inline-flex flex-col items-end text-gallery-crimson hover:text-gallery-ink"
            >
              <span className="text-xs uppercase tracking-[0.25em] opacity-70">
                {ui('next')} →
              </span>
              <span className="font-display text-lg italic">{t(next.nameKey)}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.25em] text-gallery-ink/70 hover:text-gallery-crimson"
            >
              {ui('exitExhibition')} →
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
