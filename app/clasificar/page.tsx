import type { Metadata } from 'next';
import { ClasificarShell } from '@/components/clasificar/clasificar-shell';

export const metadata: Metadata = {
  title: 'Clasificar residuo',
  description:
    'Tomá una foto con la cámara o subí una imagen y un modelo ResNet50 te dice a qué contenedor pertenece tu residuo. 9 categorías, predicción en <1s.',
};

export default function ClasificarPage() {
  return <ClasificarShell />;
}
