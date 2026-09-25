'use client';

import { useState } from 'react';
import { formatScore } from '@/lib/sleeper/scores';
import type {
  acquisitionReceipts,
  acquisitionSummary,
} from '@/lib/season/my-season';

type Receipt = ReturnType<typeof acquisitionReceipts>[number];

/** Did the pickups pay? Each addition as a bar of the starter points it gave you. */
export function PickupReturns({
  adds,
  summary,
  rostered,
  player,
  date,
}: {
  adds: Receipt[] | null;
  summary: ReturnType<typeof acquisitionSummary> | null;
  /** Whether a player is on your roster now, or null when unknown. */
  rostered: (playerId: string) => boolean | null;
  player: (playerId: string) => string;
  date: (value: number) => string;
}) {
  const [sort, setSort] = useState<'recent' | 'points'>('points');
  const [all, setAll] = useState(false);
  const sorted = [...(adds ?? [])].sort((a, b) =>
    sort === 'points'
      ? (b.points ?? -Infinity) - (a.points ?? -Infinity) ||
        b.acquired - a.acquired
      : b.acquired - a.acquired,
  );
  const max = Math.max(1, ...sorted.map((a) => a.points ?? 0));
  const shown = 5;
  return (
    <section
      id="my-waivers"
      aria-labelledby="my-waivers-title"
      className="season-panel"
    >
      <p className="ui-kicker text-primary">Your waiver wire</p>
      <h2 id="my-waivers-title" className="section-title">
        Did the pickups pay?
      </h2>
      {!adds || !summary ? (
        <p className="season-note mt-3">
          Transaction history is incomplete. Pickup returns are unavailable.
        </p>
      ) : !adds.length ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No completed pickups yet. Your first addition will start the receipt
          book.
        </p>
      ) : (
        <>
          <p className="returns-total">
            <span>
              <strong>{summary.additions}</strong> added
            </span>
            <span>
              <strong>{formatScore(summary.points)}</strong> pts used
            </span>
            <span>
              <strong>{summary.starts}</strong> starts
            </span>
            <span>
              <strong>
                {summary.faab === null ? 'Unknown' : `$${summary.faab}`}
              </strong>{' '}
              FAAB
            </span>
          </p>
          <fieldset className="sort-chips mt-3">
            <legend id="pickup-sort" className="sr-only">
              Sort pickups
            </legend>
            {(
              [
                ['recent', 'Recent'],
                ['points', 'Most points'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="sort-chip"
                aria-pressed={sort === key}
                onClick={() => setSort(key)}
              >
                {label}
              </button>
            ))}
          </fieldset>
          <ul className="returns-list">
            {(all ? sorted : sorted.slice(0, shown)).map((a) => {
              const onRoster = rostered(a.playerId);
              const waiting = a.evidence !== null && !a.evidence.length;
              return (
                <li key={a.id}>
                  <details className="return-row">
                    <summary>
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-bold">
                          {player(a.playerId)}
                        </span>
                        <span className="shrink-0 font-mono text-sm font-black">
                          {a.points === null || waiting
                            ? '—'
                            : a.points.toFixed(1)}
                        </span>
                      </span>
                      {!waiting && (
                        <span
                          className="return-track"
                          data-unavailable={a.points === null || undefined}
                          aria-hidden="true"
                        >
                          {a.points !== null && (
                            <span
                              className="return-bar"
                              style={{ width: `${(a.points / max) * 100}%` }}
                            />
                          )}
                        </span>
                      )}
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {a.type === 'waiver'
                          ? a.faab === null
                            ? 'FAAB unknown'
                            : `$${a.faab}`
                          : 'Free agent'}{' '}
                        · {date(a.acquired)} ·{' '}
                        {a.points === null
                          ? 'Return unavailable'
                          : waiting
                            ? 'Waiting for settled weeks'
                            : `${a.starts} start${a.starts === 1 ? '' : 's'}`}
                        {onRoster === true
                          ? ' · on your roster'
                          : onRoster === false
                            ? ' · moved on'
                            : ''}
                      </span>
                    </summary>
                    <div className="return-evidence">
                      {a.drops.length > 0 && (
                        <p>Released: {a.drops.map(player).join(', ')}.</p>
                      )}
                      {a.exited && (
                        <p>This spell ended; later points are excluded.</p>
                      )}
                      {a.evidence === null ? (
                        <p>
                          Acquisition timing or ownership history could not be
                          verified.
                        </p>
                      ) : a.evidence.length ? (
                        <ul className="return-weeks">
                          {a.evidence.map((e) => (
                            <li
                              key={e.week}
                              data-started={e.started || undefined}
                            >
                              <span className="font-mono font-bold">
                                Wk {e.week}
                              </span>{' '}
                              {e.excluded
                                ? 'Moved on'
                                : e.points === null
                                  ? 'Unavailable'
                                  : e.started
                                    ? `${e.points.toFixed(1)} started`
                                    : 'Bench · 0'}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
          {sorted.length > shown && (
            <button
              type="button"
              className="season-link"
              aria-expanded={all}
              onClick={() => setAll((value) => !value)}
            >
              {all ? 'Show fewer' : `Show all ${sorted.length} pickups`}
            </button>
          )}
        </>
      )}
      <details className="season-fold mt-4">
        <summary>How pickup returns are measured</summary>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          Settled scoring weeks only. The acquisition week counts if Sleeper
          records the player in your starting lineup; later bench weeks
          contribute zero used points. Exclude any departure week, then stop
          counting that ownership spell. Re-additions have separate receipts.
          Missing timing, ownership or score data stays unavailable, not zero.
          Starts are recorded starts, not proof of a good decision at the time.
          A player may have been injured or on bye; no cause is inferred from a
          zero. FAAB counts completed waiver claims once per transaction, not
          failed bids or FAAB sent in trades.
        </p>
      </details>
    </section>
  );
}
