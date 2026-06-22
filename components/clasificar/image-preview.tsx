'use client';

import { motion } from 'framer-motion';

import { useI18n } from '@/lib/i18n/I18nProvider';

type Props = {
  previewUrl: string;
  fileName: string | null;
  onReset: () => void;
};

/**
 * Vista previa unificada de la imagen lista para clasificar, sin importar
 * si vino de la cámara o de un archivo subido.
 */
export function ImagePreview({ previewUrl, fileName, onReset }: Props) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-olive/40 bg-black shadow-glow"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt={t('classify.previewAlt') as string}
        className="h-full w-full object-contain"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" aria-hidden="true" />

      <div className="absolute left-3 right-3 top-3 flex flex-wrap items-start justify-between gap-2">
        <span className="inline-flex min-h-[28px] shrink-0 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf-600" aria-hidden="true" />
          {t('classify.previewReady') as string}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-white/70 bg-wine px-4 text-[12px] font-semibold text-cream transition-colors hover:bg-wine/90"
        >
          {t('classify.changeImage') as string}
        </button>
      </div>

      {fileName && (
        <div className="absolute bottom-3 left-3 right-3 truncate rounded-xl bg-black/55 px-3 py-2 text-[12px] text-white backdrop-blur">
          {fileName}
        </div>
      )}
    </motion.div>
  );
}
