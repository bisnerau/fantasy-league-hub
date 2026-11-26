/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The scrollable table region needs keyboard focus. */
import {
  formatRecord,
  type ScheduleMatrix,
  type TeamStanding,
} from '@/lib/data/standings';
import { cn } from '@/lib/utils';

export function ScheduleMatrixTable({
  standings,
  matrix,
  played,
}: {
  standings: TeamStanding[];
  matrix: ScheduleMatrix | null;
  played: number;
}) {
  const teams = new Map(standings.map((team) => [team.rosterId, team]));

  return (
    <section aria-labelledby="schedule-matrix-title">
      <div className="section-heading">
        <div>
          <p className="ui-kicker text-primary">
            Same scores. Different schedule.
          </p>
          <h2 id="schedule-matrix-title" className="section-title scroll-mt-20">
            The schedule swap
          </h2>
        </div>
        {matrix && (
          <p className="text-sm text-muted-foreground">
            Through Week {matrix.throughWeek}
          </p>
        )}
      </div>

      {!matrix ? (
        <p className="notice">
          {played
            ? 'The schedule matrix is temporarily unavailable while completed results are verified.'
            : 'The matrix appears after the first completed regular-season week.'}
        </p>
      ) : (
        <>
          <p
            id="schedule-matrix-help"
            className="text-base leading-6 text-muted-foreground"
          >
            Read across a team’s row to see its record on each team’s schedule.
            The outlined cells are actual records. Scroll across for every team.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <span
                className="size-3 rounded-sm bg-primary/20"
                aria-hidden="true"
              />
              Better than actual
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="size-3 rounded-sm bg-amber-500/20"
                aria-hidden="true"
              />
              Worse than actual
            </span>
          </div>
          <section
            aria-label="Schedule swap records"
            aria-describedby="schedule-matrix-help"
            tabIndex={0}
            className="relative mt-4 max-h-[36rem] overflow-auto rounded-lg border border-border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <table className="w-full min-w-[1500px] table-fixed border-separate border-spacing-0 text-sm">
              <caption className="sr-only">
                Records through Week {matrix.throughWeek}. Rows are the team
                supplying the scores; columns are the team supplying the
                schedule.
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 top-0 z-30 w-36 border-b border-r border-border bg-card p-3 text-left align-bottom font-semibold sm:w-44"
                  >
                    <span className="block">Team’s scores</span>
                    <span className="mt-1 block font-normal text-muted-foreground">
                      Schedule across
                    </span>
                  </th>
                  {matrix.rows.map(({ rosterId }) => (
                    <th
                      key={rosterId}
                      scope="col"
                      className="sticky top-0 z-20 border-b border-r border-border bg-card p-3 align-bottom font-semibold last:border-r-0"
                    >
                      {teams.get(rosterId)!.teamName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row) => {
                  const team = teams.get(row.rosterId)!;
                  return (
                    <tr key={row.rosterId}>
                      <th
                        scope="row"
                        className="sticky left-0 z-10 border-b border-r border-border bg-card p-3 text-left font-semibold"
                      >
                        <span className="block">{team.teamName}</span>
                        <span className="mt-1 block font-normal text-muted-foreground">
                          {team.ownerName}
                        </span>
                      </th>
                      {row.records.map((record) => {
                        const actual = row.rosterId === record.scheduleRosterId;
                        const difference =
                          record.wins +
                          record.ties / 2 -
                          team.wins -
                          team.ties / 2;
                        return (
                          <td
                            key={record.scheduleRosterId}
                            className="border-b border-r border-border p-1 text-center last:border-r-0"
                          >
                            <div
                              className={cn(
                                'rounded-md px-2 py-3',
                                actual
                                  ? 'bg-primary/10 ring-1 ring-inset ring-primary'
                                  : difference > 0
                                    ? 'bg-primary/10'
                                    : difference < 0
                                      ? 'bg-amber-500/10'
                                      : '',
                              )}
                            >
                              <span className="font-mono font-semibold tabular-nums">
                                {formatRecord(record)}
                              </span>
                              {actual ? (
                                <span className="mt-1 block text-sm text-primary">
                                  Actual
                                </span>
                              ) : (
                                <span className="sr-only">
                                  {difference > 0
                                    ? ', better than actual'
                                    : difference < 0
                                      ? ', worse than actual'
                                      : ', same win rate as actual'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Completed regular-season weeks only, using the same week’s scores.
            If a borrowed schedule would make a team face itself, it faces the
            schedule owner instead. Equal scores count as ties; colours count a
            tie as half a win. These records don’t change the league table.
          </p>
        </>
      )}
    </section>
  );
}
