'use client';

import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type RefObject } from 'react';

export function useParallax(
  range: [number, number] = [-80, 80],
): { ref: RefObject<HTMLDivElement>; y: MotionValue<number> } {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], range);
  return { ref, y };
}
