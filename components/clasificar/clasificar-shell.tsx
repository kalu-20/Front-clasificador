'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { SectionLabel } from '@/components/ui/section-label';
import { SplitText } from '@/components/ui/split-text';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ApiPill } from './api-pill';
import { UploadDropzone } from './upload-dropzone';
import { ResultPanel } from './result-panel';
import { useI18n } from '@/lib/i18n/I18nProvider';

import {
  ApiError,
  DEFAULT_API_URL,
  getStoredApiUrl,
  setStoredApiUrl,
  predictImage,
  type PredictionResponse,
} from '@/lib/api';

type Status =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; data: PredictionResponse };

export function ClasificarShell() {
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_API_URL);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'empty' });
  const { t, lang } = useI18n();

  useEffect(() => {
    setApiUrl(getStoredApiUrl());
  }, []);

  const handleApiChange = (url: string) => {
    setApiUrl(url);
    setStoredApiUrl(url);
  };

  const handleFile = (f: File, previewUrl: string) => {
    setFile(f);
    setPreview(previewUrl);
    setStatus({ kind: 'empty' });
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setStatus({ kind: 'empty' });
  };

  const handlePredict = async () => {
    if (!file) return;
    setStatus({ kind: 'loading' });
    try {
      const data = await predictImage(apiUrl, file);
      setStatus({ kind: 'success', data });
    } catch (err) {
      let title = t('classify.errorTitleDefault') as string;
      let detail =
        err instanceof Error ? err.message : 'Error desconocido al consultar la API.';

      if (err instanceof ApiError) {
        if (err.kind === 'mixed_content') {
          title = t('classify.errorTitleMixed') as string;
          detail = t('classify.errorMixedDetail') as string;
        } else if (err.kind === 'network') {
          title = t('classify.errorTitleNetwork') as string;
          detail = `${t('classify.errorNetworkDetailA') as string} <code class="rounded bg-wine/10 px-1.5 py-0.5 font-mono text-[12px] text-wine">${apiUrl}</code> ${t('classify.errorNetworkDetailB') as string}<br/><br/><strong>${t('classify.errorDetailLabel') as string}:</strong> ${err.message}`;
        } else if (err.kind === 'http') {
          title = `${t('classify.errorTitleHttp') as string} ${err.status ?? ''}`;
          detail = err.message;
        }
      }

      setStatus({
        kind: 'error',
        message: `<strong class="block text-[14px] text-red-800">${title}</strong><div class="mt-1.5">${detail}</div>`,
      });
    }
  };

  const canPredict = !!file && status.kind !== 'loading';

  return (
    <>
      <section className="relative isolate pt-36 pb-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-paper opacity-60" />

        <div className="container-app text-center">
          <div className="flex justify-center">
            <SectionLabel number="✦">{t('classify.label') as string}</SectionLabel>
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl font-display text-display-lg font-bold tracking-tight">
            <SplitText
              key={`cl1-${lang}`}
              text={t('classify.title1') as string}
              as="span"
              splitBy="word"
              className="block text-wine"
              delay={0.15}
            />
            <SplitText
              key={`cl2-${lang}`}
              text={t('classify.title2') as string}
              as="span"
              splitBy="word"
              className="block text-olive"
              delay={0.35}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-[16px] leading-relaxed text-ink-dim sm:text-[18px]"
          >
            {t('classify.intro') as string}
          </motion.p>

          <div className="mt-8 flex justify-center">
            <ApiPill apiUrl={apiUrl} onChange={handleApiChange} />
          </div>
        </div>
      </section>

      <section className="relative pb-20 sm:pb-28">
        <div className="container-app grid grid-cols-1 gap-7 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="card-paper relative rounded-3xl p-7 sm:p-9"
          >
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-olive text-cream" aria-hidden="true">
                  <span className="text-base">📸</span>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    /upload
                  </p>
                  <h2 className="font-display text-lg font-bold tracking-tight text-wine">
                    {t('classify.uploadHeading') as string}
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                <UploadDropzone
                  onFile={handleFile}
                  previewUrl={preview}
                  fileName={file?.name ?? null}
                  onReset={handleReset}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[12px] text-ink-muted">
                  {t('classify.uploadTip') as string}
                </p>
                <MagneticButton
                  onClick={handlePredict}
                  disabled={!canPredict}
                  variant="primary"
                >
                  {status.kind === 'loading'
                    ? (t('classify.analyzing') as string)
                    : (t('classify.classifyCta') as string)}
                  {status.kind !== 'loading' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <ResultPanel status={status} />
          </motion.div>
        </div>
      </section>

      <section className="relative pb-28">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-wine/15 bg-cream p-7 sm:p-9"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-wine/15 bg-canvas text-base" aria-hidden="true">
                ⚠️
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-wine">
                  {t('classify.noteHeading') as string}
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
                  {t('classify.noteBody1') as string}{' '}
                  <code className="rounded bg-wine/10 px-1.5 py-0.5 font-mono text-[12px] text-wine">
                    http://127.0.0.1:8000
                  </code>{' '}
                  {t('classify.noteBody2') as string}{' '}
                  <strong className="text-wine">{t('classify.noteChangeUrl') as string}</strong>{' '}
                  {t('classify.noteBody3') as string}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
