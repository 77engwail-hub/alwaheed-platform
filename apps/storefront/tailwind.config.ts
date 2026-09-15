import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#FBF9F5',
          100: '#F7F5F0',
          200: '#EAE5D9',
          300: '#D9D0C1',
          400: '#B8AA94',
          500: '#8E7D67',
          600: '#675846',
          700: '#483C2F',
          800: '#2C241C',
          900: '#1C1917',
        },
        gold: {
          DEFAULT: '#C5A880',
          light: '#E3CEB2',
          dark: '#9A7D55',
          accent: '#BFA37C',
        },
        marble: {
          white: '#FAFAFA',
          vein: '#E4E2DC',
          charcoal: '#18181B',
        },
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'Cairo', 'sans-serif'],
        sans: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'stone-gradient': 'linear-gradient(135deg, #1C1917 0%, #2C241C 50%, #1C1917 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.2), transparent)',
      },
      boxShadow: {
        'stone-sm': '0 2px 8px -2px rgba(28, 25, 23, 0.08)',
        'stone-md': '0 8px 24px -4px rgba(28, 25, 23, 0.12)',
        'stone-lg': '0 16px 40px -8px rgba(28, 25, 23, 0.18)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
