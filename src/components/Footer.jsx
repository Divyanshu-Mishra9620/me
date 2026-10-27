import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";
import { NAV, SITE, waLink } from "../data.js";
import { useLocalTime } from "../lib/hooks.js";
import { scrollToTarget } from "../lib/scroll.js";
import { Button, Container } from "./ui.jsx";

export default function Footer() {
  const ref = useRef(null);
  const time = useLocalTime();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const wordY = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  const linkClass = "text-muted transition-colors hover:text-ink";

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-line pt-20 sm:pt-28"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="max-w-[16ch] font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              Have a project in mind?{" "}
              <span className="text-muted">Let’s make it happen.</span>
            </p>
            <div className="mt-8">
              <Button href={waLink()} external>
                Message me on WhatsApp
              </Button>
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Sitemap
            </p>
            <ul className="mt-5 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className={linkClass}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Contact
            </p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className={`${linkClass} break-all`}
                >
                  {SITE.email}
                </a>
              </li>
              {/* <li>
                <a href={SITE.github} target="_blank" rel="noopener" className={linkClass}>
                  GitHub
                </a>
              </li> */}
            </ul>
            <p className="mt-6 text-sm text-muted">
              {SITE.city} · {time} IST
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-5 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Divyanshu Mishra. Based in Lucknow,
            working with clients across India.
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget("#top")}
            className="group inline-flex items-center gap-3 self-start font-medium text-ink"
          >
            Back to top
            <span className="grid size-10 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:bg-ink group-hover:text-bg">
              <ArrowUp className="size-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none overflow-hidden select-none"
      >
        <motion.p
          style={{ y: wordY }}
          className="-mb-[0.18em] bg-linear-to-b from-ink/20 to-ink/0 bg-clip-text text-center font-display text-[18.5vw] leading-[0.8] font-bold tracking-[-0.065em] whitespace-nowrap text-transparent"
        >
          Divyanshu
        </motion.p>
      </div>
    </footer>
  );
}
