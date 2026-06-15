'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { EcoLogo } from '@/components/ui/eco-logo';
import { LangToggle } from '@/components/ui/LangToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useI18n } from '@/lib/i18n/I18nProvider';

const NAV_HREFS = [
  { href: '/', key: 'nav.home' as const },
  { href: '/sobre', key: 'nav.about' as const },
  { href: '/clasificar', key: 'nav.classify' as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        'fixed inset-x-0 top-3 z-50 mx-auto flex w-[min(1200px,calc(100%-1rem))] items-center justify-between rounded-2xl px-3 py-2 sm:px-4 sm:py-3 transition-[background-color,border-color,box-shadow] duration-300',
        scrolled
          ? 'border border-wine/10 bg-cream/80 shadow-card'
          : 'border border-transparent bg-cream/40',
      )}
    >
      <Link
        href="/"
        className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5"
        aria-label={t('nav.homeAriaLabel') as string}
      >
        <EcoLogo size={36} priority className="transition-transform duration-300 group-hover:scale-105" />
        <span className="hidden font-display text-[15px] font-semibold tracking-tight text-wine sm:inline">
          EcoClasificador
        </span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.home') as string}>
        {NAV_HREFS.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative rounded-xl px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors duration-200',
                active ? 'text-cream' : 'text-wine hover:text-wine/80',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-wine"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{t(item.key) as string}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        <LangToggle />
        <ThemeToggle />
        <Link
          href="/clasificar"
          className="group relative inline-flex items-center gap-2 rounded-xl bg-olive px-4 py-2 text-[13px] font-semibold text-cream shadow-soft transition-transform duration-200 hover:-translate-y-[1px]"
        >
          {t('nav.tryClassifier') as string}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <LangToggle />
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={t('common.menu') as string}
          aria-expanded={open}
          className="relative grid h-9 w-9 place-items-center rounded-xl border border-wine/15 bg-cream text-wine"
        >
          <span
            className={cn(
              'block h-[2px] w-4 bg-current transition-all duration-300',
              open ? 'translate-y-[3px] rotate-45' : '-translate-y-[3px]',
            )}
          />
          <span
            className={cn(
              'absolute block h-[2px] w-4 bg-current transition-all duration-300',
              open ? '-translate-y-[3px] -rotate-45' : 'translate-y-[3px]',
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-2 right-2 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-wine/10 bg-cream p-2 shadow-card md:hidden"
          >
            <ul className="flex flex-col">
              {NAV_HREFS.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors',
                        active
                          ? 'bg-wine text-cream'
                          : 'text-wine hover:bg-wine/10',
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {t(item.key) as string}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
