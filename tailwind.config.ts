import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'gallery-bg': '#f5f1ea',
        'gallery-wall': '#ebe4d6',
        'gallery-mat': '#f7f1e3',
        'gallery-crimson': '#7a2025',
        'gallery-gold': '#c9a14a',
        'gallery-gold-dark': '#8c6e2c',
        'gallery-ink': '#2a241c',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Garamond', 'serif'],
        body: ['var(--font-body)', 'EB Garamond', 'Garamond', 'serif'],
      },
      boxShadow: {
        frame: '0 18px 40px -12px rgba(35, 25, 15, 0.45), 0 6px 12px -4px rgba(35, 25, 15, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
