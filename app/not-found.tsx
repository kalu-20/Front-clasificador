import Link from 'next/link';
import type { Metadata } from 'next';
import { EcoLogo } from '@/components/ui/eco-logo';

export const metadata: Metadata = {
  title: 'Página no encontrada',
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center px-6 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-paper opacity-60"
      />
      <div className="text-center">
        <EcoLogo size={88} />
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-olive">
          404 · página no encontrada
        </p>
        <h1 className="mt-4 font-display text-display-lg font-bold tracking-tight text-wine">
          Acá no hay nada
          <br />
          que reciclar.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-ink-dim">
          La URL que buscás no existe o se mudó. Volvé al inicio o probá el
          clasificador.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-wine px-5 py-3 text-[14px] font-semibold text-cream shadow-soft transition-transform hover:-translate-y-[1px]"
          >
            Volver al inicio
          </Link>
          <Link
            href="/clasificar"
            className="inline-flex items-center gap-2 rounded-xl border border-wine/25 px-5 py-3 text-[14px] font-semibold text-wine transition-colors hover:bg-wine/5"
          >
            Probar el clasificador
          </Link>
        </div>
      </div>
    </section>
  );
}
