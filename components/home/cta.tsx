'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { SplitText } from '@/components/ui/split-text';
import { EcoLogo } from '@/components/ui/eco-logo';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function CTA() {
  const { t, lang } = useI18n();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="card-deep relative overflow-hidden rounded-[36px] px-8 py-16 sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(255,246,194,0.18), transparent 70%)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(68,122,0,0.30), transparent 70%)' }}
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cream" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/85">
                  {t('cta.pill') as string}
                </span>
              </div>

              <SplitText
                key={`cta1-${lang}`}
                text={t('cta.title1') as string}
                as="h2"
                splitBy="word"
                className="mt-6 block font-display text-display-lg font-bold tracking-tight text-cream"
              />
              <SplitText
                key={`cta2-${lang}`}
                text={t('cta.title2') as string}
                as="span"
                splitBy="word"
                delay={0.2}
                className="block font-display text-display-lg font-bold tracking-tight text-canvas"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-xl text-[17px] leading-relaxed text-cream/80"
              >
                {t('cta.intro') as string}
              </motion.p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <MagneticButton href="/clasificar" variant="secondary">
                  {t('cta.primary') as string}
                  <Arrow />
                </MagneticButton>
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-5 py-3 text-[14px] font-semibold text-cream transition-colors hover:bg-cream/10"
                >
                  {t('cta.secondary') as string}
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-4"
            >
              <div className="relative aspect-square w-full max-w-[340px]">
                <div className="absolute inset-0 rounded-3xl border border-cream/15 bg-cream/5" />
                <div className="absolute inset-0 grid place-items-center">
                  <EcoLogo size={180} className="drop-shadow-[0_18px_40px_rgba(0,0,0,0.4)]" />
                </div>

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55" aria-hidden="true">
                  <span>· ecoclasificador</span>
                  <span>v1.0</span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55" aria-hidden="true">
                  <span>ready</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-canvas" />
                    online
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
