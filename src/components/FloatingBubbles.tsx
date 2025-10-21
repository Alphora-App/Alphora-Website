import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

const bubbles = [
  { text: "Investing made simple", x: -520, y: -220, delay: 0 },
  { text: "Build confidence", x: 420, y: -180, delay: 0.2 },
  { text: "Small wins, big progress", x: 520, y: 160, delay: 0.35 },
  { text: "Learn by doing", x: -320, y: 260, delay: 0.5 },
];

export default function FloatingBubbles() {
  // per-bubble target motion values and springs
  const txTargets = bubbles.map(() => useMotionValue(0));
  const tyTargets = bubbles.map(() => useMotionValue(0));
  const txSprings = txTargets.map((t) => useSpring(t, { stiffness: 170, damping: 22 }));
  const tySprings = tyTargets.map((t) => useSpring(t, { stiffness: 170, damping: 22 }));

  // combined transforms: base position + spring offset
  const xTransforms = bubbles.map((b, i) => useTransform(txSprings[i], (v) => b.x + v));
  const yTransforms = bubbles.map((b, i) => useTransform(tySprings[i], (v) => b.y + v));

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const threshold = 220; // px radius for proximity
    const maxPush = 120; // max displacement when cursor is on bubble

    function onMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      bubbles.forEach((b, i) => {
        const bx = cx + b.x; // bubble center x in page coords
        const by = cy + b.y; // bubble center y
        const dx = e.clientX - bx;
        const dy = e.clientY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold && dist > 0.001) {
          const strength = (1 - dist / threshold) * (maxPush / 2 + (threshold / 4));
          // push away from cursor
          const nx = (dx / dist) * -1 * strength;
          const ny = (dy / dist) * -1 * strength;
          txTargets[i].set(nx);
          tyTargets[i].set(ny);
        } else {
          // return to base
          txTargets[i].set(0);
          tyTargets[i].set(0);
        }
      });
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [txTargets, tyTargets]);

  return (
    <div ref={wrapperRef} aria-hidden className="pointer-events-none hidden sm:block">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 16, delay: b.delay }}
          className="absolute z-0"
          style={{ left: "50%", top: "50%", x: xTransforms[i] as MotionValue<number>, y: yTransforms[i] as MotionValue<number>, translate: "-50% -50%" }}
        >
          <motion.div
            className="bubble"
            animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: b.delay + 0.2 }}
          >
            <span className="select-none text-sm md:text-base">{b.text}</span>
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="absolute left-1/2 -bottom-3 -translate-x-1/2"
            >
              <rect width="8" height="8" x="2" y="2" rx="1.5" fill="rgba(192,132,252,0.85)" transform="rotate(45 6 6)" />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
