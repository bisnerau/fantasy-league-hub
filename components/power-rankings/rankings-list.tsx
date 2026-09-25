'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { RankFlap } from '@/components/power-rankings/rank-flap';
import { RankMovement } from '@/components/power-rankings/rank-movement';
import { useMemberRoster } from '@/components/power-rankings/use-member-roster';
import { ordinal } from '@/lib/data/power-rankings';
import { prefersReducedMotion } from '@/lib/motion';

export type RankingRow = {
  rosterId: number;
  rank: number;
  previousRank?: number;
  teamName: string;
  manager: string;
  avatar: string | null;
  record: string;
  points: number;
  verdict: string;
  href: string;
};

/** Twelve compact rows; the verdict teases in one line and opens on tap. */
export function RankingsList({
  rows,
  caption,
}: {
  rows: RankingRow[];
  caption: string;
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const mine = useMemberRoster();
  const myRow = rows.find((row) => row.rosterId === mine);
  const toggle = (rosterId: number, next?: boolean) =>
    setOpen((current) => {
      const updated = new Set(current);
      if (next ?? !updated.has(rosterId)) updated.add(rosterId);
      else updated.delete(rosterId);
      return updated;
    });

  function jumpToMine() {
    if (!myRow) return;
    toggle(myRow.rosterId, true);
    const button = document.getElementById(`rank-button-${myRow.rosterId}`);
    button?.scrollIntoView({
      block: 'center',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    button?.focus({ preventScroll: true });
  }

  return (
    <div>
      {myRow && (
        <button type="button" className="mine-chip" onClick={jumpToMine}>
          <span className="ui-kicker">Your team</span>
          <span className="font-mono text-sm font-black">
            {ordinal(myRow.rank)}
          </span>
          <RankMovement rank={myRow.rank} previousRank={myRow.previousRank} />
        </button>
      )}
      <p className="mb-2 text-[11px] leading-5 text-muted-foreground">
        {caption}
      </p>
      <ol className="rankings-list" aria-label="Power rankings">
        {rows.map((row) => {
          const expanded = open.has(row.rosterId);
          const panelId = `verdict-${row.rosterId}`;
          return (
            <li
              key={row.rosterId}
              className="ranking-row"
              data-power-roster={row.rosterId}
              data-open={expanded || undefined}
              data-mine={row.rosterId === mine || undefined}
              data-top={row.rank === 1 || undefined}
            >
              <button
                id={`rank-button-${row.rosterId}`}
                type="button"
                className="ranking-row-button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(row.rosterId)}
              >
                <RankFlap rank={row.rank} previousRank={row.previousRank} />
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-bold min-[375px]:text-base">
                    {row.teamName}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {row.manager}
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, record </span>
                    {row.record}
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, </span>
                    {row.points.toFixed(2)} pts
                  </span>
                </span>
                <RankMovement rank={row.rank} previousRank={row.previousRank} />
                <ChevronDown
                  className="ranking-chevron size-4"
                  aria-hidden="true"
                />
              </button>
              <div id={panelId} className="ranking-verdict">
                <p>{row.verdict}</p>
                <a
                  href={row.href}
                  className="clubhouse-text-link mt-2 min-h-11"
                  hidden={!expanded}
                >
                  Manager profile
                  <span className="sr-only">: {row.manager}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
