'use client';

import { Marquee } from '@/components/ui/marquee';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function MarqueeBand() {
  const { t } = useI18n();
  const top = t('marquee.top') as string[];
  const bottom = t('marquee.bottom') as string[];

  return (
    <section className="relative isolate py-14">
      <Marquee items={top} speed={45} />
      <Marquee items={bottom} speed={55} reverse className="mt-1" />
    </section>
  );
}
