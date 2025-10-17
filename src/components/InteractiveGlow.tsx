import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function InteractiveGlow() {
  // raw mouse x/y
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // smooth it out so it feels premium
  const x = useSpring(mx, { stiffness: 150, damping: 30, mass: 0.2 });
  const y = useSpring(my, { stiffness: 150, damping: 30, mass: 0.2 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      className="
        pointer-events-none fixed inset-0 z-10
        h-[42rem] w-[42rem] rounded-full
        opacity-40 blur-3xl
      "
    >
      {/* big soft radial gradient that follows the cursor */}
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.35), rgba(217,70,239,0.18), transparent 70%)",
        }}
      />
    </motion.div>
  );
}
