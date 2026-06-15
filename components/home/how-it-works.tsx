'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const { t, lang } = useI18n();

  const steps = [
    { id: '01', title: t('how.step1Title') as string, description: t('how.step1Desc') as string },
    { id: '02', title: t('how.step2Title') as string, description: t('how.step2Desc') as string },
    { id: '03', title: t('how.step3Title') as string, description: t('how.step3Desc') as string },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel number="03">{t('how.label') as string}</SectionLabel>
          </div>
          <div className="mt-6">
            <SplitText
              key={`how1-${lang}`}
              text={t('how.title1') as string}
              as="h2"
              splitBy="word"
              className="block font-display text-display-md font-bold tracking-tight text-wine"
            />
            <SplitText
              key={`how2-${lang}`}
              text={t('how.title2') as string}
              as="span"
              splitBy="word"
              delay={0.2}
              className="block font-display text-display-md font-bold tracking-tight text-olive"
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-dim"
          >
            {t('how.intro') as string}
          </motion.p>
        </div>

        <div ref={ref} className="relative mt-16">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-wine/10 md:block">
            <motion.span
              style={{ scaleY: lineScale, transformOrigin: 'top' }}
              className="absolute inset-0 origin-top bg-olive"
            />
          </div>

          <div className="space-y-14 md:space-y-20">
            {steps.map((s, i) => (
              <StepRow key={s.id} index={i} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepRow({
  id,
  title,
  description,
  index,
}: {
  id: string;
  title: string;
  description: string;
  index: number;
}) {
  const { t } = useI18n();
  const isLeft = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-16"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive shadow-[0_0_22px_rgba(68,122,0,0.55)] ring-4 ring-canvas md:block" />

      <div className={cn(isLeft ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left')}>
        <div className="pill inline-flex">
          <span className="inline-block h-4 w-4 rounded-full bg-olive" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-wine">
            {t('how.stepLabel') as string} {id}
          </span>
        </div>
        <h3 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight text-wine">
          {title}
        </h3>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-dim">
          {description}
        </p>
      </div>

      <div className={cn(isLeft ? 'md:order-2' : 'md:order-1')}>
        <StepVisual id={id} />
      </div>
    </motion.div>
  );
}

function StepVisual({ id }: { id: string }) {
  if (id === '01') return <VisualCapture />;
  if (id === '02') return <VisualModel />;
  return <VisualResult />;
}

function VisualCapture() {
  return (
    <div className="card-paper relative aspect-[5/4] overflow-hidden rounded-3xl" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(68,122,0,0.18),transparent_60%)]" />
      <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-wine/20">
        <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-wine/60">
          /capture
        </div>
        <div className="absolute inset-6 grid place-items-center">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-wine text-4xl text-cream shadow-glow">
            📸
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualModel() {
  const layers = [12, 18, 24, 18, 12, 9];
  return (
    <div className="card-paper relative aspect-[5/4] overflow-hidden rounded-3xl p-7" aria-hidden="true">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/60">
        /resnet50 — fine-tuned head
      </div>
      <div className="mt-6 flex h-[calc(100%-2rem)] items-center justify-between">
        {layers.map((count, li) => (
          <div key={li} className="flex flex-col items-center gap-1.5">
            {Array.from({ length: count }).map((_, ni) => (
              <span
                key={ni}
                className="h-1.5 w-1.5 rounded-full bg-olive"
                style={{ opacity: 0.25 + ((ni + li) % 5) * 0.15 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualResult() {
  const { t } = useI18n();
  const probs = [
    { name: t('waste.plastic.name') as string, value: 92, color: '#F59E0B' },
    { name: t('waste.metal.name') as string,   value: 4,  color: '#EAB308' },
    { name: t('waste.glass.name') as string,   value: 2,  color: '#16A34A' },
    { name: t('waste.cardboard.name') as string, value: 1, color: '#3B82F6' },
  ];
  return (
    <div className="card-paper relative aspect-[5/4] overflow-hidden rounded-3xl p-7" aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/60">
          {t('how.predict') as string}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-olive">
          {t('how.ok') as string}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl">🥤</span>
        <h4 className="font-display text-2xl font-bold tracking-tight text-wine">
          {t('waste.plastic.name') as string}
        </h4>
        <span className="ml-auto font-mono text-[11px] text-ink-dim">{t('how.conf') as string}</span>
      </div>

      <div className="mt-5 space-y-3">
        {probs.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="w-20 text-[12px] text-ink-dim">{p.name}</span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-wine/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${p.value}%` }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.08 }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: p.color }}
              />
            </div>
            <span className="w-12 text-right font-mono text-[11px] text-ink-dim">
              {p.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
