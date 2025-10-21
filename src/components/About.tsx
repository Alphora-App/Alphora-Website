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
          Our mission at Alphora is to simplify financial literacy using micro learning and AI feedback to help users build investing skills through habits. Achieving financial literacy shouldn't be just for experts or as intimidating as it is. Thats where Alphora comes in; We turn investing into a all in one resource that's intuitive, interactive, and easily accesible to all.
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
        <h3 className="text-2xl font-semibold mb-2">Our Pillars</h3>
        <ul className="space-y-2 text-brand-100/90">
          <li>• Accesbility: Investing education should be acessible to all.</li>
          <li>• Clarity: Educational resources shouldnt be overcomplex and wordy. We simplify all our lessons</li>
          <li>• Consistency: True learning comes from habits, not reading in a single night</li>
          <li>• Empowerment: Alphora gives learners the confidence to make financial decisions.</li>
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
          Alphora is a financial education platform built for future investors. Built by 3 college students, we believe investing should feel approachable and fun. we aim to take the complexity and boredom out of becoming financially literate using a modern, clean design, behavioral science, and AI guidance.
        </p>
      </motion.div>
    </div>
  );
}
