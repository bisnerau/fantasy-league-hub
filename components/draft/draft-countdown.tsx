'use client';

import { useEffect, useState } from 'react';
import { FlapCountdown } from '@/components/clubhouse/flap-countdown';
import { getRemaining } from '@/lib/countdown';
import { formatLockTime } from '@/lib/predictions/rules';

export function DraftCountdown({ startTime }: { startTime: number }) {
  const [remaining, setRemaining] = useState<ReturnType<
    typeof getRemaining
  > | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(getRemaining(startTime));
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
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
        <div className="mt-5">
          <FlapCountdown
            remaining={remaining}
            until="until the scheduled draft"
          />
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
