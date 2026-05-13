'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_BY_API } from '@/lib/data';
import type { PredictionResponse } from '@/lib/api';

type Status =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; data: PredictionResponse };

export function ResultPanel({ status }: { status: Status }) {
  return (
    <div className="relative h-full min-h-[480px] overflow-hidden rounded-3xl card-paper p-7 sm:p-9">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-wine text-cream">
            <span className="text-base">📊</span>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              /predict
            </p>
            <h2 className="font-display text-lg font-bold tracking-tight text-wine">
              Resultado
            </h2>
          </div>
        </div>
        <StatusIndicator status={status} />
      </div>

      <div className="relative mt-7">
        <AnimatePresence mode="wait">
          {status.kind === 'empty' && <Empty key="empty" />}
          {status.kind === 'loading' && <Loading key="loading" />}
          {status.kind === 'error' && <ErrorView key="error" message={status.message} />}
          {status.kind === 'success' && <Success key="success" data={status.data} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: Status }) {
  const map = {
    empty:   { color: 'bg-wine/30',                label: 'idle' },
    loading: { color: 'bg-olive animate-pulse',    label: 'analyzing' },
    error:   { color: 'bg-red-500',                label: 'error' },
    success: { color: 'bg-olive',                  label: 'done' },
  } as const;
  const c = map[status.kind];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-wine/15 bg-canvas/70 px-3 py-1">
      <span className={`h-1.5 w-1.5 rounded-full ${c.color}`} />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine">
        {c.label}
      </span>
    </span>
  );
}

function Empty() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-5 py-12 text-center"
    >
      <div className="grid h-24 w-24 place-items-center rounded-3xl border-2 border-wine/10 bg-canvas text-5xl">
        ♻️
      </div>
      <p className="max-w-sm text-[15px] leading-relaxed text-ink-dim">
        Subí una imagen y presioná{' '}
        <span className="font-semibold text-wine">Clasificar</span> para ver acá
        la categoría predicha y la distribución de probabilidades.
      </p>
    </motion.div>
  );
}

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 py-2"
    >
      <div className="flex items-center justify-center gap-2.5 py-6">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3 w-3 rounded-full bg-olive"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 0.18,
            }}
          />
        ))}
      </div>
      <p className="text-center font-mono text-[12px] uppercase tracking-[0.22em] text-wine">
        Analizando imagen…
      </p>
    </motion.div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-red-400/40 bg-red-50 p-5"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-100 text-base">
          ⚠️
        </div>
        <div>
          <h3 className="font-display text-base font-bold tracking-tight text-red-700">
            No pude conectar con la API
          </h3>
          <p
            className="mt-1.5 text-[13px] leading-relaxed text-red-900/80"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Success({ data }: { data: PredictionResponse }) {
  const cls = data.predicted_class;
  const category = CATEGORY_BY_API[cls];
  const sorted = [...(data.probabilities ?? [])].sort(
    (a, b) => b.probability - a.probability,
  );
  const top = sorted[0] ?? { class_name: cls, probability: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-wine/15 p-6"
        style={{
          background: `linear-gradient(135deg, ${category?.binColor ?? '#447A00'}1E 0%, transparent 60%)`,
        }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl">{category?.emoji ?? '♻️'}</span>
            <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight text-wine">
              {category?.name ?? cls}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              confianza
            </p>
            <p className="font-display text-2xl font-bold tracking-tight text-olive">
              {(top.probability * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        {category && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.binColor }}
            />
            <span className="text-[13px] text-wine">{category.bin}</span>
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          Probabilidades por clase
        </h4>
        <ul className="space-y-3">
          {sorted.map((p, i) => {
            const cat = CATEGORY_BY_API[p.class_name];
            const pct = p.probability * 100;
            return (
              <li key={`${p.class_name}-${i}`} className="flex items-center gap-3">
                <span className="w-7 text-[14px]">{cat?.emoji ?? '•'}</span>
                <span className="w-28 truncate text-[13px] text-wine">
                  {cat?.name ?? p.class_name}
                </span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-wine/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.15 + Math.min(i, 6) * 0.05,
                    }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: cat?.binColor ?? '#447A00' }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-[11px] text-ink-dim">
                  {pct.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {category && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="rounded-2xl border border-olive/30 bg-olive/[0.06] p-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-olive">
            Recomendación
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink">
            <strong className="font-bold text-wine">
              {category.emoji} {category.name}.
            </strong>{' '}
            <span className="text-ink-dim">{category.tip}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
