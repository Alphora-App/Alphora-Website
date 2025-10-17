import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center bg-mesh">

      {/* title */}
      <motion.h1
        className="text-8xl md:text-9xl font-extrabold text-cyan-400"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Alphora
      </motion.h1>

      {/* slogan */}
      <motion.p
        className="mt-4 text-2xl font-bold text-brand-100 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Learn investing in just 5 minutes.
      </motion.p>
    </section>
  );
}
