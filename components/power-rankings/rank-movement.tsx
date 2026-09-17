import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

export function RankMovement({
  rank,
  previousRank,
}: {
  rank: number;
  previousRank?: number;
}) {
  if (previousRank === undefined)
    return <span className="text-sm text-muted-foreground">New</span>;
  const change = previousRank - rank;
  const Icon = change > 0 ? ArrowUp : change < 0 ? ArrowDown : Minus;
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-sm ${change > 0 ? 'text-primary' : 'text-muted-foreground'}`}
      aria-label={
        change === 0
          ? 'Unchanged'
          : `${change > 0 ? 'Up' : 'Down'} ${Math.abs(change)} ${Math.abs(change) === 1 ? 'place' : 'places'}`
      }
    >
      <Icon className="size-4" aria-hidden="true" />
      {change === 0 ? '—' : Math.abs(change)}
    </span>
  );
}
