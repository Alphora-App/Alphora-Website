import { motion } from "framer-motion";

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 backdrop-blur bg-brand-900/50 border-b border-brand-400/10 glass-dark"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 font-bold text-xl">
          <img
            src="/alphora-logo-official.svg"
            alt="Alphora logo"
            className="w-24 h-24 object-contain select-none"
            draggable={false}
            onLoad={() => {
              const img = document.querySelector(
                'img[src="/alphora-logo-official.svg"]'
              ) as HTMLImageElement | null;
              console.log(
                "Nav logo loaded successfully from:",
                img?.src || "not found"
              );
            }}
            onError={(e) =>
              console.error("Nav logo failed to load:", e)
            }
          />

          <span className="text-cyan-100 tracking-wide text-4xl">
            Alphora
          </span>
        </div>

        {/* updated nav: modern labels + small micro-interactions */}
        <nav className="hidden sm:flex gap-7 text-lg font-semibold items-center">
          <a href="#testimonials" className="opacity-90 hover:opacity-100 interactive">
            Testimonials
          </a>
          <a href="#showcase" className="opacity-90 hover:opacity-100 interactive">
            Preview
          </a>
          <a href="#faq" className="opacity-90 hover:opacity-100 interactive">
            FAQ
          </a>
          <a
            href="#cta"
            className="px-4 py-2 rounded-full glass text-cyan-50 font-semibold bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-200 interactive"
          >
            Get early access
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
