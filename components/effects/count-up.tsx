'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const formatter = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 0 });

// Adapted from React Bits CountUp (MIT + Commons Clause) without the motion
// dependency. The server renders the final value, assistive technology only
// hears the final value, and reduced motion skips the count entirely.
export function CountUp({
  value,
  from = 0,
  duration = 1.2,
  delay = 0,
}: {
  value: number;
  from?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || value === from || prefersReducedMotion()) return;
    const show = (current: number) => {
      element.textContent = formatter.format(current);
    };
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const startAt = performance.now() + delay * 1000;
      const tick = (now: number) => {
        const progress = Math.min(
          Math.max((now - startAt) / (duration * 1000), 0),
          1,
        );
        show(from + (value - from) * (1 - (1 - progress) ** 3));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    show(from);
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      show(value);
    };
  }, [value, from, duration, delay]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {formatter.format(value)}
      </span>
      <span className="sr-only">{formatter.format(value)}</span>
    </>
  );
}
