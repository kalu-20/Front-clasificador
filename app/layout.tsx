import type { Metadata, Viewport } from 'next';
import { Alice } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { LoadingScreen } from '@/components/loading-screen';
import { ScrollProgress } from '@/components/scroll-progress';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const alice = Alice({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-alice',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoClasificador · Visión computacional para reciclar mejor',
    template: '%s · EcoClasificador',
  },
  description:
    'Si hoy clasificamos y reciclamos correctamente los residuos, ayudamos a proteger el medio ambiente y conservar los recursos para el futuro.',
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
    title: 'EcoClasificador · Separar hoy, preservar mañana.',
    description:
      'Si hoy clasificamos y reciclamos correctamente los residuos, ayudamos a proteger el medio ambiente y conservar los recursos para el futuro.',
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
    <html lang="es" suppressHydrationWarning className={alice.variable}>
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
