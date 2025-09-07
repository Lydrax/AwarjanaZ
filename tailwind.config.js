/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', /* warm gray with opacity */
        input: 'var(--color-input)', /* subtle gray */
        ring: 'var(--color-ring)', /* warm gray */
        background: 'var(--color-background)', /* soft off-white */
        foreground: 'var(--color-foreground)', /* deep charcoal */
        primary: {
          DEFAULT: 'var(--color-primary)', /* warm gray */
          foreground: 'var(--color-primary-foreground)', /* soft off-white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* lighter gray */
          foreground: 'var(--color-secondary-foreground)', /* deep charcoal */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* muted red */
          foreground: 'var(--color-destructive-foreground)', /* soft off-white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* subtle gray */
          foreground: 'var(--color-muted-foreground)', /* warm gray */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* warm brown */
          foreground: 'var(--color-accent-foreground)', /* soft off-white */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* soft off-white */
          foreground: 'var(--color-popover-foreground)', /* deep charcoal */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* subtle gray */
          foreground: 'var(--color-card-foreground)', /* deep charcoal */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* gentle green */
          foreground: 'var(--color-success-foreground)', /* soft off-white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* warm amber */
          foreground: 'var(--color-warning-foreground)', /* soft off-white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* muted red */
          foreground: 'var(--color-error-foreground)', /* soft off-white */
        },
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'memorial-xs': ['0.75rem', { lineHeight: '1rem' }],
        'memorial-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'memorial-base': ['1rem', { lineHeight: '1.5rem' }],
        'memorial-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'memorial-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'memorial-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'memorial-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'memorial-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        'memorial-xs': '0.5rem',
        'memorial-sm': '0.75rem',
        'memorial-md': '1rem',
        'memorial-lg': '1.5rem',
        'memorial-xl': '2rem',
        'memorial-2xl': '3rem',
      },
      borderRadius: {
        'memorial-sm': '6px',
        'memorial-md': '8px',
        'memorial-lg': '12px',
      },
      boxShadow: {
        'memorial-soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'memorial-medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'memorial-strong': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'memorial-pulse': 'memorial-pulse 1.5s ease-in-out infinite',
        'memorial-fade-in': 'memorial-fade-in 300ms ease-out',
        'memorial-scale-in': 'memorial-scale-in 200ms ease-out',
      },
      keyframes: {
        'memorial-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
        'memorial-fade-in': {
          'from': { opacity: '0', transform: 'translateY(4px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'memorial-scale-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'memorial': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}