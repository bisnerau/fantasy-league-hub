import { CountUp } from '@/components/effects/count-up';
import { cn } from '@/lib/utils';
import type { LeaderboardRow } from './use-prediction-member';

const medal = ['gold', 'silver', 'bronze'] as const;

/**
 * The prediction table as a podium for the top three plus compact rows, so it
 * never scrolls sideways on a phone. Equal points share a rank.
 */
export function PredictionPodium({
  title,
  subtitle,
  rows,
  currentUserId,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  rows: LeaderboardRow[];
  currentUserId?: string;
  emptyMessage?: string;
}) {
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-heading`;
  const ranked = rows.map((row) => ({
    row,
    rank: rows.findIndex((candidate) => candidate.points === row.points) + 1,
  }));
  const podium = ranked.slice(0, 3);
  // Silver, gold, bronze from left to right, as on a real podium.
  const stage = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <section className="podium-panel" aria-labelledby={headingId}>
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h2 id={headingId} className="text-base font-bold">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {subtitle}
        </p>
      </div>
      {emptyMessage ? (
        <p className="px-5 py-8 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <>
          <ol className="podium-stage" aria-hidden="true">
            {stage.map(({ row, rank }) => (
              <li
                key={row.voter_id}
                className="podium-step"
                data-medal={medal[Math.min(rank, 3) - 1]}
              >
                <span className="podium-name">
                  {row.display_name.split(' ')[0]}
                </span>
                <span className="podium-points">
                  <CountUp value={row.points} />
                  <span className="text-[10px] font-semibold"> pts</span>
                </span>
                <span className="podium-block">{rank}</span>
              </li>
            ))}
          </ol>
          <ol
            className="podium-rows"
            aria-label={`${title}. Ranked by points; equal totals share a rank. Bankers earn two points.`}
          >
            {ranked.map(({ row, rank }) => (
              <li
                key={row.voter_id}
                className={cn(
                  'podium-row',
                  row.voter_id === currentUserId && 'podium-row-you',
                )}
              >
                <span className="podium-rank">{rank}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {row.display_name}
                    {row.voter_id === currentUserId && (
                      <span className="ml-1 text-xs text-primary">(you)</span>
                    )}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {row.correct_picks}/{row.completed_picks} correct · Bankers{' '}
                    {row.correct_bankers}/{row.completed_bankers} ·{' '}
                    {Number(row.accuracy).toFixed(1)}%
                  </span>
                </span>
                <span className="font-mono text-base font-bold text-primary">
                  {row.points}
                  <span className="ml-0.5 text-[10px] font-semibold text-muted-foreground">
                    pts
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
