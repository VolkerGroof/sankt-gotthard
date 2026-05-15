import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { adjacent, type Stop } from '@/data/exhibition';
import PictureFrame from './PictureFrame';

type Props = {
  stop: Stop;
};

export default function RoomLayout({ stop }: Props) {
  const t = useTranslations();
  const ui = useTranslations('ui');
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

      <section
        className={
          isSingle
            ? 'flex flex-1 items-center justify-center px-4 pb-1 sm:px-6 sm:pb-3'
            : 'flex flex-1 flex-wrap items-center justify-center gap-6 px-4 pb-1 sm:gap-16 sm:px-6 sm:pb-3 lg:gap-24'
        }
      >
        {stop.pictures.map((p) => (
          <PictureFrame
            key={p.id}
            titleKey={p.titleKey}
            file={p.file}
            layout={isSingle ? 'single' : 'pair'}
          />
        ))}
      </section>

      {next && (
        <div className="flex justify-center pt-1 pb-3 sm:pt-2 sm:pb-5">
          <Link
            href={`/exhibition/${next.slug}`}
            aria-label={`${ui('next')} — ${t(next.nameKey)}`}
            title={`${ui('next')} — ${t(next.nameKey)}`}
            className="inline-flex items-center justify-center p-2 text-gallery-crimson transition-colors hover:text-gallery-ink"
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
        </div>
      )}

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
