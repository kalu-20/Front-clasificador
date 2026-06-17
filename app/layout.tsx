import type { Metadata, Viewport } from 'next';
import { Alice } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { LoadingScreen } from '@/components/loading-screen';
import { ScrollProgress } from '@/components/scroll-progress';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ConfigProvider } from '@/lib/config/ConfigProvider';
import { SkipLink } from '@/components/ui/SkipLink';
import { MotionConfigProvider } from '@/components/providers/motion-config';

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

// Script inline ejecutado ANTES de la hidratación: aplica data-theme leyendo
// localStorage / prefers-color-scheme para evitar flash de tema incorrecto.
const themeBootstrapScript = `
(function(){try{
  var s=localStorage.getItem('theme');
  var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',t);
  document.documentElement.style.colorScheme=t;
  var l=localStorage.getItem('lang');
  if(l==='en'||l==='es'){document.documentElement.lang=l;}
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={alice.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="font-sans">
        <I18nProvider>
          <ThemeProvider>
            <ConfigProvider>
              <MotionConfigProvider>
                <SkipLink />
                <LoadingScreen />
                <ScrollProgress />
                <SmoothScroll>
                  <SiteHeader />
                  <main id="main" tabIndex={-1} className="relative">
                    {children}
                  </main>
                  <SiteFooter />
                </SmoothScroll>
              </MotionConfigProvider>
            </ConfigProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
