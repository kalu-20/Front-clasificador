'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';
import {
  fileToDataUrl,
  validateFaviconFile,
} from '@/lib/config/utils';
import type { FaviconValidationResult } from '@/lib/config/types';

type Props = {
  currentDataUrl: string | null;
  onChange: (dataUrl: string | null) => void;
  className?: string;
};

/**
 * Uploader de favicon con preview, validación y feedback i18n.
 *
 * Acepta image/png y image/svg+xml. Máx 1 MB. Recomienda 512x512 (warning).
 * Persistencia: vía ConfigProvider → localStorage como Data URL.
 */
export function FaviconUploader({
  currentDataUrl,
  onChange,
  className,
}: Props) {
  const { t } = useI18n();
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [result, setResult] = useState<FaviconValidationResult | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setBusy(true);
      try {
        const validation = await validateFaviconFile(file);
        setResult(validation);
        if (!validation.ok) return;
        const dataUrl = await fileToDataUrl(file);
        onChange(dataUrl);
      } catch {
        setResult({ ok: false, errorKey: 'config.favicon.errors.read' });
      } finally {
        setBusy(false);
      }
    },
    [onChange],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    void handleFile(e.target.files?.[0]);
  };

  const onClear = () => {
    setResult(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const hasFavicon = Boolean(currentDataUrl);

  const message = (() => {
    if (busy) return t('common.loading') as string;
    if (!result) return null;
    if (!result.ok && result.errorKey) {
      return t(result.errorKey) as string;
    }
    if (result.ok && result.warningKey) {
      const base = t(result.warningKey) as string;
      if (result.width && result.height) {
        return `${base} (${result.width}×${result.height})`;
      }
      return base;
    }
    if (result.ok) return t('config.favicon.success') as string;
    return null;
  })();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-wine/15 bg-cream"
        >
          {hasFavicon ? (
            <img
              src={currentDataUrl ?? undefined}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              {t('config.favicon.empty') as string}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={inputId}
            className={cn(
              'inline-flex cursor-pointer items-center justify-center rounded-xl border border-wine bg-wine px-3.5 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-wine/90',
              busy && 'opacity-60',
            )}
          >
            {t('config.favicon.choose') as string}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/png,image/svg+xml"
            onChange={onInputChange}
            aria-describedby={statusId}
            className="sr-only"
          />
          {hasFavicon ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-wine/30 bg-cream/60 px-3.5 py-2 text-[13px] font-semibold text-wine transition-colors hover:bg-cream"
            >
              {t('config.favicon.clear') as string}
            </button>
          ) : null}
        </div>
      </div>

      <p id={statusId} className="text-[12px] leading-snug text-ink-dim" role="status">
        {message ?? (t('config.favicon.hint') as string)}
      </p>
    </div>
  );
}
