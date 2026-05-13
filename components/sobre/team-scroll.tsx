'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import { TEAM } from '@/lib/data';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';

const TAG_STYLES: Record<
  'Frontend' | 'Backend',
  { gradient: string; avatarBg: string; chipBg: string; chipText: string }
> = {
  Frontend: {
    gradient: 'linear-gradient(135deg, #FBE9F3 0%, #F4C0DC 55%, #D45991 100%)',
    avatarBg: '#7C1155',
    chipBg: '#7C1155',
    chipText: '#FFF6C2',
  },
  Backend: {
    gradient: 'linear-gradient(135deg, #F2FBD9 0%, #C8EE6E 55%, #8AC81F 100%)',
    avatarBg: '#447A00',
    chipBg: '#447A00',
    chipText: '#FFF6C2',
  },
};

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
  tag: 'Frontend' | 'Backend';
  index: number;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  const style = TAG_STYLES[tag];

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
        style={{ background: style.gradient }}
      />

      <div className="relative flex h-full flex-col justify-between p-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/70">
            {String(index + 1).padStart(2, '0')} / {String(TEAM.length).padStart(2, '0')}
          </span>
          <span
            className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ backgroundColor: style.chipBg, color: style.chipText }}
          >
            {tag}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="grid h-36 w-36 place-items-center rounded-full text-5xl font-bold text-cream shadow-glow"
            style={{ backgroundColor: style.avatarBg }}
          >
            {initials}
          </div>
        </div>

        <div>
          <h3 className="font-display text-[clamp(1.25rem,2vw,1.65rem)] font-bold tracking-tight text-wine">
            {name}
          </h3>
          <p className="mt-2 text-[14px] text-ink-dim">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
