import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { LoadingScreen } from '@/components/loading-screen';
import { ScrollProgress } from '@/components/scroll-progress';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: {
    default: 'EcoClasificador · Visión computacional para reciclar mejor',
    template: '%s · EcoClasificador',
  },
  description:
    'Plataforma de clasificación de residuos con IA. Subí una foto y un modelo ResNet50 entrenado sobre RealWaste te dice a qué contenedor pertenece.',
  keywords: [
    'reciclaje',
    'clasificación de residuos',
    'IA',
    'ResNet50',
    'RealWaste',
    'sustentabilidad',
    'computer vision',
  ],
  authors: [{ name: 'EcoClasificador' }],
  openGraph: {
    title: 'EcoClasificador',
    description:
      'Reciclá mejor con IA. Subí una foto y obtené la categoría correcta al instante.',
    type: 'website',
    locale: 'es_AR',
  },
  icons: {
    icon: [
      { url: '/logo-eco.png', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo-eco.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FCF291',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="font-sans">
        <LoadingScreen />
        <ScrollProgress />
        <SmoothScroll>
          <SiteHeader />
          <main id="main" className="relative">
            {children}
          </main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
