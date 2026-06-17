'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ColorMap,
  ColorTokenKey,
  ConfigContextValue,
  ConfigState,
} from './types';
import {
  DEFAULT_CONFIG_STATE,
  DEFAULT_DARK,
  DEFAULT_LIGHT,
  STORAGE_KEYS,
} from './defaults';
import { COLOR_PRESETS, FONT_PRESETS, findColorPreset, findFontPreset } from './presets';
import {
  applyFaviconToHead,
  applyGoogleFontLink,
  normalizeHex,
  rememberOriginalFavicon,
} from './utils';

/* ---------- Storage helpers ------------------------------------------ */

function readStoredState(): ConfigState {
  if (typeof window === 'undefined') return DEFAULT_CONFIG_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.config);
    if (!raw) return DEFAULT_CONFIG_STATE;
    const parsed = JSON.parse(raw) as Partial<ConfigState>;
    // Saneamos: si alguna clave no viene, usamos default.
    return {
      colorPresetId: parsed.colorPresetId ?? DEFAULT_CONFIG_STATE.colorPresetId,
      custom: parsed.custom ?? null,
      fontPresetId: parsed.fontPresetId ?? DEFAULT_CONFIG_STATE.fontPresetId,
      // Favicon vive en su propia key, lo leemos abajo.
      faviconDataUrl: null,
    };
  } catch {
    return DEFAULT_CONFIG_STATE;
  }
}

function readStoredFavicon(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.favicon);
  } catch {
    return null;
  }
}

function persistState(state: ConfigState): void {
  if (typeof window === 'undefined') return;
  try {
    const { faviconDataUrl: _ignored, ...rest } = state;
    window.localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(rest));
    if (state.faviconDataUrl) {
      window.localStorage.setItem(STORAGE_KEYS.favicon, state.faviconDataUrl);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.favicon);
    }
  } catch {
    // ignore (storage lleno / incógnito)
  }
}

/* ---------- DOM application ------------------------------------------ */

/**
 * Resuelve qué ColorMap aplicar para el modo actual (light/dark).
 *
 * - 'custom' → usa state.custom[mode] si existe; si no, usa DEFAULT del mode.
 * - cualquier preset → si define `dark`, lo usa; si no, mantiene el dark
 *   default (no rompemos el dark existente).
 */
function resolveActiveMap(
  state: ConfigState,
  mode: 'light' | 'dark',
): ColorMap {
  if (state.colorPresetId === 'custom') {
    if (mode === 'light') {
      return state.custom?.light ?? DEFAULT_LIGHT;
    }
    return state.custom?.dark ?? DEFAULT_DARK;
  }
  const preset = findColorPreset(state.colorPresetId);
  if (mode === 'light') return preset.light;
  return preset.dark ?? DEFAULT_DARK;
}

/**
 * Inyecta dos <style> en <head>:
 *   1. `:root { --canvas-rgb: ...; ... }` con la paleta light.
 *   2. `[data-theme="dark"] { --canvas-rgb: ...; ... }` con la paleta dark.
 *
 * Reemplazamos solamente nuestros <style data-config-colors>: las reglas
 * originales de globals.css quedan, pero las nuestras tienen mayor
 * especificidad porque vienen DESPUÉS en el documento.
 */
function applyColorMapsToDocument(
  light: ColorMap,
  dark: ColorMap,
  fontDisplay: string,
  fontBody: string,
): void {
  if (typeof document === 'undefined') return;
  const head = document.head;
  head
    .querySelectorAll('style[data-config-colors="true"]')
    .forEach((n) => n.parentNode?.removeChild(n));

  const style = document.createElement('style');
  style.setAttribute('data-config-colors', 'true');
  style.appendChild(
    document.createTextNode(buildOverrideCss(light, dark, fontDisplay, fontBody)),
  );
  head.appendChild(style);
}

function buildOverrideCss(
  light: ColorMap,
  dark: ColorMap,
  fontDisplay: string,
  fontBody: string,
): string {
  const toBlock = (map: ColorMap) =>
    (Object.keys(map) as ColorTokenKey[])
      .map((token) => {
        const hex = normalizeHex(map[token]);
        if (!hex) return '';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `--${token}-rgb: ${r} ${g} ${b}; --${token}: rgb(${r}, ${g}, ${b});`;
      })
      .join(' ');

  return `
:root {
  ${toBlock(light)}
  --font-family-display: ${fontDisplay};
  --font-family-body: ${fontBody};
}
[data-theme="dark"] {
  ${toBlock(dark)}
}
html, body {
  font-family: var(--font-family-body) !important;
}
`.trim();
}

