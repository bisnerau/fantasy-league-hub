'use client';

import { useEffect, useMemo, useState } from 'react';

function getRemaining(target: number) {
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
  };
}

export function DraftCountdown({ startTime }: { startTime: number }) {
  const [remaining, setRemaining] = useState(() => getRemaining(startTime));
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-IE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Dublin',
      }).format(new Date(startTime)),
    [startTime],
  );

  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(getRemaining(startTime)),
      60_000,
    );
    return () => window.clearInterval(timer);
  }, [startTime]);

  return (
    <div className="draft-countdown-card">
      <div className="flex items-center justify-between gap-3">
        <span className="ui-kicker">Draft countdown</span>
        <span className="status-pill status-pill-live">Scheduled</span>
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x divide-white/8">
        {[
          ['Days', remaining.days],
          ['Hours', remaining.hours],
          ['Minutes', remaining.minutes],
        ].map(([label, value]) => (
          <div key={label} className="px-3 first:pl-0 last:pr-0">
            <p className="font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              {String(value).padStart(2, '0')}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-white/8 pt-3 text-xs text-muted-foreground">
        {dateLabel} · Irish time
      </p>
    </div>
  );
}
