'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { CameraCapture } from './camera-capture';
import { UploadDropzone } from './upload-dropzone';
import { ImagePreview } from './image-preview';

type Mode = 'camera' | 'upload';

type Props = {
  onFile: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
  fileName: string | null;
  onReset: () => void;
};

/**
 * Orquesta la captura de la imagen a clasificar:
 *  - Pestaña principal "Tomar foto" (cámara en vivo).
 *  - Pestaña alternativa "Subir imagen".
 *  - Cuando ya hay imagen elegida, muestra la vista previa unificada.
 */
export function CapturePanel({ onFile, previewUrl, fileName, onReset }: Props) {
  const [mode, setMode] = useState<Mode>('camera');
  const { t } = useI18n();

  if (previewUrl) {
    return (
      <ImagePreview previewUrl={previewUrl} fileName={fileName} onReset={onReset} />
    );
  }

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-full border border-wine/15 bg-canvas/60 p-1 sm:inline-flex sm:w-auto">
        <TabButton active={mode === 'camera'} onClick={() => setMode('camera')}>
          {t('classify.camTab') as string}
        </TabButton>
        <TabButton active={mode === 'upload'} onClick={() => setMode('upload')}>
          {t('classify.uploadTab') as string}
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'camera' ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <CameraCapture onCapture={onFile} />
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <UploadDropzone onFile={onFile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex min-h-[44px] w-full items-center justify-center rounded-full px-4 py-2.5 text-center text-[13px] font-semibold transition-colors sm:w-auto',
        active ? 'bg-wine text-cream shadow-soft' : 'text-ink-dim hover:text-wine',
      )}
    >
      {children}
    </button>
  );
}
