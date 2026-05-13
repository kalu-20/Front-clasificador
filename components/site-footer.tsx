'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { EcoLogo } from '@/components/ui/eco-logo';

const LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Sobre nosotros', href: '/sobre' },
  { label: 'Clasificar', href: '/clasificar' },
];

const SOCIAL = ['Instagram', 'TikTok', 'Facebook', 'GitHub'];

export function SiteFooter() {
  return (
    <footer className="relative mt-28 overflow-hidden card-deep">
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="container-app relative grid grid-cols-1 gap-12 py-20 md:grid-cols-12"
      >
        <motion.div variants={fadeUp} className="md:col-span-5">
          <div className="flex items-center gap-3">
            <EcoLogo size={48} ringed />
            <span className="font-display text-lg font-semibold tracking-tight text-cream">
              EcoClasificador
            </span>
          </div>
          <p className="mt-5 max-w-sm text-balance text-[15px] leading-relaxed text-cream/75">
            Inteligencia artificial al servicio del reciclaje. Separar hoy,
            preservar mañana.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="md:col-span-3">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
            Navegación
          </h4>
          <ul className="mt-5 space-y-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-[15px] text-cream/85 transition-colors hover:text-cream"
                >
                  <span className="h-[1px] w-3 bg-cream/30 transition-all duration-300 group-hover:w-6 group-hover:bg-cream" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="md:col-span-2">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
            Contacto
          </h4>
          <a
            href="mailto:hola@ecoclasificador.es"
            className="mt-5 block text-[15px] text-cream/85 transition-colors hover:text-cream"
          >
            hola@ecoclasificador.es
          </a>
          <p className="mt-2 text-[13px] text-cream/55">UPATecO Salta · 2026</p>
        </motion.div>

        <motion.div variants={fadeUp} className="md:col-span-2">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
            Redes
          </h4>
          <ul className="mt-5 space-y-3">
            {SOCIAL.map((s) => (
              <li key={s}>
                <span className="text-[15px] text-cream/85 transition-colors hover:text-cream">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <div className="container-app relative">
        <div className="h-px w-full bg-cream/15" />
        <div className="flex flex-col items-start justify-between gap-3 py-7 sm:flex-row sm:items-center">
          <p className="text-[12px] tracking-wide text-cream/60">
            © 2026 EcoClasificador · Todos los derechos reservados
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
            v1.0 · made with care
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-10 flex select-none items-end justify-center overflow-hidden"
      >
        <span className="font-display text-[clamp(8rem,18vw,18rem)] font-bold leading-none tracking-[-0.06em] text-cream/[0.04]">
          ECO
        </span>
      </div>
    </footer>
  );
}
