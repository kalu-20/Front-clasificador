'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import { WASTE_CATEGORIES } from '@/lib/data';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function Categories() {
  const { t, lang } = useI18n();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel number="02">{t('categories.label') as string}</SectionLabel>
            <SplitText
              key={`c1-${lang}`}
              text={t('categories.title1') as string}
              as="h2"
              splitBy="word"
              className="mt-6 block font-display text-display-md font-bold tracking-tight text-wine"
            />
            <SplitText
              key={`c2-${lang}`}
              text={t('categories.title2') as string}
              as="span"
              splitBy="word"
              className="block font-display text-display-md font-bold tracking-tight text-olive"
              delay={0.18}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-[15px] leading-relaxed text-ink-dim"
          >
            {t('categories.intro') as string}
          </motion.p>
        </div>
      </div>

      <div className="relative mt-12">
        <Swiper
          modules={[FreeMode, Mousewheel]}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.5 }}
          mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
          slidesPerView="auto"
          spaceBetween={20}
          grabCursor
          className="!px-5 sm:!px-12"
        >
          {WASTE_CATEGORIES.map((c, i) => {
            const name = (t(`waste.${c.id === 'food-organics' ? 'organic' : c.id}.name`) as string) || c.name;
            const bin = (t(`waste.${c.id === 'food-organics' ? 'organic' : c.id}.bin`) as string) || c.bin;
            const description = (t(`waste.${c.id === 'food-organics' ? 'organic' : c.id}.description`) as string) || c.description;
            const tip = (t(`waste.${c.id === 'food-organics' ? 'organic' : c.id}.tip`) as string) || c.tip;
            return (
              <SwiperSlide
                key={c.id}
                className="!w-[280px] sm:!w-[320px] lg:!w-[340px]"
              >
                <CategoryCard
                  index={i}
                  emoji={c.emoji}
                  name={name}
                  bin={bin}
                  binColor={c.binColor}
                  description={description}
                  tip={tip}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

type CardProps = {
  index: number;
  emoji: string;
  name: string;
  bin: string;
  binColor: string;
  description: string;
  tip: string;
};

function CategoryCard({ index, emoji, name, bin, binColor, description, tip }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: Math.min(index, 6) * 0.04 }}
      className="card-paper group relative h-[380px] overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl border border-wine/10 text-2xl"
            style={{ background: `${binColor}1A` }}
            aria-hidden="true"
          >
            <span>{emoji}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            {String(index + 1).padStart(2, '0')} / 09
          </span>
        </div>

        <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-wine">
          {name}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">
          {description}
        </p>

        <div className="mt-auto space-y-3 pt-6">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: binColor }}
              aria-hidden="true"
            />
            <span className="text-[13px] font-semibold text-ink">{bin}</span>
          </div>
          <p className="rounded-xl border border-wine/10 bg-canvas/70 px-3 py-2.5 text-[12px] leading-relaxed text-ink-dim">
            <span aria-hidden="true">💡</span> {tip}
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full opacity-30 transition-opacity duration-300 group-hover:opacity-50"
        style={{ background: `${binColor}55`, filter: 'blur(40px)' }}
      />
    </motion.div>
  );
}
