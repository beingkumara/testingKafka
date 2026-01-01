/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1F0',
          100: '#FFE4E2',
          200: '#FECAC5',
          300: '#FCA69E',
          400: '#F87A6E',
          500: '#E10600', // F1 red
          600: '#C40500',
          700: '#9B0400',
          800: '#760300',
          900: '#580200',
        },
        secondary: {
          50: '#F4F4F7',
          100: '#E9E9EF',
          200: '#D3D3DF',
          300: '#B4B4C7',
          400: '#9595AF',
          500: '#15151E', // F1 dark blue
          600: '#13131B',
          700: '#111118',
          800: '#0E0E14',
          900: '#0B0B10',
        },
        accent: {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#2D2D2D',
        },
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'system-ui', 'sans-serif'],
        heading: ['"Formula1-Bold"', '"Orbitron"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(225, 6, 0, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(225, 6, 0, 0.2)',
      },
    },
  },
  plugins: [],
};