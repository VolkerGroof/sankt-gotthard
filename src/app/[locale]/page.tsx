import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import EnterButton from '@/components/EnterButton';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LandingContent />;
}

function LandingContent() {
  const site = useTranslations('site');
  const landing = useTranslations('landing');
  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center px-6 text-center">
      <p className="font-body text-xs uppercase tracking-[0.5em] text-gallery-crimson/80">
        Hommage · Gotthard Günther
      </p>
      <h1 className="mt-6 font-display text-6xl leading-tight text-gallery-ink sm:text-7xl md:text-8xl">
        {site('title')}
      </h1>
      <div className="my-7 h-px w-32 bg-gallery-crimson/80" />
      <p className="max-w-2xl font-display text-2xl italic text-gallery-ink/80 sm:text-3xl">
        {site('subtitle')}
      </p>
      <p className="mt-8 max-w-5xl font-body text-lg leading-relaxed text-gallery-ink/70">
        {landing('intro')}
      </p>
      <div className="mt-12">
        <EnterButton />
      </div>
    </main>
  );
}
