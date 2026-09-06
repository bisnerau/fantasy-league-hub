import { ChevronDown } from 'lucide-react';
import {
  getSchedulePreview,
  scheduleStories,
} from '@/lib/data/schedule-preview';

export function SchedulePreview({ rosterId }: { rosterId: number }) {
  const preview = getSchedulePreview(rosterId);
  const story = scheduleStories[rosterId];
  if (!preview || !story)
    return (
      <p className="text-xs text-muted-foreground">
        Schedule preview unavailable.
      </p>
    );
  const { fixtures, toughest, byeWatch } = preview;
  const rivalry = fixtures.filter(
    (g) => g.opponent.rosterId === story.opponentId,
  );
  const record = rivalry[0]?.history;
  const strongest = [...fixtures].sort(
    (a, b) => a.opponent.predictedFinish - b.opponent.predictedFinish,
  )[0];
  const earlyByes = byeWatch.byes.filter((p) => p.round <= 7);
  return (
    <details
      data-schedule-preview
      className="group/schedule rounded-xl border border-primary/20 bg-primary/[0.025]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-xs font-semibold">
            Road to the playoffs
          </span>
          <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
            14 weeks · {story.title} · Week{' '}
            {rivalry.map((g) => g.week).join(' & ')}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 transition-transform group-open/schedule:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-primary/10 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <section>
            <h3 className="ui-kicker">Opening stretch</h3>
            <ol className="mt-2 space-y-2 text-xs">
              {fixtures.slice(0, 3).map((g) => (
                <li key={g.week}>
                  <span className="text-muted-foreground">Week {g.week}</span> ·{' '}
                  {g.opponent.managerName}{' '}
                  <span className="text-muted-foreground">
                    (predicted #{g.opponent.predictedFinish})
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h3 className="ui-kicker">Toughest three-week run</h3>
            <p className="mt-2 text-xs leading-6">
              Weeks {toughest.games[0].week}–{toughest.games[2].week}:{' '}
              {toughest.games.map((g) => g.opponent.managerName).join(', ')}.
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Average predicted opponent finish: {toughest.average.toFixed(1)}.
              Highest-rated opponent: {strongest.opponent.managerName}, in Week{' '}
              {fixtures
                .filter(
                  (g) => g.opponent.rosterId === strongest.opponent.rosterId,
                )
                .map((g) => g.week)
                .join(' & ')}
              .
            </p>
          </section>
        </div>
        <section className="rounded-lg border border-secondary/20 bg-secondary/[0.04] p-3">
          <h3 className="text-xs font-semibold">
            {story.title} · Week {rivalry.map((g) => g.week).join(' & ')}
          </h3>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {story.story}
          </p>
          {record && (
            <p className="mt-2 text-[11px] text-secondary-foreground">
              2025 regular-season head-to-head: {record.wins}W–{record.losses}L
              {record.ties > 0 ? `–${record.ties}T` : ''} · from this manager’s
              perspective.
            </p>
          )}
        </section>
        <section>
          <h3 className="ui-kicker">
            Bye-week pressure · Week {byeWatch.week}
          </h3>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Against {byeWatch.opponent.managerName}, {earlyByes.length} of the
            first seven draft picks are on bye:{' '}
            {earlyByes.map((p) => p.player).join(', ')}. {byeWatch.byes.length}{' '}
            drafted players are off in total.
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            This flags draft-day depth pressure, not a confirmed starting
            lineup. Trades, injuries and waiver moves can change the picture.
          </p>
        </section>
        <section>
          <h3 className="ui-kicker">Schedule verdict</h3>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {story.verdict}
          </p>
        </section>
        <details className="group/fixtures rounded-lg border border-white/[0.065]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            Full regular-season schedule{' '}
            <ChevronDown className="size-3.5 shrink-0 transition-transform group-open/fixtures:rotate-180" />
          </summary>
          <div className="overflow-x-auto border-t border-white/[0.065]">
            <table className="w-full text-left text-[11px]">
              <caption className="sr-only">
                Regular-season opponents, 2025 head-to-head records and drafted
                players on bye
              </caption>
              <thead className="text-muted-foreground">
                <tr>
                  <th scope="col" className="p-3">
                    Week
                  </th>
                  <th scope="col" className="p-3">
                    Opponent
                  </th>
                  <th scope="col" className="p-3">
                    2025 W–L–T
                  </th>
                  <th scope="col" className="min-w-40 p-3">
                    Drafted players on bye
                  </th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((g) => (
                  <tr key={g.week} className="border-t border-white/[0.045]">
                    <th scope="row" className="p-3 align-top">
                      {g.week}
                    </th>
                    <td className="p-3 align-top">
                      <a
                        href={`#roster-${g.opponent.rosterId}`}
                        className="font-medium hover:text-primary"
                      >
                        {g.opponent.managerName}
                      </a>
                      <span className="mt-1 block text-muted-foreground">
                        Predicted #{g.opponent.predictedFinish}
                        {g.opponent.rosterId === story.opponentId
                          ? ' · History matchup'
                          : ''}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3 align-top text-muted-foreground">
                      {g.history.games
                        ? `${g.history.wins}–${g.history.losses}–${g.history.ties}`
                        : 'No meetings'}
                    </td>
                    <td className="p-3 align-top leading-5 text-muted-foreground">
                      {g.byes.length
                        ? g.byes.map((p) => p.player).join(', ')
                        : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <p className="text-[10px] leading-5 text-muted-foreground">
          Preseason snapshot checked 6 September 2026. Difficulty uses the
          frozen editorial predicted table: lower opponent finish means a
          tougher game; the lowest three-game average identifies the toughest
          run (earliest if tied). Bye pressure prioritises the most
          first-seven-round picks off, then total drafted players, then earliest
          week. Head-to-head records cover verified 2025 regular-season games
          only; older context comes from the league archive and manager
          profiles. Playoff opponents are not yet decided.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-primary">
          <a
            href="https://sleeper.com/leagues/1389706813993160704/matchup"
            className="underline underline-offset-2"
          >
            Sleeper schedule
          </a>
          <a
            href="https://sleeper.com/leagues/1263411405122449408/matchup"
            className="underline underline-offset-2"
          >
            2025 matchups
          </a>
          <a href="/records" className="underline underline-offset-2">
            League history
          </a>
          <a href="/managers" className="underline underline-offset-2">
            Manager profiles
          </a>
          <a
            href="/data/draft-2026-pick-review.csv"
            className="underline underline-offset-2"
          >
            Draft bye data
          </a>
          <a
            href="https://www.nfl.com/news/2026-nfl-schedule-release-every-team-bye-week"
            className="underline underline-offset-2"
          >
            NFL bye schedule
          </a>
        </div>
      </div>
    </details>
  );
}
