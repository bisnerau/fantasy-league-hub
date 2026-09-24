import type { CSSProperties } from 'react';

/** Saved picks as a drive from a touchback; the Banker is the two-point try. */
export function DriveTracker({
  picks,
  total,
  banker,
}: {
  picks: number;
  total: number;
  banker: boolean;
}) {
  if (!total) return null;
  const made = Math.min(picks, total);
  const yard = 20 + (80 * made) / total;
  const left = total - made;
  const label =
    made === total
      ? banker
        ? 'Touchdown · two-point try good'
        : 'Touchdown · Banker is the two-point try'
      : made === 0
        ? 'Touchback · 80 yards to go'
        : `Ball on the ${yard <= 50 ? 'own' : 'opp'} ${Math.round(
            yard <= 50 ? yard : 100 - yard,
          )} · ${left} ${left === 1 ? 'pick' : 'picks'} from the end zone`;

  return (
    <div className="mt-5">
      <div
        className="drive-field"
        aria-hidden="true"
        data-touchdown={made === total || undefined}
        style={{ '--ball': `${yard}%` } as CSSProperties}
      >
        <span className="drive-endzone" />
        <span className="drive-play">
          <span className="drive-progress" />
          <span className="drive-ball">
            <svg viewBox="0 0 24 14" className="size-full">
              <ellipse cx="12" cy="7" rx="11" ry="6.5" fill="currentColor" />
              <path
                d="M7 7h10M9.5 5.2v3.6M12 5.2v3.6M14.5 5.2v3.6"
                stroke="var(--card)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
        <span className="drive-endzone drive-endzone-goal">
          <span className="drive-two-point" data-good={banker || undefined}>
            2pt
          </span>
        </span>
      </div>
      <p className="mt-2 text-xs font-semibold text-foreground">{label}</p>
    </div>
  );
}
