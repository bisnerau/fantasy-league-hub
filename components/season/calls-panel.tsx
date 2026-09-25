import { ArrowRight } from 'lucide-react';
import { CountUp } from '@/components/effects/count-up';
import type { compareForecast } from '@/lib/season/features';
import type { pickAttendance } from '@/lib/season/my-season';
import type { PersonalDraft } from './my-season';

/** Your weekly calls, turnout and the preseason ballot against the table. */
export function CallsPanel({
  correct,
  decided,
  submitted,
  weekly,
  attendance,
  forecast,
  ballot,
  tableWeek,
  rosterId,
  team,
  draft,
}: {
  correct: number;
  decided: number;
  submitted: number;
  weekly: { week: number; correct: number; games: number }[];
  attendance: ReturnType<typeof pickAttendance>;
  forecast: number[] | null;
  ballot: ReturnType<typeof compareForecast>;
  tableWeek: number | null;
  rosterId: number;
  team: (rosterId: number) => string;
  draft: PersonalDraft | undefined;
}) {
  const rate = decided ? correct / decided : 0;
  const circumference = 2 * Math.PI * 34;
  const full = attendance.filter((w) => w.full).length;
  return (
    <section
      id="my-predictions"
      aria-labelledby="my-predictions-title"
      className="season-panel"
    >
      <p className="ui-kicker text-primary">Your calls</p>
      <h2 id="my-predictions-title" className="section-title">
        Calls and preseason receipts
      </h2>

      <div className="hit-rate">
        <div className="hit-ring">
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle className="hit-ring-track" cx="40" cy="40" r="34" />
            {correct > 0 && (
              <circle
                className="hit-ring-value"
                cx="40"
                cy="40"
                r="34"
                strokeDasharray={`${rate * circumference} ${circumference}`}
              />
            )}
          </svg>
          <span className="hit-ring-label">
            <span className="font-mono text-xl font-black">
              <CountUp value={correct} />
            </span>
            <span className="text-[10px] text-muted-foreground">
              of {decided}
            </span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-2xl font-black text-primary">
            {decided ? `${(100 * rate).toFixed(1)}%` : '—'}
          </p>
          <p className="text-sm">
            {decided
              ? 'hit rate on settled, decisive matchups'
              : 'No settled accuracy yet'}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {submitted} submitted · {decided - submitted} missed. Missed picks
            count against you; tied matchups are left out.
          </p>
        </div>
      </div>
      {weekly.length > 0 && (
        <details className="season-fold mt-3">
          <summary>Weekly prediction results</summary>
          <ul className="mt-2 space-y-1 text-xs">
            {weekly.map((w) => (
              <li key={w.week}>
                Week {w.week} · {w.correct} of {w.games} correct winners
              </li>
            ))}
          </ul>
        </details>
      )}

      {attendance.length > 0 && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold">The turnstile</h3>
            <p className="font-mono text-xs text-muted-foreground">
              Full slip {full} of {attendance.length}
            </p>
          </div>
          <ol className="turnstile" aria-label="Picks attendance by week">
            {attendance.map((w) => (
              <li
                key={w.week}
                className="turnstile-token"
                data-full={w.full || undefined}
              >
                <span className="font-mono text-[10px] font-bold">
                  Wk {w.week}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wide">
                  {w.full
                    ? 'In'
                    : w.saved
                      ? `${w.saved}/${w.total}`
                      : 'No show'}
                </span>
                <span className="sr-only">
                  {w.full
                    ? ', every pick saved'
                    : `, ${w.saved} of ${w.total} picks saved`}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {forecast && ballot && tableWeek ? (
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold">Your ballot v the table</h3>
            <p className="font-mono text-xs text-muted-foreground">
              After Week {tableWeek}
            </p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {ballot.exact} spot on · {ballot.total} places out in total
          </p>
          <ol className="ballot-list">
            {ballot.rows
              .filter(
                (row) =>
                  row.rosterId === rosterId || row === biggestMiss(ballot.rows),
              )
              .map((row) => (
                <BallotRow
                  key={row.rosterId}
                  row={row}
                  mine={row.rosterId === rosterId}
                  tag={row.rosterId === rosterId ? 'You' : 'Biggest miss'}
                  team={team}
                />
              ))}
          </ol>
          <details className="season-fold mt-1">
            <summary>Line by line · all 12</summary>
            <ol className="ballot-list">
              {ballot.rows.map((row) => (
                <BallotRow
                  key={row.rosterId}
                  row={row}
                  mine={row.rosterId === rosterId}
                  team={team}
                />
              ))}
            </ol>
          </details>
        </div>
      ) : forecast ? (
        <details className="season-fold mt-5">
          <summary>Your submitted final table</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
            {forecast.map((r) => (
              <li key={r}>
                {team(r)}
                {r === rosterId ? ' (you)' : ''}
              </li>
            ))}
          </ol>
        </details>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          You have not submitted a final-table prediction.
        </p>
      )}

      {draft && (
        <a href={`/draft-recap#roster-${rosterId}`} className="verdict-card">
          <span className="verdict-grade">{draft.grade}</span>
          <span className="min-w-0">
            <span className="ui-kicker block">The preseason verdict</span>
            <span className="mt-1 block text-sm font-semibold">
              {draft.gradeScore}/100 · predicted #{draft.predictedFinish}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {draft.headline}
            </span>
          </span>
        </a>
      )}
      <p className="mt-3 flex flex-wrap gap-x-4">
        <a href="/draft-recap" className="season-link">
          Open season predictions
        </a>
        <a href="/season-hub#prediction-reviews" className="season-link">
          Halfway and final reviews <ArrowRight className="size-4" />
        </a>
      </p>
    </section>
  );
}

type BallotLine = NonNullable<
  ReturnType<typeof compareForecast>
>['rows'][number];

/** The largest gap; the higher predicted place wins a tie. */
function biggestMiss(rows: BallotLine[]) {
  return rows.reduce((worst, row) => (row.gap > worst.gap ? row : worst));
}

function BallotRow({
  row,
  mine,
  tag,
  team,
}: {
  row: BallotLine;
  mine: boolean;
  tag?: string;
  team: (rosterId: number) => string;
}) {
  const move = row.predicted - row.actual;
  return (
    <li className="ballot-row" data-mine={mine || undefined}>
      <span className="font-mono text-xs font-bold text-muted-foreground">
        #{row.predicted}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold">
          {team(row.rosterId)}
        </span>
        {tag && (
          <span className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {tag}
          </span>
        )}
      </span>
      <span className="font-mono text-xs">now {row.actual}</span>
      <span
        className="ballot-move"
        data-tone={move > 0 ? 'up' : move < 0 ? 'down' : 'even'}
      >
        {move === 0 ? '✓' : move > 0 ? `▲${move}` : `▼${-move}`}
        <span className="sr-only">
          {move === 0
            ? ' spot on'
            : move > 0
              ? ' places higher than you predicted'
              : ' places lower than you predicted'}
        </span>
      </span>
    </li>
  );
}
