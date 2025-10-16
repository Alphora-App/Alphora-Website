import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import GlassCard from './components/GlassCard'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Section from './components/Section'
import WatchlistDemo from './components/WatchlistDemo'
import FAQ from './components/FAQ'

export default function App(){
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const y = useTransform(scrollYProgress, [0,1],[0,-120])
  const scale = useTransform(scrollYProgress, [0,1],[1, .94])
 
  return (
    <div className="min-h-screen bg-brand-900 bg-mesh">

      <Nav />
      <motion.div ref={heroRef} style={{ y, scale }}>
        <Hero />
      </motion.div>

      <Section id="features" title="Why it sticks">
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard title="Bite-sized lessons" body="Finish micro sized lessons in minutes and keep a daily streak." />
          <GlassCard title="Smart Review System" body="Review the right ideas at the right time to remember more." />
          <GlassCard title="AI Feedback" body="Intelligent realtime feedback from GPT-4 after each weekly trading competition. " />
        </div>
      </Section>

      <Section id="watchlist" title="Sample Watchlist">
        <WatchlistDemo/>
      </Section>

      <Section id="faq" title="FAQ">
        <FAQ/>
      </Section>

      <footer className="py-10 text-center text-sm/6 text-slate-300">
        © {new Date().getFullYear()} Alphora -- educational only.
      </footer>
    </div>
  )
}
