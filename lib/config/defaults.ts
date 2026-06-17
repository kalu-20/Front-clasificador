import type { ColorMap, ConfigState } from './types';

/**
 * Defaults derivados directamente de `app/globals.css` del repo
 * Front-clasificador. Si globals.css cambia, hay que actualizar acá
 * para mantener el preset "EcoClasificador" 1:1 con el sitio sin panel.
 *
 * Los hex se obtuvieron convirtiendo las tríadas R G B existentes:
 *   --canvas-rgb: 252 242 145  →  #fcf291
 *   --cream-rgb:  255 246 194  →  #fff6c2
 *   --olive-rgb:   68 122   0  →  #447a00
 *   --wine-rgb:   124  17  85  →  #7c1155
 *   --magenta-rgb:130  15  82  →  #820f52
 *   --ink-rgb:     42   3  18  →  #2a0312
 */
export const DEFAULT_LIGHT: ColorMap = {
  canvas: '#fcf291',
  cream: '#fff6c2',
  olive: '#447a00',
  wine: '#7c1155',
  magenta: '#820f52',
  ink: '#2a0312',
};

export const DEFAULT_DARK: ColorMap = {
  canvas: '#1a1224',
  cream: '#2a1b34',
  olive: '#fcf291',
  wine: '#7c1155',
  magenta: '#820f52',
  ink: '#fff6c2',
};

export const DEFAULT_COLOR_PRESET_ID = 'eco';
export const DEFAULT_FONT_PRESET_ID = 'alice';

/** Estado por defecto antes de leer localStorage. */
export const DEFAULT_CONFIG_STATE: ConfigState = {
  colorPresetId: DEFAULT_COLOR_PRESET_ID,
  custom: null,
  fontPresetId: DEFAULT_FONT_PRESET_ID,
  faviconDataUrl: null,
};

/** Claves de localStorage. Una sola clave para state, una para favicon. */
export const STORAGE_KEYS = {
  /** Estado completo serializado (colores + tipografía). */
  config: 'ecoclasificador.config',
  /** Favicon separado: puede ser un Data URL grande (~1MB). */
  favicon: 'ecoclasificador.favicon',
} as const;

/** Tamaño máximo permitido para el favicon (1 MB). */
export const FAVICON_MAX_BYTES = 1 * 1024 * 1024;

/** Dimensión recomendada (warning, no error). */
export const FAVICON_RECOMMENDED_SIZE = 512;
