import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { findStop } from '@/data/exhibition';
import RoomLayout from '@/components/RoomLayout';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stop = findStop('ausgang');
  if (!stop) notFound();
  return <RoomLayout stop={stop} />;
}
