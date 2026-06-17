import type { Metadata } from 'next';
import { ConfigPanel } from '@/components/ui/ConfigPanel';

/**
 * Página /configuracion — punto de prueba funcional de la integración.
 *
 * Asume que `<ConfigProvider>` ya envuelve `children` en `app/layout.tsx`
 * (ver README.md, paso 2). Si no, los hooks devuelven el fallback no-op
 * y todo sigue renderizando, pero los cambios no persisten.
 */
export const metadata: Metadata = {
  title: 'Configuración',
  description:
    'Personalizá colores, tipografía y favicon del sitio. Los cambios se guardan localmente en tu navegador.',
};

export default function ConfiguracionPage() {
  return (
    <div className="container-app py-24 sm:py-32">
      <ConfigPanel />
    </div>
  );
}
