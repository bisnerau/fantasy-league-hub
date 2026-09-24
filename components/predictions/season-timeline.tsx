'use client';

import { useEffect, useRef } from 'react';
import { Check, LockKeyhole } from 'lucide-react';
import type { MemberWeek } from './use-prediction-member';

type WeekState = 'settled' | 'open' | 'locked' | 'past' | 'live';

/**
 * The season as a rail of week chips. Only the viewed week's state is known
 * exactly; other past weeks show a tick once the member has settled points.
 */
export function SeasonTimeline({
  week,
  currentWeek,
  locked,
  finalized,
  memberWeeks,
}: {
  week: number;
  currentWeek: number;
  locked: boolean;
  finalized: boolean;
  memberWeeks: MemberWeek[];
}) {
  const railRef = useRef<HTMLOListElement>(null);
  const latest = Math.max(1, currentWeek);
  const weeks = Array.from({ length: latest }, (_, index) => index + 1);
  const points = new Map(
    memberWeeks
      .filter((row) => row.completed_picks > 0)
      .map((row) => [row.week, row.points]),
  );

  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!rail || !chip) return;
    // Scroll the rail itself; scrollIntoView would also move the page.
    rail.scrollLeft =
      chip.offsetLeft - rail.clientWidth / 2 + chip.offsetWidth / 2;
  }, [week]);

  const stateFor = (value: number): WeekState =>
    value === week
      ? finalized
        ? 'settled'
        : locked
          ? 'locked'
          : 'open'
      : points.has(value)
        ? 'settled'
        : value === latest
          ? 'live'
          : 'past';
  const words: Record<WeekState, string> = {
    settled: 'settled',
    open: 'open for picks',
    locked: 'locked',
    past: 'played',
    live: 'this week',
  };

  return (
    <nav aria-label="Season weeks">
      <ol ref={railRef} className="snap-rail season-rail">
        {weeks.map((value) => {
          const state = stateFor(value);
          const score = points.get(value);
          return (
            <li key={value}>
              <a
                href={`/matchups?week=${value}`}
                className="week-chip"
                data-state={state}
                aria-current={value === week ? 'page' : undefined}
                aria-label={`Week ${value}, ${words[state]}${score == null ? '' : `, ${score} ${score === 1 ? 'point' : 'points'}`}`}
              >
                <span className="font-mono text-sm font-black">W{value}</span>
                <span className="week-chip-state" aria-hidden="true">
                  {state === 'settled' ? (
                    <>
                      <Check className="size-3" />
                      {score != null && `${score} pts`}
                    </>
                  ) : state === 'locked' ? (
                    <LockKeyhole className="size-3" />
                  ) : state === 'open' || state === 'live' ? (
                    <span className="live-dot" />
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
