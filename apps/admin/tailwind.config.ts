import type { Config } from 'tailwindcss';

const config: Config = {
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
        },
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
