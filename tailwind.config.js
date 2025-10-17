/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f3ff",
          100: "#e9e8ff",
          200: "#c9bfff",
          300: "#a38eff",
          400: "#7f5cff",
          500: "#7041ff",   // rich violet-blue core
          600: "#552ae5",   // darker violet
          700: "#2b1a72",   // deep indigo shadow
          800: "#151033",   // near-black indigo base
          900: "#090713"    // almost black — background base
        },
        accent: {
          magenta: "#d946ef", // subtle glow accent
          blue: "#420efeff"
        }
      },
      boxShadow: {
        glow: "0 0 80px rgba(125, 66, 255, 0.3)", // violet halo
        glowSoft: "0 0 60px rgba(217, 70, 239, 0.15)"
      },
      backgroundImage: {
        mesh: `
          radial-gradient(900px 600px at 10% 10%, rgba(125, 66, 255, 0.25), transparent 70%),
          radial-gradient(800px 500px at 90% 20%, rgba(91, 33, 182, 0.18), transparent 70%),
          radial-gradient(900px 600px at 50% 100%, rgba(66, 7, 243, 0.12), transparent 75%)
        `
      },
      backdropBlur: { xs: "2px" }
    },
  },
  plugins: [],
}
