'use client';

import { useCallback, useRef } from 'react';

type Options = {
  max?: number;
  scale?: number;
  perspective?: number;
};

export function useMouseTilt<T extends HTMLElement>({
  max = 8,
  scale = 1.02,
  perspective = 900,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const frame = useRef<number | null>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -2 * max;
      const ry = (px - 0.5) * 2 * max;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      });
    },
    [max, scale, perspective],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }, [perspective]);

  return { ref, onMove, onLeave };
}
