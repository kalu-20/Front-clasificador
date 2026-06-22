'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook que encapsula el ciclo de vida de la cámara del dispositivo
 * (getUserMedia → stream → captura de fotograma → File JPEG).
 *
 * Responsabilidad única: gestionar el acceso a la cámara y exponer
 * acciones claras (`start`, `stop`, `switchCamera`, `capture`) sin saber
 * nada de la UI que lo consume.
 *
 * Garantías de robustez:
 *  - No filtra streams: un token de invalidación (`requestIdRef`) y la
 *    bandera de montaje detienen cualquier stream que llegue tarde tras un
 *    desmontaje, un `stop()` o un `start()` más nuevo.
 *  - Pensado para celular (no abre dos cámaras a la vez): al cambiar de
 *    cámara detiene la actual antes de pedir la otra y, si falla, vuelve a
 *    la que funcionaba.
 *
 * Requiere un contexto seguro (HTTPS o localhost); en producción tanto
 * Vercel como GitHub Pages lo cumplen.
 */

export type CameraStatus = 'idle' | 'requesting' | 'streaming' | 'error';

export type CameraErrorKind =
  | 'unsupported'
  | 'denied'
  | 'notfound'
  | 'inuse'
  | 'unknown';

export type FacingMode = 'environment' | 'user';

export type CaptureResult = {
  file: File;
  previewUrl: string;
};

function mapError(err: unknown): CameraErrorKind {
  if (err instanceof DOMException) {
    switch (err.name) {
      case 'NotAllowedError':
      case 'SecurityError':
        return 'denied';
      case 'NotFoundError':
      case 'OverconstrainedError':
        return 'notfound';
      case 'NotReadableError':
      case 'AbortError':
        return 'inuse';
      default:
        return 'unknown';
    }
  }
  return 'unknown';
}

/** Lee la cámara realmente entregada por el navegador (puede ignorar el `ideal`). */
function resolveFacingMode(stream: MediaStream, fallback: FacingMode): FacingMode {
  const actual = stream.getVideoTracks()[0]?.getSettings().facingMode;
  return actual === 'user' || actual === 'environment' ? actual : fallback;
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [ready, setReady] = useState(false);
  const [errorKind, setErrorKind] = useState<CameraErrorKind | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [cameraCount, setCameraCount] = useState(0);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setReady(false);
  }, []);

  /**
   * Enciende la cámara. `exact` pide un cambio real de lente (constraint duro)
   * y degrada a `ideal` si esa cámara no existe. Devuelve `true` si quedó
   * transmitiendo.
   */
  const start = useCallback(
    async (mode: FacingMode = 'environment', exact = false): Promise<boolean> => {
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setErrorKind('unsupported');
        setStatus('error');
        return false;
      }

      const reqId = ++requestIdRef.current;
      setStatus('requesting');
      setErrorKind(null);
      setReady(false);

      // El celular no abre dos cámaras a la vez: soltar la actual primero.
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let media: MediaStream;
      try {
        media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: exact ? { exact: mode } : { ideal: mode } },
          audio: false,
        });
      } catch (err) {
        // Si la cámara exacta no existe, reintentar con la preferencia blanda.
        if (
          exact &&
          err instanceof DOMException &&
          err.name === 'OverconstrainedError'
        ) {
          try {
            media = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: mode } },
              audio: false,
            });
          } catch (retryErr) {
            if (mountedRef.current && reqId === requestIdRef.current) {
              setErrorKind(mapError(retryErr));
              setStatus('error');
            }
            return false;
          }
        } else {
          if (mountedRef.current && reqId === requestIdRef.current) {
            setErrorKind(mapError(err));
            setStatus('error');
          }
          return false;
        }
      }

      // Petición obsoleta (desmontaje, stop() o un start() más nuevo):
      // detener el stream que acaba de llegar para no dejar la cámara encendida.
      if (!mountedRef.current || reqId !== requestIdRef.current) {
        media.getTracks().forEach((track) => track.stop());
        return false;
      }

      streamRef.current = media;
      setStream(media);
      setFacingMode(resolveFacingMode(media, mode));
      setStatus('streaming');

      // Con el permiso concedido las etiquetas son visibles: contar cámaras.
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (mountedRef.current && reqId === requestIdRef.current) {
          setCameraCount(
            devices.filter((device) => device.kind === 'videoinput').length,
          );
        }
      } catch {
        /* enumerateDevices es opcional; el botón de cambio sólo se oculta */
      }

      return true;
    },
    [],
  );

  const stop = useCallback(() => {
    requestIdRef.current++; // invalida cualquier start() en vuelo
    stopStream();
    setStatus('idle');
    setErrorKind(null);
  }, [stopStream]);

  const switchCamera = useCallback(async () => {
    const previous = facingMode;
    const next: FacingMode = previous === 'environment' ? 'user' : 'environment';
    const ok = await start(next, true);
    // Si la otra cámara falla, recuperar la que estaba funcionando.
    if (!ok && mountedRef.current) {
      await start(previous, false);
    }
  }, [facingMode, start]);

  const capture = useCallback(async (): Promise<CaptureResult | null> => {
    const video = videoRef.current;
    const vw = video?.videoWidth ?? 0;
    const vh = video?.videoHeight ?? 0;
    if (!video || !vw || !vh) return null;

    // Recortar la captura al MISMO encuadre 4:3 que muestra el visor
    // (object-cover, centrado) para que lo que el usuario ve, lo que recibe la
    // API y la vista previa coincidan exactamente (WYSIWYG).
    const ratio = 4 / 3;
    let sw: number;
    let sh: number;
    let sx: number;
    let sy: number;
    if (vw / vh > ratio) {
      sh = vh;
      sw = Math.round(vh * ratio);
      sx = Math.round((vw - sw) / 2);
      sy = 0;
    } else {
      sw = vw;
      sh = Math.round(vw / ratio);
      sx = 0;
      sy = Math.round((vh - sh) / 2);
    }

    // Limitar el lado mayor del destino a 1280px (peso del File / memoria).
    let dw = sw;
    let dh = sh;
    if (dw > 1280) {
      dw = 1280;
      dh = 960;
    }

    const canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Espejar la captura con la cámara frontal para que coincida con el preview.
    if (facingMode === 'user') {
      ctx.translate(dw, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, dw, dh);

    const previewUrl = canvas.toDataURL('image/jpeg', 0.92);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.92),
    );
    if (!blob) return null;

    const file = new File([blob], `captura-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    return { file, previewUrl };
  }, [facingMode]);

  // Adjuntar el stream al <video> y marcar "listo" cuando hay primer frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    const markReady = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) setReady(true);
    };
    video.addEventListener('loadedmetadata', markReady);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    video.play().then(markReady).catch(() => {
      /* algunos navegadores rechazan play() sin gesto; el stream igual corre */
    });
    markReady(); // por si ya tenía dimensiones

    return () => {
      video.removeEventListener('loadedmetadata', markReady);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
    };
  }, [stream]);

  // Liberar la cámara y marcar desmontaje (corta cualquier start() en vuelo).
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    status,
    ready,
    errorKind,
    facingMode,
    hasMultipleCameras: cameraCount > 1,
    start,
    stop,
    switchCamera,
    capture,
  };
}
