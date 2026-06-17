'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { ColorTokenKey } from '@/lib/config/types';

/**
 * Fila para editar UN token de color: muestra label, hint accesible,
 * <input type="color"> nativo y el valor hex en mono.
 *
 * Sin dependencias externas (regla del proyecto): el picker es el nativo
 * del browser.
 */
type Props = {
  token: ColorTokenKey;
  label: string;
  hint?: string;
  value: string;
  onChange: (hex: string) => void;
  className?: string;
};

export function ColorPickerRow({
  token,
  label,
  hint,
  value,
  onChange,
  className,
}: Props) {
  const inputId = useId();
  const hintId = useId();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border border-wine/15 bg-cream/60 px-3 py-2',
        className,
      )}
    >
      <div className="min-w-0">
        <label
          htmlFor={inputId}
          className="block text-[13px] font-semibold tracking-wide text-wine"
        >
          {label}
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            --{token}
          </span>
        </label>
        {hint ? (
          <p
            id={hintId}
            className="mt-0.5 text-[11px] leading-snug text-ink-muted"
          >
            {hint}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim"
          aria-hidden="true"
        >
          {value}
        </span>
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? hintId : undefined}
          aria-label={label}
          className="h-9 w-9 cursor-pointer rounded-lg border border-wine/20 bg-transparent p-0"
        />
      </div>
    </div>
  );
}
