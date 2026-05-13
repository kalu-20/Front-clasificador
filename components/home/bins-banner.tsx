'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';

const BINS = [
  { color: '#2563EB', label: 'Papel',    sub: 'Azul'     },
  { color: '#16A34A', label: 'Vidrio',   sub: 'Verde'    },
  { color: '#F59E0B', label: 'Plástico', sub: 'Naranja'  },
  { color: '#DC2626', label: 'E-Waste',  sub: 'Rojo'     },
  { color: '#EAB308', label: 'Metal',    sub: 'Amarillo' },
  { color: '#6B7280', label: 'Orgánico', sub: 'Gris'     },
];

export function BinsBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel number="✦">Aprendé a separar</SectionLabel>
            <div className="mt-6">
              <SplitText
                text="Cada residuo,"
                as="h2"
                splitBy="word"
                className="block font-display text-display-md font-bold tracking-tight text-wine"
              />
              <SplitText
                text="su color."
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
              El primer paso del reciclaje es saber dónde va cada cosa. El
              sistema de contenedores por color es una guía universal: una
              mirada al color y ya sabés qué residuos van adentro.
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
              {BINS.map((b) => (
                <motion.li
                  key={b.label}
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
                  >
                    <span className="text-[14px] text-white">♻</span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-wine">
                      {b.label}
                    </p>
                    <p className="text-[11px] text-ink-muted">{b.sub}</p>
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
                alt="Contenedores de reciclaje: papel, vidrio, plástico, e-waste, metal y orgánico"
                width={1600}
                height={500}
                className="h-full w-full object-contain"
                sizes="(min-width: 1024px) 700px, 100vw"
              />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              <span>· guía universal de contenedores</span>
              <span>6 colores · 9 categorías</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
