import type { PointerEvent } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

// Adapted from React Bits SpotlightCard (MIT + Commons Clause). The glow is the
// `.spotlight-card` pseudo-element; pointer moves only update CSS variables, so
// following the mouse never re-renders the card. Touch and reduced motion keep
// the resting glow.
export function followSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
  card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
}
