/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#070B17',
          card: '#111827',
          purple: '#8B5CF6',
          gold: '#F59E0B',
          success: '#10B981',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
        slate: {
          950: '#070B17',
          900: '#111827',
        },
        amber: {
          500: '#F59E0B',
          400: '#FBBF24',
        },
        emerald: {
          500: '#10B981',
          400: '#34D399',
        },
        purple: {
          500: '#8B5CF6',
          600: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
