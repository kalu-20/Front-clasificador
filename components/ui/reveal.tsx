'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/cn';
import { fadeUp } from '@/lib/motion';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  once?: boolean;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
};

export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  once = true,
  as = 'div',
}: Props) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-80px' }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
