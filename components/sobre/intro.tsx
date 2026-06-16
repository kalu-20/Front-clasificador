'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function Intro() {
  const { t, lang } = useI18n();
  return (
    <section className="relative isolate flex min-h-[70svh] items-center pt-36 pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-paper opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(900px 500px at 50% 0%, rgba(68,122,0,0.16), transparent 60%)' }}
      />

      <div className="container-app">
        <SectionLabel number="00">{t('about.introLabel') as string}</SectionLabel>

        <h1 className="mt-8 max-w-5xl font-display text-display-xl font-bold tracking-tight">
          <SplitText
            key={`it1-${lang}`}
            text={t('about.introTitle1') as string}
            as="span"
            splitBy="word"
            className="block text-wine"
            delay={0.15}
          />
          <SplitText
            key={`it2-${lang}`}
            text={t('about.introTitle2') as string}
            as="span"
            splitBy="word"
            className="block text-olive"
            delay={0.4}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="mt-10 max-w-2xl text-balance text-[18px] leading-relaxed text-ink-dim sm:text-[20px]"
        >
          {t('about.introBody') as string}
        </motion.p>
      </div>
    </section>
  );
}
