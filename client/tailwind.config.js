/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral, Claude/ChatGPT-style chrome: white surfaces, near-black text, gray steps.
        canvas: '#ffffff',
        surface: '#ffffff',
        sidebar: '#fafafa',
        subtle: '#f4f4f5',
        border: {
          DEFAULT: '#e5e5e7',
          soft: '#eeeeef',
        },
        ink: {
          DEFAULT: '#171717',
          soft: '#404040',
          faint: '#737373',
          quiet: '#a3a3a3',
        },
        hitesh: {
          DEFAULT: '#c9762c',
          soft: '#e0a15f',
          tint: '#fbeee1',
        },
        piyush: {
          DEFAULT: '#3d7fd6',
          soft: '#7fabe8',
          tint: '#e7eff9',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'ui-sans-serif', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1.2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.2s ease-out',
      },
      boxShadow: {
        panel: '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 12px -4px rgba(0,0,0,0.06)',
        popover: '0 12px 32px -8px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
