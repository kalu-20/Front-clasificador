'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';

type Props = {
  onFile: (file: File, previewUrl: string) => void;
  previewUrl?: string | null;
  fileName?: string | null;
  onReset?: () => void;
};

export function UploadDropzone({ onFile, previewUrl, fileName, onReset }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { t } = useI18n();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onFile(file, e.target.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onFile],
  );

  useEffect(() => {
    const prevent = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);

  return (
    <div className="relative">
      <label
        htmlFor="file-input"
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-canvas/40 text-center transition-colors duration-300',
          dragOver
            ? 'border-olive bg-olive/10 shadow-glow'
            : 'border-wine/20 hover:border-wine/45 hover:bg-canvas/70',
        )}
      >
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={t('classify.previewAlt') as string}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine/60 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                <span className="rounded-full bg-cream px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-wine">
                  {t('classify.preview') as string}
                </span>
                {onReset && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onReset();
                    }}
                    className="rounded-full border border-cream/50 bg-wine/85 px-3 py-1 text-[11px] font-semibold text-cream transition-colors hover:bg-wine"
                  >
                    {t('classify.changeImage') as string}
                  </button>
                )}
              </div>
              {fileName && (
                <div className="absolute bottom-4 left-4 right-4 truncate rounded-xl bg-cream/90 px-3 py-2 text-[12px] text-wine">
                  {fileName}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center justify-center gap-4 px-6"
            >
              <div
                className={cn(
                  'grid h-16 w-16 place-items-center rounded-2xl border-2 text-2xl transition-colors',
                  dragOver
                    ? 'border-olive bg-olive/15'
                    : 'border-wine/20 bg-cream',
                )}
                aria-hidden="true"
              >
                📤
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-wine">
                  {dragOver ? (t('classify.dropNow') as string) : (t('classify.dropHere') as string)}
                </p>
                <p className="mt-1.5 text-[13px] text-ink-dim">
                  {t('classify.openExplorer') as string}
                </p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                {t('classify.fileFormats') as string}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </label>
    </div>
  );
}
