import type { Variants } from 'framer-motion';

export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeInOutExpo: [number, number, number, number] = [0.87, 0, 0.13, 1];
export const easePremium: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOutExpo } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: easeOutExpo } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: easeOutExpo } },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(10px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.05, ease: easeOutExpo } },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const maskReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1.1, ease: easeOutExpo } },
};
