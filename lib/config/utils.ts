import {
  FAVICON_MAX_BYTES,
  FAVICON_RECOMMENDED_SIZE,
} from './defaults';
import type {
  ColorMap,
  ColorTokenKey,
  FaviconValidationResult,
} from './types';

/* ---------- Color helpers --------------------------------------------- */

/**
 * Convierte un hex `#RRGGBB` (o `#RGB`) a una tríada "R G B" lista para
 * inyectar como CSS variable `--canvas-rgb: 252 242 145`.
 *
 * Devuelve null si el hex es inválido — el provider ignora silenciosamente
 * el cambio en ese caso.
 */
export function hexToRgbTriad(hex: string): string | null {
  const m = parseHex(hex);
  if (!m) return null;
  return `${m.r} ${m.g} ${m.b}`;
}

/** Convierte hex a `#rrggbb` normalizado (lowercase, 7 chars). */
export function normalizeHex(hex: string): string | null {
  const m = parseHex(hex);
  if (!m) return null;
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to2(m.r)}${to2(m.g)}${to2(m.b)}`;
}

function parseHex(input: string): { r: number; g: number; b: number } | null {
  if (typeof input !== 'string') return null;
  let h = input.trim().toLowerCase();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length !== 6) return null;
  if (!/^[0-9a-f]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Itera un ColorMap y aplica `--<token>-rgb` + `--<token>` al elemento dado. */
export function applyColorMapToElement(
  el: HTMLElement,
  map: ColorMap,
): void {
  (Object.keys(map) as ColorTokenKey[]).forEach((token) => {
    const triad = hexToRgbTriad(map[token]);
    if (!triad) return;
    el.style.setProperty(`--${token}-rgb`, triad);
    el.style.setProperty(`--${token}`, `rgb(${triad.replaceAll(' ', ', ')})`);
  });
}

/* ---------- Favicon helpers ------------------------------------------- */

/**
 * Valida un archivo de favicon antes de persistirlo.
 *
 * Reglas:
 *  - Tipo: image/png o image/svg+xml.
 *  - Tamaño: <= FAVICON_MAX_BYTES (1 MB).
 *  - Dimensiones: warning (no error) si no es FAVICON_RECOMMENDED_SIZE.
 *    Para SVG no se chequean dimensiones (son vectoriales).
 */
export async function validateFaviconFile(
  file: File,
): Promise<FaviconValidationResult> {
  if (!['image/png', 'image/svg+xml'].includes(file.type)) {
    return { ok: false, errorKey: 'config.favicon.errors.type' };
  }
  if (file.size > FAVICON_MAX_BYTES) {
    return { ok: false, errorKey: 'config.favicon.errors.size' };
  }
  if (file.type === 'image/svg+xml') {
    return { ok: true };
  }
  // PNG: leemos dimensiones via Image() para warning de tamaño.
  try {
    const dims = await readImageDimensions(file);
    const warning =
      dims.width !== FAVICON_RECOMMENDED_SIZE ||
      dims.height !== FAVICON_RECOMMENDED_SIZE
        ? 'config.favicon.warnings.dimensions'
        : undefined;
    return {
      ok: true,
      warningKey: warning,
      width: dims.width,
      height: dims.height,
    };
  } catch {
    // No pudimos leer dimensiones: aprobamos sin warning específico.
    return { ok: true };
  }
}

function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const out = { width: img.naturalWidth, height: img.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(out);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image load failed'));
    };
    img.src = url;
  });
}

/** Convierte un File a Data URL (base64). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

/**
 * Aplica un favicon personalizado sin pelearse con React.
 *
 * IMPORTANTE: Next.js renderiza los `<link rel="icon">` desde el `metadata`
 * del layout, y esos nodos los controla React. Si los eliminamos a mano,
 * React pierde la referencia y al reconciliar el <head> (p. ej. al navegar a
 * una página con otro metadata) tira "Cannot read properties of null
 * (reading 'removeChild')" y rompe la app en producción.
 *
 * Por eso acá gestionamos ÚNICAMENTE nuestro propio
 * `<link rel="icon" data-config-favicon="true">`: nunca tocamos los que
 * renderiza Next/React.
 * - Con `dataUrl`: insertamos/actualizamos nuestro link (al ir último en el
 *   <head>, el navegador lo prioriza sobre el del metadata).
 * - Con `null`: removemos solo el nuestro; vuelven a regir los íconos del
 *   metadata original.
 */
const CONFIG_FAVICON_ATTR = 'data-config-favicon';

export function rememberOriginalFavicon(): void {
  // No-op: ya no manipulamos el favicon original del metadata (lo maneja React).
  // Se mantiene exportado por compatibilidad con quienes lo importan.
}

export function applyFaviconToHead(dataUrl: string | null): void {
  if (typeof document === 'undefined') return;
  const head = document.head;
  // Removemos SOLO nuestro propio favicon previo (nunca los de React/metadata).
  head
    .querySelectorAll(`link[${CONFIG_FAVICON_ATTR}="true"]`)
    .forEach((node) => node.parentNode?.removeChild(node));

  if (!dataUrl) return; // restaurar = quitar el nuestro; quedan los del metadata.

  const link = document.createElement('link');
  link.rel = 'icon';
  link.setAttribute(CONFIG_FAVICON_ATTR, 'true');
  link.type = dataUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png';
  link.href = dataUrl;
  head.appendChild(link);
}

/* ---------- Font helpers ---------------------------------------------- */

/**
 * Inyecta (o reemplaza) un <link rel="stylesheet"> de Google Fonts en el
 * <head>. Usamos un `data-config-font` para identificarlo y poder limpiarlo.
 */
export function applyGoogleFontLink(href: string | undefined): void {
  if (typeof document === 'undefined') return;
  const head = document.head;
  const existing = head.querySelectorAll('link[data-config-font="true"]');
  existing.forEach((node) => node.parentNode?.removeChild(node));

  if (!href) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-config-font', 'true');
  head.appendChild(link);
}
