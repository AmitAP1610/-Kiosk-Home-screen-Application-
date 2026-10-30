/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        robot: {
          bg: '#000000',
          cyan: '#00f3ff',
          cyanDim: '#009bb3',
          cyanGlow: '#38f9d7',
          cyanDark: '#04222f',
          bezel: '#12151b',
          bezelBorder: '#232936',
          whiteChassis: '#f0f3f6',
        },
        ssu: {
          maroon: '#702815',
          maroonDark: '#45160b',
          maroonLight: '#8a341e',
          maroonMuted: 'rgba(112, 40, 21, 0.25)',
          gold: '#C8A451',
          goldLight: '#e4c375',
          goldDark: '#9e7e31',
          goldMuted: 'rgba(200, 164, 81, 0.2)',
          black: '#000000',
          white: '#FFFFFF',
          surface: '#120704',
          card: '#1a0b07',
          border: '#38160e',
          borderGold: '#5e4414',
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 243, 255, 0.6), 0 0 30px rgba(0, 243, 255, 0.3)',
        'cyan-intense': '0 0 20px rgba(0, 243, 255, 0.9), 0 0 45px rgba(0, 243, 255, 0.5)',
        'ssu-gold': '0 0 15px rgba(200, 164, 81, 0.4), 0 0 30px rgba(200, 164, 81, 0.2)',
        'ssu-maroon': '0 0 20px rgba(112, 40, 21, 0.5)',
      }
    },
  },
  plugins: [],
}

