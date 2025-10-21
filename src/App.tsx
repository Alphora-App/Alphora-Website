import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Section from "./components/Section";
import FAQ from "./components/FAQ";
import About from "./components/About";

import VisualShowcase from "./components/VisualShowcase";
import WhyAlphora from "./components/WhyAlphora";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  // subtle parallax on hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <div className="min-h-screen bg-brand-900 bg-mesh">
      <Nav />

      {/* HERO (parallax) */}
      <motion.div ref={heroRef} style={{ y, scale }}>
        <Hero />
      </motion.div>

      {/* ABOUT — now first */}
      <Section id="about" title="About Alphora">
        <About />
      </Section>

      {/* WHY ALPHORA — feature grid */}
      <WhyAlphora />

      {/* VISUAL SHOWCASE — screenshots */}
      <VisualShowcase />

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <Testimonials />

      {/* BIG CTA / WAITLIST */}
      <CTA />

      {/* FAQ */}
      <Section id="faq" title="FAQ">
        <FAQ />
      </Section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
