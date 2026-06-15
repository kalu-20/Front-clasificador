'use client';

import { useI18n, type Lang } from '@/lib/i18n/I18nProvider';
import { cn } from '@/lib/cn';

type Props = {
  className?: string;
};

export function LangToggle({ className }: Props) {
  const { lang, setLang, t } = useI18n();

  const toggle = (next: Lang) => {
    if (next !== lang) setLang(next);
  };

  const aria = t('lang.switchTo') as string;

  return (
    <div
      role="group"
      aria-label={t('theme.label') === 'Theme' ? 'Language' : 'Idioma'}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-wine/15 bg-cream/70 p-0.5 font-mono text-[11px] uppercase tracking-[0.18em]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => toggle('es')}
        aria-pressed={lang === 'es'}
        aria-label={aria}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          lang === 'es' ? 'bg-wine text-cream' : 'text-wine hover:bg-wine/10',
        )}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => toggle('en')}
        aria-pressed={lang === 'en'}
        aria-label={aria}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          lang === 'en' ? 'bg-wine text-cream' : 'text-wine hover:bg-wine/10',
        )}
      >
        EN
      </button>
    </div>
  );
}
