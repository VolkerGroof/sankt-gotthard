export type Picture = {
  id: string;
  titleKey: string;
  suplineKey?: string;
  file: string;
  /** Optional override shown in the fullscreen lightbox instead of `file`. */
  lightboxFile?: string;
  /** Narration audio per locale. Picture renders a speaker icon only for locales present here. */
  audio?: { de?: string; en?: string };
};

export type Stop = {
  slug: 'eingang' | 'raum-1' | 'raum-2' | 'raum-3' | 'raum-4' | 'ausgang' | 'gallery';
  nameKey: string;
  pictures: Picture[];
};

export const stops: Stop[] = [
  {
    slug: 'eingang',
    nameKey: 'rooms.eingang',
    pictures: [
      {
        id: 'georg',
        titleKey: 'pictures.georg',
        file: '0 Georg.png',
        audio: { de: 'Eingang.m4a' },
      },
    ],
  },
  {
    slug: 'raum-1',
    nameKey: 'rooms.r1',
    pictures: [
      { id: 'stargazer', titleKey: 'pictures.stargazer', file: '1.1 Stargazer.png' },
      { id: 'homage', titleKey: 'pictures.homage', file: '1.2 Homage.png' },
    ],
  },
  {
    slug: 'raum-2',
    nameKey: 'rooms.r2',
    pictures: [
      { id: 'agarrrando', titleKey: 'pictures.agarrrando', file: '2.1 Agarrrando.png' },
      { id: 'sin-guantes', titleKey: 'pictures.sinGuantes', file: '2.2 Sin Guantes.png' },
    ],
  },
  {
    slug: 'raum-3',
    nameKey: 'rooms.r3',
    pictures: [
      { id: 'offenbarung', titleKey: 'pictures.offenbarung', file: '3.1 die amerikanische Offenbarung.png' },
      { id: 'banane', titleKey: 'pictures.banane', file: '3.2 Die Banane im Getriebe.png' },
    ],
  },
  {
    slug: 'raum-4',
    nameKey: 'rooms.r4',
    pictures: [
      { id: 'ich-oder-du', titleKey: 'pictures.ichOderDu', file: '4.1 Ich oder Du.png' },
      { id: 'culture', titleKey: 'pictures.culture', file: '4.2 The Culture.png' },
    ],
  },
  {
    slug: 'ausgang',
    nameKey: 'rooms.ausgang',
    pictures: [
      {
        id: 'proemial',
        titleKey: 'pictures.proemial',
        file: '5 proemial decoder.png',
        lightboxFile: 'Proemial decoder in groß.png',
      },
    ],
  },
  {
    slug: 'gallery',
    nameKey: 'rooms.gallery',
    pictures: [
      { id: 'georg', titleKey: 'pictures.georg', file: '0 Georg.png' },
      { id: 'stargazer', titleKey: 'pictures.stargazer', file: '1.1 Stargazer.png' },
      { id: 'homage', titleKey: 'pictures.homage', file: '1.2 Homage.png' },
      { id: 'agarrrando', titleKey: 'pictures.agarrrando', file: '2.1 Agarrrando.png' },
      { id: 'sin-guantes', titleKey: 'pictures.sinGuantes', file: '2.2 Sin Guantes.png' },
      { id: 'offenbarung', titleKey: 'pictures.offenbarung', file: '3.1 die amerikanische Offenbarung.png' },
      { id: 'banane', titleKey: 'pictures.banane', file: '3.2 Die Banane im Getriebe.png' },
      { id: 'ich-oder-du', titleKey: 'pictures.ichOderDu', file: '4.1 Ich oder Du.png' },
      { id: 'culture', titleKey: 'pictures.culture', file: '4.2 The Culture.png' },
      { id: 'proemial', titleKey: 'pictures.proemial', file: '5 proemial decoder.png' },
    ],
  },
];

export const findStop = (slug: string): Stop | undefined =>
  stops.find((s) => s.slug === slug);

export const adjacent = (slug: string): { prev?: Stop; next?: Stop } => {
  const i = stops.findIndex((s) => s.slug === slug);
  if (i < 0) return {};
  return { prev: stops[i - 1], next: stops[i + 1] };
};
