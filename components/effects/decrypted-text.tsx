'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';

// Adapted from React Bits DecryptedText (MIT + Commons Clause). Characters
// resolve left to right once on mount; assistive technology only ever hears
// the final text, and reduced motion shows it immediately.
export function DecryptedText({
  text,
  duration = 900,
}: {
  text: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const resolved = Math.floor(
        Math.min((now - start) / duration, 1) * text.length,
      );
      element.textContent = text
        .split('')
        .map((character, index) =>
          index < resolved || character === ' '
            ? character
            : glyphs[Math.floor(Math.random() * glyphs.length)],
        )
        .join('');
      if (resolved < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      element.textContent = text;
    };
  }, [text, duration]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
