'use client';
// Vite's worker query supplies the constructor as a generated default export.
// eslint-disable-next-line import/default
import ForecastWorker from './forecast.worker.ts?worker';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type {
  ForecastResponse,
  ForecastResult,
  Scenario,
} from '@/lib/playoffs/types';
import {
  percentage,
  percentagePoints,
  finishingBounds,
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
      <strong>{stake.label}</strong>
      {stake.label !== 'Big swing game' && ' (mathematical)'} —{' '}
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
    [sort, setSort] = useState('standings'),
    [view, setView] = useState<'race' | 'finishes'>('race');
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
  const bounds = useMemo(
    () =>
      input
        ? finishingBounds(input, hypothetical && current ? scenario : {})
        : null,
    [input, hypothetical, current, scenario],
  );
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
  function resetScenario() {
    setScenario({});
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
  const stakeGroups = new Map<string, Stake[]>();
  for (const stake of absoluteStakes ?? []) {
    const key = `${stake.rosterId}:${stake.objective}:${stake.label}`;
    stakeGroups.set(key, [...(stakeGroups.get(key) ?? []), stake]);
  }
  const swingGames = input.fixtures
    .map((fixture) => ({
      ...fixture,
      stakes:
        insights?.matchStakes.filter(
          (stake) => stake.fixtureKey === fixture.key,
        ) ?? [],
    }))
    .filter((fixture) => fixture.stakes.length > 0)
    .sort(
      (a, b) =>
        a.week - b.week ||
        Math.max(...b.stakes.map((s) => s.swing ?? 0)) -
          Math.max(...a.stakes.map((s) => s.swing ?? 0)),
    )
    .map((game) => ({
      ...game,
      homeBounds: finishingBounds(input, {
        ...(isScenario ? scenario : {}),
        [game.key]: game.home,
      }),
      awayBounds: finishingBounds(input, {
        ...(isScenario ? scenario : {}),
        [game.key]: game.away,
      }),
    }));
  const swingWeeks = [...new Set(swingGames.map((game) => game.week))];
  const scenarioWeeks = [
    ...new Set(
      snapshot.result.fixtures.filter((f) => !f.resolved).map((f) => f.week),
    ),
  ];
  const choiceCount = Object.keys(scenario).length;
  return (
    <div className="playoff-page">
      <div className="pc-intro">
        <header className="pc-hero">
          <p className="ui-kicker">MAC 12 · THE RUN-IN</p>
          <h1>
            Playoff Chances<span>.</span>
          </h1>
          <p>Six spots. One wooden spoon.</p>
          <p className="pc-season-note">
            {input.regularSeasonWeeks - input.completedThrough} weeks left · Top
            six qualify
          </p>
        </header>
        <p className="pc-updated">
          Updated{' '}
          <time dateTime={input.asOf}>
            {new Date(input.asOf).toLocaleString('en-IE', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Dublin',
            })}
          </time>{' '}
          · Irish time
        </p>
        <nav className="pc-jump-links" aria-label="Playoff page sections">
          <a href="#pc-odds">Odds</a>
          {!result.final && (
            <>
              <a href="#pc-bubble">Bubble</a>
              <a href="#pc-stakes">Stakes</a>
              <a href="#pc-scenarios">What if?</a>
            </>
          )}
        </nav>
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
      <div id="pc-odds" className="pc-odds-controls">
        <div className="pc-section-heading">
          <div>
            <p className="ui-kicker">
              {isScenario ? 'IN THIS SCENARIO' : 'PUBLISHED FORECAST'}
            </p>
            <h2>
              {view === 'race' ? 'The race for six' : 'Finishing positions'}
            </h2>
          </div>
          <label>
            <span className="sr-only">Sort teams</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="standings">Standings</option>
              <option value="playoff">Playoff %</option>
              <option value="last">Last-place %</option>
            </select>
          </label>
        </div>
        <fieldset className="pc-view-switch">
          <legend className="sr-only">Odds view</legend>
          <button
            type="button"
            aria-pressed={view === 'race'}
            aria-controls="pc-race"
            onClick={() => setView('race')}
          >
            Playoffs &amp; last
          </button>
          <button
            type="button"
            aria-pressed={view === 'finishes'}
            aria-controls="pc-finishes"
            onClick={() => setView('finishes')}
          >
            All 12 places
          </button>
        </fieldset>
        {hypothetical && (
          <div className="pc-scenario-notice">
            <p>
              <strong>Your scenario</strong> · {choiceCount}{' '}
              {choiceCount === 1 ? 'result' : 'results'} picked.{' '}
              {isScenario
                ? 'Changes are percentage points (pp) from the published odds.'
                : 'Published odds shown while your picks are checked.'}
            </p>
            <div>
              <a href="#pc-scenarios">Edit picks</a>
              <button type="button" onClick={resetScenario}>
                Back to forecast
              </button>
            </div>
          </div>
        )}
        {pending && !error && (
          <output className="pc-calculating">
            {hypothetical
              ? 'Calculating your scenario…'
              : 'Updating the forecast…'}{' '}
            {Math.round(progress * 100)}%. Published odds shown for now.
          </output>
        )}
        {current && !result.reliable && (
          <p className="notice">
            Too few simulations support this combination of results. Clear a
            pick to get a more stable estimate.
          </p>
        )}
      </div>
      <section
        id="pc-race"
        aria-label="The race for six"
        hidden={view !== 'race'}
      >
        <p className="pc-section-intro">
          Top six qualify. Last means 12th. Tap a manager for fixtures.
        </p>
        <div className="pc-table">
          <div className="pc-table-head">
            <span>Manager</span>
            <span>Playoffs</span>
            <span>Last</span>
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
                      {team.wins}–{team.losses}
                      {team.ties ? `–${team.ties}` : ''}
                      <span className="pc-expand-hint" aria-hidden="true">
                        ⌄
                      </span>
                    </small>
                  </span>
                  {(['playoff', 'last'] as const).map((field) => (
                    <span className={`pc-probability pc-${field}`} key={field}>
                      <b>
                        {percentage(
                          chance[field],
                          result.final,
                          field === 'last'
                            ? bounds!.get(team.id)!.worst < input.teams.length
                            : bounds!.get(team.id)!.best > input.playoffTeams,
                        )}
                      </b>
                      {comparison && (
                        <small>
                          {percentagePoints(chance[field] - comparison[field])}
                        </small>
                      )}
                    </span>
                  ))}
                </summary>
                <div className="pc-team-detail">
                  <p className="pc-team-name">{team.name}</p>
                  <p className="pc-bye-odds">
                    Top-two bye chance{' '}
                    <strong>
                      {percentage(
                        chance.bye,
                        result.final,
                        bounds!.get(team.id)!.best > 2,
                      )}
                    </strong>
                  </p>
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
          0% = mathematically ruled out. &lt;1% = a tiny estimate, not proof of
          elimination.
        </p>
      </section>
      <section
        id="pc-finishes"
        aria-label="Finishing positions"
        hidden={view !== 'finishes'}
      >
        <p className="pc-footnote">
          Where could everyone land after Week 14? Tap a manager to see all
          twelve places. Highlighted places qualify for the playoffs; rounded
          percentages may not total 100%.
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
                      <dd>
                        {percentage(
                          probability,
                          result.final,
                          position + 1 < bounds!.get(team.id)!.best ||
                            position + 1 > bounds!.get(team.id)!.worst,
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            );
          })}
        </div>
      </section>
      {!result.final && (
        <section id="pc-bubble" aria-labelledby="pc-bubble-title">
          <p className="ui-kicker">STILL IN THE CONVERSATION</p>
          <h2 id="pc-bubble-title">On the bubble</h2>
          <p className="pc-section-intro">
            Who’s chasing a spot, and who’s trying to hang on?
          </p>
          <div className="pc-bubble-grid">
            {insights?.bubble.map((team) => (
              <article className="pc-bubble" key={team.id}>
                <p className="ui-kicker">{team.label}</p>
                <h3>
                  {team.manager}
                  <span>
                    {percentage(
                      team.playoff,
                      false,
                      bounds!.get(team.id)!.best > input.playoffTeams,
                    )}
                  </span>
                </h3>
                {isScenario && <p className="pc-footnote">In this scenario</p>}
                <p className="pc-chance-caption">
                  chance of making the playoffs
                </p>
                {team.keyGame ? (
                  <div className="pc-key-game">
                    <p>
                      <strong>Biggest game</strong> · Week {team.keyGame.week}{' '}
                      vs{' '}
                      {manager(
                        team.keyGame.home === team.id
                          ? team.keyGame.away
                          : team.keyGame.home,
                      )}
                    </p>
                    <dl className="pc-swing-grid">
                      <div>
                        <dt>If they win</dt>
                        <dd>
                          {percentage(
                            team.keyGame.home === team.id
                              ? team.keyGame.homeChance
                              : team.keyGame.awayChance,
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>If they lose</dt>
                        <dd>
                          {percentage(
                            team.keyGame.home === team.id
                              ? team.keyGame.awayChance
                              : team.keyGame.homeChance,
                          )}
                        </dd>
                      </div>
                    </dl>
                    <p className="pc-swing-note">
                      {team.keyGame.swing >= 0.2 ? 'Big swing game · ' : ''}
                      {(team.keyGame.swing * 100).toFixed(1)} percentage points
                      at stake.
                    </p>
                  </div>
                ) : (
                  <p>No single remaining game stands out reliably yet.</p>
                )}
                {team.helpfulGame ? (
                  <details className="pc-rival-help">
                    <summary>
                      A little help: cheer for{' '}
                      {manager(team.helpfulGame.helpfulWinner)}
                    </summary>
                    <p>
                      Against{' '}
                      {manager(
                        team.helpfulGame.helpfulWinner === team.helpfulGame.home
                          ? team.helpfulGame.away
                          : team.helpfulGame.home,
                      )}{' '}
                      in Week {team.helpfulGame.week}. {team.manager}’s playoff
                      chance is{' '}
                      {percentage(
                        Math.max(
                          team.helpfulGame.homeChance,
                          team.helpfulGame.awayChance,
                        ),
                      )}{' '}
                      if they win, versus{' '}
                      {percentage(
                        Math.min(
                          team.helpfulGame.homeChance,
                          team.helpfulGame.awayChance,
                        ),
                      )}{' '}
                      if they lose—a {(team.helpfulGame.swing * 100).toFixed(1)}{' '}
                      percentage-point difference.
                    </p>
                  </details>
                ) : (
                  <p className="pc-footnote">
                    No single rival result stands out reliably yet.
                  </p>
                )}
                {insights.stakes
                  .filter(
                    (s) =>
                      s.rosterId === team.id &&
                      s.fixtureKey === team.keyGame?.fixtureKey &&
                      (s.label !== 'Big swing game' ||
                        s.objective !== 'playoffs'),
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
        <section id="pc-stakes" aria-labelledby="pc-stakes-title">
          <p className="ui-kicker">
            {isScenario ? 'In this scenario' : 'THE PRESSURE IS ON'}
          </p>
          <h2 id="pc-stakes-title">Must win &amp; can’t lose</h2>
          <p className="pc-section-intro">
            Chasing a bye, hanging onto a playoff spot, or dodging the wooden
            spoon. A must-win for one manager can be a can’t-lose for the other.
            The top two earn a first-round playoff bye.
          </p>
          <p className="pc-footnote">
            These labels describe the pressure of the game. A defeat can still
            leave a route.
          </p>
          {swingWeeks.map((week, index) => (
            <details className="pc-stakes-week" key={week} open={index === 0}>
              <summary>
                Week {week}
                <span>
                  {swingGames.filter((game) => game.week === week).length} to
                  watch
                </span>
              </summary>
              <div className="pc-bubble-grid">
                {swingGames
                  .filter((game) => game.week === week)
                  .map((game) => (
                    <article className="pc-bubble pc-swing-game" key={game.key}>
                      <p className="ui-kicker">Matchup stakes</p>
                      <h3 className="pc-game-title">
                        {manager(game.home)} vs {manager(game.away)}
                      </h3>
                      {(['bye', 'playoffs', 'avoid last'] as const).map(
                        (objective) => {
                          const stakes = game.stakes.filter(
                            (stake) => stake.objective === objective,
                          );
                          return (
                            stakes.length > 0 && (
                              <table className="pc-stakes-odds" key={objective}>
                                <caption>
                                  {objective === 'bye'
                                    ? 'Top-two bye chance · higher is better'
                                    : objective === 'playoffs'
                                      ? 'Playoff chance · higher is better'
                                      : 'Last-place risk · lower is better'}
                                </caption>
                                <thead>
                                  <tr>
                                    <th scope="col">Manager</th>
                                    <th scope="col">If win</th>
                                    <th scope="col">If lose</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stakes.map((stake) => (
                                    <Fragment key={stake.rosterId}>
                                      <tr className="pc-stakes-probabilities">
                                        <th scope="row">
                                          {manager(stake.rosterId)}
                                          <span className="pc-stake-label">
                                            {stake.label}
                                          </span>
                                        </th>
                                        {(['win', 'loss'] as const).map(
                                          (outcome) => {
                                            const winner =
                                              outcome === 'win'
                                                ? stake.rosterId
                                                : game.home === stake.rosterId
                                                  ? game.away
                                                  : game.home;
                                            const range = (
                                              winner === game.home
                                                ? game.homeBounds
                                                : game.awayBounds
                                            ).get(stake.rosterId)!;
                                            return (
                                              <td key={outcome}>
                                                {percentage(
                                                  stake[outcome]!,
                                                  false,
                                                  objective === 'bye'
                                                    ? range.best > 2
                                                    : objective === 'playoffs'
                                                      ? range.best >
                                                        input.playoffTeams
                                                      : range.worst <
                                                        input.teams.length,
                                                )}
                                              </td>
                                            );
                                          },
                                        )}
                                      </tr>
                                      <tr>
                                        <td
                                          colSpan={3}
                                          className="pc-stakes-reason"
                                        >
                                          {stake.reason} ·{' '}
                                          {(stake.swing * 100).toFixed(1)} pp
                                          swing
                                        </td>
                                      </tr>
                                    </Fragment>
                                  ))}
                                </tbody>
                              </table>
                            )
                          );
                        },
                      )}
                      <p className="pc-footnote">
                        Win / lose refers to each manager’s own result. pp =
                        percentage points.
                      </p>
                    </article>
                  ))}
              </div>
            </details>
          ))}
          {insights && !swingGames.length && (
            <p className="pc-footnote">
              No remaining games meet the pressure-game threshold{' '}
              {isScenario ? 'in this scenario' : 'in the current forecast'}.
            </p>
          )}
          <details className="pc-elimination-stakes">
            <summary>Mathematical elimination checks</summary>
            <p className="pc-footnote">
              Must win: a tie or defeat ends the route. Can’t lose: defeat ends
              it, but a tie keeps a route open. These checks use the literal
              meanings, separately from the editorial labels above.
            </p>
            <div className="pc-bubble-grid">
              {[...stakeGroups].map(([key, group]) => {
                const stake = group[0];
                return (
                  <article className="pc-bubble pc-stakes-card" key={key}>
                    <h3>{manager(stake.rosterId)}</h3>
                    <StakeText stake={stake} scenario={isScenario} />
                    <ul className="pc-stakes-fixtures">
                      {group.map((game) => {
                        const fixture = input.fixtures.find(
                          (f) => f.key === game.fixtureKey,
                        )!;
                        return (
                          <li key={game.fixtureKey}>
                            <span>Week {fixture.week}</span>
                            <strong>
                              vs{' '}
                              {manager(
                                fixture.home === game.rosterId
                                  ? fixture.away
                                  : fixture.home,
                              )}
                            </strong>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                );
              })}
            </div>
            {absoluteStakes && !absoluteStakes.length && (
              <p>
                No mathematically proven must-win or can’t-lose games{' '}
                {isScenario ? 'in this scenario' : 'in the current forecast'}.
              </p>
            )}
          </details>
        </section>
      )}
      {!result.final && (
        <section
          id="pc-scenarios"
          className="pc-scenarios"
          aria-labelledby="pc-scenario-title"
        >
          <div className="pc-section-heading">
            <div>
              <p className="ui-kicker">WHAT IF?</p>
              <h2 id="pc-scenario-title">Pick the results</h2>
            </div>
            <button
              type="button"
              disabled={!hypothetical}
              onClick={resetScenario}
            >
              Reset everything
            </button>
          </div>
          <p>
            Play commissioner for a minute. Pick some winners and see who
            climbs—or starts sweating. Your picks are hypothetical and stay on
            this page.
          </p>
          <output className="pc-scenario-feedback">
            {error
              ? 'Your scenario could not be updated. Published odds are still shown.'
              : pending
                ? 'Updating your odds…'
                : hypothetical
                  ? `${choiceCount} ${choiceCount === 1 ? 'result' : 'results'} picked. Your scenario is ready.`
                  : 'Start with one game. Leave the rest undecided.'}
            {hypothetical && !pending && !error && (
              <a href="#pc-odds" onClick={() => setView('race')}>
                See updated odds
              </a>
            )}
          </output>
          {scenarioWeeks.map((week, index) => (
            <details className="pc-scenario-week" key={week} open={index === 0}>
              <summary>
                Week {week}
                <span>
                  {
                    snapshot.result.fixtures.filter(
                      (f) => f.week === week && scenario[f.key] !== undefined,
                    ).length
                  }{' '}
                  picked
                </span>
              </summary>
              <div className="pc-scenario-grid">
                {snapshot.result.fixtures
                  .filter((f) => f.week === week && !f.resolved)
                  .map((f) => (
                    <label key={f.key}>
                      {manager(f.home)} <span className="pc-versus">vs</span>{' '}
                      {manager(f.away)}
                      <select
                        aria-label={`Week ${f.week}: ${manager(f.home)} vs ${manager(f.away)}`}
                        value={scenario[f.key] ?? ''}
                        onChange={(e) => choose(f.key, e.target.value)}
                      >
                        <option value="">Leave undecided</option>
                        <option value={f.home}>{manager(f.home)} wins</option>
                        <option value={f.away}>{manager(f.away)} wins</option>
                      </select>
                    </label>
                  ))}
              </div>
              {hypothetical && (
                <a
                  className="pc-results-link"
                  href="#pc-odds"
                  onClick={() => setView('race')}
                >
                  See updated odds
                </a>
              )}
            </details>
          ))}
        </section>
      )}
      <details className="pc-method">
        <summary>How the forecast works</summary>
        <div className="space-y-4">
          <p>
            Standings through Week {input.completedThrough}. Source cutoff:{' '}
            {new Date(input.sourceCutoff).toLocaleString('en-IE', {
              timeZone: 'Europe/Dublin',
            })}{' '}
            (Irish time). Current records stay fixed when trying a scenario; the
            percentages change.
          </p>
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
            A 0% forecast requires a mathematical record bound that rules out
            the outcome, accounting for remaining fixtures, confirmed results
            and your scenario choices. Tied records keep the benefit of
            unresolved points tiebreakers. Zero successes in the simulations
            alone still display as &lt;1%.
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
            Matchup labels are editorial: “Must win” means chasing a top-two bye
            or a playoff place, or trying to climb out of last; “Can’t lose”
            means protecting a current top-two/top-six position or keeping away
            from last. They use current standings and require a reliable
            win-versus-loss swing of at least 20 percentage points for that
            objective. Scenario picks update the odds; the current standings
            remain the reference for the labels. Bye odds count finishes in
            first or second in the same whole-league simulations, including the
            points tiebreaks.
          </p>
          <p>
            The separate mathematical checks include ties and favourable
            unresolved scoring tiebreaks. A literal must-win requires a
            surviving route with a win and elimination with a tie or defeat; a
            literal can’t-lose still permits a route with a tie. Inconclusive
            proofs receive no mathematical label.
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
