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
      className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-olive/40 shadow-glow"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt={t('classify.previewAlt') as string}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wine/60 via-transparent to-transparent" aria-hidden="true" />

      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-olive">
          <span className="h-1.5 w-1.5 rounded-full bg-olive" aria-hidden="true" />
          {t('classify.previewReady') as string}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-cream/50 bg-wine/85 px-3 py-1 text-[11px] font-semibold text-cream transition-colors hover:bg-wine"
        >
          {t('classify.changeImage') as string}
        </button>
      </div>

      {fileName && (
        <div className="absolute bottom-4 left-4 right-4 truncate rounded-xl bg-cream/90 px-3 py-2 text-[12px] text-wine">
          {fileName}
        </div>
      )}
    </motion.div>
  );
}
