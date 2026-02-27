import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#F7F5F0',
        bg2:   '#EFECE5',
        surf:  '#FFFFFF',
        brd:   '#E0DBD3',
        brds:  '#C4BBB0',
        ink:   '#1A1714',
        ink2:  '#3D3830',
        ink3:  '#7C756C',
        ink4:  '#B0A99F',
        acc:   '#2A5C45',
        accl:  '#E8F2EC',
        accd:  '#1B3D2E',
        accm:  '#4A9E72',
        warn:  '#8B4A13',
        warnl: '#FEF0E6',
        err:   '#9B2335',
        errl:  '#FDEEF1',
        inf:   '#1A4F7A',
        infl:  '#EAF3FB',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans:    ['Instrument Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      borderRadius: {
        r1: '4px', r2: '8px', r3: '14px', r4: '22px', rf: '9999px',
      },
      boxShadow: {
        sh1: '0 1px 4px rgba(26,23,20,.06)',
        sh2: '0 4px 18px rgba(26,23,20,.10)',
        sh3: '0 24px 56px rgba(26,23,20,.13), 0 4px 12px rgba(26,23,20,.06)',
      },
    },
  },
  plugins: [],
};
export default config;
