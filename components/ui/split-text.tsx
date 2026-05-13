'use client';

import { motion, type Variants } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  splitBy?: 'word' | 'char';
  /** Si true (default), dispara al montar. Si false, espera al scroll. */
  immediate?: boolean;
};

const itemVariants: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      delay: i,
    },
  }),
};

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  as = 'h2',
  splitBy = 'word',
  immediate = true,
}: Props) {
  const tokens = useMemo(() => {
    return splitBy === 'word' ? text.split(/(\s+)/) : Array.from(text);
  }, [text, splitBy]);

  const MotionTag = motion[as] as typeof motion.h2;

  const animationProps = immediate
    ? { initial: 'hidden' as const, animate: 'show' as const }
    : {
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0, margin: '200px 0px 200px 0px' },
      };

  return (
    <MotionTag
      className={cn('inline-block', className)}
      aria-label={text}
      {...animationProps}
    >
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={`s-${i}`} aria-hidden>
              {token}
            </span>
          );
        }
        return (
          <span
            key={`${token}-${i}`}
            aria-hidden
            className="relative inline-block overflow-hidden align-baseline"
            style={{ lineHeight: 1.1 }}
          >
            <motion.span
              variants={itemVariants}
              custom={delay + i * stagger}
              className="inline-block"
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
