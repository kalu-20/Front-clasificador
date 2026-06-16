'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import es from './es.json';
import en from './en.json';

export type Lang = 'es' | 'en';

type Dict = typeof es;

const DICTIONARIES: Record<Lang, Dict> = {
  es: es as Dict,
  en: en as unknown as Dict,
};

/**
 * Tipo de valores que puede devolver `t()`. Strings en su mayoría, pero
 * algunas claves devuelven arrays/objetos (listas, blocks de marquee, …).
 */
export type TranslationValue = string | string[] | Record<string, unknown> | Record<string, unknown>[];

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /**
   * Resuelve una clave anidada por puntos (ej: "nav.home").
   * Si la clave devuelve un objeto/array, lo devuelve tal cual (útil para listas).
   * Si no encuentra la clave, devuelve la key tal cual (fail-soft).
   *
   * Por default tipa el retorno como `string` (el caso más común). Para
   * obtener listas u objetos, pasá el genérico:
   *   const items = t<string[]>('marquee.list');
   */
  t: <T extends TranslationValue = string>(key: string) => T;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'lang';

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return 'es';
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'es' || v === 'en') return v;
  } catch {
    // ignore
  }
  return 'es';
}

function resolveKey(dict: any, path: string): any {
  const parts = path.split('.');
  let current: any = dict;
  for (const p of parts) {
    if (current == null) return undefined;
    current = current[p];
  }
  return current;
}

// useLayoutEffect en SSR genera un warning; alias a useEffect en server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Arrancamos en 'es' (default) para que SSR y primer render del cliente
  // coincidan. Antes del primer paint, useLayoutEffect lee el idioma del
  // bootstrap inline (ya aplicado a <html lang>) o de localStorage, lo cual
  // minimiza el micro-flicker al cargar con lang=en guardado.
  const [lang, setLangState] = useState<Lang>('es');

  useIsomorphicLayoutEffect(() => {
    // El bootstrap inline (app/layout.tsx) ya escribió document.documentElement.lang
    // si había un valor válido en localStorage. Lo usamos como source of truth
    // antes que tocar storage para evitar dos reads.
    const fromDom = typeof document !== 'undefined' ? document.documentElement.lang : '';
    const candidate: Lang =
      fromDom === 'es' || fromDom === 'en' ? fromDom : readStoredLang();
    if (candidate !== lang) {
      setLangState(candidate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    <T extends TranslationValue = string>(key: string): T => {
      const dict = DICTIONARIES[lang];
      const value = resolveKey(dict, key);
      if (value === undefined) {
        // fallback: probamos en español, sino devolvemos la key.
        const fallback = resolveKey(DICTIONARIES.es, key);
        return (fallback ?? key) as T;
      }
      return value as T;
    },
    [lang],
  );

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback seguro si algún componente se renderiza fuera del provider:
    // siempre español, setLang no-op.
    return {
      lang: 'es',
      setLang: () => {},
      t: <T extends TranslationValue = string>(key: string): T =>
        (resolveKey(DICTIONARIES.es, key) ?? key) as T,
    };
  }
  return ctx;
}
