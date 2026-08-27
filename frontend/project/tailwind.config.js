/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // F1 inspired color palette - RED (Main Brand)
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
          DEFAULT: '#E10600',
        },
        // Carbon Fiber / Dark Mode backgrounds
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#1F1F2E', // Lighter dark for cards
          600: '#15151E', // Main background
          700: '#101016',
          800: '#0A0A0E', // Deepest background
          900: '#05050A',
          950: '#020617', // Absolute darkest
        },
        // Secondary accent - Cyan/Blue (Mercedes/Petronas vibes)
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
        // Tertiary - Gold/Podium (used in sidebar, race results)
        tertiary: {
          400: '#FFD700',
          500: '#F4C430', // Gold accent
          600: '#D4A017',
        },
        // Accent - Neon Green (fastest lap, DRS zone)
        accent: {
          400: '#4ADE80',
          500: '#22C55E', // Success green
          600: '#16A34A',
        },
        // Status Colors
        success: '#27F59B', // F1 Modern Green
        warning: '#FF8700', // McLaren Orange / Warning Flag
        error: '#E10600',   // Red Flag
        info: '#33CFFF',    // Wet Tire Blue

        // Team Colors (2024/25 Palette)
        team: {
          mercedes: '#00D2BE',
          redbull: '#0600EF',
          ferrari: '#E80020',
          mclaren: '#FF8000',
          alpine: '#0090FF',
          astonmartin: '#229971',
          williams: '#64C4FF',
          bulls: '#1634CB', // RB
          sauber: '#52E252', // Kick Sauber
          haas: '#B6BABD',
        }
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'system-ui', 'sans-serif'],
        heading: ['"Formula1-Bold"', '"Titillium Web"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
        display: ['"Orbitron"', '"Formula1-Wide"', '"Titillium Web"', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(225, 6, 0, 0.5)',
        'glow-red-lg': '0 0 30px rgba(225, 6, 0, 0.4), 0 0 60px rgba(225, 6, 0, 0.2)',
        'glow-blue': '0 0 15px rgba(0, 144, 208, 0.5)',
        'glow-green': '0 0 15px rgba(39, 245, 155, 0.5)',
        'glow-orange': '0 0 15px rgba(255, 135, 0, 0.5)',
        'glow-gold': '0 0 15px rgba(244, 196, 48, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500")',
        'inner-red': 'inset 3px 0 0 #E10600',
      },
      backgroundImage: {
        'carbon-fiber': "url('/images/carbon-fiber.png')",
        'grid-pattern': "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'checkered': 'repeating-conic-gradient(#222 0% 25%, transparent 0% 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-red': 'pulse-red 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'speed-line': 'speed-line 1.5s linear infinite',
        'glow-border': 'glow-border 2s linear infinite',
        'slide-in-left': 'slide-in-left 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'lights-on': 'lights-on 0.2s ease-out forwards',
        'lights-off': 'lights-off 0.3s ease-in forwards',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 6px rgba(225, 6, 0, 0.8)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 14px rgba(225, 6, 0, 1)' },
        },
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
        'glow-border': {
          '0%, 100%': { borderColor: 'rgba(225, 6, 0, 0.3)' },
          '50%': { borderColor: 'rgba(225, 6, 0, 0.9)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'lights-on': {
          '0%': { backgroundColor: 'transparent', boxShadow: 'none' },
          '100%': { backgroundColor: '#E10600', boxShadow: '0 0 20px rgba(225,6,0,0.9)' },
        },
        'lights-off': {
          '0%': { backgroundColor: '#E10600', boxShadow: '0 0 20px rgba(225,6,0,0.9)' },
          '100%': { backgroundColor: '#1a0000', boxShadow: '0 0 4px rgba(225,6,0,0.2)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
    },
  },
  plugins: [
    // Custom tabular-nums utility
    function ({ addUtilities }) {
      addUtilities({
        '.tabular-nums': {
          'font-variant-numeric': 'tabular-nums',
        },
        '.slashed-zero': {
          'font-variant-numeric': 'slashed-zero',
        },
      });
    },
  ],
};