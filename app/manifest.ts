import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EcoClasificador',
    short_name: 'EcoClasif',
    description:
      'Clasificá residuos con IA. Subí una foto y el modelo te dice a qué contenedor pertenece.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FCF291',
    theme_color: '#7C1155',
    orientation: 'portrait',
    lang: 'es-AR',
    icons: [
      {
        src: '/logo-eco.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo-eco.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'utilities', 'productivity'],
  };
}
