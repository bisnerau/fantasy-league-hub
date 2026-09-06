import { formatScore } from '@/lib/sleeper/scores';

export function PointsBars({
  pointsFor,
  pointsAgainst,
  max,
}: {
  pointsFor: number | null;
  pointsAgainst: number | null;
  max: number;
}) {
  return (
    <div
      className="flex h-8 w-28 flex-col justify-center gap-1.5"
      aria-label={`${formatScore(pointsFor)} points for and ${formatScore(pointsAgainst)} points against`}
    >
      {[
        { value: pointsFor, color: 'bg-primary' },
        { value: pointsAgainst, color: 'bg-accent' },
      ].map((bar, index) => (
        <div key={index} className="h-1.5 rounded-sm bg-muted">
          <span
            className={`block h-full rounded-sm ${bar.color}`}
            style={{
              width:
                bar.value == null
                  ? '0%'
                  : `${Math.max(0, Math.min(100, (bar.value / Math.max(max, 1)) * 100))}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
