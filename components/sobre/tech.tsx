'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { fadeUp, staggerContainer } from '@/lib/motion';

const SPECS = [
  { k: 'Arquitectura', v: 'ResNet50 + cabeza fine-tuned' },
  { k: 'Estrategia',   v: 'Transfer Learning' },
  { k: 'Runtime',      v: 'ONNX · CPU edge' },
  { k: 'Dataset',      v: 'RealWaste · UCI ML Repo' },
  { k: 'Categorías',   v: '9 clases de residuo' },
  { k: 'API',          v: 'FastAPI · REST · multipart' },
];

export function Tech() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel number="03">Tecnología</SectionLabel>
            <div className="mt-6">
              <SplitText
                text="Visión computacional"
                as="h2"
                splitBy="word"
                className="block font-display text-display-md font-bold tracking-tight text-wine"
              />
              <SplitText
                text="entrenada con datos abiertos."
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
              El motor es una red neuronal convolucional ResNet50 fine-tuned
              sobre RealWaste (UCI). La API REST recibe la imagen y devuelve la
              clase + distribución de probabilidades.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-8 rounded-2xl border border-wine/15 bg-cream/60 p-5 text-[13px] leading-relaxed text-ink-dim"
            >
              <strong className="font-semibold text-ink">Referencia: </strong>
              Single, S., Iranmanesh, S., &amp; Raad, R. (2023). RealWaste
              [Dataset]. UCI Machine Learning Repository.{' '}
              <a
                href="https://doi.org/10.24432/C5SS4G"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-wine underline-offset-4 hover:underline"
              >
                doi.org/10.24432/C5SS4G
              </a>
            </motion.div>
          </div>

          <motion.dl
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7"
          >
            {SPECS.map((s) => (
              <motion.div
                key={s.k}
                variants={fadeUp}
                className="card-paper rounded-2xl p-6"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                  {s.k}
                </dt>
                <dd className="mt-3 font-display text-xl font-bold tracking-tight text-wine">
                  {s.v}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
