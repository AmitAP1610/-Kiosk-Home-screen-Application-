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
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 243, 255, 0.6), 0 0 30px rgba(0, 243, 255, 0.3)',
        'cyan-intense': '0 0 20px rgba(0, 243, 255, 0.9), 0 0 45px rgba(0, 243, 255, 0.5)',
      }
    },
  },
  plugins: [],
}

