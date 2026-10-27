import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { usePointerFine } from "../lib/hooks.js";

export const EASE = [0.16, 1, 0.3, 1];

export function Container({ className = "", children, ...rest }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ index, children, className = "" }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted ${className}`}
    >
      <span className="size-1.5 rounded-full bg-accent-ink" />
      <span className="tabular-nums">({index})</span>
      <span>{children}</span>
    </p>
  );
}

/* Pulls its child toward the cursor while hovered. */
export function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const spring = { stiffness: 220, damping: 16, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const active = fine && !reduced;

  const onMove = (e) => {
    if (!active) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

const BUTTON_VARIANTS = {
  primary: {
    base: "bg-accent text-on-accent",
    icon: "bg-on-accent text-accent",
  },
  dark: { base: "bg-ink text-bg", icon: "bg-bg text-ink" },
  ghost: {
    base: "border border-line bg-surface/50 text-ink backdrop-blur hover:border-ink/30",
    icon: "bg-ink text-bg",
  },
};

/* Pill link with a rolling label and an arrow that turns on hover. */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon: Icon = ArrowUpRight,
  external = false,
  magnetic = true,
  className = "",
  ...rest
}) {
  const v = BUTTON_VARIANTS[variant];
  const sizing =
    size === "lg"
      ? "h-14 gap-4 pl-7 pr-2 text-base"
      : "h-12 gap-3 pl-5 pr-1.5 text-[15px]";
  const iconSize = size === "lg" ? "size-10" : "size-9";
  const link = (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`group relative inline-flex items-center rounded-full font-semibold whitespace-nowrap transition-colors duration-300 ${sizing} ${v.base} ${className}`}
      {...rest}
    >
      <span className="relative block overflow-hidden leading-tight">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span
        className={`grid shrink-0 place-items-center rounded-full ${iconSize} ${v.icon}`}
      >
        <Icon
          className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45"
          aria-hidden="true"
        />
      </span>
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

/* Underlined text link with an animated rule. */
export function TextLink({ href, children, external, className = "", ...rest }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`group inline-flex items-center gap-1.5 font-semibold text-ink ${className}`}
      {...rest}
    >
      <span className="relative">
        {children}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-100 bg-current transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-0" />
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-ink transition-transform delay-150 duration-500 ease-out-expo group-hover:scale-x-100" />
      </span>
      <ArrowUpRight
        className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  );
}

export function Reveal({
  as = "div",
  delay = 0,
  y = 28,
  className = "",
  children,
  ...rest
}) {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* Heading whose words slide up from a mask. Wrap a word in *asterisks* to
   set it in the italic serif accent. */
export function SplitText({
  text,
  as: Tag = "h2",
  className = "",
  accentClass = "text-accent-ink",
  delay = 0,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{text.replaceAll("*", "")}</span>
      <span aria-hidden="true">
        {words.map((raw, i) => {
          const accent = raw.startsWith("*") && raw.endsWith("*");
          const word = accent ? raw.slice(1, -1) : raw;
          return (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${accent ? `pr-[0.06em] font-serif font-normal italic ${accentClass}` : ""}`}
                  initial={{ y: "115%" }}
                  animate={inView ? { y: "0%" } : undefined}
                  transition={{ duration: 1, delay: delay + i * 0.06, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

export function Chip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1 text-[13px] font-medium text-muted ${className}`}
    >
      {children}
    </span>
  );
}
