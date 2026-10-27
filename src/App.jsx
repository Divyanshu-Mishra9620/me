import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { scrollToTarget, startSmoothScroll } from "./lib/scroll.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Statement from "./components/Statement.jsx";
import Work from "./components/Work.jsx";
import Services from "./components/Services.jsx";
import Agency from "./components/Agency.jsx";
import Process from "./components/Process.jsx";
import About from "./components/About.jsx";
import Faq from "./components/Faq.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Cursor from "./components/Cursor.jsx";

export default function App() {
  useEffect(() => startSmoothScroll(), []);

  // In-page links glide to their section instead of jumping.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      target.focus?.({ preventScroll: true });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    if (location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) requestAnimationFrame(() => scrollToTarget(target, { immediate: true }));
    }
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[90] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Cursor />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee />
        <Statement />
        <Work />
        <Services />
        <Agency />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  );
}
