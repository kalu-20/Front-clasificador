'use client';

import { motion } from 'framer-motion';
import { SplitText } from '@/components/ui/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { EcoLogo } from '@/components/ui/eco-logo';
import { STATS } from '@/lib/data';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-paper opacity-80" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[1100px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(68,122,0,0.18), transparent 70%)' }}
      />

      <div className="container-app relative grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-wine/15 bg-cream px-3.5 py-1.5 shadow-card"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-olive" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-olive" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-wine">
              ResNet50 · RealWaste · 9 categorías
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-display-xl font-bold tracking-tight">
            <SplitText
              text="Separar hoy,"
              as="span"
              splitBy="word"
              className="block text-wine"
              stagger={0.05}
              delay={0.3}
            />
            <SplitText
              text="preservar mañana."
              as="span"
              splitBy="word"
              className="block text-olive"
              stagger={0.05}
              delay={0.55}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            className="mt-7 max-w-xl text-balance text-[17px] leading-relaxed text-ink-dim sm:text-[19px]"
          >
            Si hoy clasificamos y reciclamos correctamente los residuos,
            ayudamos a proteger el medio ambiente y conservar los recursos para
            el futuro.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="/clasificar" variant="primary">
              Probá el clasificador
              <Arrow />
            </MagneticButton>
            <MagneticButton href="/sobre" variant="outline">
              Cómo funciona
            </MagneticButton>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { delayChildren: 1, staggerChildren: 0.07 } },
            }}
            className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="border-l-2 border-olive/40 pl-4"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                  {s.label}
                </dt>
                <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight text-wine">
                  {s.value}
                </dd>
                <p className="mt-1 text-[12px] text-ink-dim">{s.sub}</p>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="relative lg:col-span-5"
        >
          <HeroArt />
        </motion.div>
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <div
        aria-hidden
        className="absolute inset-[-6%] -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(68,122,0,0.28), rgba(124,17,85,0.10) 45%, transparent 70%)',
        }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[36px] card-paper">
        {/* Anillos estáticos */}
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full opacity-70"
        >
          <circle cx="200" cy="200" r="160" fill="none" stroke="#7C1155" strokeOpacity="0.12" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#447A00" strokeOpacity="0.18" strokeDasharray="2 8" />
          <circle cx="200" cy="200" r="80"  fill="none" stroke="#7C1155" strokeOpacity="0.18" />
        </svg>

        {/* Iconos en órbita (estáticos, CSS rotate único contenedor) */}
        <div className="absolute inset-0 [animation:spin_60s_linear_infinite] will-change-transform">
          {ORBIT_ICONS.map((icon, i) => {
            const angle = (i / ORBIT_ICONS.length) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * 42;
            const y = 50 + Math.sin(angle) * 42;
            return (
              <span
                key={icon}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
                className="absolute grid h-12 w-12 place-items-center rounded-2xl border border-wine/10 bg-cream text-xl shadow-card"
              >
                {icon}
              </span>
            );
          })}
        </div>

        {/* Núcleo */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -m-6 rounded-full"
              style={{ background: 'radial-gradient(closest-side, rgba(68,122,0,0.35), transparent 70%)' }}
            />
            <EcoLogo size={160} priority className="relative drop-shadow-[0_18px_40px_rgba(124,17,85,0.35)]" />
          </div>
        </div>

        {/* HUD */}
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-wine/70">
          <span>· resnet50</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-olive" />
            live
          </span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-wine/60">
          <span>9 / classes</span>
          <span>94% / acc</span>
        </div>
      </div>
    </div>
  );
}

const ORBIT_ICONS = ['📦', '🍎', '🍾', '🥫', '📄', '🥤', '👕', '🌿'];

function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
