'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { useI18n } from '@/lib/i18n/I18nProvider';

const ICONS = ['♻️', '🤖', '🎓'];

export function Pillars() {
  const { t, lang } = useI18n();
  const items = (t('pillars.items') as Array<{ title: string; copy: string }>) || [];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel number="04">{t('pillars.label') as string}</SectionLabel>
            <div className="mt-6">
              <SplitText
                key={`p1-${lang}`}
                text={t('pillars.title1') as string}
                as="h2"
                splitBy="word"
                className="block font-display text-display-md font-bold tracking-tight text-wine"
              />
              <SplitText
                key={`p2-${lang}`}
                text={t('pillars.title2') as string}
                as="span"
                splitBy="word"
                delay={0.2}
                className="block font-display text-display-md font-bold tracking-tight text-olive"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
            {items.map((p, i) => (
              <PillarCard
                key={p.title}
                index={i}
                title={p.title}
                copy={p.copy}
                icon={ICONS[i] ?? '♻️'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  title,
  copy,
  icon,
  index,
}: {
  title: string;
  copy: string;
  icon: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="card-paper group relative overflow-hidden rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-wine/10 bg-canvas text-2xl" aria-hidden="true">
          {icon}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-wine">
        {title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink-dim">{copy}</p>
    </motion.div>
  );
}
