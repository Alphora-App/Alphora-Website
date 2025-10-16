/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f3ff",   // soft lavender
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",   // main purple
          600: "#7c3aed",   // deeper accent purple
          700: "#6d28d9",   // darker purple
          800: "#5b21b6",
          900: "#3b0764"    // near-indigo depth
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(217, 70, 239, 0.35)" // soft pinkish glow
      },
      backgroundImage: {
        mesh: `
          radial-gradient(1000px 600px at 10% 10%, rgba(168, 85, 247, 0.22), transparent 60%),
          radial-gradient(800px 500px at 90% 20%, rgba(236, 72, 153, 0.18), transparent 60%),
          radial-gradient(700px 500px at 50% 100%, rgba(147, 51, 234, 0.25), transparent 60%)
        `
      },
      backdropBlur: { xs: "2px" }
    },
  },
  plugins: [],
}
