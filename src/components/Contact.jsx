import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCheck, Copy, Mail } from "lucide-react";
import { SITE, waLink } from "../data.js";
import { useLocalTime } from "../lib/hooks.js";
import { Button, Container, EASE, Reveal, SectionLabel, SplitText } from "./ui.jsx";

const BUSINESS = [
  { id: "coaching", label: "Coaching centre", phrase: "I run a coaching centre." },
  { id: "clinic", label: "Clinic", phrase: "I run a clinic." },
  { id: "gym", label: "Gym", phrase: "I run a gym." },
  { id: "shop", label: "Shop", phrase: "I run a shop." },
  { id: "agency", label: "Agency", phrase: "I run a digital agency." },
  { id: "other", label: "Something else", phrase: "" },
];
const NEEDS = [
  { id: "website", label: "Business website", phrase: "a business website" },
  { id: "store", label: "Online store", phrase: "an online store" },
  { id: "landing", label: "Landing page for ads", phrase: "a landing page for ads" },
  { id: "assistant", label: "AI chat assistant", phrase: "an AI chat assistant" },
];
const TIMING = [
  { id: "asap", label: "As soon as possible", phrase: "I’d like to start as soon as possible." },
  { id: "month", label: "Within a month", phrase: "I’d like it within the next month." },
  { id: "exploring", label: "Just exploring", phrase: "I’m just exploring for now." },
];

const listJoin = (items) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

function buildMessage({ name, business, needs, timing }) {
  const parts = [name.trim() ? `Hi Divyanshu, I’m ${name.trim()}.` : "Hi Divyanshu!"];
  const b = BUSINESS.find((x) => x.id === business);
  if (b?.phrase) parts.push(b.phrase);
  const wanted = NEEDS.filter((x) => needs.includes(x.id)).map((x) => x.phrase);
  parts.push(
    wanted.length
      ? `I’m looking for ${listJoin(wanted)}.`
      : "I saw your website and want to talk about a project.",
  );
  const t = TIMING.find((x) => x.id === timing);
  if (t) parts.push(t.phrase);
  parts.push("Could you tell me what you’d suggest and what it would cost?");
  return parts.join(" ");
}

function Choice({ type, name, checked, onChange, children }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-all duration-300 select-none peer-checked:border-transparent peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink hover:border-ink/30 hover:text-ink">
        {checked && <Check className="size-3.5" aria-hidden="true" />}
        {children}
      </span>
    </label>
  );
}

function Group({ legend, children }) {
  return (
    <fieldset className="mt-8">
      <legend className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        {legend}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${SITE.email}`}
        className="inline-flex min-w-0 items-center gap-2 font-medium break-all text-ink underline-offset-4 hover:underline"
      >
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="relative inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-full border border-line px-3 text-xs font-semibold transition-colors hover:bg-surface-2"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}

export default function Contact() {
  const time = useLocalTime();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState(null);
  const [needs, setNeeds] = useState([]);
  const [timing, setTiming] = useState(null);
  const message = buildMessage({ name, business, needs, timing });

  const toggleNeed = (id) =>
    setNeeds((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]));

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-bg-2 py-24 sm:py-36"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob blob-a bottom-[-16rem] left-[-12rem] size-[40rem] bg-accent/25 dark:bg-accent/10" />
        <div className="blob blob-b top-[-10rem] right-[-12rem] size-[36rem] bg-violet/20 dark:bg-violet/15" />
      </div>
      <Container>
        <SectionLabel index="06">Contact</SectionLabel>
        <SplitText
          id="contact-title"
          text="Tell me about your *business*"
          className="mt-6 max-w-[13ch] font-display text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] font-semibold tracking-[-0.045em]"
        />
        <div className="mt-8 flex flex-col gap-3">
          <Reveal as="p" className="max-w-[48ch] text-lg text-muted sm:text-xl">
            Send a message with what your business does, and I’ll reply with
            what I’d build and what it would cost.
          </Reveal>
          <Reveal as="p" delay={0.1} lang="hi" className="font-hindi text-xl text-ink">
            हिंदी या English, जो आपको आसान लगे उसी में बात करें।
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="h-full rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-10"
            >
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Plan your project
              </h3>
              <p className="mt-1 text-muted">
                Pick what fits and I’ll write the WhatsApp message for you.
              </p>
              <Group legend="Your business">
                {BUSINESS.map((b) => (
                  <Choice
                    key={b.id}
                    type="radio"
                    name="business"
                    checked={business === b.id}
                    onChange={() => setBusiness(b.id)}
                  >
                    {b.label}
                  </Choice>
                ))}
              </Group>
              <Group legend="What do you need?">
                {NEEDS.map((n) => (
                  <Choice
                    key={n.id}
                    type="checkbox"
                    name="needs"
                    checked={needs.includes(n.id)}
                    onChange={() => toggleNeed(n.id)}
                  >
                    {n.label}
                  </Choice>
                ))}
              </Group>
              <Group legend="When do you need it?">
                {TIMING.map((t) => (
                  <Choice
                    key={t.id}
                    type="radio"
                    name="timing"
                    checked={timing === t.id}
                    onChange={() => setTiming(t.id)}
                  >
                    {t.label}
                  </Choice>
                ))}
              </Group>
              <label className="mt-8 block">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  Your name (optional)
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={60}
                  placeholder="e.g. Rahul"
                  className="mt-3 block h-12 w-full rounded-2xl border border-line bg-bg px-4 text-base text-ink transition-colors outline-none placeholder:text-muted/70 focus:border-ink/40"
                />
              </label>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft">
              <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
                <span className="grid size-11 place-items-center rounded-full bg-ink font-display text-sm font-bold text-bg">
                  DM
                </span>
                <div>
                  <p className="font-semibold">Divyanshu Mishra</p>
                  <p className="text-xs text-muted">
                    {SITE.city} · {time} IST
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted">
                  <span className="pulse-dot relative size-2 rounded-full bg-[#22c55e]" />
                  WhatsApp
                </span>
              </div>

              <div
                className="flex min-h-[260px] flex-1 flex-col justify-end gap-3 p-5 sm:p-6"
                style={{
                  backgroundImage:
                    "radial-gradient(color-mix(in srgb, var(--ink) 7%, transparent) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              >
                <p className="mx-auto rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted">
                  Message preview
                </p>
                <motion.div
                  layout
                  transition={{ duration: 0.4, ease: EASE }}
                  className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-[15px] leading-relaxed text-on-accent shadow-soft"
                >
                  <motion.p layout="position" aria-live="polite">
                    {message}
                  </motion.p>
                  <span className="mt-1 flex items-center justify-end gap-1 text-[11px] opacity-60">
                    now <CheckCheck className="size-3.5" aria-hidden="true" />
                  </span>
                </motion.div>
              </div>

              <div className="space-y-5 border-t border-line p-5 sm:p-6">
                <Button
                  href={waLink(message)}
                  external
                  size="lg"
                  magnetic={false}
                  className="w-full justify-between"
                >
                  Send on WhatsApp
                </Button>
                <div className="text-sm text-muted">
                  <p className="mb-2">Prefer email?</p>
                  <CopyEmail />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
