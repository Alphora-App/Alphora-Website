import { motion } from "framer-motion";

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 backdrop-blur bg-brand-900/50 border-b border-brand-400/10"
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-2xl">
          <img
            src={"/Purple%20Alphora%20Logo.png"}
            alt="Alphora logo"
            className="w-10 h-10 object-contain select-none"
            draggable={false}
          />
          <span className="text-brand-100 tracking-wide">Alphora</span>
        </div>

        {/* nav links slightly larger, bolder, and lower */}
        <nav className="hidden sm:flex gap-7 text-lg font-semibold relative top-[4px]">
          <a href="#features" className="opacity-90 hover:opacity-100">
            Features
          </a>
          <a href="#watchlist" className="opacity-90 hover:opacity-100">
            Watchlist
          </a>
          <a href="#faq" className="opacity-90 hover:opacity-100">
            FAQ
          </a>
          <a
            href="#cta"
            className="px-4 py-2 rounded-full glass text-brand-50 font-semibold relative -top-[1px]"
          >
            Get Started
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
