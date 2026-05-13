'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Props = {
  number?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ number = '01', children, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'inline-flex items-center gap-3 rounded-full border border-wine/15 bg-cream/70 px-4 py-1.5',
        className,
      )}
    >
      <span className="font-mono text-[10px] tracking-[0.25em] text-olive">
        {number}
      </span>
      <span className="h-3 w-px bg-wine/20" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine">
        {children}
      </span>
    </motion.div>
  );
}
