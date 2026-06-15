'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import es from './es.json';
import en from './en.json';

export type Lang = 'es' | 'en';

type Dict = typeof es;

const DICTIONARIES: Record<Lang, Dict> = {
  es: es as Dict,
  en: en as unknown as Dict,
};

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /**
   * Resuelve una clave anidada por puntos (ej: "nav.home").
   * Si la clave devuelve un objeto/array, lo devuelve tal cual (útil para listas).
   * Si no encuentra la clave, devuelve la key tal cual (fail-soft).
   */
  t: (key: string) => any;
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

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Siempre arrancamos en 'es' (default) para que SSR y primer render del cliente coincidan.
  // Después de montar leemos localStorage y, si difiere, actualizamos.
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    const stored = readStoredLang();
    if (stored !== lang) {
      setLangState(stored);
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
    (key: string) => {
      const dict = DICTIONARIES[lang];
      const value = resolveKey(dict, key);
      if (value === undefined) {
        // fallback: probamos en español, sino devolvemos la key.
        const fallback = resolveKey(DICTIONARIES.es, key);
        return fallback ?? key;
      }
      return value;
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
      t: (key: string) => resolveKey(DICTIONARIES.es, key) ?? key,
    };
  }
  return ctx;
}
