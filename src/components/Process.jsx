import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { STEPS } from "../data.js";
import { Container, EASE, Reveal, SectionLabel, SplitText } from "./ui.jsx";

export default function Process() {
  const listRef = useRef(null);
  const marks = useRef([]);
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.6", "end 0.6"],
  });

  // Where each step's number sits along the line, as a 0–1 fraction.
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      marks.current = [...list.children]
        .filter((el) => el.tagName === "LI")
        .map((li) => (li.offsetTop + 28) / list.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(listRef.current);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setReached(marks.current.filter((m) => p >= m - 0.001).length);
  });

  const current = Math.max(reached, 1);

  return (
    <section id="process" aria-labelledby="process-title" className="py-24 sm:py-36">
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel index="03">Process</SectionLabel>
          <SplitText
            id="process-title"
            text="How it *works*"
            className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
          />
          <Reveal as="p" className="mt-6 max-w-[34ch] text-lg text-muted">
            From a WhatsApp message to a live website, in four simple steps.
          </Reveal>
          <div
            aria-hidden="true"
            className="mt-12 hidden items-end gap-3 font-display leading-none lg:flex"
          >
            <span className="relative block h-[7.5rem] overflow-hidden text-[7.5rem] font-semibold tracking-[-0.05em]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={current}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="block"
                >
                  0{current}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="pb-3 text-2xl text-muted">/ 0{STEPS.length}</span>
          </div>
        </div>

        <ol ref={listRef} className="relative">
          <div aria-hidden="true" className="absolute top-2 bottom-2 left-[27px] w-px bg-line">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute inset-0 origin-top bg-accent-ink"
            />
          </div>
          {STEPS.map((step, i) => {
            const on = i < reached;
            return (
              <li key={step.title} className="relative grid grid-cols-[56px_1fr] gap-5 pb-12 last:pb-0 sm:gap-8">
                <span
                  className={`relative z-10 grid size-14 place-items-center rounded-full border font-display text-lg font-semibold transition-all duration-500 ${
                    on
                      ? "scale-100 border-transparent bg-accent text-on-accent"
                      : "scale-90 border-line bg-bg text-muted"
                  }`}
                >
                  0{i + 1}
                </span>
                <div
                  className={`rounded-3xl border p-6 transition-all duration-700 sm:p-8 ${
                    on
                      ? "border-line bg-surface shadow-soft"
                      : "border-transparent opacity-50"
                  }`}
                >
                  <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted sm:text-lg">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
