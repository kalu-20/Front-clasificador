export const DEFAULT_API_URL = 'http://127.0.0.1:8000/api/v1/predict';

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

export async function predictImage(
  apiUrl: string,
  file: File,
): Promise<PredictionResponse> {
  const form = new FormData();
  form.append('file', file);
  const resp = await fetch(apiUrl, { method: 'POST', body: form });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`API respondió ${resp.status}: ${text.slice(0, 200)}`);
  }
  return (await resp.json()) as PredictionResponse;
}
