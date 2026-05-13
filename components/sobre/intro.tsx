'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';

export function Intro() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center pt-36 pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-paper opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(900px 500px at 50% 0%, rgba(68,122,0,0.16), transparent 60%)' }}
      />

      <div className="container-app">
        <SectionLabel number="00">Sobre EcoClasificador</SectionLabel>

        <h1 className="mt-8 max-w-5xl font-display text-display-xl font-bold tracking-tight">
          <SplitText
            text="Un proyecto educativo"
            as="span"
            splitBy="word"
            className="block text-wine"
            delay={0.15}
          />
          <SplitText
            text="que une IA y ambiente."
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
          Facilitamos la separación correcta de residuos en origen con una
          herramienta accesible: una foto basta para saber a qué contenedor va.
        </motion.p>
      </div>
    </section>
  );
}
