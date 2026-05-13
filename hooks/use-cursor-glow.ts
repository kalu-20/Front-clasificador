'use client';

import { useCallback, useRef } from 'react';

export function useCursorGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const frame = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--glow-x', `${x}px`);
      el.style.setProperty('--glow-y', `${y}px`);
    });
  }, []);

  return { ref, onMove };
}
