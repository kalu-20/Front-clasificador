'use client';

import { useLenis } from '@/hooks/use-lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useLenis(true);
  return <>{children}</>;
}
