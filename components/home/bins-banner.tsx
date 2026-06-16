'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { useI18n } from '@/lib/i18n/I18nProvider';

const BIN_DEFS = [
  { color: '#2563EB', labelKey: 'bins.items.paper',   subKey: 'bins.items.paperSub'   },
  { color: '#16A34A', labelKey: 'bins.items.glass',   subKey: 'bins.items.glassSub'   },
  { color: '#F59E0B', labelKey: 'bins.items.plastic', subKey: 'bins.items.plasticSub' },
  { color: '#DC2626', labelKey: 'bins.items.ewaste',  subKey: 'bins.items.ewasteSub'  },
  { color: '#EAB308', labelKey: 'bins.items.metal',   subKey: 'bins.items.metalSub'   },
  { color: '#6B7280', labelKey: 'bins.items.organic', subKey: 'bins.items.organicSub' },
];

export function BinsBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const { t, lang } = useI18n();

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel number="✦">{t('bins.label') as string}</SectionLabel>
            <div className="mt-6">
              <SplitText
                key={`b1-${lang}`}
                text={t('bins.title1') as string}
                as="h2"
                splitBy="word"
                className="block font-display text-display-md font-bold tracking-tight text-wine"
              />
              <SplitText
                key={`b2-${lang}`}
                text={t('bins.title2') as string}
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
              className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-dim"
            >
              {t('bins.intro') as string}
            </motion.p>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
              }}
              className="mt-8 grid grid-cols-2 gap-3"
            >
              {BIN_DEFS.map((b) => (
                <motion.li
                  key={b.labelKey}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 rounded-xl border border-wine/10 bg-cream/60 px-3 py-2"
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                    style={{ backgroundColor: b.color }}
                    aria-hidden="true"
                  >
                    <span className="text-[14px] text-white">♻</span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-wine">
                      {t(b.labelKey) as string}
                    </p>
                    <p className="text-[11px] text-ink-muted">{t(b.subKey) as string}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            style={{ y }}
            className="relative lg:col-span-7"
          >
            <div className="relative aspect-[16/5] w-full overflow-hidden rounded-3xl card-paper p-3 sm:p-5">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(255,246,194,0.8), transparent 70%)',
                }}
              />
              <Image
                src="/canecas.png"
                alt={t('bins.imageAlt') as string}
                width={1600}
                height={500}
                className="h-full w-full object-contain"
                sizes="(min-width: 1024px) 700px, 100vw"
              />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              <span>{t('bins.footerLeft') as string}</span>
              <span>{t('bins.footerRight') as string}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
