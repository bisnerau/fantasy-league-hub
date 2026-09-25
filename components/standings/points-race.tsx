'use client';

import { useEffect, useRef } from 'react';
import type { TeamStanding } from '@/lib/data/standings';
import { prefersReducedMotion } from '@/lib/motion';

/** Points for as a bar race. The bars grow once, the first time it is seen. */
export function PointsRace({ standings }: { standings: TeamStanding[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const rows = [...standings].sort(
    (a, b) =>
      (b.pointsFor ?? -Infinity) - (a.pointsFor ?? -Infinity) ||
      a.rank - b.rank,
  );
  const max = Math.max(...rows.map((team) => team.pointsFor ?? 0), 1);

  // The server renders full bars; only a motion-friendly browser shrinks
  // them first so they can grow into view.
  useEffect(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) return;
    list.dataset.armed = '';
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        list.dataset.grown = '';
      },
      { threshold: 0.3 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="points-race-title">
      <div className="section-heading">
        <div>
          <p className="ui-kicker text-primary">Points for</p>
          <h2 id="points-race-title" className="section-title">
            The points race
          </h2>
        </div>
      </div>
      <ol ref={ref} className="points-race">
        {rows.map((team, index) => (
          <li
            key={team.rosterId}
            className="points-race-row"
            style={{ '--i': index } as React.CSSProperties}
          >
            <span className="truncate text-xs font-semibold">
              {team.teamName}
            </span>
            <span className="points-race-track">
              {team.pointsFor != null && (
                <span
                  className="points-race-bar"
                  data-leader={index === 0 || undefined}
                  style={{ width: `${(team.pointsFor / max) * 100}%` }}
                />
              )}
            </span>
            <span className="text-right font-mono text-xs font-bold">
              {team.pointsFor == null ? '—' : team.pointsFor.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
