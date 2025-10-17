import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import GlassCard from "./components/GlassCard";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Section from "./components/Section";
import WatchlistDemo from "./components/WatchlistDemo";
import FAQ from "./components/FAQ";
import About from "./components/About";

// Stagger + item variants for scroll-reveal
const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <div className="min-h-screen bg-brand-900 bg-mesh">
      <Nav />

      {/* subtle parallax on hero */}
      <motion.div ref={heroRef} style={{ y, scale }}>
        <Hero />
      </motion.div>

      {/* Features with staggered reveal */}
      <Section id="features" title="Why it sticks">
        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <motion.div variants={item}>
            <GlassCard
              title="Bite-sized lessons"
              body="Finish micro sized lessons in minutes and keep a daily streak."
            />
          </motion.div>
          <motion.div variants={item}>
            <GlassCard
              title="Smart Review System"
              body="Review the right ideas at the right time to remember more."
            />
          </motion.div>
          <motion.div variants={item}>
            <GlassCard
              title="AI Feedback"
              body="Intelligent realtime feedback from GPT-4 after each weekly trading competition."
            />
          </motion.div>
        </motion.div>
      </Section>

      {/* Watchlist */}
      <Section id="watchlist" title="Sample Watchlist">
        <WatchlistDemo />
      </Section>

      
            <Section id="about" title="About Alphora">
        <About />
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ">
        <FAQ />
      </Section>

      <footer className="py-10 text-center text-sm/6 text-brand-100/80">
        © {new Date().getFullYear()} Alphora — educational only.
      </footer>
    </div>
  );
}
