import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { FAQS, waLink } from "../data.js";
import { Button, Container, EASE, Reveal, SectionLabel, SplitText } from "./ui.jsx";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line py-24 sm:py-36">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel index="05">FAQ</SectionLabel>
          <SplitText
            id="faq-title"
            text="Questions, *answered*"
            className="mt-6 font-display text-[clamp(2.75rem,6.5vw,6rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
          />
          <Reveal as="p" className="mt-6 max-w-[32ch] text-lg text-muted">
            Something else on your mind? Ask me directly.
          </Reveal>
          <Reveal className="mt-8">
            <Button
              href={waLink("Hi Divyanshu, I have a question about getting a website.")}
              external
              variant="ghost"
            >
              Ask on WhatsApp
            </Button>
          </Reveal>
        </div>

        <ul className="border-t border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
                  >
                    <span
                      className={`font-display text-xl font-medium tracking-tight transition-colors sm:text-2xl ${
                        isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo ${
                        isOpen
                          ? "rotate-45 border-transparent bg-accent text-on-accent"
                          : "border-line group-hover:bg-surface-2"
                      }`}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[58ch] pr-14 pb-7 text-muted sm:text-lg">
                        {f.hindi && (
                          <span lang="hi" className="font-hindi text-ink">
                            {f.hindi}{" "}
                          </span>
                        )}
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
