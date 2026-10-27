import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { STATS } from "../data.js";
import { Container, EASE, Reveal, SectionLabel } from "./ui.jsx";

const TEXT =
  "I care about the small things your customers notice. Pages that open *fast* on any phone, buttons that are *easy* *to* *tap,* and every enquiry landing straight in your *WhatsApp.*";

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const accent = word.startsWith("*") && word.endsWith("*");
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block pr-[0.26em] ${accent ? "font-serif font-normal italic text-accent-ink" : ""}`}
    >
      {accent ? word.slice(1, -1) : word}
    </motion.span>
  );
}

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 2,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {value.toLocaleString("en-IN")}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {n.toLocaleString("en-IN")}
        {suffix}
      </span>
    </span>
  );
}

export default function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = TEXT.split(" ");

  return (
    <section className="py-24 sm:py-36">
      <Container>
        <SectionLabel index="✦">Why work with me</SectionLabel>
        <p
          ref={ref}
          className="mt-8 max-w-[1100px] font-display text-[clamp(1.9rem,4.4vw,4.1rem)] leading-[1.08] font-medium tracking-[-0.03em]"
        >
          <span className="sr-only">{TEXT.replaceAll("*", "")}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <Word
                key={i}
                word={w}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
              />
            ))}
          </span>
        </p>

        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 sm:mt-28 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="flex flex-col-reverse gap-3">
              <dt className="max-w-[18ch] text-sm leading-snug text-muted sm:text-base">
                {s.label}
              </dt>
              <dd className="font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
