'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Respeta prefers-reduced-motion a nivel global para todas las animaciones de
 * Framer Motion. Combinado con el bloque @media en globals.css y el guard en
 * useLenis(), garantiza que el usuario que pidió "reducir movimiento" reciba
 * una experiencia estática.
 */
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
