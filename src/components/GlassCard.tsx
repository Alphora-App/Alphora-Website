// src/components/GlassCard.tsx
import { motion } from "framer-motion";

export default function GlassCard({
  title,
  body,
  delay = 0, // optional per-card offset
}: { title: string; body: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="p-5 rounded-2xl glass min-h-[140px] will-change-transform"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-brand-100/90 text-sm mt-2">{body}</p>
    </motion.div>
  );
}
