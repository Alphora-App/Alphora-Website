import { motion } from "framer-motion";

const quotes = [
  {
    q: "This finally made investing click, and I feel confident taking action.",
    a: "founder family member",
  },
  { q: "Fast, visual, and not boring - I learned useful things in minutes.", a: "early user" },
  {
    q: "I actually remember the concepts now - the lessons really stick with me.",
    a: "student tester",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="mt-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-50/90 text-center">What people say</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {quotes.map((c, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass p-6 rounded-2xl interactive-card"
            >
              <p className="text-brand-50/90">“{c.q}”</p>
              <footer className="mt-3 text-sm text-brand-50/60">- {c.a}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
