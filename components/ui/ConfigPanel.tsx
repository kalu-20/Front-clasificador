'use client';

import { useId, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { useTheme } from '@/lib/theme/ThemeProvider';
import {
  COLOR_PRESETS,
  FONT_PRESETS,
  resolveActiveMap,
  useConfig,
} from '@/lib/config/ConfigProvider';
import type { ColorMap, ColorTokenKey } from '@/lib/config/types';
import { ColorPickerRow } from './ColorPickerRow';
import { FontPicker } from './FontPicker';
import { FaviconUploader } from './FaviconUploader';

const TOKEN_ORDER: ColorTokenKey[] = [
  'canvas',
  'cream',
  'ink',
  'wine',
  'olive',
  'magenta',
];

/**
 * Panel principal de configuración. Renderiza:
 *  1. Selector de preset de colores (presets + "custom").
 *  2. Si custom: 6 pickers por token (en el modo activo: light o dark).
 *  3. Selector de tipografía con preview.
 *  4. Uploader de favicon.
 *  5. Botones: Aplicar (no-op real, ya se aplica en vivo), Restablecer
 *     y toggle de preview opcional con muestra de botón + card + input.
 *
 * Toda la persistencia + aplicación al DOM la hace ConfigProvider; el panel
 * sólo dispara setters. Eso lo hace robusto a hot-reload y compatible con
 * `prefers-reduced-motion` (no usamos framer-motion ni animaciones largas).
 */
export function ConfigPanel({ className }: { className?: string }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const {
    state,
    setColorPreset,
    setCustomColor,
    setFontPreset,
    setFavicon,
    resetAll,
  } = useConfig();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const editMode = theme === 'dark' ? 'dark' : 'light';

  // Cuál ColorMap mostrar en los pickers. En modo custom, mostramos la
  // versión guardada; si no hay custom guardado, seedeamos con la activa.
  const customMap: ColorMap = useMemo(() => {
    if (state.custom) {
      return editMode === 'light' ? state.custom.light : state.custom.dark;
    }
    return resolveActiveMap(state, editMode);
  }, [state, editMode]);

  const handleApply = () => {
    // No-op real: ConfigProvider ya aplicó y persistió todo en vivo.
    // Mostramos un flash visual de confirmación para feedback al usuario.
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  };

  const previewId = useId();

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <header className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {t('config.kicker') as string}
        </p>
        <h1 className="text-3xl font-semibold text-wine sm:text-4xl">
          {t('config.title') as string}
        </h1>
        <p className="max-w-2xl text-[14px] leading-relaxed text-ink-dim">
          {t('config.intro') as string}
        </p>
      </header>

      {/* ---------- Sección colores ---------- */}
      <section
        aria-labelledby="config-colors-h"
        className="rounded-2xl border border-wine/10 bg-cream/60 p-5 sm:p-6"
      >
        <h2
          id="config-colors-h"
          className="text-lg font-semibold text-wine"
        >
          {t('config.sections.colors') as string}
        </h2>
        <p className="mt-1 text-[13px] text-ink-dim">
          {t('config.colorsHint') as string}
        </p>

        <div
          className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          role="radiogroup"
          aria-label={t('config.sections.colors') as string}
        >
          {COLOR_PRESETS.map((p) => {
            const active = p.id === state.colorPresetId;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setColorPreset(p.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                  active
                    ? 'border-wine bg-wine/10'
                    : 'border-wine/15 bg-cream hover:bg-cream/80',
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-wine/15"
                >
                  <span style={{ background: p.light.wine, width: '33%' }} />
                  <span style={{ background: p.light.canvas, width: '34%' }} />
                  <span style={{ background: p.light.olive, width: '33%' }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-wine">
                    {t(p.i18nKey) as string}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    {p.id}
                  </span>
                </span>
              </button>
            );
          })}

          {/* Tarjeta para entrar en modo custom */}
          <button
            type="button"
            role="radio"
            aria-checked={state.colorPresetId === 'custom'}
            onClick={() => setColorPreset('custom')}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
              state.colorPresetId === 'custom'
                ? 'border-wine bg-wine/10'
                : 'border-dashed border-wine/30 bg-cream hover:bg-cream/80',
            )}
          >
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-wine/30 text-wine"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-wine">
                {t('config.colorPresets.custom') as string}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                custom
              </span>
            </span>
          </button>
        </div>

        {state.colorPresetId === 'custom' ? (
          <div className="mt-5 grid gap-2">
            <p className="text-[12px] text-ink-dim">
              {(t('config.customEditingMode') as string).replace(
                '{mode}',
                editMode === 'dark'
                  ? (t('config.modes.dark') as string)
                  : (t('config.modes.light') as string),
              )}
            </p>
            {TOKEN_ORDER.map((token) => (
              <ColorPickerRow
                key={token}
                token={token}
                label={t(`config.tokens.${token}`) as string}
                hint={t(`config.tokenHints.${token}`) as string}
                value={customMap[token]}
                onChange={(hex) => setCustomColor(token, hex, editMode)}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* ---------- Sección tipografía ---------- */}
      <section
        aria-labelledby="config-font-h"
        className="rounded-2xl border border-wine/10 bg-cream/60 p-5 sm:p-6"
      >
        <h2 id="config-font-h" className="text-lg font-semibold text-wine">
          {t('config.sections.font') as string}
        </h2>
        <p className="mt-1 text-[13px] text-ink-dim">
          {t('config.fontHint') as string}
        </p>
        <div className="mt-4">
          <FontPicker
            presets={FONT_PRESETS}
            value={state.fontPresetId}
            onChange={setFontPreset}
            label={t('config.sections.font') as string}
            resolveLabel={(k) => t(k) as string}
          />
        </div>
      </section>

      {/* ---------- Sección favicon ---------- */}
      <section
        aria-labelledby="config-favicon-h"
        className="rounded-2xl border border-wine/10 bg-cream/60 p-5 sm:p-6"
      >
        <h2 id="config-favicon-h" className="text-lg font-semibold text-wine">
          {t('config.sections.favicon') as string}
        </h2>
        <p className="mt-1 text-[13px] text-ink-dim">
          {t('config.faviconHint') as string}
        </p>
        <div className="mt-4">
          <FaviconUploader
            currentDataUrl={state.faviconDataUrl}
            onChange={setFavicon}
          />
        </div>
      </section>

      {/* ---------- Preview opcional ---------- */}
      <section
        aria-labelledby="config-preview-h"
        className="rounded-2xl border border-wine/10 bg-cream/60 p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="config-preview-h"
            className="text-lg font-semibold text-wine"
          >
            {t('config.sections.preview') as string}
          </h2>
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            aria-expanded={previewOpen}
            aria-controls={previewId}
            className="rounded-xl border border-wine/20 bg-cream px-3 py-1.5 text-[12px] font-semibold text-wine transition-colors hover:bg-cream/80"
          >
            {previewOpen
              ? (t('config.previewHide') as string)
              : (t('config.previewShow') as string)}
          </button>
        </div>
        {previewOpen ? (
          <div id={previewId} className="mt-4">
            <PreviewSample />
          </div>
        ) : null}
      </section>

      {/* ---------- Acciones ---------- */}
      <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-wine/15 bg-cream/90 p-3 backdrop-blur sm:p-4">
        <button
          type="button"
          onClick={handleApply}
          className="rounded-xl bg-wine px-4 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-wine/90"
        >
          {t('config.actions.apply') as string}
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window !== 'undefined' &&
              !window.confirm(t('config.actions.resetConfirm') as string)
            ) {
              return;
            }
            resetAll();
          }}
          className="rounded-xl border border-wine/30 bg-cream px-4 py-2 text-[13px] font-semibold text-wine transition-colors hover:bg-cream/80"
        >
          {t('config.actions.reset') as string}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={cn(
            'text-[12px] text-olive transition-opacity duration-150 motion-reduce:transition-none',
            savedFlash ? 'opacity-100' : 'opacity-0',
          )}
        >
          {t('config.actions.savedMessage') as string}
        </p>
      </div>

    </div>
  );
}

/* ---------- Preview sample (botón + card + input) -------------------- */

function PreviewSample() {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-wine p-4 text-cream">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-80">
          {t('config.preview.button') as string}
        </p>
        <button
          type="button"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-cream px-3 py-2 text-[13px] font-semibold text-wine"
        >
          {t('common.tryIt') as string}
        </button>
      </div>
      <div className="card-paper rounded-2xl p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          {t('config.preview.card') as string}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-wine">
          {t('config.preview.cardTitle') as string}
        </h3>
        <p className="text-[13px] text-ink-dim">
          {t('config.preview.cardBody') as string}
        </p>
      </div>
      <div className="rounded-2xl border border-wine/15 bg-cream p-4">
        <label
          htmlFor="config-preview-input"
          className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted"
        >
          {t('config.preview.input') as string}
        </label>
        <input
          id="config-preview-input"
          type="text"
          placeholder={t('config.preview.placeholder') as string}
          className="mt-2 w-full rounded-xl border border-wine/20 bg-canvas/40 px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted focus:outline-none"
        />
      </div>
    </div>
  );
}
