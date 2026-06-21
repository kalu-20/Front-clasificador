'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';

type Props = {
  onFile: (file: File, previewUrl: string) => void;
};

/**
 * Área para subir una imagen por arrastrar-y-soltar o desde el explorador.
 * La vista previa la muestra el panel contenedor (ImagePreview), por eso este
 * componente sólo se ocupa de seleccionar el archivo.
 */
export function UploadDropzone({ onFile }: Props) {
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

  // Evitar que soltar un archivo fuera del dropzone navegue a la imagen.
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
        id="file-input"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-6">
        <div
          className={cn(
            'grid h-16 w-16 place-items-center rounded-2xl border-2 text-2xl transition-colors',
            dragOver ? 'border-olive bg-olive/15' : 'border-wine/20 bg-cream',
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
      </div>
    </label>
  );
}
