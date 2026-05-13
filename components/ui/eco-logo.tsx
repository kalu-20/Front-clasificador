'use client';

import Image from 'next/image';
import { cn } from '@/lib/cn';

type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Si true, muestra el logo dentro de un círculo crema con borde — útil sobre fondos morados */
  ringed?: boolean;
};

export function EcoLogo({ size = 32, className, priority, ringed }: Props) {
  return (
    <span
      className={cn(
        'relative inline-block overflow-hidden',
        ringed
          ? 'rounded-full bg-cream p-1 ring-1 ring-wine/15'
          : 'rounded-md',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-eco.png"
        alt="EcoClasificador"
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
