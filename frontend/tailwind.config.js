/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── FOODBRIDGE DARK + NEON THEME (black #0a0a0a · neon #dfff00 · green #2bff88) ──
        'bg-dark': '#0a0a0a',
        'bg-darker': '#050505',
        'accent-neon': '#dfff00',
        'accent-neon-bright': '#eaff4d',
        'text-white': '#ffffff',
        'text-on-accent': '#0a0a0a',
        'border-subtle': 'rgba(43,255,136,0.18)',
        'bg-dark-elevated': 'rgba(10,10,10,0.92)',

        // ── M3-style semantic system, remapped to dark + neon ──
        surface: '#0a0a0a',
        'surface-dim': '#050505',
        'surface-bright': '#0a0a0a',
        'surface-container-lowest': '#141614',
        'surface-container-low': '#1b1e1b',
        'surface-container': '#232723',
        'surface-container-high': '#2e322e',
        'surface-container-highest': '#343834',
        'surface-variant': '#343834',
        'on-surface': '#ffffff',
        'on-surface-variant': '#9aa39b',
        'inverse-surface': '#0a0a0a',
        'inverse-on-surface': '#ffffff',
        outline: '#8a948b',
        'outline-variant': '#2e322e',
        'surface-tint': '#dfff00',

        primary: '#dfff00',
        'on-primary': '#0a0a0a',
        'primary-container': '#0e5c35',
        'on-primary-container': '#ffffff',
        'inverse-primary': '#0a0a0a',

        secondary: '#2bff88',
        'on-secondary': '#0a0a0a',
        'secondary-container': '#2bff88',
        'on-secondary-container': '#0a0a0a',

        tertiary: '#ffd54d',
        'on-tertiary': '#0a0a0a',
        'tertiary-container': '#3a3000',
        'on-tertiary-container': '#ffd54d',

        error: '#ff4d4d',
        'on-error': '#0a0a0a',
        'error-container': '#3a1414',
        'on-error-container': '#ff9d9d',

        'primary-fixed': '#dfff00',
        'primary-fixed-dim': '#b8d400',
        'on-primary-fixed': '#0a0a0a',
        'on-primary-fixed-variant': '#0a0a0a',
        'secondary-fixed': '#6ffbbe',
        'secondary-fixed-dim': '#4edea3',
        'on-secondary-fixed': '#002113',
        'on-secondary-fixed-variant': '#002113',
        'tertiary-fixed': '#3a3000',
        'tertiary-fixed-dim': '#ffd54d',
        'on-tertiary-fixed': '#ffd54d',
        'on-tertiary-fixed-variant': '#ffd54d',

        // ── Semantic aliases → CSS vars (legacy class names keep working) ──
        app: 'rgb(var(--fb-app) / <alpha-value>)',
        panel: 'rgb(var(--fb-panel) / <alpha-value>)',
        elevated: 'rgb(var(--fb-elevated) / <alpha-value>)',
        line: 'rgb(var(--fb-line) / <alpha-value>)',
        muted: 'rgb(var(--fb-muted) / <alpha-value>)',
        harvest: 'rgb(var(--fb-accent) / <alpha-value>)',
        tomato: 'rgb(var(--fb-danger) / <alpha-value>)',
        carrot: 'rgb(var(--fb-secondary) / <alpha-value>)',
        wheat: 'rgb(var(--fb-highlight) / <alpha-value>)',
        leaf: 'rgb(var(--fb-leaf) / <alpha-value>)',
        bone: 'rgb(var(--fb-text) / <alpha-value>)',
        cream: {
          DEFAULT: 'rgb(var(--fb-text) / <alpha-value>)',
          muted: 'rgb(var(--fb-text-2) / <alpha-value>)',
          dark: 'rgb(var(--fb-text-3) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--fb-app) / <alpha-value>)',
          deep: 'rgb(var(--fb-app-deep) / <alpha-value>)',
          soft: 'rgb(var(--fb-panel) / <alpha-value>)',
        },
        botanical: {
          DEFAULT: '#0e5c35',
          light: '#2bff88',
          dark: '#002111',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
        body: ['Rubik', 'system-ui', 'sans-serif'],
        headline: ['Anton', 'Impact', 'sans-serif'],
        label: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        glass: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glass-lg':
          '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'glass-xl': '0 24px 48px -8px rgba(0, 0, 0, 0.7)',
        header: '0 1px 8px rgba(0, 0, 0, 0.5)',
        'bottom-nav': '0 -2px 12px rgba(0, 0, 0, 0.6)',
        fab: '0 4px 12px rgba(223, 255, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
