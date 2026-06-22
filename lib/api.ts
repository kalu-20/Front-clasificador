/**
 * Cliente del backend de EcoClasificador.
 *
 * La URL por defecto se resuelve en este orden:
 *   1. `NEXT_PUBLIC_API_URL` definida en build (Vercel / .env.local).
 *   2. Fallback hardcoded a la API pública en producción (saltaget.com.ar).
 *   3. localStorage `ecoApi` — sobreescribe ambas si el usuario tocó "Cambiar URL".
 */

const ENV_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

const PRODUCTION_API_URL =
  ENV_URL && ENV_URL.length > 0
    ? ENV_URL
    : 'https://saltaget.com.ar/api/v1/predict';

const LOCAL_API_URL = 'http://127.0.0.1:8000/api/v1/predict';

/** URL inicial que ve el usuario al entrar a /clasificar. */
export const DEFAULT_API_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? LOCAL_API_URL
    : PRODUCTION_API_URL;

export type Probability = {
  class_name: string;
  probability: number;
};

export type PredictionResponse = {
  predicted_class: string;
  probabilities: Probability[];
};

export function getStoredApiUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_API_URL;
  return localStorage.getItem('ecoApi') || DEFAULT_API_URL;
}

export function setStoredApiUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ecoApi', url);
}

export function resetStoredApiUrl(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ecoApi');
}

export class ApiError extends Error {
  readonly kind: 'mixed_content' | 'network' | 'http' | 'unknown';
  readonly status?: number;

  constructor(
    kind: ApiError['kind'],
    message: string,
    status?: number,
  ) {
    super(message);
    this.kind = kind;
    this.status = status;
    this.name = 'ApiError';
  }
}

function detectMixedContent(apiUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:' && apiUrl.startsWith('http://');
}

/**
 * Hace un ping al endpoint `/health` (o `/` como fallback) de la API.
 * Devuelve `true` si está online, `false` si no.
 * Toma como input la URL de `/api/v1/predict` y deriva el origin.
 */
export async function pingApi(apiUrl: string, signal?: AbortSignal): Promise<boolean> {
  if (detectMixedContent(apiUrl)) return false;
  try {
    const origin = new URL(apiUrl).origin;
    const resp = await fetch(`${origin}/health`, {
      method: 'GET',
      signal,
      cache: 'no-store',
    });
    if (resp.ok) return true;
    // fallback al root
    const rootResp = await fetch(origin, { method: 'GET', signal, cache: 'no-store' });
    return rootResp.ok;
  } catch {
    return false;
  }
}

export async function predictImage(
  apiUrl: string,
  file: File,
): Promise<PredictionResponse> {
  if (detectMixedContent(apiUrl)) {
    throw new ApiError(
      'mixed_content',
      'La página está servida por HTTPS y la URL de la API es HTTP. Los navegadores bloquean este tipo de llamadas. Usá una URL https:// o serví esta web localmente.',
    );
  }

  const form = new FormData();
  form.append('file', file);

  let response: Response;
  try {
    response = await fetch(apiUrl, { method: 'POST', body: form });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new ApiError(
      'network',
      `No se pudo conectar con la API. Verificá que esté online y que tenga CORS habilitado. (${reason})`,
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new ApiError(
      'http',
      `La API respondió ${response.status}: ${text.slice(0, 200)}`,
      response.status,
    );
  }

  return (await response.json()) as PredictionResponse;
}
