import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { Briefcase, Clock, GraduationCap, Mail, MapPin } from "lucide-react";
import { SITE, TIMELINE } from "../data.js";
import { useLocalTime, usePointerFine } from "../lib/hooks.js";
import { Container, Reveal, SectionLabel, SplitText, TextLink } from "./ui.jsx";

function ProfileCard() {
  const ref = useRef(null);
  const time = useLocalTime();
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    if (!fine || reduced) return;
    const r = ref.current.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const facts = [
    { icon: MapPin, text: `${SITE.city}, India` },
    { icon: Clock, text: `${time} IST` },
    { icon: GraduationCap, text: "B.Tech, MMMUT Gorakhpur" },
    { icon: Briefcase, text: "Ex-AI full-stack Developer, ParallelDots" },
  ];

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-6"
    >
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,var(--accent),var(--violet))]">
        <div className="bg-grid absolute inset-0 opacity-40 mix-blend-overlay" />
        <span className="font-display text-[7rem] leading-none font-bold tracking-[-0.06em] text-on-accent sm:text-[8.5rem]">
          DM
        </span>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-bg/80 py-1.5 pr-3 pl-2 text-xs font-medium text-ink backdrop-blur">
          <span className="pulse-dot relative size-2 rounded-full bg-[#22c55e]" />
          Available for new projects
        </span>
      </div>
      <div className="px-1 pt-6 pb-1">
        <p className="font-display text-3xl font-semibold tracking-tight">
          Divyanshu Mishra
        </p>
        <p className="text-muted">Freelance web developer</p>
        <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[15px]">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <Icon
                className="size-4 shrink-0 text-accent-ink"
                aria-hidden="true"
              />
              {text}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
          <TextLink href={SITE.github} external>
            GitHub
          </TextLink>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 font-semibold text-ink hover:text-accent-ink"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email me
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-line py-24 sm:py-36"
    >
      <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="order-last lg:sticky lg:top-28 lg:order-first lg:self-start">
          <ProfileCard />
        </Reveal>

        <div>
          <SectionLabel index="04">About</SectionLabel>
          <SplitText
            id="about-title"
            text="About *me*"
            className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
          />
          <Reveal
            as="p"
            className="mt-8 max-w-[44ch] font-display text-2xl leading-snug font-medium tracking-tight sm:text-3xl"
          >
            I’m Divyanshu, a web developer based in Lucknow, working with
            clients across India.
          </Reveal>

          <ol className="mt-14 border-t border-line">
            {TIMELINE.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 0.08}
                className="group grid gap-2 border-b border-line py-8 sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <span className="text-sm font-medium uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent-ink">
                  {item.when}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-1 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
