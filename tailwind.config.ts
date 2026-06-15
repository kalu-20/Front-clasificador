import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta institucional EcoClasificador.
        // Las CSS vars subyacentes se definen en app/globals.css como triadas
        // R G B (space-separated) — `--canvas-rgb`, `--cream-rgb`, etc. — y
        // cambian entre :root (light) y [data-theme="dark"] (dark). De esta
        // forma, todas las utility classes (incluyendo modificadores de
        // opacidad como `bg-cream/80`) reaccionan automáticamente al cambio
        // de tema.
        canvas:  'rgb(var(--canvas-rgb) / <alpha-value>)',
        cream:   'rgb(var(--cream-rgb) / <alpha-value>)',
        olive:   'rgb(var(--olive-rgb) / <alpha-value>)',
        wine:    'rgb(var(--wine-rgb) / <alpha-value>)',
        magenta: 'rgb(var(--magenta-rgb) / <alpha-value>)',

        // Tonos derivados de texto
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          dim:     'rgb(var(--ink-dim-rgb) / <alpha-value>)',
          muted:   'rgb(var(--ink-muted-rgb) / <alpha-value>)',
        },
        leaf: {
          50:  '#F2FBD9',
          100: '#E1F6A8',
          200: '#C8EE6E',
          300: '#A9DD3B',
          400: '#8AC81F',
          500: '#5E9B07',
          600: '#447A00',       // = olive
          700: '#345E00',
          800: '#264400',
          900: '#1B3000',
        },
        wineline: {
          50:  '#FBE9F3',
          100: '#F4C0DC',
          200: '#E58CB9',
          300: '#D45991',
          400: '#B83370',
          500: '#9C1F5C',
          600: '#7C1155',       // = wine
          700: '#5E0D41',
          800: '#42082E',
          900: '#2A0312',
        },
        sun: {
          50:  '#FFFCE3',
          100: '#FFF6C2',       // = cream
          200: '#FCF291',       // = canvas
          300: '#F9E76A',
          400: '#F0D33C',
        },
      },
      fontFamily: {
        sans: ['var(--font-alice)', 'Georgia', 'serif'],
        display: ['var(--font-alice)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.25rem, 5.5vw, 4.75rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.875rem, 4vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      backgroundImage: {
        'paper':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.49 0 0 0 0 0.07 0 0 0 0 0.34 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        'float-y': {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%':     { transform: 'translate3d(0,-10px,0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'float-y': 'float-y 7s ease-in-out infinite',
        'shimmer': 'shimmer 8s linear infinite',
      },
      boxShadow: {
        'soft':  '0 24px 60px -28px rgba(124,17,85,0.35)',
        'card':  '0 1px 0 rgba(255,255,255,0.5) inset, 0 24px 60px -32px rgba(68,122,0,0.25)',
        'glow':  '0 0 0 1px rgba(124,17,85,0.08), 0 24px 60px -20px rgba(124,17,85,0.35)',
      },
      transitionTimingFunction: {
        'out-expo':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo':    'cubic-bezier(0.7, 0, 0.84, 0)',
      },
    },
  },
  plugins: [],
};

export default config;
