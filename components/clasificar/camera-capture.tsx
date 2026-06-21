'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useCamera, type CameraErrorKind } from '@/hooks/use-camera';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { cn } from '@/lib/cn';

type Props = {
  /** Se invoca con la foto tomada (cámara en vivo o cámara del sistema). */
  onCapture: (file: File, previewUrl: string) => void;
};

const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-olive px-5 py-2.5 text-[14px] font-semibold text-cream shadow-soft transition-transform duration-200 hover:-translate-y-[1px]';
const OUTLINE_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-wine ring-1 ring-wine/25 transition-colors hover:bg-wine/5';
// Controles sobre el video: color FIJO (glass oscuro + texto blanco), igual en
// ambos temas porque el visor siempre es oscuro.
const ICON_BTN =
  'grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white shadow-soft backdrop-blur transition-colors hover:bg-black/75';

const ERROR_KEY: Record<CameraErrorKind, string> = {
  unsupported: 'classify.camErrUnsupported',
  denied: 'classify.camErrDenied',
  notfound: 'classify.camErrNotfound',
  inuse: 'classify.camErrInuse',
  unknown: 'classify.camErrUnknown',
};

function SwitchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function CameraCapture({ onCapture }: Props) {
  const {
    videoRef,
    status,
    ready,
    errorKind,
    facingMode,
    hasMultipleCameras,
    start,
    stop,
    switchCamera,
    capture,
  } = useCamera();
  const { t } = useI18n();

  const nativeInputRef = useRef<HTMLInputElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const errorMessage = errorKind ? (t(ERROR_KEY[errorKind]) as string) : null;

  // Tomar la foto desde el stream en vivo. La cámara se libera sola al
  // desmontarse el componente cuando el panel pasa a mostrar la vista previa.
  const handleShutter = useCallback(async () => {
    if (!ready || capturing) return;
    setHint(null);
    setCapturing(true);
    const shot = await capture();
    if (!shot) {
      setCapturing(false);
      setHint(t('classify.camNotReady') as string);
      return;
    }
    onCapture(shot.file, shot.previewUrl);
  }, [ready, capturing, capture, onCapture, t]);

  // Fallback: cámara nativa del sistema (input capture) cuando getUserMedia
  // no está disponible o el usuario lo prefiere.
  const handleNativeFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onCapture(file, e.target.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onCapture],
  );

  const openNativeCamera = () => nativeInputRef.current?.click();

  const liveView = status === 'requesting' || status === 'streaming';

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-wine/20 bg-canvas/40">
      {/* Input oculto que invoca la cámara del sistema (fallback robusto). */}
      <input
        ref={nativeInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleNativeFile}
      />

      {/* Visor: fondo oscuro fijo en ambos temas, con el feed en vivo. */}
      {liveView && (
        <div className="absolute inset-0 bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={cn(
              'h-full w-full object-cover',
              facingMode === 'user' && '-scale-x-100',
            )}
          />
        </div>
      )}

      {/* Flash de captura. */}
      <AnimatePresence>
        {capturing && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-20 bg-white"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Estado inicial: superficie adaptativa (matchea el panel de subir). */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-wine/20 bg-cream text-3xl" aria-hidden="true">
              📸
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-wine">
                {t('classify.camTitle') as string}
              </p>
              <p className="mt-1.5 text-[13px] text-ink-dim">
                {t('classify.camHint') as string}
              </p>
            </div>
            <button type="button" onClick={() => start('environment')} className={PRIMARY_BTN}>
              🎥 {t('classify.camEnable') as string}
            </button>
            <button
              type="button"
              onClick={openNativeCamera}
              className="text-[12px] font-semibold text-ink-dim underline-offset-4 transition-colors hover:text-wine hover:underline"
            >
              {t('classify.camSystem') as string}
            </button>
          </motion.div>
        )}

        {/* Pidiendo permiso / abriendo dispositivo (sobre el visor oscuro). */}
        {status === 'requesting' && (
          <motion.div
            key="requesting"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center"
          >
            <div className="flex items-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-white"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: i * 0.18,
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-white">
              {t('classify.camOpening') as string}
            </p>
            <p className="text-[12px] text-white/70">
              {t('classify.camPermission') as string}
            </p>
          </motion.div>
        )}

        {/* Transmitiendo: controles sobre el video (color fijo blanco/glass). */}
        {status === 'streaming' && (
          <motion.div
            key="streaming"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <span className="sr-only">{t('classify.camLiveReady') as string}</span>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />

            <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
                {t('classify.camLive') as string}
              </span>
              <div className="flex items-center gap-2">
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={switchCamera}
                    aria-label={t('classify.camSwitchAria') as string}
                    className={ICON_BTN}
                  >
                    <SwitchIcon />
                  </button>
                )}
                <button
                  type="button"
                  onClick={stop}
                  aria-label={t('classify.camCloseAria') as string}
                  className={ICON_BTN}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2">
              {!ready && (
                <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
                  {t('classify.camFocusing') as string}
                </span>
              )}
              <button
                type="button"
                onClick={handleShutter}
                disabled={!ready || capturing}
                aria-label={t('classify.camShutterAria') as string}
                className="group grid h-[68px] w-[68px] place-items-center rounded-full border-4 border-white bg-white/25 backdrop-blur transition-transform duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                <span className="h-12 w-12 rounded-full bg-white transition-colors group-hover:bg-olive group-disabled:bg-white/70" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Error: superficie adaptativa + reintento + fallback nativo. */}
        {status === 'error' && (
          <motion.div
            key="error"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15 text-2xl" aria-hidden="true">
              📷
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-ink-dim">
              {errorMessage}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => start('environment')} className={PRIMARY_BTN}>
                {t('classify.camRetry') as string}
              </button>
              <button type="button" onClick={openNativeCamera} className={OUTLINE_BTN}>
                {t('classify.camSystemBtn') as string}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aviso accionable cuando la captura no estaba lista. */}
      <AnimatePresence>
        {hint && (
          <motion.div
            key="hint"
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-3 top-16 z-30 rounded-xl bg-wine/95 px-3 py-2 text-center text-[12px] font-medium text-white backdrop-blur"
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
