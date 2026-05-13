'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import { TEAM } from '@/lib/data';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';

const GRADIENTS = [
  'linear-gradient(135deg, #FFF6C2 0%, #FCF291 60%, #F0D33C 100%)',
  'linear-gradient(135deg, #E1F6A8 0%, #C8EE6E 60%, #8AC81F 100%)',
  'linear-gradient(135deg, #FBE9F3 0%, #F4C0DC 60%, #D45991 100%)',
];

export function TeamScroll() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-app">
        <SectionLabel number="02">El equipo</SectionLabel>
        <div className="mt-5">
          <SplitText
            text="Personas reales detrás del modelo."
            as="h2"
            splitBy="word"
            className="block font-display text-display-md font-bold tracking-tight text-wine"
          />
        </div>
      </div>

      <div className="relative mt-12">
        <Swiper
          modules={[FreeMode, Mousewheel]}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.5 }}
          mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
          slidesPerView="auto"
          spaceBetween={24}
          grabCursor
          className="!px-5 sm:!px-12"
        >
          {TEAM.map((t, i) => (
            <SwiperSlide
              key={t.name}
              className="!w-[300px] sm:!w-[360px] lg:!w-[420px]"
            >
              <TeamCard index={i} {...t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container-app mt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          ← arrastrá · UPATecO · Salta · 2026 →
        </p>
      </div>
    </section>
  );
}

function TeamCard({
  name,
  role,
  tag,
  index,
}: {
  name: string;
  role: string;
  tag: string;
  index: number;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      className="card-paper relative h-[480px] overflow-hidden rounded-[32px]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-90"
        style={{ background: GRADIENTS[index % GRADIENTS.length] }}
      />

      <div className="relative flex h-full flex-col justify-between p-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/70">
            {String(index + 1).padStart(2, '0')} / {String(TEAM.length).padStart(2, '0')}
          </span>
          <span className="rounded-full border border-wine/25 bg-cream/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-wine">
            {tag}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div className="grid h-36 w-36 place-items-center rounded-full bg-wine text-5xl font-bold text-cream shadow-glow">
            {initials}
          </div>
        </div>

        <div>
          <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.85rem)] font-bold tracking-tight text-wine">
            {name}
          </h3>
          <p className="mt-2 text-[14px] text-ink-dim">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
