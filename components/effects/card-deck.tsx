'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Adapted from React Bits CardSwap and Stack (MIT + Commons Clause). Swipe the
// top card, use the buttons, or the arrow keys. Only the top card is exposed
// to assistive technology; the position is announced politely.
export function CardDeck({
  items,
  label,
}: {
  items: { key: string; content: ReactNode }[];
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number } | null>(null);
  const last = items.length - 1;
  const go = (next: number) => setIndex(Math.min(Math.max(next, 0), last));
  const arrows = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(index + 1);
    if (event.key === 'ArrowLeft') go(index - 1);
  };

  return (
    <section aria-roledescription="carousel" aria-label={label}>
      <div className="card-deck">
        {items.map((item, position) => {
          const offset = position - index;
          return (
            <div
              key={item.key}
              className="deck-card"
              data-offset={offset < 0 ? 'gone' : Math.min(offset, 3)}
              aria-hidden={offset !== 0 || undefined}
              inert={offset !== 0}
              onPointerDown={(event) => {
                if (offset !== 0) return;
                drag.current = { x: event.clientX };
                event.currentTarget.dataset.dragging = '';
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!drag.current) return;
                const distance = event.clientX - drag.current.x;
                event.currentTarget.style.setProperty(
                  '--drag',
                  `${distance}px`,
                );
                event.currentTarget.style.setProperty(
                  '--tilt',
                  `${distance / 24}deg`,
                );
              }}
              onPointerUp={(event) => {
                if (!drag.current) return;
                const distance = event.clientX - drag.current.x;
                drag.current = null;
                settle(event.currentTarget);
                if (distance < -60) go(index + 1);
                else if (distance > 60) go(index - 1);
              }}
              onPointerCancel={(event) => {
                drag.current = null;
                settle(event.currentTarget);
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          className={deckButton}
          onClick={() => go(index - 1)}
          onKeyDown={arrows}
          disabled={index === 0}
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <p
          className="font-mono text-xs text-muted-foreground"
          aria-live="polite"
        >
          {index + 1} / {items.length}
        </p>
        <button
          type="button"
          className={deckButton}
          onClick={() => go(index + 1)}
          onKeyDown={arrows}
          disabled={index === last}
          aria-label="Next"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function settle(card: HTMLElement) {
  delete card.dataset.dragging;
  card.style.setProperty('--drag', '0px');
  card.style.setProperty('--tilt', '0deg');
}

const deckButton =
  'inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 disabled:opacity-35';
