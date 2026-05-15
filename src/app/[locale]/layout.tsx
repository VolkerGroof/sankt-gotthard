import type { Metadata } from 'next';
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import LanguageToggle from '@/components/LanguageToggle';
import '../globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sankt Gotthard',
  description: 'Eine Ausstellung zu Ehren von Gotthard Günther',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="layout-root relative z-10 flex min-h-screen flex-col">
            <header className="flex items-center justify-between px-6 py-5 sm:px-10">
              <Link
                href="/"
                className="font-display text-2xl tracking-wide text-gallery-ink hover:text-gallery-crimson"
              >
                Sankt Gotthard
              </Link>
              <LanguageToggle />
            </header>
            <div className="flex-1">{children}</div>
            <footer className="px-6 py-6 text-center font-body text-xs uppercase tracking-[0.3em] text-gallery-ink/40">
              · Sankt Gotthard ·
            </footer>
          </div>
          <div className="floor-parquet" aria-hidden />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
