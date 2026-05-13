'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '@/components/ui/section-label';

const BLOCKS = [
  {
    title: 'El primer paso',
    copy: 'La correcta separación en origen es el primer paso para que un residuo pueda volver al ciclo productivo en lugar de terminar en un vertedero.',
  },
  {
    title: 'Tecnología útil',
    copy: 'Reducir el impacto ambiental de los residuos urbanos ofreciendo una guía visual y automática, accesible desde cualquier dispositivo.',
  },
  {
    title: 'Aprendizaje abierto',
    copy: 'Código y datos abiertos. Pensado para que estudiantes, docentes y municipios puedan replicarlo y mejorarlo.',
  },
];

export function MissionSticky() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const trackScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative">
      <div className="container-app grid grid-cols-1 gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel number="01">Misión</SectionLabel>
            <h2 className="mt-6 font-display text-display-md font-bold tracking-tight text-wine">
              Reducir el impacto, una foto a la vez.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-ink-dim">
              Nuestra misión es bajar la fricción de hacer las cosas bien. No
              hace falta un curso ni una app pesada: un navegador, una foto, una
              respuesta clara.
            </p>

            <div className="mt-10 hidden h-1 w-32 overflow-hidden rounded-full bg-wine/10 lg:block">
              <motion.span
                style={{ scaleX: trackScale, transformOrigin: 'left' }}
                className="block h-full origin-left bg-olive"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-8">
            {BLOCKS.map((b, i) => (
              <Block key={b.title} index={i} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Block({ title, copy, index }: { title: string; copy: string; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="card-paper relative overflow-hidden rounded-3xl p-7 sm:p-9"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-wine/15" />
      </div>
      <h3 className="mt-5 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-wine">
        {title}
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-dim">{copy}</p>
    </motion.article>
  );
}
