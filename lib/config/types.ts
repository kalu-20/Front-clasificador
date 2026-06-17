/**
 * Tipos para la configuración global del frontend EcoClasificador.
 *
 * Todas las interfaces son exportadas para poder importarse desde
 * componentes y tests externos.
 */

/**
 * Tokens de color que la app usa internamente como CSS variables
 * "tríadas R G B" (ej: `--canvas-rgb: 252 242 145`). Mantenemos
 * exactamente los mismos nombres que `app/globals.css` para que el
 * panel pueda escribirlos a `:root` sin ningún mapeo intermedio.
 */
export type ColorTokenKey =
  | 'canvas'
  | 'cream'
  | 'olive'
  | 'wine'
  | 'magenta'
  | 'ink';

/** Mapa token → color hexadecimal (#RRGGBB, lowercase). */
export type ColorMap = Record<ColorTokenKey, string>;

/**
 * Un preset puede definir SOLO los colores light, o ambos. Si no define
 * `dark`, el ConfigProvider deriva una versión dark razonable (oscurece
 * canvas/cream y aclara ink) o mantiene el dark del default.
 */
export interface ColorPreset {
  /** Id estable (no traducir). */
  id: string;
  /** Etiqueta i18n: clave bajo `config.colorPresets.<id>`. */
  i18nKey: string;
  /** Paleta para modo claro. */
  light: ColorMap;
  /** Paleta para modo oscuro (opcional). */
  dark?: ColorMap;
}

/** Familias tipográficas definidas como par display + body. */
export interface FontPreset {
  id: string;
  /** Clave i18n bajo `config.fontPresets.<id>`. */
  i18nKey: string;
  /** Stack para titulares / display. */
  display: string;
  /** Stack para body / texto corrido. */
  body: string;
  /**
   * URL opcional de Google Fonts (CSS2). Si está presente, el provider
   * la inyecta como <link rel="stylesheet"> en el <head> al aplicar.
   */
  googleFontHref?: string;
}

/**
 * Estado completo persistido a `localStorage('ecoclasificador.config')`.
 * El campo `custom` sólo se usa cuando `colorPresetId === 'custom'`.
 */
export interface ConfigState {
  colorPresetId: string;
  custom: { light: ColorMap; dark: ColorMap } | null;
  fontPresetId: string;
  /** Data URL del favicon subido por el usuario, o null si es el default. */
  faviconDataUrl: string | null;
}

/** Resultado de validar un archivo de favicon. */
export interface FaviconValidationResult {
  ok: boolean;
  /** Clave i18n del mensaje de error (si !ok). */
  errorKey?: string;
  /** Mensaje de warning no bloqueante (ej: dimensiones != 512). */
  warningKey?: string;
  /** Ancho detectado, si se pudo leer. */
  width?: number;
  /** Alto detectado, si se pudo leer. */
  height?: number;
}

/** Forma del contexto expuesto por `useConfig()`. */
export interface ConfigContextValue {
  state: ConfigState;
  /** Cambia preset de color (o 'custom'). Aplica inmediatamente. */
  setColorPreset: (id: string) => void;
  /** Edita un token individual del modo custom. Activa 'custom' automáticamente. */
  setCustomColor: (token: ColorTokenKey, hex: string, mode: 'light' | 'dark') => void;
  /** Cambia familia tipográfica. */
  setFontPreset: (id: string) => void;
  /** Setea (o limpia) el favicon. Pasar null = restaurar default. */
  setFavicon: (dataUrl: string | null) => void;
  /** Vuelve TODO al default y limpia localStorage. */
  resetAll: () => void;
}
