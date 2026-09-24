'use client';

import { useRef, type ReactNode } from 'react';

export type SwipeSide = 'home' | 'away';

const THRESHOLD = 80;

// Adapted from React Bits Stack/TinderCards (MIT + Commons Clause). Drag the
// card towards a team to pick it: left for the home side, right for away.
// The pick buttons and arrow keys in the caller do the same without a drag.
export function SwipePick({
  children,
  disabled,
  onPick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onPick: (side: SwipeSide) => void;
}) {
  const drag = useRef<{ x: number } | null>(null);
  const settle = (card: HTMLElement) => {
    delete card.dataset.dragging;
    delete card.dataset.lean;
    card.style.setProperty('--drag', '0px');
    card.style.setProperty('--tilt', '0deg');
  };

  return (
    <div
      className="swipe-card"
      // The card owns its drag: a sheet around it must not read it as a dismiss.
      onPointerDown={(event) => {
        event.stopPropagation();
        if (disabled || event.button !== 0) return;
        if ((event.target as HTMLElement).closest('button, a')) return;
        drag.current = { x: event.clientX };
        event.currentTarget.dataset.dragging = '';
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        event.stopPropagation();
        const card = event.currentTarget;
        const distance = event.clientX - drag.current.x;
        card.style.setProperty('--drag', `${distance}px`);
        card.style.setProperty('--tilt', `${distance / 20}deg`);
        if (Math.abs(distance) > THRESHOLD / 2)
          card.dataset.lean = distance < 0 ? 'home' : 'away';
        else delete card.dataset.lean;
      }}
      onPointerUp={(event) => {
        if (!drag.current) return;
        event.stopPropagation();
        const distance = event.clientX - drag.current.x;
        drag.current = null;
        settle(event.currentTarget);
        if (Math.abs(distance) >= THRESHOLD)
          onPick(distance < 0 ? 'home' : 'away');
      }}
      onPointerCancel={(event) => {
        drag.current = null;
        settle(event.currentTarget);
      }}
    >
      {children}
    </div>
  );
}
