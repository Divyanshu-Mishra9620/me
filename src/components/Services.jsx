import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Bot, Check, CheckCheck, MessageCircle, ShoppingBag } from "lucide-react";
import { SERVICES, waLink } from "../data.js";
import { Chip, Container, EASE, Reveal, SectionLabel, SplitText, TextLink } from "./ui.jsx";

/* Steps through 0..count-1 on a timer while the element is on screen. */
function useLoop(ref, count, ms) {
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? count - 1 : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => clearInterval(id);
  }, [inView, reduced, count, ms]);
  return step;
}

const pop = {
  initial: { opacity: 0, y: 14, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.5, ease: EASE },
};

function Bar({ w = "100%", className = "" }) {
  return <span className={`block h-2 rounded-full bg-ink/10 ${className}`} style={{ width: w }} />;
}

function WebsiteVisual() {
  const ref = useRef(null);
  const step = useLoop(ref, 3, 1800);
  return (
    <div ref={ref} className="relative h-[380px] w-[420px]">
      <div className="absolute top-2 left-1/2 h-[370px] w-[210px] -translate-x-1/2 overflow-hidden rounded-[2.2rem] border-[6px] border-ink bg-bg shadow-soft">
        <div className="h-24 bg-[linear-gradient(135deg,var(--accent),var(--violet))] p-4">
          <Bar w="40%" className="bg-on-accent/30" />
          <p className="mt-3 font-display text-[15px] leading-tight font-semibold text-on-accent">
            Admissions open for 2027
          </p>
        </div>
        <div className="space-y-2 p-4">
          <Bar w="80%" />
          <Bar w="60%" />
          <div className="mt-4 space-y-2 rounded-xl border border-line p-3">
            <p className="text-[10px] font-semibold">Send an enquiry</p>
            <div className="h-6 rounded-md border border-line bg-surface px-2 text-[9px] leading-6 text-muted">
              {step > 0 ? "Priya Sharma" : "Your name"}
            </div>
            <div className="h-6 rounded-md border border-line bg-surface px-2 text-[9px] leading-6 text-muted">
              {step > 0 ? "NEET batch, Class 11" : "Course"}
            </div>
            <motion.div
              animate={{ scale: step === 1 ? 0.94 : 1 }}
              className="grid h-7 place-items-center rounded-md bg-ink text-[9px] font-semibold text-bg"
            >
              Send on WhatsApp
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            {...pop}
            className="absolute top-14 right-0 w-48 rounded-2xl border border-line bg-surface p-3 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#25d366]/15 text-[#1aa34a]">
                <MessageCircle className="size-3.5" />
              </span>
              <span className="text-[11px] font-semibold">New enquiry</span>
              <span className="ml-auto text-[10px] text-muted">now</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-muted">
              Priya Sharma wants to know about the NEET batch.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoreVisual() {
  const ref = useRef(null);
  const step = useLoop(ref, 4, 1400);
  const products = [
    { c: "#f2b53c", p: "₹799" },
    { c: "#8b7bff", p: "₹1,299" },
    { c: "#19c08a", p: "₹549" },
    { c: "#e8964a", p: "₹999" },
  ];
  return (
    <div ref={ref} className="relative h-[380px] w-[420px]">
      <div className="absolute inset-x-6 top-4 rounded-3xl border border-line bg-bg p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <Bar w="30%" />
          <div className="relative grid size-8 place-items-center rounded-full bg-ink text-bg">
            <ShoppingBag className="size-4" />
            <motion.span
              key={step}
              initial={{ scale: 1.6 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-on-accent"
            >
              {Math.min(step + 1, 3)}
            </motion.span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {products.map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: step === i ? -4 : 0 }}
              className="rounded-2xl border border-line bg-surface p-2"
            >
              <div
                className="h-16 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${item.c}, ${item.c}55)` }}
              />
              <Bar w="70%" className="mt-2" />
              <p className="mt-1.5 text-[11px] font-semibold">{item.p}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            {...pop}
            className="absolute right-2 bottom-6 flex items-center gap-2 rounded-full border border-line bg-surface py-2 pr-4 pl-2 shadow-soft"
          >
            <span className="grid size-6 place-items-center rounded-full bg-[#22c55e] text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="text-xs font-semibold">Paid via Razorpay</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const rows = [
    { label: "Instagram ad", value: 42 },
    { label: "Google ad", value: 31 },
    { label: "Facebook ad", value: 18 },
  ];
  return (
    <div ref={ref} className="relative h-[380px] w-[420px]">
      <div className="absolute inset-x-6 top-8 rounded-3xl border border-line bg-bg p-6 shadow-soft">
        <p className="text-xs text-muted">Enquiries this month</p>
        <p className="font-display text-4xl font-semibold tracking-tight">91</p>
        <div className="mt-6 space-y-4">
          {rows.map((r, i) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs">
                <span className="font-medium">{r.label}</span>
                <span className="tabular-nums text-muted">{r.value}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(r.value / 42) * 100}%` } : undefined}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: EASE }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--violet),var(--accent))]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute right-2 bottom-8 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold shadow-soft"
      >
        Tracked per ad ✓
      </motion.div>
    </div>
  );
}

function AssistantVisual() {
  const ref = useRef(null);
  const step = useLoop(ref, 5, 1500);
  const bubble = "max-w-[78%] rounded-2xl px-3 py-2 text-[12px] leading-snug";
  return (
    <div ref={ref} className="relative h-[380px] w-[420px]">
      <div className="absolute inset-x-8 top-4 bottom-4 flex flex-col rounded-3xl border border-line bg-bg shadow-soft">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="grid size-7 place-items-center rounded-full bg-violet/20 text-violet">
            <Bot className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Clinic assistant</p>
            <p className="text-[10px] text-muted">Replies instantly</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2 p-4">
          <div className={`${bubble} self-end rounded-br-sm bg-ink text-bg`}>
            Are you open on Saturday?
          </div>
          <AnimatePresence mode="popLayout">
            {step === 1 && (
              <motion.div key="typing" {...pop} className={`${bubble} flex gap-1 self-start bg-surface-2`}>
                <span className="typing-dot size-1.5 rounded-full bg-muted" />
                <span className="typing-dot size-1.5 rounded-full bg-muted" />
                <span className="typing-dot size-1.5 rounded-full bg-muted" />
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div key="reply" {...pop} className={`${bubble} self-start rounded-bl-sm bg-surface-2`}>
                Yes, 10 am to 1 pm. Want me to book a slot for you?
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div key="yes" {...pop} className={`${bubble} self-end rounded-br-sm bg-ink text-bg`}>
                Yes please, for my father.
              </motion.div>
            )}
            {step >= 4 && (
              <motion.div
                key="handoff"
                {...pop}
                className="mx-auto mt-1 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-on-accent"
              >
                <CheckCheck className="size-3.5" /> Sent to the clinic owner
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const VISUALS = {
  website: WebsiteVisual,
  store: StoreVisual,
  landing: LandingVisual,
  assistant: AssistantVisual,
};

function ServiceCard({ service, index, total, progress }) {
  const Visual = VISUALS[service.id];
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const dim = useTransform(progress, [index / total, 1], [0, (total - 1 - index) * 0.12]);
  const cardRef = useRef(null);

  const onMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="sticky top-0 flex h-[100svh] items-center">
      <motion.article
        ref={cardRef}
        onPointerMove={onMove}
        style={{ scale, top: `${index * 22}px` }}
        className="group relative grid w-full origin-top overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft md:min-h-[520px] md:grid-cols-[1.05fr_1fr]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 z-20 bg-bg"
        />
        <div className="relative flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-display text-sm tabular-nums text-muted">
              0{index + 1} / 0{total}
            </span>
            <Chip>{service.for}</Chip>
          </div>
          <h3 className="mt-8 font-display text-[2.25rem] leading-[0.95] font-semibold tracking-[-0.035em] sm:text-5xl md:mt-auto lg:text-6xl">
            {service.title}
          </h3>
          <p className="mt-4 max-w-[42ch] text-[15px] text-muted sm:text-lg">{service.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {service.points.map((p) => (
              <li key={p}>
                <Chip className="text-ink">
                  <Check className="size-3.5 text-accent-ink" aria-hidden="true" />
                  {p}
                </Chip>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <TextLink href={waLink(service.ask)} external>
              Ask about this
            </TextLink>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative h-40 overflow-hidden border-t border-line bg-surface-2 sm:h-64 md:h-auto md:border-t-0 md:border-l"
        >
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="shrink-0 scale-[0.42] sm:scale-[0.68] md:scale-[0.85] xl:scale-100">
              <Visual />
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section id="services" aria-labelledby="services-title" className="relative pt-24 sm:pt-36">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel index="02">Services</SectionLabel>
            <SplitText
              id="services-title"
              text="What I can *build* for you"
              className="mt-6 max-w-[14ch] font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
            />
          </div>
          <Reveal as="p" className="max-w-[34ch] text-lg text-muted">
            Tell me what your business needs and I’ll suggest the simplest
            thing that does the job.
          </Reveal>
        </div>
        <div ref={ref} className="mt-6 sm:mt-10">
          {SERVICES.map((s, i) => (
            <ServiceCard
              key={s.id}
              service={s}
              index={i}
              total={SERVICES.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
