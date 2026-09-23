// CSS reduced-motion rules in globals.css cannot stop script-driven effects,
// so every JavaScript animation checks this before it starts.
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
