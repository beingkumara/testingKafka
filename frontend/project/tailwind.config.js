/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // F1 inspired color palette
        primary: {
          50: '#FFF1F0',
          100: '#FFE2E0',
          200: '#FFC5C0',
          300: '#FFA8A0',
          400: '#FF8B80',
          500: '#E10600', // F1 Official Red
          600: '#C10500',
          700: '#A10400',
          800: '#810300',
          900: '#610200',
        },
        secondary: {
          50: '#E6F9FF',
          100: '#CCF3FF',
          200: '#99E7FF',
          300: '#66DBFF',
          400: '#33CFFF',
          500: '#0090D0', // F1 Blue
          600: '#007AB8',
          700: '#00649F',
          800: '#004E87',
          900: '#00386F',
        },
        tertiary: {
          50: '#F0FFF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#27F59B', // F1 Turquoise
          600: '#15D080',
          700: '#0FAC65',
          800: '#09874F',
          900: '#046339',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF8700', // F1 Orange
          600: '#E06C00',
          700: '#C25100',
          800: '#A33700',
          900: '#851D00',
        },
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#15151E', // F1 Dark Blue/Black
          600: '#13131A',
          700: '#101016',
          800: '#0D0D12',
          900: '#0A0A0E',
        },
        success: {
          500: '#27F59B', // F1 Turquoise
        },
        warning: {
          500: '#FF8700', // F1 Orange
        },
        error: {
          500: '#E10600', // F1 Red
        },
        // Team colors
        mercedes: '#00D2BE',
        redbull: '#0600EF',
        ferrari: '#DC0000',
        mclaren: '#FF8700',
        alpine: '#0090FF',
        astonmartin: '#006F62',
        williams: '#005AFF',
        alphatauri: '#2B4562',
        alfaromeo: '#900000',
        haas: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'system-ui', 'sans-serif'],
        heading: ['"Formula1-Bold"', '"Titillium Web"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(225, 6, 0, 0.7)',
        'glow-blue': '0 0 20px rgba(0, 144, 208, 0.7)',
        'glow-green': '0 0 20px rgba(39, 245, 155, 0.7)',
        'glow-orange': '0 0 20px rgba(255, 135, 0, 0.7)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
        'f1-card': '0 8px 20px rgba(225, 6, 0, 0.15)',
        'f1-card-hover': '0 12px 28px rgba(225, 6, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'speed-line': 'speed-line 1.5s linear infinite',
        'checkered-flag': 'checkered-flag 2s ease-in-out infinite',
        'tire-spin': 'tire-spin 0.8s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'speed-line': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'checkered-flag': {
          '0%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 0.8 },
        },
        'tire-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        'checkered-flag': 'repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 0, #fff 20px), repeating-linear-gradient(-45deg, #000 0, #000 10px, #fff 0, #fff 20px)',
        'racing-stripe': 'linear-gradient(90deg, transparent, #E10600, transparent)',
        'speed-blur': 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 60%, transparent 70%)',
        'f1-grid': 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(225, 6, 0, 0.1) 20px, rgba(225, 6, 0, 0.1) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(225, 6, 0, 0.1) 20px, rgba(225, 6, 0, 0.1) 21px)',
      },
      borderRadius: {
        'f1': '0.5rem',
      },
    },
  },
  plugins: [],
};