import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: mission */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="p-6 rounded-2xl glass"
      >
        <h3 className="text-2xl font-semibold mb-2">Our mission</h3>
        <p className="text-brand-100/90">
          lowkey what is our mission idk
        </p>
      </motion.div>

      {/* Right: what we value */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="p-6 rounded-2xl glass"
      >
        <h3 className="text-2xl font-semibold mb-2">What we value</h3>
        <ul className="space-y-2 text-brand-100/90">
          <li>• Point 1</li>
          <li>• Point 2</li>
          <li>• Point 3</li>
          <li>• Point 4</li>
        </ul>
      </motion.div>

      {/* Team / credibility blurb */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-2 p-6 rounded-2xl glass"
      >
        <h3 className="text-2xl font-semibold mb-2">Who we are</h3>
        <p className="text-brand-100/90">
          we're goated
        </p>
      </motion.div>
    </div>
  );
}
