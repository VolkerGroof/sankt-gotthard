'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

export default function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (target: Locale) => {
    if (target === locale) return;
    router.replace(pathname, { locale: target });
  };

  const base =
    'px-3 py-1 font-body text-sm uppercase tracking-[0.2em] transition-colors';
  const active = 'text-gallery-crimson';
  const inactive = 'text-gallery-ink/50 hover:text-gallery-ink';

  return (
    <div className="flex items-center gap-1 font-body text-sm text-gallery-ink/60">
      <button
        type="button"
        onClick={() => switchTo('de')}
        className={`${base} ${locale === 'de' ? active : inactive}`}
        aria-pressed={locale === 'de'}
      >
        DE
      </button>
      <span className="opacity-40">|</span>
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={`${base} ${locale === 'en' ? active : inactive}`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
