import { motion } from "framer-motion";

export default function VisualShowcase() {
  return (
    <section id="showcase" className="relative pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-50 tracking-tight">
          See Alphora in action
        </h2>
        <p className="mt-3 text-brand-50/70">
          Clean lessons, quick checks, and progress that actually feels rewarding.
        </p>
      </div>

      {/* equal boxes */}
      <div className="mt-12 max-w-6xl mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[ 
            { src: "/screens/home.png", alt: "Home" },
            { src: "/screens/lesson.png", alt: "Lesson" },
            { src: "/screens/progress.png", alt: "Progress" }
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden glass aspect-[4/3] flex items-center justify-center"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
