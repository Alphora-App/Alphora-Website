import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

function InteractiveGlow() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(mx, { stiffness: 150, damping: 30, mass: 0.2 });
  const y = useSpring(my, { stiffness: 150, damping: 30, mass: 0.2 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <motion.div
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      className="pointer-events-none fixed inset-0 z-10 h-[40rem] w-[40rem] rounded-full opacity-40 blur-3xl"
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.35), rgba(139,92,246,0.15), transparent 70%)",
        }}
      />
    </motion.div>
  );
}

export default function Hero() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });
  const moveX = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 });
  const moveY = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      px.set((e.clientX - cx) / window.innerWidth);
      py.set((e.clientY - cy) / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [px, py]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center bg-mesh overflow-hidden">
      <InteractiveGlow />

      <motion.div
        style={{ rotateX: rx, rotateY: ry, x: moveX, y: moveY }}
        className="relative z-20 will-change-transform"
      >
        {/* Title */}
        <motion.h1
          className="text-8xl md:text-9xl font-extrabold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-500 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]">
            Alphora
          </span>
        </motion.h1>

        {/* Slogan */}
        <motion.p
          className="mt-4 text-2xl font-bold text-brand-100 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Learn investing in just 5 minutes.
        </motion.p>

        {/* Coming Soon Button */}
        <motion.a
          href="#"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="
            mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full
            bg-gradient-to-r from-brand-500 to-purple-400
            text-white font-semibold tracking-wide
            shadow-[0_0_25px_rgba(168,85,247,0.4)]
            hover:scale-105 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]
            active:scale-95 transition-all duration-300
          "
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M4 12h16m0 0l-4-4m4 4l-4 4' />
          </svg>
          Coming&nbsp;Soon
        </motion.a>
      </motion.div>
    </section>
  );
}
