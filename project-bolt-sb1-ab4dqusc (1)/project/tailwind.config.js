/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // F1 inspired colors
        primary: {
          50: '#FFEDE9',
          100: '#FFD1C8',
          200: '#FFA499',
          300: '#FF766A',
          400: '#FF493B',
          500: '#E10600', // F1 red
          600: '#BA0500',
          700: '#940400',
          800: '#6D0300',
          900: '#470200',
        },
        secondary: {
          50: '#EAEAEF',
          100: '#D5D5DF',
          200: '#ACABC0',
          300: '#8281A0',
          400: '#595781',
          500: '#333342', // F1 dark blue/grey
          600: '#282836',
          700: '#1E1E2A',
          800: '#15151E', // F1 dark
          900: '#0C0C12',
        },
        accent: {
          50: '#F4F4F4',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B9B9B9',
          400: '#A3A3A3',
          500: '#8C8C8C',
          600: '#767676',
          700: '#5F5F5F',
          800: '#494949',
          900: '#333333',
        },
        success: {
          500: '#4CAF50',
        },
        warning: {
          500: '#FF9800',
        },
        error: {
          500: '#F44336',
        },
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'system-ui', 'sans-serif'],
        heading: ['"Formula1-Bold"', '"Titillium Web"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(225, 6, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};