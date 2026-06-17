import type { ColorPreset, FontPreset } from './types';
import { DEFAULT_DARK, DEFAULT_LIGHT } from './defaults';

/**
 * COLOR PRESETS
 *
 * - `eco`              → paleta institucional vino + crema (default).
 * - `forest`           → verdes; canvas crema-verde, acentos olivos.
 * - `ocean`            → azules profundos.
 * - `sunset`           → naranjas + violeta.
 * - `highContrast`     → negro + amarillo, optimizado para baja visión.
 *
 * Cada preset define `light` y, cuando aporta valor, `dark`. Si un preset
 * omite `dark`, el provider conserva el `dark` del default (no rompe el
 * modo oscuro existente).
 */
export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'eco',
    i18nKey: 'config.colorPresets.eco',
    light: DEFAULT_LIGHT,
    dark: DEFAULT_DARK,
  },
  {
    id: 'forest',
    i18nKey: 'config.colorPresets.forest',
    light: {
      canvas: '#eaf5d9',
      cream: '#f6fbe8',
      olive: '#2f6b1a',
      wine: '#1f4a10',
      magenta: '#2f6b1a',
      ink: '#102808',
    },
    dark: {
      canvas: '#0f1b0a',
      cream: '#1a2d12',
      olive: '#b8e07a',
      wine: '#5fa83a',
      magenta: '#5fa83a',
      ink: '#eaf5d9',
    },
  },
  {
    id: 'ocean',
    i18nKey: 'config.colorPresets.ocean',
    light: {
      canvas: '#dbeefb',
      cream: '#eef7fd',
      olive: '#1c6ea4',
      wine: '#0b3d63',
      magenta: '#10527f',
      ink: '#06172a',
    },
    dark: {
      canvas: '#091624',
      cream: '#0f253a',
      olive: '#7ac6f0',
      wine: '#1c6ea4',
      magenta: '#3e8ec0',
      ink: '#dbeefb',
    },
  },
  {
    id: 'sunset',
    i18nKey: 'config.colorPresets.sunset',
    light: {
      canvas: '#ffe7c2',
      cream: '#fff2dc',
      olive: '#d65a1f',
      wine: '#7a2b6b',
      magenta: '#a23687',
      ink: '#321026',
    },
    dark: {
      canvas: '#2b0f24',
      cream: '#3d1832',
      olive: '#ffae5a',
      wine: '#d65a1f',
      magenta: '#e07a8a',
      ink: '#ffe7c2',
    },
  },
  {
    id: 'highContrast',
    i18nKey: 'config.colorPresets.highContrast',
    light: {
      canvas: '#ffffff',
      cream: '#fff9c4',
      olive: '#000000',
      wine: '#000000',
      magenta: '#000000',
      ink: '#000000',
    },
    dark: {
      canvas: '#000000',
      cream: '#1a1a00',
      olive: '#ffeb00',
      wine: '#ffeb00',
      magenta: '#ffeb00',
      ink: '#ffeb00',
    },
  },
];

/**
 * FONT PRESETS
 *
 * - `alice`              → la actual del repo (Alice + Georgia + serif).
 * - `inter`              → sans moderna (Inter), buena legibilidad UI.
 * - `serifClassic`       → Georgia / Times, estilo editorial.
 * - `atkinsonHyperlegible` → diseñada por Braille Institute para baja visión.
 *
 * `googleFontHref` se inyecta como <link rel="stylesheet"> al aplicar.
 * Si el preset usa fuentes ya disponibles vía `next/font` en el layout
 * (Alice), googleFontHref queda undefined: las CSS vars usan el stack
 * directamente.
 */
export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'alice',
    i18nKey: 'config.fontPresets.alice',
    display: "var(--font-alice), Georgia, serif",
    body: "var(--font-alice), Georgia, serif",
  },
  {
    id: 'inter',
    i18nKey: 'config.fontPresets.inter',
    display:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    body:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  {
    id: 'serifClassic',
    i18nKey: 'config.fontPresets.serifClassic',
    display: "Georgia, 'Times New Roman', Times, serif",
    body: "Georgia, 'Times New Roman', Times, serif",
  },
  {
    id: 'atkinsonHyperlegible',
    i18nKey: 'config.fontPresets.atkinsonHyperlegible',
    display:
      "'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif",
    body:
      "'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif",
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap',
  },
];

/** Helpers de lookup tolerantes (si el id guardado ya no existe, fallback al primero). */
export function findColorPreset(id: string): ColorPreset {
  return COLOR_PRESETS.find((p) => p.id === id) ?? COLOR_PRESETS[0];
}

export function findFontPreset(id: string): FontPreset {
  return FONT_PRESETS.find((p) => p.id === id) ?? FONT_PRESETS[0];
}