/* ---------- Provider ------------------------------------------------- */

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // Default seguro para SSR; el primer effect rehidrata desde localStorage.
  const [state, setState] = useState<ConfigState>(DEFAULT_CONFIG_STATE);
  const hydratedRef = useRef(false);

  // Hidratar desde storage al montar.
  useEffect(() => {
    rememberOriginalFavicon();
    const stored = readStoredState();
    const favicon = readStoredFavicon();
    const initial: ConfigState = { ...stored, faviconDataUrl: favicon };
    setState(initial);
    hydratedRef.current = true;
  }, []);

  // Aplicar cambios al DOM cada vez que cambia el state.
  useEffect(() => {
    const light = resolveActiveMap(state, 'light');
    const dark = resolveActiveMap(state, 'dark');
    const font = findFontPreset(state.fontPresetId);
    applyColorMapsToDocument(light, dark, font.display, font.body);
    applyGoogleFontLink(font.googleFontHref);
    applyFaviconToHead(state.faviconDataUrl);

    if (hydratedRef.current) {
      persistState(state);
    }
  }, [state]);

  /* ---------- API expuesta -------------------------------------------- */

  const setColorPreset = useCallback((id: string) => {
    setState((prev) => {
      if (id === 'custom') {
        // Si pasamos a custom y no tenemos custom guardado, lo seedeamos con
        // la paleta actualmente activa para que el usuario edite sobre algo
        // razonable.
        const seedLight = resolveActiveMap(prev, 'light');
        const seedDark = resolveActiveMap(prev, 'dark');
        return {
          ...prev,
          colorPresetId: 'custom',
          custom: prev.custom ?? { light: seedLight, dark: seedDark },
        };
      }
      return { ...prev, colorPresetId: id };
    });
  }, []);

  const setCustomColor = useCallback(
    (token: ColorTokenKey, hex: string, mode: 'light' | 'dark') => {
      const normalized = normalizeHex(hex);
      if (!normalized) return;
      setState((prev) => {
        const seedLight =
          prev.custom?.light ?? resolveActiveMap(prev, 'light');
        const seedDark = prev.custom?.dark ?? resolveActiveMap(prev, 'dark');
        const next = {
          light: { ...seedLight },
          dark: { ...seedDark },
        };
        next[mode][token] = normalized;
        return {
          ...prev,
          colorPresetId: 'custom',
          custom: next,
        };
      });
    },
    [],
  );

  const setFontPreset = useCallback((id: string) => {
    setState((prev) => ({ ...prev, fontPresetId: id }));
  }, []);

  const setFavicon = useCallback((dataUrl: string | null) => {
    setState((prev) => ({ ...prev, faviconDataUrl: dataUrl }));
  }, []);

  const resetAll = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.config);
        window.localStorage.removeItem(STORAGE_KEYS.favicon);
      } catch {
        // ignore
      }
    }
    setState(DEFAULT_CONFIG_STATE);
  }, []);

  const value = useMemo<ConfigContextValue>(
    () => ({
      state,
      setColorPreset,
      setCustomColor,
      setFontPreset,
      setFavicon,
      resetAll,
    }),
    [state, setColorPreset, setCustomColor, setFontPreset, setFavicon, resetAll],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    // Fallback no-op: mantiene la app funcionando si alguien renderiza un
    // consumer fuera del provider (ej: tests).
    return {
      state: DEFAULT_CONFIG_STATE,
      setColorPreset: () => {},
      setCustomColor: () => {},
      setFontPreset: () => {},
      setFavicon: () => {},
      resetAll: () => {},
    };
  }
  return ctx;
}

/* ---------- Re-exports prácticos -------------------------------------- */

export { COLOR_PRESETS, FONT_PRESETS };
export type { ConfigState, ConfigContextValue };
// Helper exportado para los componentes UI que necesitan saber cuál es la
// paleta efectiva sin redescubrirla.
export { resolveActiveMap };
