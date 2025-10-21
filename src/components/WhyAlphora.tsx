import { motion } from "framer-motion";

const items = [
  { t: "Learn in minutes", d: "Bite-size lessons that fit your day." },
  { t: "Stay consistent", d: "Streaks and reminders to keep you moving." },
  { t: "Practice safely", d: "Understand moves without risking money." },
  { t: "Actually remember", d: "Smart review so concepts stick long-term." },
];

export default function WhyAlphora() {
  return (
    <section id="features" className="mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-50/90">Why Alphora</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <motion.div
              key={it.t}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass p-6 rounded-2xl"
            >
              <h3 className="text-xl font-semibold text-brand-50">{it.t}</h3>
              <p className="mt-2 text-brand-50/70">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
