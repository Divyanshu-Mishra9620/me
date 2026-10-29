import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  Bot,
  Check,
  CreditCard,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { AUDIENCES, PROJECTS, waLink } from "../data.js";
import { usePointerFine } from "../lib/hooks.js";
import BrowserFrame from "./BrowserFrame.jsx";
import { Button, Container, EASE } from "./ui.jsx";

const SLIDE_SECONDS = 5;

function RotatingWord() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % AUDIENCES.length), 2400);
    return () => clearInterval(id);
  }, [reduced]);

  const word = AUDIENCES[i];
  return (
    <span className="relative inline-grid overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
      {/* Every word sits invisibly in the same cell so the width never jumps. */}
      {AUDIENCES.map((w) => (
        <span key={w} className="invisible col-start-1 row-start-1 pr-[0.12em] font-serif font-normal italic">
          {w}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="col-start-1 row-start-1 pr-[0.12em] font-serif font-normal italic text-accent-ink"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Line({ delay, children }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeUp({ delay, className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* A small UI card floating over the showcase, nudged by the mouse. */
function FloatCard({ sx, sy, depth, delay, className = "", children }) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className={`absolute z-10 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        <div
          className="float-y rounded-2xl border border-line bg-surface/90 p-3 shadow-soft backdrop-blur-xl sm:p-3.5"
          style={{ animationDelay: `${delay}s` }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AssistantBubble() {
  const [typing, setTyping] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setTyping(false);
      return;
    }
    const id = setInterval(() => setTyping((t) => !t), 2600);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <div className="mt-2 min-h-[2.4rem] rounded-xl rounded-tl-sm bg-surface-2 px-3 py-2 text-[12.5px] leading-snug text-ink">
      <AnimatePresence mode="wait" initial={false}>
        {typing ? (
          <motion.span
            key="dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-5 items-center gap-1"
          >
            <span className="typing-dot size-1.5 rounded-full bg-muted" />
            <span className="typing-dot size-1.5 rounded-full bg-muted" />
            <span className="typing-dot size-1.5 rounded-full bg-muted" />
          </motion.span>
        ) : (
          <motion.span
            key="msg"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="block"
          >
            Yes, we’re open on Sunday from 10 to 2.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Showcase({ sx, sy }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.25 });
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  // The frame starts tipped back and flattens as it scrolls into place.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.2"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 60, 0]);

  const next = () => setIndex((i) => (i + 1) % PROJECTS.length);
  const project = PROJECTS[index];

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-24 w-full max-w-[1120px] [perspective:1600px] sm:mt-20"
    >
      <motion.div
        style={{ rotateX, scale, y, transformOrigin: "50% 0%" }}
        className="relative"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Colour glow that picks up the active project's tint. */}
        <div aria-hidden="true" className="pointer-events-none absolute -inset-x-[8%] -inset-y-[12%] -z-10">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="absolute inset-0 blur-3xl transition-opacity duration-1000"
              style={{
                opacity: i === index ? 0.55 : 0,
                background: `radial-gradient(50% 50% at 50% 50%, ${p.tint}, transparent 70%)`,
              }}
            />
          ))}
        </div>

        <BrowserFrame url={project.url}>
          <div id="showcase-panel" role="tabpanel" aria-label={project.title}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener"
            aria-label={`Open the live ${project.title}`}
            data-cursor="Visit"
            className="relative block aspect-[1000/458] overflow-hidden bg-surface-2"
          >
            {PROJECTS.map((p, i) => (
              <motion.img
                key={p.id}
                src={p.heroImage ?? p.image}
                width={p.width}
                height={p.height}
                alt={i === index ? (p.heroAlt ?? p.alt) : ""}
                aria-hidden={i !== index}
                loading={i === 0 ? "eager" : "lazy"}
                initial={false}
                animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.06 }}
                transition={{ duration: 1, ease: EASE }}
                className="absolute inset-0 size-full object-cover object-top"
              />
            ))}
          </a>
          </div>
        </BrowserFrame>

        <FloatCard sx={sx} sy={sy} depth={-28} delay={0.9} className="-top-16 -left-1 w-48 sm:top-[10%] sm:-left-8 sm:w-60">
          <div className="flex items-start gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#25d366]/15 text-[#1aa34a]">
              <MessageCircle className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold sm:text-[13px]">
                New enquiry <span className="font-normal text-muted">· WhatsApp</span>
              </p>
              <p className="text-[12px] leading-snug text-muted sm:text-[13px]">
                “Are admissions open for Class 11?”
              </p>
            </div>
          </div>
        </FloatCard>

        <FloatCard sx={sx} sy={sy} depth={34} delay={1.1} className="-right-1 -bottom-12 w-44 sm:-right-8 sm:bottom-[14%] sm:w-56">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
              <CreditCard className="size-4" />
            </span>
            <div>
              <p className="text-[11px] text-muted sm:text-xs">Payment received</p>
              <p className="font-display text-base font-semibold sm:text-lg">₹2,499</p>
            </div>
            <span className="ml-auto grid size-5 place-items-center rounded-full bg-[#22c55e] text-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
          </div>
        </FloatCard>

        <FloatCard sx={sx} sy={sy} depth={22} delay={1.3} className="-top-8 right-[8%] hidden w-64 md:block">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-violet/20 text-violet">
              <Bot className="size-3.5" />
            </span>
            <p className="text-xs font-semibold">AI assistant</p>
            <span className="ml-auto text-[11px] text-muted">online</span>
          </div>
          <AssistantBubble />
        </FloatCard>

        <FloatCard sx={sx} sy={sy} depth={-18} delay={1.5} className="-bottom-6 left-[12%] hidden lg:block">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <Smartphone className="size-4 text-accent-ink" />
            Works on every phone
          </div>
        </FloatCard>
      </motion.div>

      <div
        role="tablist"
        aria-label="Featured projects"
        className={`mt-20 flex justify-center gap-3 sm:mt-10 sm:gap-5 ${hovered || !inView ? "is-paused" : ""}`}
      >
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-controls="showcase-panel"
            onClick={() => setIndex(i)}
            className="group w-[4.75rem] text-left sm:w-32 md:w-36 lg:w-40"
          >
            <span
              className={`flex items-baseline gap-2 text-xs font-medium transition-colors sm:text-sm ${
                i === index ? "text-ink" : "text-muted group-hover:text-ink"
              }`}
            >
              <span className="hidden tabular-nums text-muted sm:inline">0{i + 1}</span>
              {p.short}
            </span>
            <span className="mt-2.5 block h-[3px] overflow-hidden rounded-full bg-line">
              {i === index && (
                <span
                  key={index}
                  className="tab-progress block h-full rounded-full bg-accent-ink"
                  style={{ "--tab-duration": `${SLIDE_SECONDS}s` }}
                  onAnimationEnd={next}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 20 });
  const sy = useSpring(my, { stiffness: 70, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", reduced ? "0%" : "-12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, reduced ? 1 : 0.25]);

  const onMove = (e) => {
    if (!fine || reduced) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate overflow-x-clip pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="blob blob-a top-[-12rem] left-[-10rem] size-[36rem] bg-accent/30 sm:size-[46rem] dark:bg-accent/15" />
        <div className="blob blob-b top-[8rem] right-[-14rem] size-[34rem] bg-violet/25 sm:size-[42rem] dark:bg-violet/20" />
      </div>

      <Container>
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <FadeUp delay={0.15} className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 py-1.5 pr-3.5 pl-2 text-[13px] font-medium backdrop-blur">
              <span className="grid size-5 place-items-center rounded-full bg-[#22c55e]/15">
                <span className="pulse-dot relative size-2 rounded-full bg-[#22c55e]" />
              </span>
              Available for new projects
            </span>
            <span className="text-sm text-muted">
              Hi, I’m Divyanshu Mishra, a freelance web developer.
            </span>
          </FadeUp>

          <h1 className="mt-7 font-display text-[clamp(2.2rem,10.4vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
            <span className="sr-only">I make websites for local businesses and agencies.</span>
            <span aria-hidden="true">
              <Line delay={0.25}>I make websites</Line>
              <Line delay={0.35}>
                for <RotatingWord />
              </Line>
            </span>
          </h1>

          <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <FadeUp delay={0.6} className="max-w-[36rem]">
              <p className="text-lg leading-relaxed text-muted sm:text-xl">
                Coaching centres, clinics, gyms, shops, and digital agencies who
                need a dependable developer. Every site I build works well on
                phones and sends enquiries straight to your WhatsApp.
              </p>
            </FadeUp>
            <FadeUp delay={0.75} className="flex flex-wrap items-center gap-3">
              <Button href={waLink()} external size="lg">
                Message me on WhatsApp
              </Button>
              <Button href="#work" variant="ghost" size="lg" icon={ArrowDown}>
                See my work
              </Button>
            </FadeUp>
          </div>

          <FadeUp delay={0.9}>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {["Replies in Hindi or English", "Two rounds of changes included", "You get all the code and logins"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-accent-ink" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>
        </motion.div>

        <Showcase sx={sx} sy={sy} />
      </Container>
    </section>
  );
}
