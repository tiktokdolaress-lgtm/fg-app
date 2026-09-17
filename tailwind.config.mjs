/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface2) / <alpha-value>)',
        deep: 'rgb(var(--deep) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        gold: '#FFC846',
        gold2: '#E5A93C',
        ink: '#F5F5F7',
        muted: '#8E8E93',
        danger: '#FF4D4D',
        danger2: '#D52020',
        ok: '#3DD68C',
      },
      fontFamily: {
        display: ['var(--fd)', 'Impact', 'sans-serif'],
        body: ['var(--fb)', 'system-ui', 'sans-serif'],
        mono: ['var(--fm)', 'monospace'],
      },
      borderRadius: {
        r: '12px',
        r2: '16px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255,200,70,.12)',
      },
    },
  },
  plugins: [],
};
