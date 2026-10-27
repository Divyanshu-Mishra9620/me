import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { MARQUEE_AUDIENCES, MARQUEE_SERVICES } from "../data.js";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Star({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-[0.55em] shrink-0 ${className}`} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
      />
    </svg>
  );
}

/* A row that drifts on its own and speeds up (and flips) with scroll velocity. */
function VelocityRow({ items, baseVelocity }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="flex shrink-0">
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={item} className="flex items-center gap-[0.6em] px-[0.6em]">
                {item}
                <Star className="opacity-70" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-hidden="true" className="relative overflow-x-clip py-10 sm:py-16">
      <div className="relative h-[9.5rem] sm:h-[11rem]">
        <div className="absolute inset-x-[-5vw] top-[32%] -translate-y-1/2 rotate-[2.2deg] sm:top-1/2 border-y border-line bg-surface-2 py-3 font-display text-[1.75rem] font-semibold tracking-tight text-muted sm:py-4 sm:text-5xl">
          <VelocityRow items={MARQUEE_AUDIENCES} baseVelocity={2} />
        </div>
        <div className="absolute inset-x-[-5vw] top-[68%] -translate-y-1/2 -rotate-[2.2deg] bg-accent sm:top-1/2 py-3 font-display text-[1.75rem] font-semibold tracking-tight text-on-accent shadow-soft sm:py-4 sm:text-5xl">
          <VelocityRow items={MARQUEE_SERVICES} baseVelocity={-2.6} />
        </div>
      </div>
    </section>
  );
}
