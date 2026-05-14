'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function EnterButton() {
  const t = useTranslations('landing');
  const onEnter = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sg:enter'));
    }
  };
  return (
    <Link
      href="/exhibition/eingang"
      onClick={onEnter}
      className="group inline-flex items-center gap-3 border border-gallery-crimson bg-gallery-crimson px-10 py-4 font-display text-xl text-gallery-mat shadow-frame transition-colors hover:bg-gallery-ink hover:border-gallery-ink"
    >
      <span className="tracking-wide">{t('enter')}</span>
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
