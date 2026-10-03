/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary backgrounds - Crisp Intelligence Canvas
        'bg-base':       '#F8FAFC',
        'bg-surface':    '#FFFFFF',
        'bg-secondary':  '#F1F5F9',
        'bg-elevated':   '#FFFFFF',

        // Borders
        'border-default': '#E2E8F0',
        'border-strong':  '#CBD5E1',
        'border-subtle':  '#F1F5F9',

        // Typography - Ultra crisp high-contrast
        'text-primary':   '#0F172A',
        'text-secondary': '#475569',
        'text-muted':     '#64748B',
        'text-disabled':  '#94A3B8',

        // Government brand palette
        'gov-blue':       '#0A2540',
        'gov-blue-2':     '#10385F',
        'gov-blue-light': '#F0F5FA',
        'gov-blue-mid':   '#1E40AF',
        'gov-saffron':    '#D97706',
        'gov-saffron-light': '#FEF3C7',
        'gov-ashoka':     '#081B2E',

        // Forensic Status Colors
        'status-green':   '#059669',
        'status-green-bg':'#ECFDF5',
        'status-amber':   '#D97706',
        'status-amber-bg':'#FFFBEB',
        'status-red':     '#DC2626',
        'status-red-bg':  '#FEF2F2',
        'status-blue':    '#2563EB',
        'status-blue-bg': '#EFF6FF',

        // Investigation accent
        'inv-accent':     '#0A2540',
        'inv-accent-bg':  '#F8FAFC',

        // Monospace / forensic
        'mono-green':     '#047857',
        'mono-amber':     '#B45309',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Menlo', 'Consolas', 'monospace'],
        legal: ['Newsreader', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(23, 33, 43, 0.06), 0 1px 2px -1px rgba(23, 33, 43, 0.04)',
        'panel':   '0 2px 8px 0 rgba(23, 33, 43, 0.08)',
        'header':  '0 1px 0 0 #D9E0E7',
        'elevated':'0 4px 16px 0 rgba(23, 33, 43, 0.10)',
        'nav':     'inset 2px 0 0 #123B63',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(12px)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
