'use client';

import { useState } from 'react';
import { useMemberRoster } from '@/components/power-rankings/use-member-roster';
import {
  ordinal,
  type RankHistory as History,
} from '@/lib/data/power-rankings';

const W = 320;
const H = 196;
const PAD = { top: 14, right: 26, bottom: 26, left: 22 };

type Series = { rosterId: number; teamName: string; ranks: (number | null)[] };

/**
 * A bump chart of every published edition: one team in primary, the rest in
 * grey (emphasis, never twelve hues). Unpublished weeks stay as labelled gaps.
 */
export function RankHistory({
  columns,
  series,
  size,
}: {
  columns: History['columns'];
  series: Series[];
  size: number;
}) {
  const mine = useMemberRoster();
  const [picked, setPicked] = useState<number | null>(null);
  const selected =
    picked ??
    (series.some((row) => row.rosterId === mine) ? mine : null) ??
    series[0]?.rosterId;
  const x = (index: number) =>
    PAD.left +
    (columns.length === 1
      ? 0
      : (index * (W - PAD.left - PAD.right)) / (columns.length - 1));
  const y = (rank: number) =>
    PAD.top + ((rank - 1) * (H - PAD.top - PAD.bottom)) / Math.max(1, size - 1);
  const highlighted = series.find((row) => row.rosterId === selected);
  const ordered = [
    ...series.filter((row) => row.rosterId !== selected),
    ...(highlighted ? [highlighted] : []),
  ];

  return (
    <section aria-labelledby="history-title">
      <div className="section-heading">
        <div>
          <p className="ui-kicker text-primary">Every edition</p>
          <h2 id="history-title" className="section-title">
            Rank history
          </h2>
        </div>
      </div>
      <div className="rank-history">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          aria-hidden="true"
        >
          {[1, size].map((rank) => (
            <g key={rank} className="rank-history-grid">
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(rank)}
                y2={y(rank)}
              />
              <text x={PAD.left - 8} y={y(rank)} dy="0.32em" textAnchor="end">
                {rank}
              </text>
            </g>
          ))}
          {columns.map((column, index) => (
            <text
              key={column.label}
              x={x(index)}
              y={H - 6}
              textAnchor="middle"
              className="rank-history-axis"
              data-gap={!column.published || undefined}
            >
              {column.published ? column.label : `${column.label} –`}
            </text>
          ))}
          {ordered.map((row) => {
            const active = row.rosterId === selected;
            return (
              <g
                key={row.rosterId}
                className="rank-history-series"
                data-active={active || undefined}
              >
                {segments(row.ranks).map((segment) =>
                  segment.length === 1 ? (
                    <circle
                      key={segment[0]}
                      cx={x(segment[0])}
                      cy={y(row.ranks[segment[0]]!)}
                      r={2}
                    />
                  ) : (
                    <polyline
                      key={segment[0]}
                      points={segment
                        .map((index) => `${x(index)},${y(row.ranks[index]!)}`)
                        .join(' ')}
                    />
                  ),
                )}
                {active &&
                  row.ranks.map((rank, index) =>
                    rank == null ? null : (
                      <g key={index}>
                        <circle cx={x(index)} cy={y(rank)} r={4.5} />
                        <text
                          x={x(index)}
                          y={y(rank)}
                          dy={rank <= 2 ? '1.35em' : '-0.75em'}
                          textAnchor="middle"
                        >
                          {rank}
                        </text>
                      </g>
                    ),
                  )}
              </g>
            );
          })}
        </svg>
        <p className="sr-only" aria-live="polite">
          {highlighted
            ? `${highlighted.teamName}: ${describe(highlighted, columns)}`
            : ''}
        </p>
        <fieldset className="history-chips snap-rail">
          <legend className="sr-only">Highlight a team</legend>
          {series.map((row) => (
            <button
              key={row.rosterId}
              type="button"
              className="sort-chip"
              aria-pressed={row.rosterId === selected}
              onClick={() => setPicked(row.rosterId)}
            >
              <span className="max-w-[9rem] truncate">{row.teamName}</span>
            </button>
          ))}
        </fieldset>
      </div>
      <div className="sr-only">
        <table>
          <caption>Power ranking by edition</caption>
          <thead>
            <tr>
              <th scope="col">Team</th>
              {columns.map((column) => (
                <th key={column.label} scope="col">
                  {column.week == null
                    ? 'Preseason forecast'
                    : `Week ${column.week}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((row) => (
              <tr key={row.rosterId}>
                <th scope="row">{row.teamName}</th>
                {row.ranks.map((rank, index) => (
                  <td key={index}>{rank == null ? 'No edition' : rank}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Runs of consecutive ranked columns; a gap breaks the line. */
function segments(ranks: (number | null)[]) {
  const runs: number[][] = [];
  ranks.forEach((rank, index) => {
    if (rank == null) return;
    const run = runs.at(-1);
    if (run && run.at(-1) === index - 1) run.push(index);
    else runs.push([index]);
  });
  return runs;
}

function describe(row: Series, columns: History['columns']) {
  return row.ranks
    .map((rank, index) => {
      const column = columns[index];
      const when =
        column.week == null ? 'preseason forecast' : `Week ${column.week}`;
      return `${when} ${rank == null ? 'no edition' : ordinal(rank)}`;
    })
    .join(', ');
}
