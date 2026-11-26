import type { PredictionWeekData } from '@/lib/data/predictions';
import { isThanksgivingWeek } from '@/lib/data/thanksgiving-week';

export function ThanksgivingWeek({ data }: { data: PredictionWeekData }) {
  if (!isThanksgivingWeek(data)) return null;

  return (
    <aside
      aria-labelledby="thanksgiving-title"
      className="overflow-hidden rounded-xl border border-amber-700/50 bg-gradient-to-br from-[#39221b] via-[#241e19] to-[#17231d] p-5 text-[#fff5e5] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-amber-300">
          Thanksgiving · Week 12
        </p>
        <span className="text-2xl" aria-hidden="true">
          🦃
        </span>
      </div>
      <h2
        id="thanksgiving-title"
        className="mt-2 font-heading text-2xl font-black tracking-tight sm:text-3xl"
      >
        A feast of football. A fight for the last seat.
      </h2>
      <p className="mt-3 text-base leading-6 text-[#ead9c5]">
        Sleeper lineups lock at each player’s kickoff. Picks + Banker: Sunday 29
        November, 18:00 Irish time.
      </p>
      <div className="mt-5 border-t border-amber-200/20 pt-4">
        <p className="text-sm font-semibold text-amber-300">
          Holiday kickoffs · all times Irish
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <li className="border-l-2 border-amber-500/60 pl-3">
            <p className="text-base font-semibold">Bears at Lions</p>
            <time
              dateTime="2026-11-26T18:00:00Z"
              className="text-sm text-[#ead9c5]"
            >
              Thu 26 Nov · 18:00
            </time>
          </li>
          <li className="border-l-2 border-amber-500/60 pl-3">
            <p className="text-base font-semibold">Eagles at Cowboys</p>
            <time
              dateTime="2026-11-26T21:30:00Z"
              className="text-sm text-[#ead9c5]"
            >
              Thu 26 Nov · 21:30
            </time>
          </li>
          <li className="border-l-2 border-amber-500/60 pl-3">
            <p className="text-base font-semibold">Chiefs at Bills</p>
            <time
              dateTime="2026-11-27T01:20:00Z"
              className="text-sm text-[#ead9c5]"
            >
              Fri 27 Nov · 01:20
            </time>
          </li>
          <li className="border-l-2 border-amber-500/60 pl-3">
            <p className="text-base font-semibold">Broncos at Steelers</p>
            <time
              dateTime="2026-11-27T20:00:00Z"
              className="text-sm text-[#ead9c5]"
            >
              Fri 27 Nov · 20:00
            </time>
          </li>
        </ul>
        <p className="mt-4 text-sm leading-5 text-[#ead9c5]">
          Packers–Rams has finished; the previews include its recorded points.{' '}
          <a
            href="https://fantasy-www.nfl.com/news/nfl-week-12-injury-report-2026-season"
            className="inline-flex min-h-11 items-center font-semibold text-amber-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            NFL schedule and game statuses
          </a>
        </p>
      </div>
    </aside>
  );
}
