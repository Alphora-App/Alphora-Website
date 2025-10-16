import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center bg-mesh">
      {/* logo */}
      <motion.img
        src="/Green Alphora Logo.png"
        alt="Alphora logo"
        className="w-[320px] h-[220px] mb-6 drop-shadow-lg -ml-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* title */}
      <motion.h1
        className="text-7xl md:text-8xl font-extrabold text-brand-400"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Alphora
      </motion.h1>

      {/* slogan */}
      <motion.p
        className="mt-4 text-lg text-brand-100 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Learn investing in just 5 minutes.
      </motion.p>
    </section>
  );
}
