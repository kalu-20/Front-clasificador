'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-wine text-base text-cream shadow-glow">
                ♻
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-wine">
                EcoClasificador
              </span>
            </motion.div>

            <div className="h-[2px] w-32 overflow-hidden rounded-full bg-wine/10">
              <motion.span
                className="block h-full bg-olive"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
