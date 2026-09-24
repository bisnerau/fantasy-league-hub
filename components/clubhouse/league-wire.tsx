'use client';

import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import type { WireItem } from '@/lib/data/league-wire';

// Adapted from React Bits LogoLoop and ScrollVelocity (MIT + Commons Clause) as
// a CSS marquee. Moving content has a pause control, and reduced motion shows
// a still, wrapped row.
export function LeagueWire({
  week,
  items,
}: {
  week: number;
  items: WireItem[];
}) {
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;
  const list = (hidden: boolean) => (
    <ul className="wire-track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.label} className="wire-item">
          <span className="wire-label">{item.label}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section
      className="league-wire"
      aria-label={`Week ${week} league wire`}
      data-paused={paused || undefined}
    >
      <span className="wire-badge">Wk {week} final</span>
      <div className="wire-viewport">
        <div className="wire-marquee">
          {list(false)}
          {list(true)}
        </div>
      </div>
      <button
        type="button"
        className="wire-toggle"
        aria-pressed={paused}
        aria-label={paused ? 'Play the league wire' : 'Pause the league wire'}
        onClick={() => setPaused(!paused)}
      >
        {paused ? (
          <Play className="size-3.5" aria-hidden="true" />
        ) : (
          <Pause className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
