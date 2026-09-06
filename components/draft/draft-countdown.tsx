'use client';

import { useEffect, useState } from 'react';
import { formatLockTime } from '@/lib/predictions/rules';

function getRemaining(target: number) {
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
  };
}

export function DraftCountdown({ startTime }: { startTime: number }) {
  const [remaining, setRemaining] = useState<ReturnType<
    typeof getRemaining
  > | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(getRemaining(startTime));
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [startTime]);
  if (!startTime)
    return (
      <div className="draft-countdown-card">
        <p className="ui-kicker">Draft day</p>
        <p className="mt-4 text-sm text-muted-foreground">
          The draft time has not been scheduled yet.
        </p>
      </div>
    );
  const due =
    remaining != null &&
    !remaining.days &&
    !remaining.hours &&
    !remaining.minutes;
  return (
    <div className="draft-countdown-card">
      <span className="ui-kicker">Draft day</span>
      {due ? (
        <p className="mt-5 text-xl font-semibold">
          It’s draft time. Open Sleeper for the latest.
        </p>
      ) : (
        <div
          className="mt-5 grid grid-cols-3 divide-x divide-border"
          aria-label="Time until the scheduled draft"
        >
          {[
            ['Days', remaining?.days],
            ['Hours', remaining?.hours],
            ['Minutes', remaining?.minutes],
          ].map(([label, value]) => (
            <div key={label} className="px-3 first:pl-0">
              <p className="font-mono text-3xl font-bold tracking-tight">
                {value == null ? '—' : String(value).padStart(2, '0')}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      )}
      <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        <time dateTime={new Date(startTime).toISOString()}>
          {formatLockTime(new Date(startTime).toISOString())}
        </time>
      </p>
    </div>
  );
}
