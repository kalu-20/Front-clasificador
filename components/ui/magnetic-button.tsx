'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: Variant;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-wine text-cream shadow-soft hover:-translate-y-[1px] hover:shadow-glow',
  secondary:
    'bg-olive text-cream shadow-soft hover:-translate-y-[1px]',
  outline:
    'bg-transparent text-wine ring-1 ring-wine/25 hover:bg-wine/5 hover:ring-wine/45',
};

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = 'primary',
  type = 'button',
  disabled,
  ariaLabel,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const w = wrapRef.current;
    if (!w) return;
    const rect = w.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    w.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    const w = wrapRef.current;
    if (w) w.style.transform = 'translate3d(0,0,0)';
  };

  const baseClass = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold tracking-tight transition-[transform,box-shadow,background-color] duration-200 will-change-transform',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
    VARIANTS[variant],
    className,
  );

  const content = (
    <span
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={baseClass}
      style={{ transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className="inline-block">
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-block bg-transparent p-0"
    >
      {content}
    </button>
  );
}
