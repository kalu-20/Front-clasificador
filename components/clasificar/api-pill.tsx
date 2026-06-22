'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pingApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/I18nProvider';

type Props = {
  apiUrl: string;
  onChange: (url: string) => void;
};

type Status = 'checking' | 'online' | 'offline';

const STATUS_DOT: Record<Status, string> = {
  checking: 'bg-amber-400',
  online: 'bg-olive',
  offline: 'bg-red-500',
};

export function ApiPill({ apiUrl, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(apiUrl);
  const [status, setStatus] = useState<Status>('checking');
  const { t } = useI18n();

  const STATUS_LABEL: Record<Status, string> = {
    checking: t('classify.apiStatusChecking') as string,
    online: t('classify.apiStatusOnline') as string,
    offline: t('classify.apiStatusOffline') as string,
  };

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    setStatus('checking');
    pingApi(apiUrl, ctrl.signal).then((ok) => {
      if (!cancelled) setStatus(ok ? 'online' : 'offline');
    });
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [apiUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="mx-auto inline-flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-wine/15 bg-cream px-4 py-2 shadow-card sm:flex-nowrap sm:rounded-full"
    >
      <span
        className={cn(
          'relative inline-flex h-2 w-2 shrink-0 rounded-full transition-colors',
          STATUS_DOT[status],
        )}
        aria-label={`${t('classify.apiAria') as string}: ${STATUS_LABEL[status]}`}
      >
        {status === 'online' && (
          <span className="absolute inset-0 animate-ping rounded-full bg-olive opacity-70" aria-hidden="true" />
        )}
      </span>
      <span
        className={cn(
          'font-mono text-[11px] uppercase tracking-[0.22em]',
          status === 'online' ? 'text-olive' :
          status === 'offline' ? 'text-red-700' : 'text-wine',
        )}
      >
        {t('classify.apiLabel') as string} · {STATUS_LABEL[status]}
      </span>
      {!editing ? (
        <>
          <code className="min-w-0 max-w-full flex-1 truncate rounded-md bg-canvas px-2 py-1 font-mono text-[12px] text-ink ring-1 ring-wine/10 sm:max-w-[420px] sm:flex-none">
            {apiUrl}
          </code>
          <button
            type="button"
            onClick={() => {
              setValue(apiUrl);
              setEditing(true);
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-wine/20 px-4 text-[12px] font-semibold text-wine transition-colors hover:bg-wine hover:text-cream"
          >
            {t('classify.apiChangeUrl') as string}
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = value.trim();
            if (v.length > 0) onChange(v);
            setEditing(false);
          }}
          className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            aria-label={t('classify.apiChangeUrl') as string}
            className="min-h-[44px] w-full min-w-0 rounded-md border border-wine/20 bg-cream px-2.5 py-1.5 font-mono text-[12px] text-ink outline-none transition-colors focus:border-olive sm:w-[400px] sm:min-w-[240px]"
            placeholder={t('classify.apiUrlPlaceholder') as string}
          />
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-wine px-4 text-[12px] font-semibold text-cream"
          >
            {t('common.save') as string}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-wine/20 px-4 text-[12px] font-semibold text-wine hover:bg-wine/5"
          >
            {t('common.cancel') as string}
          </button>
        </form>
      )}
    </motion.div>
  );
}
