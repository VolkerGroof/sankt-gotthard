import { useTranslations } from 'next-intl';
import fs from 'node:fs';
import path from 'node:path';

type Props = {
  titleKey: string;
  file: string;
  layout?: 'single' | 'pair';
};

function fileExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', 'pictures', file));
  } catch {
    return false;
  }
}

export default function PictureFrame({ titleKey, file, layout = 'single' }: Props) {
  const t = useTranslations();
  const ui = useTranslations('ui');
  const exists = fileExists(file);
  const title = t(titleKey);

  const figureWidth =
    layout === 'pair'
      ? 'w-full max-w-[min(600px,40vw)]'
      : 'w-full max-w-[min(760px,60vw)]';

  const imgMaxH =
    layout === 'pair' ? 'max-h-[50vh]' : 'max-h-[60vh]';

  return (
    <figure className={`flex flex-col items-center ${figureWidth}`}>
      <div
        className="relative w-full rounded-[2px] shadow-frame"
        style={{
          padding: '14px',
          background:
            'linear-gradient(140deg, #d9b56a 0%, #c9a14a 38%, #8c6e2c 100%)',
        }}
      >
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
              style={{ width: layout === 'pair' ? '100%' : 'auto', height: layout === 'pair' ? '100%' : 'auto' }}
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
      <figcaption className="mt-5 max-w-[28rem] text-center font-display text-xl italic leading-snug text-gallery-ink sm:text-2xl">
        {title}
      </figcaption>
    </figure>
  );
}
