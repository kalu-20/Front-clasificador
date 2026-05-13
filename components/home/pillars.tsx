'use client';

import { motion } from 'framer-motion';
import { PILLARS } from '@/lib/data';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';

export function Pillars() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel number="04">Nuestro enfoque</SectionLabel>
            <div className="mt-6">
              <SplitText
                text="Tecnología útil,"
                as="h2"
                splitBy="word"
                className="block font-display text-display-md font-bold tracking-tight text-wine"
              />
              <SplitText
                text="con un propósito claro."
                as="span"
                splitBy="word"
                delay={0.2}
                className="block font-display text-display-md font-bold tracking-tight text-olive"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.title} index={i} {...p} />
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
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-wine/10 bg-canvas text-2xl">
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
