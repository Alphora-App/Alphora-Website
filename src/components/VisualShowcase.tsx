// src/components/VisualShowcase.tsx
import { motion, useMotionValue, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function Count({ value, start }: { value: number; start?: boolean }) {
  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    const unsub = mv.onChange((v) => {
      if (nodeRef.current) nodeRef.current.textContent = Math.round(v).toString();
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [mv, value, start]);

  return <span ref={nodeRef}>{0}</span>;
}

export default function VisualShowcase() {
  const screens = [
    { src: "/screens/account-screen.png", alt: "Account screen", caption: "Account" },
    { src: "/screens/ai-screen.png", alt: "AI feedback screen", caption: "AI feedback" },
    { src: "/screens/leaderboard-screen.png", alt: "Leaderboard screen", caption: "Leaderboard" },
  ];
  const countsRef = useRef<HTMLDivElement | null>(null);
  const countsInView = useInView(countsRef, { once: true, amount: 0.5 });

  return (
    <section id="showcase" className="relative pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div ref={countsRef} className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-brand-50">
              <Count value={50} start={countsInView} />
            </div>
            <div className="text-sm text-brand-50/70">Active learners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-brand-50">
              <Count value={8} start={countsInView} />
            </div>
            <div className="text-sm text-brand-50/70">Topics covered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-brand-50">
              <Count value={317} start={countsInView} />
            </div>
            <div className="text-sm text-brand-50/70">Lessons completed</div>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-50 tracking-tight">
          See Alphora in Action
        </h2>
        <p className="mt-3 text-brand-50/70 max-w-2xl mx-auto">
          Clean lessons, smart feedback, and a leaderboard that keeps you motivated.
        </p>
      </div>

      <div className="mt-12 max-w-6xl mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {screens.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              // ⬇️ fixed height, no aspect ratio class
              className="relative rounded-2xl overflow-hidden glass h-[520px] flex items-center justify-center hover:scale-[1.03] transition-transform duration-300"
            >
              <img
                src={img.src}
                alt={img.alt}
                // ⬇️ contain to avoid cropping; switch to object-cover if you prefer fill + crop
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {/* Caption overlay */}
              <div
                aria-hidden
                className="absolute left-0 right-0 bottom-0 px-4 py-3 bg-black/45 backdrop-blur-sm text-white text-sm md:text-base flex items-center justify-center"
              >
                {img.caption}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
