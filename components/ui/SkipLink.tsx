'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';

/**
 * Skip-link: primer enlace focusable de la página.
 * Está oculto visualmente hasta que recibe foco; entonces salta al main.
 * Su contenido se traduce con i18n.
 */
export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-wine focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream focus:shadow-soft focus:outline-none"
    >
      {t('skipLink') as string}
    </a>
  );
}
