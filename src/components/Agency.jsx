import { ClipboardList, FileCode, Handshake } from "lucide-react";
import { WA_AGENCY, waLink } from "../data.js";
import { Button, Container, Reveal, SplitText } from "./ui.jsx";

const POINTS = [
  {
    icon: Handshake,
    title: "You keep the client and the credit",
    body: "I stay in the background as the developer behind your website projects.",
  },
  {
    icon: ClipboardList,
    title: "Built to your brief",
    body: "I build the site to your brief, and you deliver it under your name.",
  },
  {
    icon: FileCode,
    title: "Full handover",
    body: "You get the full code and logins when it’s done.",
  },
];

function SpinningBadge() {
  const text = "WHITE-LABEL • DEVELOPER • FOR AGENCIES • ";
  return (
    <div className="relative size-36" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-slow size-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-sans text-[15.5px] font-semibold tracking-[0.18em]">
          <textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto grid size-14 place-items-center rounded-full bg-accent text-on-accent">
        <Handshake className="size-6" />
      </span>
    </div>
  );
}

export default function Agency() {
  return (
    <section
      id="agencies"
      aria-labelledby="agencies-title"
      className="relative overflow-hidden bg-ink py-24 text-bg sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-accent/20 blur-[120px]"
      />
      <Container className="relative grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-bg/60">
            <span className="size-1.5 rounded-full bg-accent" />
            For agencies
          </p>
          <SplitText
            id="agencies-title"
            text="Run an *agency?*"
            accentClass="text-accent dark:text-[#4b7a06]"
            className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] font-semibold tracking-[-0.045em]"
          />
          <Reveal as="p" className="mt-8 max-w-[38ch] text-lg text-bg/70 sm:text-xl">
            I can be the developer behind your website projects. You keep the
            client and the credit, and I stay in the background.
          </Reveal>
          <div className="mt-10 hidden lg:block">
            <SpinningBadge />
          </div>
        </div>

        <div>
          <ul className="border-t border-bg/15">
            {POINTS.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.1}
                className="group flex gap-5 border-b border-bg/15 py-7"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-bg/20 transition-colors duration-500 group-hover:border-transparent group-hover:bg-accent group-hover:text-on-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-1 text-bg/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={waLink(WA_AGENCY)} external size="lg">
              Talk about agency work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
