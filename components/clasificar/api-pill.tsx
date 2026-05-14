'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pingApi } from '@/lib/api';
import { cn } from '@/lib/cn';

type Props = {
  apiUrl: string;
  onChange: (url: string) => void;
};

type Status = 'checking' | 'online' | 'offline';

const STATUS_LABEL: Record<Status, string> = {
  checking: 'verificando…',
  online: 'online',
  offline: 'offline',
};

const STATUS_DOT: Record<Status, string> = {
  checking: 'bg-amber-400',
  online: 'bg-olive',
  offline: 'bg-red-500',
};

export function ApiPill({ apiUrl, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(apiUrl);
  const [status, setStatus] = useState<Status>('checking');

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
      className="mx-auto inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-wine/15 bg-cream px-4 py-2 shadow-card sm:flex-nowrap"
    >
      <span
        className={cn(
          'relative inline-flex h-2 w-2 shrink-0 rounded-full transition-colors',
          STATUS_DOT[status],
        )}
        aria-label={`Estado de la API: ${STATUS_LABEL[status]}`}
      >
        {status === 'online' && (
          <span className="absolute inset-0 animate-ping rounded-full bg-olive opacity-70" />
        )}
      </span>
      <span
        className={cn(
          'font-mono text-[11px] uppercase tracking-[0.22em]',
          status === 'online' ? 'text-olive' :
          status === 'offline' ? 'text-red-700' : 'text-wine',
        )}
      >
        API · {STATUS_LABEL[status]}
      </span>
      {!editing ? (
        <>
          <code className="max-w-[260px] truncate rounded-md bg-canvas px-2 py-1 font-mono text-[12px] text-ink sm:max-w-[420px]">
            {apiUrl}
          </code>
          <button
            type="button"
            onClick={() => {
              setValue(apiUrl);
              setEditing(true);
            }}
            className="rounded-full border border-wine/20 px-3 py-1 text-[12px] font-semibold text-wine transition-colors hover:bg-wine hover:text-cream"
          >
            Cambiar URL
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
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className="w-full min-w-[240px] rounded-md border border-wine/20 bg-cream px-2.5 py-1.5 font-mono text-[12px] text-ink outline-none transition-colors focus:border-olive sm:w-[400px]"
            placeholder="https://ecoclasificador-api-production.up.railway.app/api/v1/predict"
          />
          <button
            type="submit"
            className="rounded-full bg-wine px-3 py-1 text-[12px] font-semibold text-cream"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-full border border-wine/20 px-3 py-1 text-[12px] font-semibold text-wine hover:bg-wine/5"
          >
            Cancelar
          </button>
        </form>
      )}
    </motion.div>
  );
}
