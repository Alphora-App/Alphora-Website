import { motion } from "framer-motion";

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 backdrop-blur bg-brand-900/50 border-b border-brand-400/10"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 font-bold text-xl">
          <img
            src="/alphora-logo-official.svg"
            alt="Alphora logo"
            className="w-24 h-24 object-contain select-none"
            draggable={false}
            onLoad={() => console.log('Nav logo loaded successfully from:', document.querySelector('img[src="/logo.png"]')?.src)}
            onError={(e) => console.log('Nav logo failed to load:', e)}
          />
          <span className="text-cyan-100 tracking-wide text-4xl">Alphora</span>
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
            className="px-4 py-2 rounded-full glass text-cyan-50 font-semibold relative -top-[1px] bg-cyan-500/20 border border-cyan-400/30"
          >
            Get Started
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
