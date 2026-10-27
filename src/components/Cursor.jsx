import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { usePointerFine } from "../lib/hooks.js";

/* A soft ring that trails the pointer and grows over things you can click.
   The native cursor stays visible. */
export default function Cursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.6 });
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState(null);
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target instanceof Element ? e.target : null;
      setHover(!!target?.closest("a, button, label, input, [data-cursor]"));
      setLabel(target?.closest("[data-cursor]")?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 92 : hover ? 54 : 30;
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[80]"
    >
      <motion.div
        animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className={`-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full ${
          label
            ? "bg-accent text-on-accent shadow-soft"
            : "border border-ink/35 bg-ink/[0.03]"
        }`}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-0.5 text-xs font-semibold"
          >
            {label}
            <ArrowUpRight className="size-3.5" />
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
