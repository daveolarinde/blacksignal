/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        panel: '#111111',
        mutedPanel: '#181818',
        primary: '#8b5e34',
        primaryLight: '#b48250',
        cream: '#ece7d7',
        textSoft: '#cfc6ba',
        borderSoft: 'rgba(255,255,255,0.08)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(180,130,80,0.25), 0 10px 40px rgba(0,0,0,0.45)',
        soft: '0 20px 60px rgba(0,0,0,0.3)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(180,130,80,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(139,94,52,0.22), transparent 35%)',
        section: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
