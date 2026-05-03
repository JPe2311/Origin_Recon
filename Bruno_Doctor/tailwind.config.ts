import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#0ea5e9', 700: '#0369a1' }
      }
    }
  },
  plugins: []
} satisfies Config;
