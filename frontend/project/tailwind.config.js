/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vibrant modern color palette
        primary: {
          50: '#FFF1F0',
          100: '#FFE2E0',
          200: '#FFC5C0',
          300: '#FFA8A0',
          400: '#FF8B80',
          500: '#FF3D30', // Vibrant red
          600: '#E02A20',
          700: '#C01810',
          800: '#A00800',
          900: '#800400',
        },
        secondary: {
          50: '#E6F9FF',
          100: '#CCF3FF',
          200: '#99E7FF',
          300: '#66DBFF',
          400: '#33CFFF',
          500: '#00C3FF', // Vibrant blue
          600: '#009CCC',
          700: '#007599',
          800: '#004E66',
          900: '#002733',
        },
        tertiary: {
          50: '#F0FFF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Vibrant green
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Vibrant orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#0F172A', // Dark blue/slate
          600: '#0D1424',
          700: '#0B101E',
          800: '#080C18',
          900: '#050812',
        },
        success: {
          500: '#10B981', // Emerald
        },
        warning: {
          500: '#F59E0B', // Amber
        },
        error: {
          500: '#EF4444', // Red
        },
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'system-ui', 'sans-serif'],
        heading: ['"Formula1-Bold"', '"Titillium Web"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(255, 61, 48, 0.6)',
        'glow-blue': '0 0 15px rgba(0, 195, 255, 0.6)',
        'glow-green': '0 0 15px rgba(34, 197, 94, 0.6)',
        'glow-orange': '0 0 15px rgba(249, 115, 22, 0.6)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      },
    },
  },
  plugins: [],
};