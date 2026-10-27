import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROJECTS, waLink } from "../data.js";
import { useMediaQuery } from "../lib/hooks.js";
import { scrollToTarget } from "../lib/scroll.js";
import BrowserFrame from "./BrowserFrame.jsx";
import { Button, Chip, Container, SectionLabel, SplitText, TextLink } from "./ui.jsx";

const INTRO =
  "A few things I’ve built. They’re all live, so open them on your phone and try them yourself.";

function ProjectInfo({ project, index }) {
  return (
    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          <span className="tabular-nums">0{index + 1}</span>
          <span className="h-px w-6 bg-line" />
          {project.kind}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-[54ch] text-muted">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>
      </div>
      <TextLink href={project.url} external className="shrink-0 sm:mt-7">
        {project.cta}
      </TextLink>
    </div>
  );
}

function Shot({ project, imageStyle }) {
  return (
    <BrowserFrame url={project.url}>
      <div className="group relative aspect-[1000/458] overflow-hidden bg-surface-2">
        <div className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
          <motion.img
            src={project.image}
            width={project.width}
            height={project.height}
            alt={project.alt}
            loading="lazy"
            style={imageStyle}
            className="size-full object-cover object-top"
          />
        </div>
        {/* Mouse shortcut to the live site; the text link below is the accessible one. */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener"
          tabIndex={-1}
          aria-hidden="true"
          data-cursor="Visit"
          className="absolute inset-0"
        />
      </div>
    </BrowserFrame>
  );
}

function OutroCard({ className = "" }) {
  return (
    <div
      className={`flex flex-col justify-between gap-10 rounded-[2rem] bg-accent p-8 text-on-accent sm:p-10 ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] opacity-70">
        Next up
      </p>
      <div>
        <h3 className="font-display text-4xl leading-[0.95] font-semibold tracking-[-0.03em] sm:text-5xl">
          Your business could be next.
        </h3>
        <p className="mt-4 max-w-[30ch] opacity-75">
          Tell me what your business needs and I’ll suggest the simplest thing
          that does the job.
        </p>
      </div>
      <div>
        <Button href={waLink()} external variant="dark">
          Start a project
        </Button>
      </div>
    </div>
  );
}

/* Desktop: vertical scrolling drives the row of projects sideways. */
function PinnedWork() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const centers = useRef([]);
  const distance = useMotionValue(0);
  const [height, setHeight] = useState("auto");
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  const imageX = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const d = Math.max(0, track.scrollWidth - stickyRef.current.clientWidth);
      distance.set(d);
      setHeight(`calc(100vh + ${d}px)`);
      centers.current = [...track.querySelectorAll("[data-project]")].map(
        (el) => el.offsetLeft + el.offsetWidth / 2,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [distance]);

  useMotionValueEvent(x, "change", (v) => {
    const mid = -v + stickyRef.current.clientWidth / 2;
    let best = 0;
    centers.current.forEach((c, i) => {
      if (Math.abs(c - mid) < Math.abs(centers.current[best] - mid)) best = i;
    });
    setActive(best);
  });

  // Keep keyboard focus visible: jump the scroll to the focused panel.
  const onFocus = (e) => {
    stickyRef.current.scrollLeft = 0;
    const panel = e.target.closest("[data-panel]");
    if (!panel) return;
    const shift = Math.min(distance.get(), Math.max(0, panel.offsetLeft - 64));
    const top = sectionRef.current.getBoundingClientRect().top + scrollY;
    scrollToTarget(top + shift, { immediate: true });
  };

  return (
    <div ref={sectionRef} style={{ height }} className="relative">
      <div ref={stickyRef} className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-10">
        <motion.div
          ref={trackRef}
          style={{ x }}
          onFocus={onFocus}
          className="flex w-max items-center gap-10 pr-[10vw] pl-[max(3rem,calc((100vw-1280px)/2+3rem))] xl:gap-14"
        >
          <div data-panel className="flex w-[min(30rem,36vw)] shrink-0 flex-col pr-6">
            <SectionLabel index="01">Selected work</SectionLabel>
            <SplitText
              id="work-title"
              text="Recent *work*"
              className="mt-6 font-display text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-semibold tracking-[-0.045em]"
            />
            <p className="mt-6 max-w-[30ch] text-lg text-muted">{INTRO}</p>
            <p className="mt-10 flex items-center gap-3 text-sm font-medium">
              <span className="grid size-11 place-items-center rounded-full border border-line">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
              Keep scrolling
            </p>
          </div>

          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-panel
              data-project
              className="w-[min(66vw,1000px,calc((100vh-360px)*2.05))] shrink-0"
            >
              <Shot project={p} imageStyle={{ x: imageX, scale: 1.12, originY: 0 }} />
              <ProjectInfo project={p} index={i} />
            </article>
          ))}

          <div data-panel className="shrink-0">
            <OutroCard className="h-[min(68vh,540px)] w-[min(28rem,34vw)]" />
          </div>
        </motion.div>

        <Container className="absolute inset-x-0 bottom-7 flex items-center gap-6 text-sm text-muted">
          <span className="font-display tabular-nums text-ink">
            0{active + 1}
            <span className="text-muted"> / 0{PROJECTS.length}</span>
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <motion.span
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 origin-left bg-ink"
            />
          </span>
          <span>Scroll</span>
        </Container>
      </div>
    </div>
  );
}

/* Phones and tablets: a swipeable slider. */
function WorkSlider() {
  const [emblaRef, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const progress = useMotionValue(0);

  const sync = useCallback(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const onScroll = () =>
      progress.set(Math.min(1, Math.max(0, api.scrollProgress())));
    sync();
    onScroll();
    api.on("reInit", sync).on("select", sync).on("scroll", onScroll);
    return () => {
      api.off("reInit", sync).off("select", sync).off("scroll", onScroll);
    };
  }, [api, sync, progress]);

  const slides = PROJECTS.length + 1;

  return (
    <div className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="01">Selected work</SectionLabel>
            <SplitText
              id="work-title"
              text="Recent *work*"
              className="mt-6 font-display text-[clamp(3rem,12vw,6rem)] leading-[0.9] font-semibold tracking-[-0.045em]"
            />
            <p className="mt-5 max-w-[40ch] text-lg text-muted">{INTRO}</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <SliderArrow dir="prev" disabled={!canPrev} onClick={() => api?.scrollPrev()} />
            <SliderArrow dir="next" disabled={!canNext} onClick={() => api?.scrollNext()} />
          </div>
        </div>

        <div
          className="embla mt-12"
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Recent work"
        >
          <div className="embla__container -ml-4">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides}`}
                className="min-w-0 shrink-0 grow-0 basis-[90%] pl-4 sm:basis-[72%] md:basis-[62%]"
              >
                <Shot project={p} />
                <ProjectInfo project={p} index={i} />
              </div>
            ))}
            <div
              role="group"
              aria-roledescription="slide"
              aria-label={`${slides} of ${slides}`}
              className="min-w-0 shrink-0 grow-0 basis-[90%] pl-4 sm:basis-[60%] md:basis-[45%]"
            >
              <OutroCard className="h-full min-h-[420px]" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-5">
          <div className="flex gap-1.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected ? "true" : undefined}
                className="grid h-8 place-items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === selected ? "w-7 bg-ink" : "w-1.5 bg-line"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <motion.span
              style={{ scaleX: progress }}
              className="absolute inset-0 origin-left bg-ink"
            />
          </span>
          <div className="flex gap-2 sm:hidden">
            <SliderArrow dir="prev" disabled={!canPrev} onClick={() => api?.scrollPrev()} />
            <SliderArrow dir="next" disabled={!canNext} onClick={() => api?.scrollNext()} />
          </div>
        </div>
      </Container>
    </div>
  );
}

function SliderArrow({ dir, disabled, onClick }) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous project" : "Next project"}
      className="grid size-12 place-items-center rounded-full border border-line text-ink transition-all duration-300 hover:bg-ink hover:text-bg disabled:pointer-events-none disabled:opacity-35"
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

export default function Work() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      {desktop && !reduced ? <PinnedWork /> : <WorkSlider />}
    </section>
  );
}
