'use client';
// Vite's worker query supplies the constructor as a generated default export.
// eslint-disable-next-line import/default
import ForecastWorker from './forecast.worker.ts?worker';
import { useEffect, useMemo, useState } from 'react';
import type {
  ForecastResponse,
  ForecastResult,
  Scenario,
} from '@/lib/playoffs/types';
import {
  percentage,
  percentagePoints,
  type Insights,
  type Stake,
} from '@/lib/playoffs/insights';

type Calculation = { result: ForecastResult; insights: Insights; key: string };
function positionLabel(position: number) {
  return `${position}${position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'}`;
}
function StakeText({ stake, scenario }: { stake: Stake; scenario: boolean }) {
  return (
    <p className="pc-stake">
      {scenario && 'In this scenario · '}
      <strong>{stake.label}</strong> —{' '}
      {stake.label === 'Big swing game'
        ? stake.objective === 'playoffs'
          ? 'playoff chances'
          : 'last-place risk'
        : stake.objective === 'playoffs'
          ? 'to stay in the playoff race'
          : 'to avoid last place'}
      {stake.label === 'Can’t lose' && '. A tie still leaves a route.'}
      {stake.label === 'Must win' && '. A tie or defeat ends that route.'}
      {stake.label === 'Big swing game' &&
        stake.win !== null &&
        stake.loss !== null && (
          <>
            . {stake.objective === 'playoffs' ? 'Playoff' : 'Last-place'}{' '}
            chance: win {percentage(stake.win)}, lose {percentage(stake.loss)} (
            {percentagePoints(stake.win - stake.loss)}).
          </>
        )}
    </p>
  );
}
export function PlayoffChances({
  initial,
  initialInsights,
}: {
  initial: ForecastResponse;
  initialInsights: Insights | null;
}) {
  const [viewedAt] = useState(() => Date.now());
  const [data, setData] = useState(initial),
    [scenario, setScenario] = useState<Scenario>({}),
    [sort, setSort] = useState('standings');
  const [calculation, setCalculation] = useState<Calculation | null>(
    initial.snapshot && initialInsights
      ? {
          result: initial.snapshot.result,
          insights: initialInsights,
          key: JSON.stringify([
            initial.snapshot.input.asOf,
            initial.snapshot.input.sourceCutoff,
            '{}',
          ]),
        }
      : null,
  );
  const [progress, setProgress] = useState(0),
    [error, setError] = useState<string | null>(null);
  const snapshot = data.snapshot,
    input = snapshot?.input;
  const scenarioKey = JSON.stringify(scenario),
    hypothetical = Object.keys(scenario).length > 0;
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const response = await fetch('/api/playoff-chances', {
          signal: controller.signal,
        });
        if (!response.ok) throw Error();
        const next = (await response.json()) as ForecastResponse;
        setData(next);
      } catch {
        if (!controller.signal.aborted)
          setError(
            'Could not check for completed games. The last forecast is still shown.',
          );
      }
    };
    void refresh();
    const interval = setInterval(() => void refresh(), 300_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  useEffect(() => {
    if (!input) return;
    const worker = new ForecastWorker();
    worker.onmessage = (
      event: MessageEvent<{
        progress?: number;
        result?: ForecastResult;
        insights?: Insights;
        error?: string;
      }>,
    ) => {
      if (event.data.progress !== undefined) setProgress(event.data.progress);
      if (event.data.error) setError(event.data.error);
      if (event.data.result && event.data.insights) {
        setCalculation({
          result: event.data.result,
          insights: event.data.insights,
          key: JSON.stringify([input.asOf, input.sourceCutoff, scenarioKey]),
        });
        setError(null);
        setProgress(1);
      }
    };
    worker.onerror = () =>
      setError(
        'The scenario worker could not load. Published probabilities remain available.',
      );
    worker.postMessage({ input, scenario: JSON.parse(scenarioKey) });
    return () => worker.terminate();
  }, [input, scenarioKey]);
  const current =
    calculation?.key ===
    JSON.stringify([input?.asOf, input?.sourceCutoff, scenarioKey])
      ? calculation
      : null;
  const result = current?.result ?? snapshot?.result,
    insights = current?.insights ?? (!hypothetical ? initialInsights : null);
  const pending = !!input && !current;
  const teams = useMemo(
    () =>
      input
        ? [...input.teams].sort((a, b) =>
            sort === 'standings'
              ? a.rank - b.rank
              : (result?.teams.find((t) => t.rosterId === b.id)?.[
                  sort === 'playoff' ? 'playoff' : 'last'
                ] ?? 0) -
                (result?.teams.find((t) => t.rosterId === a.id)?.[
                  sort === 'playoff' ? 'playoff' : 'last'
                ] ?? 0),
          )
        : [],
    [input, result, sort],
  );
  const manager = (id: number) =>
    input?.teams.find((t) => t.id === id)?.manager ?? `Team ${id}`;
  function choose(key: string, value: string) {
    setScenario((old) => {
      const next = { ...old };
      if (value) next[key] = Number(value);
      else delete next[key];
      return next;
    });
    setProgress(0);
    setError(null);
  }
  if (!snapshot || !input || !result)
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Playoff Chances</h1>
        <p className="notice">
          {data.notice ?? 'A verified forecast is not available yet.'}
        </p>
        <a className="clubhouse-text-link" href="/halftime">
          The Halftime Show archive →
        </a>
      </div>
    );
  const isScenario = hypothetical && !!current;
  const absoluteStakes = insights?.stakes.filter(
    (s) => s.label !== 'Big swing game',
  );
  return (
    <div className="playoff-page space-y-7">
      <header className="pc-hero">
        <p className="ui-kicker">MAC 12 · THE RUN-IN</p>
        <h1>
          Playoff Chances<span>.</span>
        </h1>
        <p>Six spots. One last place. Every remaining matchup matters.</p>
        <div className="pc-hero-numbers">
          <strong>
            {input.regularSeasonWeeks - input.completedThrough}
            <small>WEEKS TO SETTLE</small>
          </strong>
          <strong>
            100,000<small>SEASONS SIMULATED</small>
          </strong>
        </div>
      </header>
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          Daily inputs:{' '}
          <time dateTime={input.asOf}>
            {new Date(input.asOf).toLocaleString('en-IE', {
              timeZone: 'Europe/Dublin',
            })}
          </time>{' '}
          · Ireland
        </p>
        <p>
          Source cutoff:{' '}
          {new Date(input.sourceCutoff).toLocaleString('en-IE', {
            timeZone: 'Europe/Dublin',
          })}
          . Standings through Week {input.completedThrough}.
        </p>
      </div>
      {data.notice && (
        <output className="notice">
          {data.notice}{' '}
          {data.stale &&
            `Inputs are ${Math.floor((viewedAt - Date.parse(input.asOf)) / 3600_000)} hours old.`}
        </output>
      )}
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      {result.final && (
        <p className="notice">
          The regular season is complete. Any exact standings ties await
          Sleeper’s official resolution; future scenarios are closed.
        </p>
      )}
      <section aria-labelledby="pc-table-title">
        <div className="pc-section-heading">
          <div>
            <p className="ui-kicker">
              {isScenario ? 'IN THIS SCENARIO' : 'PUBLISHED FORECAST'}
            </p>
            <h2 id="pc-table-title">The race for six</h2>
          </div>
          <label>
            Sort{' '}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="standings">Standings</option>
              <option value="playoff">Playoff %</option>
              <option value="last">Last-place %</option>
            </select>
          </label>
        </div>
        {pending && !error && (
          <output>
            Calculating your scenario… {Math.round(progress * 100)}%. Published
            probabilities shown until it finishes.
          </output>
        )}
        {current && !result.reliable && (
          <p className="notice">
            These combined outcomes have low effective sample support. Treat the
            scenario as unstable and clear a selection.
          </p>
        )}
        <div className="pc-table">
          <div className="pc-table-head">
            <span>Manager / record</span>
            <span>Playoff %</span>
            <span>Last %</span>
          </div>
          {teams.map((team) => {
            const chance = result.teams.find((t) => t.rosterId === team.id)!,
              comparison = (
                isScenario ? snapshot.result : data.previous
              )?.teams.find((t) => t.rosterId === team.id);
            return (
              <details className="pc-team" key={team.id}>
                <summary>
                  <span>
                    <span className="pc-rank">
                      {team.rank.toString().padStart(2, '0')}
                    </span>
                    <strong>{team.manager}</strong>
                    <small>
                      {team.name} · {team.wins}–{team.losses}
                      {team.ties ? `–${team.ties}` : ''}
                    </small>
                  </span>
                  {(['playoff', 'last'] as const).map((field) => (
                    <span className={`pc-probability pc-${field}`} key={field}>
                      <b>{percentage(chance[field], result.final)}</b>
                      {comparison && (
                        <small>
                          {percentagePoints(chance[field] - comparison[field])}
                        </small>
                      )}
                    </span>
                  ))}
                </summary>
                <div className="pc-team-detail">
                  <p className="ui-kicker">Remaining fixtures</p>
                  {result.fixtures
                    .filter((f) => f.home === team.id || f.away === team.id)
                    .map((f) => (
                      <div className="pc-fixture" key={f.key}>
                        <p>
                          Week {f.week} · vs{' '}
                          <strong>
                            {manager(f.home === team.id ? f.away : f.home)}
                          </strong>{' '}
                          <span>
                            {f.resolved
                              ? 'Final'
                              : `${percentage(f.home === team.id ? f.homeWin : 1 - f.homeWin - f.tie)} estimated win chance`}
                          </span>
                        </p>
                        {insights?.stakes
                          .filter(
                            (s) =>
                              s.fixtureKey === f.key && s.rosterId === team.id,
                          )
                          .map((s) => (
                            <StakeText
                              key={s.objective}
                              stake={s}
                              scenario={isScenario}
                            />
                          ))}
                      </div>
                    ))}
                  {!input.fixtures.length && (
                    <p>No remaining regular-season fixtures.</p>
                  )}
                  <details className="mt-4">
                    <summary>Availability and bye assumptions</summary>
                    <ul className="pc-notes">
                      {[
                        ...new Set(
                          input.lineups
                            .filter((l) => l.rosterId === team.id)
                            .flatMap((l) =>
                              l.notes.map((note) => `Week ${l.week}: ${note}`),
                            ),
                        ),
                      ].map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                    <p>
                      Roster status source:{' '}
                      <a href="https://docs.sleeper.com/" className="underline">
                        Sleeper
                      </a>
                      . Current rosters are held constant.
                    </p>
                  </details>
                </div>
              </details>
            );
          })}
        </div>
        <p className="pc-footnote">
          {(isScenario || data.previous) && (
            <>
              Changes are percentage points{' '}
              {isScenario
                ? 'from the published forecast'
                : 'since the previous daily forecast'}
              .{' '}
            </>
          )}
          Tap a manager for fixtures and assumptions. &lt;1% does not mean
          eliminated.
        </p>
      </section>
      {!result.final && (
        <section aria-labelledby="pc-stakes-title">
          <p className="ui-kicker">
            {isScenario ? 'In this scenario' : 'NO ROOM FOR ERROR'}
          </p>
          <h2 id="pc-stakes-title">Must win &amp; can’t lose</h2>
          <p className="pc-footnote">
            Must win: a tie or defeat ends the route. Can’t lose: defeat ends
            it, but a tie keeps a route open. Only mathematically verified
            consequences appear here.
          </p>
          <div className="pc-bubble-grid">
            {absoluteStakes?.map((stake) => {
              const fixture = input.fixtures.find(
                (f) => f.key === stake.fixtureKey,
              )!;
              return (
                <article
                  className="pc-bubble"
                  key={`${stake.fixtureKey}:${stake.rosterId}:${stake.objective}`}
                >
                  <h3>{manager(stake.rosterId)}</h3>
                  <p>
                    Week {fixture.week} · vs{' '}
                    {manager(
                      fixture.home === stake.rosterId
                        ? fixture.away
                        : fixture.home,
                    )}
                  </p>
                  <StakeText stake={stake} scenario={isScenario} />
                </article>
              );
            })}
          </div>
          {absoluteStakes && !absoluteStakes.length && (
            <p>
              No mathematically proven must-win or can’t-lose games{' '}
              {isScenario ? 'in this scenario' : 'in the current forecast'}. Big
              swing games are shown with each manager’s remaining fixtures.
            </p>
          )}
        </section>
      )}
      <section aria-labelledby="pc-finishes-title">
        <p className="ui-kicker">
          {isScenario ? 'Hypothetical finishes' : 'EVERY PLACE COUNTS'}
        </p>
        <h2 id="pc-finishes-title">Finishing positions</h2>
        <p className="pc-footnote">
          Chance of each position after Week 14, before the playoffs. Tap a
          manager to see all twelve places. Rounded percentages may not add to
          100%.
        </p>
        <div className="pc-finishes">
          {teams.map((team) => {
            const chance = result.teams.find((t) => t.rosterId === team.id)!;
            const mostLikely = chance.finishes.indexOf(
              Math.max(...chance.finishes),
            );
            return (
              <details className="pc-finish-team" key={team.id}>
                <summary>
                  <strong>{team.manager}</strong>
                  <span>
                    Most likely: {positionLabel(mostLikely + 1)} ·{' '}
                    {percentage(chance.finishes[mostLikely], result.final)}
                  </span>
                </summary>
                <dl className="pc-position-grid">
                  {chance.finishes.map((probability, position) => (
                    <div
                      key={position}
                      className={
                        position < input.playoffTeams
                          ? 'pc-qualifying-position'
                          : undefined
                      }
                    >
                      <dt>{positionLabel(position + 1)}</dt>
                      <dd>{percentage(probability, result.final)}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            );
          })}
        </div>
      </section>
      {!result.final && (
        <section aria-labelledby="pc-bubble-title">
          <p className="ui-kicker">STILL IN THE CONVERSATION</p>
          <h2 id="pc-bubble-title">On the bubble</h2>
          <div className="pc-bubble-grid">
            {insights?.bubble.map((team) => (
              <article className="pc-bubble" key={team.id}>
                <p className="ui-kicker">{team.label}</p>
                <h3>
                  {team.manager}
                  <span>{percentage(team.playoff)}</span>
                </h3>
                {isScenario && <p className="pc-footnote">In this scenario</p>}
                {team.keyGame ? (
                  <p>
                    Biggest fixture: Week {team.keyGame.week} vs{' '}
                    {manager(
                      team.keyGame.home === team.id
                        ? team.keyGame.away
                        : team.keyGame.home,
                    )}
                    . Win:{' '}
                    <strong>
                      {percentage(
                        team.keyGame.home === team.id
                          ? team.keyGame.homeChance
                          : team.keyGame.awayChance,
                      )}
                    </strong>
                    ; lose:{' '}
                    <strong>
                      {percentage(
                        team.keyGame.home === team.id
                          ? team.keyGame.awayChance
                          : team.keyGame.homeChance,
                      )}
                    </strong>
                    . {Math.round(team.keyGame.swing * 1000) / 10}{' '}
                    percentage-point swing.
                  </p>
                ) : (
                  <p>
                    No decisive remaining fixture can be distinguished reliably.
                  </p>
                )}
                {team.helpfulGame ? (
                  <p className="mt-3">
                    A little help: {manager(team.helpfulGame.helpfulWinner)}{' '}
                    beating{' '}
                    {manager(
                      team.helpfulGame.helpfulWinner === team.helpfulGame.home
                        ? team.helpfulGame.away
                        : team.helpfulGame.home,
                    )}{' '}
                    in Week {team.helpfulGame.week}. Playoff chance{' '}
                    {percentage(
                      Math.max(
                        team.helpfulGame.homeChance,
                        team.helpfulGame.awayChance,
                      ),
                    )}{' '}
                    versus{' '}
                    {percentage(
                      Math.min(
                        team.helpfulGame.homeChance,
                        team.helpfulGame.awayChance,
                      ),
                    )}{' '}
                    ({(team.helpfulGame.swing * 100).toFixed(1)} pp).
                  </p>
                ) : (
                  <p className="mt-3">
                    No decisive rival result can be distinguished reliably.
                  </p>
                )}
                {insights.stakes
                  .filter(
                    (s) =>
                      s.rosterId === team.id &&
                      s.fixtureKey === team.keyGame?.fixtureKey,
                  )
                  .map((s) => (
                    <StakeText
                      key={s.objective}
                      stake={s}
                      scenario={isScenario}
                    />
                  ))}
              </article>
            ))}
          </div>
          {insights && !insights.bubble.length && (
            <p>No teams meet the bubble thresholds.</p>
          )}
        </section>
      )}
      {!result.final && (
        <section className="pc-scenarios" aria-labelledby="pc-scenario-title">
          <div className="pc-section-heading">
            <div>
              <p className="ui-kicker">WHAT IF?</p>
              <h2 id="pc-scenario-title">Pick the results</h2>
            </div>
            <button
              type="button"
              disabled={!hypothetical}
              onClick={() => {
                setScenario({});
                setError(null);
              }}
            >
              Reset everything
            </button>
          </div>
          <p>
            Your choices stay in this browser session. These hypothetical
            results change the table and stakes above.
          </p>
          <div className="pc-scenario-grid">
            {snapshot.result.fixtures
              .filter((f) => !f.resolved)
              .map((f) => (
                <label key={f.key}>
                  Week {f.week} · {manager(f.home)} vs {manager(f.away)}
                  <select
                    aria-label={`Week ${f.week}: ${manager(f.home)} vs ${manager(f.away)}`}
                    value={scenario[f.key] ?? ''}
                    onChange={(e) => choose(f.key, e.target.value)}
                  >
                    <option value="">No chosen winner / clear</option>
                    <option value={f.home}>{manager(f.home)} wins</option>
                    <option value={f.away}>{manager(f.away)} wins</option>
                  </select>
                </label>
              ))}
          </div>
        </section>
      )}
      <details className="pc-method">
        <summary>How the forecast works</summary>
        <div className="space-y-4">
          <p>
            100,000 whole-league simulations use Sleeper’s actual remaining
            schedule through Week 14, MAC 12 scoring and weekly NFL-opponent
            projections. Each roster’s strongest legal projected lineup is
            chosen before performances are sampled. Current rosters persist;
            transactions after the cutoff are unknown. This model does not set
            Weekly Picks prices.
          </p>
          <p>
            Started players stay in their actual starting slots. Recorded points
            are banked only after ESPN confirms a final NFL result. Games in
            progress retain their pregame estimates: this is not a live
            win-probability model. NFL byes cannot fill a lineup slot.
          </p>
          <p>
            {input.calibration.summary} The model uses normal scoring errors,
            pooled by position, with a fitted team variance multiplier. Banked
            points have no remaining variance. NFL teammate correlations and
            future roster moves are not separately modelled.
          </p>
          <p>
            Out/IR players without dated return evidence are excluded, including
            future weeks. Questionable players remain eligible and are flagged.
            Any sourced return window is sampled uniformly across its stated
            weeks; that distribution is a modelling assumption. See each team’s
            assumptions and the daily source cutoff.
          </p>
          <ul className="pc-notes">
            {(input.assumptions ?? []).map((source) => (
              <li key={source.name}>
                <a className="underline" href={source.source}>
                  {source.name}: {source.note}
                </a>{' '}
                Weeks {source.weeks}; reporting checked {source.checkedAt}.
              </li>
            ))}
          </ul>
          <p>
            Standings use record, then points for, then higher points against.
            Otherwise identical simulations use a random tiebreak.{' '}
            <a
              className="underline"
              href="https://support.sleeper.com/en/articles/2203518-how-do-playoff-teams-get-determined"
            >
              Sleeper’s standings rules
            </a>
            .
          </p>
          <p>
            Scenario scores are sampled conditional on your chosen winners.
            Availability draws are weighted by the likelihood of those outcomes.
            Scores and standings tiebreakers stay consistent. Effective samples:{' '}
            {Math.round(result.effectiveSamples).toLocaleString('en-IE')}.
            Comparisons use consistent random seeds; fixture insights require at
            least 1,000 effective samples per outcome and a gap larger than
            three estimated standard errors and one percentage point.
          </p>
          <p>
            “Sniffing around” means currently outside the top six with at least
            a 10% playoff chance. “Looking over their shoulder” means inside the
            top six with less than 80%. These are editorial thresholds, not
            model inputs.
          </p>
          <p>
            “Must win” requires a proven route with a win and elimination with
            either a tie or defeat. “Can’t lose” requires elimination with
            defeat and a surviving route with a tie. The schedule proof includes
            tied games and gives the team the benefit of unresolved scoring
            tiebreakers when checking elimination. A surviving route needs a
            consistent set of scores that reaches the required position,
            respecting already fixed points. Inconclusive proofs receive no
            absolute label. A “Big swing game” changes playoff or last-place
            chance by at least 20 percentage points.
          </p>
          <p>
            The limited archive supports scoring-error checks, not a claim of
            validated season-end playoff calibration. Percentages are estimates
            conditional on the model and stated availability assumptions.
            Published snapshots are refreshed daily; cached read-only checks
            look for completed NFL games every five minutes while this page is
            visible. Failed feeds retain the last valid forecast.
          </p>
          <a href="/halftime" className="clubhouse-text-link">
            The Halftime Show archive →
          </a>
        </div>
      </details>
    </div>
  );
}
