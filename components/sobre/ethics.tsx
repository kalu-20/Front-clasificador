'use client';

import { motion } from 'framer-motion';
import { SplitText } from '@/components/ui/split-text';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function Ethics() {
  const { t, lang } = useI18n();
  const chips = (t('about.ethicsChips') as Array<{ k: string; v: string }>) || [];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="card-deep relative overflow-hidden rounded-[36px] px-8 py-16 sm:px-16 sm:py-20">
          <div className="relative grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="pill !border-cream/25 !bg-cream/10 !text-cream">
                <span className="font-mono text-[10px] tracking-[0.25em] text-canvas">
                  04
                </span>
                <span className="h-3 w-px bg-cream/30" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream">
                  {t('about.ethicsLabel') as string}
                </span>
              </div>
              <SplitText
                key={`et-${lang}`}
                text={t('about.ethicsTitle') as string}
                as="h2"
                splitBy="word"
                className="mt-6 block font-display text-display-md font-bold tracking-tight text-cream"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 text-[16px] leading-relaxed text-cream/85 lg:col-span-8"
            >
              <p>
                {t('about.ethicsBody1Part1') as string}
                <strong className="text-cream">
                  {t('about.ethicsBody1Strong') as string}
                </strong>
                {t('about.ethicsBody1Part2') as string}
              </p>
              <p>
                {t('about.ethicsBody2') as string}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {chips.map((b) => (
                  <div
                    key={b.k}
                    className="rounded-xl border border-cream/20 bg-cream/5 px-4 py-3"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55">
                      {b.k}
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-cream">{b.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
