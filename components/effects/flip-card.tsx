'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { followSpotlight } from '@/components/effects/spotlight';
import { cn } from '@/lib/utils';

// Adapted from React Bits FlipCard (MIT + Commons Clause). Both faces stay in
// the document; the hidden face is inert, and focus follows the flip.
export function FlipCard({
  front,
  back,
  flipLabel,
  spotlight = false,
  className,
}: {
  front: ReactNode;
  back: ReactNode;
  flipLabel: string;
  spotlight?: boolean;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const toggled = useRef(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const flip = (next: boolean) => {
    toggled.current = true;
    setFlipped(next);
  };

  useEffect(() => {
    if (!toggled.current) return;
    (flipped ? backRef : frontRef).current
      ?.querySelector<HTMLElement>('a[href], button')
      ?.focus({ preventScroll: true });
  }, [flipped]);

  return (
    <div
      className={cn('flip-card', spotlight && 'spotlight-card', className)}
      data-flipped={flipped || undefined}
      onPointerMove={spotlight ? followSpotlight : undefined}
    >
      <div className="flip-card-inner">
        <div ref={frontRef} className="flip-face" inert={flipped}>
          {front}
          <button
            type="button"
            className="flip-hit"
            aria-label={flipLabel}
            onClick={() => flip(true)}
          />
        </div>
        <div
          ref={backRef}
          className="flip-face flip-face-back"
          inert={!flipped}
        >
          {back}
          <button
            type="button"
            className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Flip back"
            onClick={() => flip(false)}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
