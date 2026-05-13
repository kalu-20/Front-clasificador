'use client';

import { cn } from '@/lib/cn';

type Props = {
  items: string[];
  className?: string;
  reverse?: boolean;
  speed?: number;
};

export function Marquee({ items, className, reverse, speed = 38 }: Props) {
  const list = [...items, ...items];
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      <div
        className="marquee-track py-2"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {list.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex shrink-0 items-center gap-3 font-display text-[clamp(1.75rem,4.5vw,3.5rem)] font-bold uppercase tracking-[-0.02em] text-wine/30"
          >
            {item}
            <span className="inline-block h-2 w-2 rounded-full bg-olive/55" />
          </span>
        ))}
      </div>
    </div>
  );
}
