'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';

export function Ethics() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        <div className="card-deep relative overflow-hidden rounded-[36px] px-8 py-16 sm:px-16 sm:py-20">
          <div className="relative grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="pill !border-cream/25 !bg-cream/10 !text-cream">
                <span className="font-mono text-[10px] tracking-[0.25em] text-canvas">
                  04
                </span>
                <span className="h-3 w-px bg-cream/30" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream">
                  Aviso ético
                </span>
              </div>
              <SplitText
                text="Una herramienta de apoyo."
                as="h2"
                splitBy="word"
                className="mt-6 block font-display text-display-md font-bold tracking-tight text-cream"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 text-[16px] leading-relaxed text-cream/85 lg:col-span-8"
            >
              <p>
                EcoClasificador es un proyecto educativo y experimental. Sus
                predicciones tienen un margen de error y{' '}
                <strong className="text-cream">
                  no reemplazan la normativa local de reciclaje
                </strong>{' '}
                ni la decisión de un operador profesional.
              </p>
              <p>
                Para decisiones críticas — residuos peligrosos, RAEE, materiales
                especiales — consultá siempre la regulación vigente en tu
                municipio.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { k: 'Uso',           v: 'Educativo' },
                  { k: 'Margen',        v: 'Probabilístico' },
                  { k: 'Decisión final', v: 'Humana' },
                ].map((b) => (
                  <div
                    key={b.k}
                    className="rounded-xl border border-cream/20 bg-cream/5 px-4 py-3"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55">
                      {b.k}
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-cream">{b.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
