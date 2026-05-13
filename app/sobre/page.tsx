import type { Metadata } from 'next';
import { Intro } from '@/components/sobre/intro';
import { MissionSticky } from '@/components/sobre/mission-sticky';
import { TeamScroll } from '@/components/sobre/team-scroll';
import { Tech } from '@/components/sobre/tech';
import { Ethics } from '@/components/sobre/ethics';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Conocé el equipo y la tecnología detrás de EcoClasificador: ResNet50 + RealWaste, una herramienta educativa para reciclar mejor.',
};

export default function SobrePage() {
  return (
    <>
      <Intro />
      <MissionSticky />
      <TeamScroll />
      <Tech />
      <Ethics />
    </>
  );
}
