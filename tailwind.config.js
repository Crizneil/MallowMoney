/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        'pixel': ['VT323', 'monospace'],
        'press-start': ['"Press Start 2P"', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        space: {
          bg: "#0B0E14",
          card: "#161B22",
          glass: "rgba(22, 27, 34, 0.7)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        'mallow-light-bg': "#FFF9F5",
        'mallow-light-card': "#FFFFFF",
        'mallow-light-pink': "#FFD1DC",
        'mallow-light-blue': "#B0E0E6",
        'mallow-light-cream': "#FFF9F5",
        'mallow-light-text': "#4A4E69",
        'mallow-light-glass': "rgba(255, 255, 255, 0.7)",
        'mallow-light-border': "rgba(255, 179, 198, 0.2)",
        mallow: {
          white: "#FFFFFF",
          pink: "#FFB7C5",
          shadow: "#D1D5DB",
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glass-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
