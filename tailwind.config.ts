import type { Config } from 'tailwindcss';

// CI-Tokens aus Konzept A. Dunkles Canvas dominiert, Cream traegt Text,
// Orange und Gelb sind scharfe Akzente, nicht geflutet.
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0b0b0c',
        cream: '#f5f3ee',
        accent: {
          DEFAULT: '#ff4a1c', // Orange, primaer
          2: '#ffd23f', // Gelb, sekundaer
        },
        panel: {
          DEFAULT: '#141417',
          2: '#26262a',
        },
        border: '#3a3a40',
        muted: '#7d7d84',
        grey: {
          300: '#bcbcbf',
          200: '#dcdbd9',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
