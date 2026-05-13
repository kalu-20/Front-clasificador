'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type Props = {
  apiUrl: string;
  onChange: (url: string) => void;
};

export function ApiPill({ apiUrl, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(apiUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="mx-auto inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-wine/15 bg-cream px-4 py-2 shadow-card sm:flex-nowrap"
    >
      <span className="relative inline-flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-olive" />
        <span className="relative h-2 w-2 rounded-full bg-olive" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-wine">
        API
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
            placeholder="https://api.midominio.com/api/v1/predict"
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
