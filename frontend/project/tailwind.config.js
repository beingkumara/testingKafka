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
          900: '#000000',
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
        display: ['"Formula1-Wide"', '"Titillium Web"', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(225, 6, 0, 0.5)',
        'glow-blue': '0 0 15px rgba(0, 144, 208, 0.5)',
        'glow-green': '0 0 15px rgba(39, 245, 155, 0.5)',
        'glow-orange': '0 0 15px rgba(255, 135, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500")',
      },
      backgroundImage: {
        'carbon-fiber': "url('/images/carbon-fiber.png')", // We'll need to ensure this asset exists or use a CSS pattern
        'grid-pattern': "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'speed-line': 'speed-line 1.5s linear infinite',
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
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};