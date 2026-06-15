'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function MissionSticky() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const trackScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { t } = useI18n();
  const blocks = (t('about.blocks') as Array<{ title: string; copy: string }>) || [];

  return (
    <section ref={ref} className="relative">
      <div className="container-app grid grid-cols-1 gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel number="01">{t('about.missionLabel') as string}</SectionLabel>
            <h2 className="mt-6 font-display text-display-md font-bold tracking-tight text-wine">
              {t('about.missionTitle') as string}
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-dim">
              {t('about.missionBody') as string}
            </p>

            <div className="mt-10 hidden h-1 w-32 overflow-hidden rounded-full bg-wine/10 lg:block">
              <motion.span
                style={{ scaleX: trackScale, transformOrigin: 'left' }}
                className="block h-full origin-left bg-olive"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-8">
            {blocks.map((b, i) => (
              <Block key={b.title} index={i} title={b.title} copy={b.copy} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Block({ title, copy, index }: { title: string; copy: string; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="card-paper relative overflow-hidden rounded-3xl p-7 sm:p-9"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-wine/15" />
      </div>
      <h3 className="mt-5 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-wine">
        {title}
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-dim">{copy}</p>
    </motion.article>
  );
}
