import { SplitFlap } from '@/components/effects/split-flap';
import type { getRemaining } from '@/lib/countdown';

const pad = (value: number | undefined) =>
  value == null ? '--' : String(Math.min(value, 99)).padStart(2, '0');

/** Stadium-board digits; renders dashes until the client knows the time. */
export function FlapCountdown({
  remaining,
  until,
}: {
  remaining: ReturnType<typeof getRemaining> | null;
  until: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-1.5 sm:gap-2" aria-hidden="true">
        {(
          [
            ['Days', remaining?.days],
            ['Hrs', remaining?.hours],
            ['Mins', remaining?.minutes],
          ] as const
        ).map(([label, value], index) => (
          <div key={label} className="flex items-start gap-1.5 sm:gap-2">
            {index > 0 && <span className="split-flap-colon">:</span>}
            <div className="text-center">
              <SplitFlap value={pad(value)} />
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
      {remaining && (
        <span className="sr-only">
          {remaining.days} days, {remaining.hours} hours and {remaining.minutes}{' '}
          minutes {until}
        </span>
      )}
    </div>
  );
}
