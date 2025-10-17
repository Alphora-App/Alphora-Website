/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f8fafc",   // soft white
          100: "#e2e8f0",   // light gray-blue
          200: "#cbd5e1",   // light slate
          300: "#94a3b8",   // medium slate
          400: "#64748b",   // slate-500
          500: "#475569",   // slate-600
          600: "#334155",   // slate-700
          700: "#1e293b",   // slate-800
          800: "#0f172a",   // deep navy
          900: "#020617"    // almost black
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(217, 70, 239, 0.35)" // soft pinkish glow
      },
      backgroundImage: {
        mesh: `
          radial-gradient(1000px 600px at 10% 10%, rgba(139, 92, 246, 0.22), transparent 60%),
          radial-gradient(800px 500px at 90% 20%, rgba(30, 41, 59, 0.18), transparent 60%),
          radial-gradient(700px 500px at 50% 100%, rgba(71, 85, 105, 0.25), transparent 60%)
        `
      },
      backdropBlur: { xs: "2px" }
    },
  },
  plugins: [],
}
