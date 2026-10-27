import Lenis from "lenis";

let lenis = null;

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Inertia scrolling for wheel/trackpad. Touch devices keep native scrolling. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: true });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/* Scrolls to "#id", an element or a pixel offset. */
export function scrollToTarget(target, { immediate = false } = {}) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (el == null) return;
  if (lenis) {
    lenis.scrollTo(el, { immediate, force: true, duration: immediate ? 0 : 1.4 });
    return;
  }
  const top =
    typeof el === "number" ? el : el.getBoundingClientRect().top + scrollY;
  window.scrollTo({
    top,
    behavior: immediate || prefersReducedMotion() ? "auto" : "smooth",
  });
}
