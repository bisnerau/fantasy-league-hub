'use client';

import { useEffect, useRef, useState } from 'react';
import { SplitFlap } from '@/components/effects/split-flap';
import { prefersReducedMotion } from '@/lib/motion';

const STEP = 70;
const pad = (rank: number) => String(rank).padStart(2, '0');

// The departure board: the rank rolls from last edition's place to this one
// the first time the row scrolls into view. The server renders the real rank,
// which stays for no-JS, reduced motion, new entries and unchanged places.
export function RankFlap({
  rank,
  previousRank,
}: {
  rank: number;
  previousRank?: number;
}) {
  const [shown, setShown] = useState(rank);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      previousRank === undefined ||
      previousRank === rank ||
      prefersReducedMotion()
    )
      return;
    const timers: number[] = [];
    let reset = false;
    const roll = () => {
      const direction = rank < previousRank ? -1 : 1;
      const steps = Math.abs(rank - previousRank);
      for (let step = 1; step <= steps; step++)
        timers.push(
          window.setTimeout(
            () => setShown(previousRank + step * direction),
            STEP * step + 180,
          ),
        );
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!reset) {
          reset = true;
          setShown(previousRank);
        }
        if (!visible) return;
        observer.disconnect();
        roll();
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [rank, previousRank]);

  return (
    <span ref={ref} className="rank-flap">
      <span className="sr-only">Rank {rank}</span>
      <SplitFlap value={pad(shown)} />
    </span>
  );
}
