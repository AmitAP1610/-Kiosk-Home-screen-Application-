/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official KIOSK AMR Physical Robot Palette
        kiosk: {
          white: '#FFFFFF',
          charcoal: '#30343B',
          green: '#174D3A',
          greenHover: '#134232',
          lightGreen: '#DCE8E1',
          dark: '#202124',
          border: '#DDE3DE',
          silver: '#B0B4B8',
          text: '#30343B',
          textSecondary: '#68736C',
          textMuted: '#68736C',
          warning: '#D49A36',
          error: '#B42318',
        },
        amr: {
          bg: '#FFFFFF',        // Main background
          primary: '#30343B',   // Sidebar and primary elements
          secondary: '#68736C', // Secondary text
          border: '#DDE3DE',    // Border and dividers
          dark: '#202124',      // Dark components
          accent: '#174D3A',    // Forest Green accent
          accentHover: '#134232',
          highlight: '#DCE8E1', // Light Green highlight
          card: '#FFFFFF',      // Cards
          text: '#30343B',      // Primary readable text
          textMuted: '#68736C', // Secondary text
          warning: '#D49A36',
          error: '#B42318',
        },
        chaos: {
          bg: '#FFFFFF',
          charcoal: '#30343B',
          charcoalDark: '#23272D',
          charcoalLight: '#3A3F47',
          maroon: '#174D3A',    // Forest Green
          maroonHover: '#134232',
          maroonLight: '#237A5C',
          display: '#202124',
          white: '#FFFFFF',
          silver: '#B0B4B8',
          rubber: '#202124',
          card: '#FFFFFF',
        },
        robot: {
          bg: '#202124',
          cyan: '#174D3A',
          cyanDim: '#134232',
          cyanGlow: '#237A5C',
          cyanDark: '#202124',
          bezel: '#30343B',
          bezelBorder: '#B0B4B8',
          whiteChassis: '#FFFFFF',
        },
        ssu: {
          maroon: '#174D3A',
          maroonDark: '#134232',
          maroonLight: '#237A5C',
          maroonMuted: 'rgba(23, 77, 58, 0.15)',
          gold: '#174D3A',
          goldLight: '#237A5C',
          goldDark: '#134232',
          goldMuted: 'rgba(23, 77, 58, 0.15)',
          black: '#202124',
          white: '#FFFFFF',
          surface: '#30343B',
          card: '#FFFFFF',
          border: '#B0B4B8',
          borderGold: '#174D3A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(48, 52, 59, 0.08), 0 1px 2px rgba(48, 52, 59, 0.04)',
        'card': '0 2px 6px rgba(48, 52, 59, 0.06)',
      }
    },
  },
  plugins: [],
}
