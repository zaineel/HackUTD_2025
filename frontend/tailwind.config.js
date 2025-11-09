/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gs: {
          navy: {
            DEFAULT: '#001E4D',
            light: '#003366',
            dark: '#000C28'
          },
          blue: {
            DEFAULT: '#005EB8',
            light: '#0078D4',
            dark: '#004B96'
          },
          gold: {
            DEFAULT: '#C5A572',
            light: '#D4B896',
            dark: '#A68E5E'
          },
          gray: {
            50: '#F8FAFB',
            100: '#F1F4F7',
            200: '#E4E9ED',
            300: '#C8D1D9',
            400: '#96A5B3',
            500: '#6B7B8C',
            600: '#4A5968',
            700: '#2F3D4A',
            800: '#1E2936',
            900: '#0F1926'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'gs': '0 2px 8px rgba(0, 30, 77, 0.08)',
        'gs-lg': '0 4px 16px rgba(0, 30, 77, 0.12)',
        'gs-xl': '0 8px 32px rgba(0, 30, 77, 0.16)',
      }
    },
  },
  plugins: [],
}
