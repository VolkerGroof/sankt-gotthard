import fs from 'node:fs';
import path from 'node:path';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { findStop, adjacent } from '@/data/exhibition';
import GalleryViews, { type GalleryPicture } from '@/components/GalleryViews';

function fileExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', 'pictures', file));
  } catch {
    return false;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stop = findStop('gallery');
  if (!stop) notFound();
  const { prev } = adjacent(stop.slug);
  if (!prev) notFound();

  const pictures: GalleryPicture[] = stop.pictures.map((p) => ({
    id: p.id,
    titleKey: p.titleKey,
    file: p.file,
    exists: fileExists(p.file),
  }));

  return (
    <GalleryViews
      pictures={pictures}
      prevSlug={prev.slug}
      prevNameKey={prev.nameKey}
      titleKey={stop.nameKey}
    />
  );
}
