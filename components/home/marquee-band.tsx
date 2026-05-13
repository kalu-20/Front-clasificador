'use client';

import { Marquee } from '@/components/ui/marquee';

const TOP = [
  'Reciclá mejor',
  'IA accesible',
  'Educación abierta',
  'Visión computacional',
  'RealWaste · UCI',
  'ResNet50',
  'FastAPI',
  'Open data',
];

const BOTTOM = [
  '9 categorías',
  'Predicción en <1s',
  'Sin instalación',
  'Hecho en Salta',
  'UPATecO 2026',
  'Top-1 94%',
];

export function MarqueeBand() {
  return (
    <section className="relative isolate py-14">
      <Marquee items={TOP} speed={45} />
      <Marquee items={BOTTOM} speed={55} reverse className="mt-1" />
    </section>
  );
}
