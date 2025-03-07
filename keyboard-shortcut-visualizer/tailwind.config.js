/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#90cdf4',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        gray: {
          light: '#f3f4f6',
          DEFAULT: '#9ca3af',
          dark: '#4b5563',
        },
        red: {
          light: '#fca5a5',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        green: {
          light: '#a7f3d0',
          DEFAULT: '#10b981',
          dark: '#065f46',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}