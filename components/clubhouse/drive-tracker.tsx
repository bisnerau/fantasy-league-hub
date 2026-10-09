import type { CSSProperties } from 'react';
import { Football } from '@/components/effects/football';

/** Saved picks as a drive from a touchback; the Banker is the two-point try. */
export function DriveTracker({
  picks,
  total,
  banker,
  showBanker = true,
}: {
  picks: number;
  total: number;
  banker: boolean;
  showBanker?: boolean;
}) {
  if (!total) return null;
  const made = Math.min(picks, total);
  const yard = 20 + (80 * made) / total;
  const left = total - made;
  const label =
    made === total
      ? !showBanker
        ? 'Touchdown · all picks in'
        : banker
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
            <Football className="size-full" />
          </span>
        </span>
        <span className="drive-endzone drive-endzone-goal">
          {showBanker && (
            <span className="drive-two-point" data-good={banker || undefined}>
              2pt
            </span>
          )}
        </span>
      </div>
      <p className="mt-2 text-xs font-semibold text-foreground">{label}</p>
    </div>
  );
}
