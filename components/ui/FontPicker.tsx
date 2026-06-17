'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { FontPreset } from '@/lib/config/types';

type Props = {
  presets: FontPreset[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  /** Función que recibe `i18nKey` y devuelve la etiqueta traducida. */
  resolveLabel: (i18nKey: string) => string;
  className?: string;
};

/**
 * Grid de tarjetas para seleccionar familia tipográfica. Cada tarjeta
 * renderiza un preview ("Aa") con la fuente real para que el usuario vea
 * el resultado antes de aplicar.
 */
export function FontPicker({
  presets,
  value,
  onChange,
  label,
  resolveLabel,
  className,
}: Props) {
  const groupId = useId();
  return (
    <fieldset
      className={cn('grid gap-2 sm:grid-cols-2', className)}
      aria-labelledby={groupId}
    >
      <legend id={groupId} className="sr-only">
        {label}
      </legend>
      {presets.map((p) => {
        const active = p.id === value;
        return (
          <label
            key={p.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors',
              active
                ? 'border-wine bg-wine/10'
                : 'border-wine/15 bg-cream/60 hover:bg-cream',
            )}
          >
            <input
              type="radio"
              name={groupId}
              value={p.id}
              checked={active}
              onChange={() => onChange(p.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-wine/15 bg-cream text-wine"
              style={{ fontFamily: p.display, fontSize: 20, lineHeight: 1 }}
            >
              Aa
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-wine">
                {resolveLabel(p.i18nKey)}
              </span>
              <span
                className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted"
              >
                {p.id}
              </span>
            </span>
            {active ? (
              <span
                aria-hidden="true"
                className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-wine text-cream"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l4 4 10-10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
          </label>
        );
      })}
    </fieldset>
  );
}
