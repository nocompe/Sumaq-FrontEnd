/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Geist', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#16a34a',
        'on-primary': '#ffffff',
        'primary-container': '#86efac',
        'on-primary-container': '#1b4d2a',
        'primary-fixed': '#86efac',
        'primary-fixed-dim': '#5ac74b',
        
        secondary: '#0ea5e9',
        'on-secondary': '#ffffff',
        'secondary-container': '#e0f2fe',
        'on-secondary-container': '#0c4a6e',
        
        tertiary: '#f59e0b',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#fef3c7',
        'on-tertiary-container': '#78350f',
        
        surface: '#f8fafc',
        'on-surface': '#0f172a',
        'on-surface-variant': '#475569',
        'surface-variant': '#e2e8f0',
        'surface-container': '#f1f5f9',
        'surface-container-low': '#ffffff',
        'surface-container-lowest': '#f8fafc',
        
        outline: '#cbd5e1',
        'outline-variant': '#e2e8f0',
        
        background: '#f8fafc',
        'on-background': '#0f172a',
        
        error: '#dc2626',
        'on-error': '#ffffff',
        'error-container': '#fee2e2',
        'on-error-container': '#7f1d1d',
        
        success: '#22c55e',
        warning: '#eab308',
        info: '#06b6d4',
      },
      animation: {
        'in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-primary': theme('colors.primary'),
          '--color-on-primary': theme('colors.on-primary'),
          '--color-secondary': theme('colors.secondary'),
          '--color-on-secondary': theme('colors.on-secondary'),
          '--color-surface': theme('colors.surface'),
          '--color-on-surface': theme('colors.on-surface'),
        },
      });
    }),
  ],
}
