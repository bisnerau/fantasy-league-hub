'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

// Adapted from React Bits TearTicket and StickerPeel (MIT + Commons Clause).
// Drag the cover sideways past a third of its width, or simply tap it: both
// reveal the same content. The cover is a real disclosure button, and dragging
// only writes a CSS variable, so it never re-renders mid-gesture. Hidden
// content takes no space (and lazy images do not load) until it is revealed.
export function TearReveal({
  cover,
  children,
  variant,
  className,
}: {
  cover: ReactNode;
  children: ReactNode;
  variant: 'ticket' | 'sticker';
  className?: string;
}) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealed) return;
    contentRef.current
      ?.querySelector<HTMLElement>('a[href], button')
      ?.focus({ preventScroll: true });
  }, [revealed]);

  const progress = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current;
    if (!start) return 0;
    return clamp(
      Math.abs(event.clientX - start.x) / event.currentTarget.offsetWidth,
    );
  };

  return (
    <div
      className={cn('tear-reveal', `tear-${variant}`, className)}
      data-revealed={revealed || undefined}
    >
      <div ref={contentRef} id={id} className="tear-content" hidden={!revealed}>
        {children}
      </div>
      <button
        type="button"
        className="tear-cover"
        aria-expanded={revealed}
        aria-controls={id}
        inert={revealed}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          drag.current = { x: event.clientX, moved: false };
          event.currentTarget.dataset.dragging = '';
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start) return;
          if (Math.abs(event.clientX - start.x) > 6) start.moved = true;
          event.currentTarget.style.setProperty(
            '--tear',
            String(progress(event)),
          );
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          const amount = progress(event);
          drag.current = null;
          delete event.currentTarget.dataset.dragging;
          if (!start?.moved) return;
          suppressClick.current = true;
          if (amount > 0.34) setRevealed(true);
          else event.currentTarget.style.setProperty('--tear', '0');
        }}
        onPointerCancel={(event) => {
          drag.current = null;
          delete event.currentTarget.dataset.dragging;
          event.currentTarget.style.setProperty('--tear', '0');
        }}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          setRevealed(true);
        }}
      >
        {cover}
      </button>
    </div>
  );
}
