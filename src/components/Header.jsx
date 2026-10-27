import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { NAV, SITE, waLink } from "../data.js";
import { lockScroll, prefersReducedMotion } from "../lib/scroll.js";
import { useLocalTime } from "../lib/hooks.js";
import { Button, EASE } from "./ui.jsx";

const TRACKED = ["top", ...NAV.map((n) => n.id), "agencies", "contact"];
const MENU = [...NAV, { id: "contact", label: "Contact" }];

function useActiveSection() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    TRACKED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );

  const apply = (next, save) => {
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0a0b0e" : "#f4f3ee");
    if (save) {
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage blocked: the choice just won't be remembered */
      }
    }
    setTheme(next);
  };

  // Follow the system setting until the visitor picks a theme themselves.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem("theme");
      } catch {
        /* ignore */
      }
      if (!saved) apply(e.matches ? "dark" : "light", false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    if (!document.startViewTransition || prefersReducedMotion()) {
      apply(next, true);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const transition = document.startViewTransition(() => apply(next, true));
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-line bg-surface/60 text-ink transition-colors hover:bg-surface-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {theme === "dark" ? (
            <Moon className="size-[18px]" aria-hidden="true" />
          ) : (
            <Sun className="size-[18px]" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function MobileMenu({ onClose }) {
  const time = useLocalTime();
  return (
    <motion.div
      id="mobile-menu"
      initial={{ clipPath: "circle(0% at 92% 4%)" }}
      animate={{ clipPath: "circle(150% at 92% 4%)" }}
      exit={{ clipPath: "circle(0% at 92% 4%)" }}
      transition={{ duration: 0.75, ease: EASE }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-6 pt-28 pb-10 lg:hidden"
    >
      <nav aria-label="Menu">
        <ul>
          {MENU.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ y: 48, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: 0.2 + i * 0.06, duration: 0.8, ease: EASE },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <a
                href={`#${item.id}`}
                onClick={onClose}
                className="flex items-baseline gap-4 border-b border-line py-4 font-display text-[2.4rem] leading-none font-semibold tracking-tight"
              >
                <span className="font-sans text-xs font-medium text-muted tabular-nums">
                  0{i + 1}
                </span>
                {item.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="mt-auto space-y-5 pt-10"
      >
        <Button href={waLink()} external size="lg" magnetic={false}>
          Message me on WhatsApp
        </Button>
        <p className="text-sm text-muted">
          <a href={`mailto:${SITE.email}`} className="text-ink underline-offset-4 hover:underline">
            {SITE.email}
          </a>
          <br />
          {SITE.city}, India · {time}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 480);
  });

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = () => {
    lockScroll(false);
    setOpen(false);
  };

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent-ink"
      />
      <motion.header
        initial={{ y: "-130%" }}
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <div
          className={`mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 rounded-full border px-2 transition-[background-color,border-color,box-shadow] duration-500 ${
            scrolled || open
              ? "border-line bg-surface/75 shadow-soft backdrop-blur-xl"
              : "border-transparent"
          }`}
        >
          <a
            href="#top"
            className="flex items-center gap-3 rounded-full pr-3"
            aria-label="Divyanshu Mishra, back to top"
          >
            <span className="grid size-11 place-items-center rounded-full bg-ink font-display text-sm font-bold tracking-tight text-bg">
              DM
            </span>
            <span className="hidden font-display text-[15px] font-semibold tracking-tight sm:block">
              Divyanshu Mishra
            </span>
          </a>

          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.id} className="relative">
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink/8"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active === item.id ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:block">
              <Button href={waLink()} external magnetic={false}>
                Let’s talk
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full bg-ink text-bg lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {open ? (
                    <X className="size-5" aria-hidden="true" />
                  ) : (
                    <Menu className="size-5" aria-hidden="true" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>{open && <MobileMenu onClose={closeMenu} />}</AnimatePresence>
    </>
  );
}
