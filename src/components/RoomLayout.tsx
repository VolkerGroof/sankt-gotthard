import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { adjacent, type Stop } from '@/data/exhibition';
import PictureFrame from './PictureFrame';
import WallText from './WallText';

type Props = {
  stop: Stop;
};

export default function RoomLayout({ stop }: Props) {
  const t = useTranslations();
  const ui = useTranslations('ui');
  const { prev, next } = adjacent(stop.slug);
  const isSingle = stop.pictures.length === 1;

  return (
    <main className="relative flex min-h-[calc(100vh-6rem)] flex-col">
      <header className="px-6 pt-12 pb-8 text-center">
        <h1 className="font-display text-4xl uppercase tracking-[0.25em] text-gallery-ink sm:text-5xl">
          {t(stop.nameKey)}
        </h1>
        <div className="mx-auto mt-4 h-px w-24 bg-gallery-crimson" />
      </header>

      <section
        className={
          isSingle
            ? 'flex flex-1 items-center justify-center px-6 pb-16'
            : 'flex flex-1 flex-wrap items-center justify-center gap-16 px-6 pb-16 lg:gap-24'
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

      <nav className="flex items-center gap-6 border-t border-gallery-ink/10 bg-gallery-bg/70 px-6 py-5 font-body text-base text-gallery-ink backdrop-blur-sm sm:px-12">
        <div className="flex-1 min-w-0">
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

        <WallText />

        <div className="flex-1 min-w-0 text-right">
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
