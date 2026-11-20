import { projectLineup } from './lineups';
import type {
  ForecastInput,
  ForecastResult,
  Scenario,
  FixtureForecast,
  ConditionalChances,
} from './types';
export type Route = 'possible' | 'impossible' | 'unknown';
export type Stake = {
  fixtureKey: string;
  rosterId: number;
  objective: 'playoffs' | 'avoid last';
  label: string;
  win: number | null;
  loss: number | null;
  swing: number | null;
};
// A bounded exhaustive schedule proof. Tied records receive the most favourable
// unresolved scoring tiebreak. Such a leaf cannot prove a route exists, but it
// prevents an elimination claim. A guaranteed rank proves existence.
export function route(
  input: ForecastInput,
  scenario: Scenario,
  teamId: number,
  qualifying: number,
  fixtureKey: string,
  outcome: 'win' | 'loss' | 'tie',
  budget = 30_000,
): Route {
  const ids = input.teams.map((t) => t.id),
    index = ids.indexOf(teamId);
  if (index < 0) throw Error('Unknown team');
  const units = input.teams.map((t) => 2 * t.wins + t.ties),
    remaining: { a: number; b: number }[] = [];
  for (const f of input.fixtures) {
    const a = ids.indexOf(f.home),
      b = ids.indexOf(f.away);
    let winner = scenario[f.key];
    const home = input.lineups.find(
        (l) => l.week === f.week && l.rosterId === f.home,
      ),
      away = input.lineups.find(
        (l) => l.week === f.week && l.rosterId === f.away,
      );
    if (home && away) {
      const h = projectLineup(input, home),
        v = projectLineup(input, away);
      if (h.complete && v.complete) {
        const hp = Math.round(h.mean * 100),
          ap = Math.round(v.mean * 100);
        units[a] += hp > ap ? 2 : hp === ap ? 1 : 0;
        units[b] += ap > hp ? 2 : hp === ap ? 1 : 0;
        continue;
      }
    }
    if (f.key === fixtureKey) {
      if (outcome === 'tie') {
        units[a]++;
        units[b]++;
        continue;
      }
      winner = outcome === 'win' ? teamId : f.home === teamId ? f.away : f.home;
    }
    if (winner !== undefined) {
      units[ids.indexOf(winner)] += 2;
      continue;
    }
    if (a === index || b === index) {
      units[index] += 2;
      continue;
    }
    remaining.push({ a, b });
  }
  const threshold = units[index];
  let visits = 0;
  const search = (i: number): Route => {
    if (++visits > budget) return 'unknown';
    if (
      units.filter((u, j) => j !== index && u > threshold).length >= qualifying
    )
      return 'impossible';
    if (i === remaining.length) {
      return units.filter((u, j) => j !== index && u >= threshold).length <
        qualifying
        ? 'possible'
        : 'unknown';
    }
    const { a, b } = remaining[i];
    let unknown = false;
    // Try reducing the number of teams above the cut first.
    const outcomes =
      units[a] > units[b]
        ? [
            [2, 0],
            [0, 2],
            [1, 1],
          ]
        : [
            [0, 2],
            [2, 0],
            [1, 1],
          ];
    for (const [x, y] of outcomes) {
      units[a] += x;
      units[b] += y;
      const result = search(i + 1);
      units[a] -= x;
      units[b] -= y;
      if (result === 'possible') return result;
      if (result === 'unknown') unknown = true;
      if (visits > budget) break;
    }
    return unknown ? 'unknown' : 'impossible';
  };
  return search(0);
}
function distinct(
  a: ConditionalChances | null,
  b: ConditionalChances | null,
  field: 'playoff' | 'last',
) {
  if (!a || !b) return false;
  const error = Math.sqrt(
    (a[field] * (1 - a[field])) / a.effectiveSamples +
      (b[field] * (1 - b[field])) / b.effectiveSamples,
  );
  return Math.abs(a[field] - b[field]) > Math.max(0.01, 3 * error);
}
export function fixtureSwing(
  f: FixtureForecast,
  id: number,
  field: 'playoff' | 'last' = 'playoff',
) {
  const effect = f.effects.find((e) => e.rosterId === id);
  if (!effect || !distinct(effect.homeWin, effect.awayWin, field)) return null;
  const home = effect.homeWin!,
    away = effect.awayWin!;
  return {
    fixtureKey: f.key,
    week: f.week,
    home: f.home,
    away: f.away,
    homeChance: home[field],
    awayChance: away[field],
    swing: Math.abs(home[field] - away[field]),
    helpfulWinner: home[field] > away[field] ? f.home : f.away,
  };
}
export function getInsights(
  input: ForecastInput,
  result: ForecastResult,
  scenario: Scenario = {},
) {
  const unresolved = result.fixtures.filter(
    (f) => !f.resolved && scenario[f.key] === undefined,
  );
  const stakes: Stake[] = [];
  for (const f of unresolved)
    for (const id of [f.home, f.away])
      for (const objective of ['playoffs', 'avoid last'] as const) {
        const field = objective === 'playoffs' ? 'playoff' : 'last',
          k =
            objective === 'playoffs'
              ? input.playoffTeams
              : input.teams.length - 1;
        const effect = f.effects.find((e) => e.rosterId === id),
          win =
            (id === f.home ? effect?.homeWin : effect?.awayWin)?.[field] ??
            null,
          loss =
            (id === f.home ? effect?.awayWin : effect?.homeWin)?.[field] ??
            null;
        let label = '';
        if (route(input, scenario, id, k, f.key, 'loss') === 'impossible') {
          const winRoute = route(input, scenario, id, k, f.key, 'win'),
            tieRoute = route(input, scenario, id, k, f.key, 'tie');
          if (tieRoute === 'possible') label = 'Can’t lose';
          else if (winRoute === 'possible' && tieRoute === 'impossible')
            label = 'Must win';
        }
        const swing =
          win !== null && loss !== null ? Math.abs(win - loss) : null;
        if (
          !label &&
          swing !== null &&
          swing >= 0.2 &&
          fixtureSwing(f, id, field)
        )
          label = 'Big swing game';
        if (label)
          stakes.push({
            fixtureKey: f.key,
            rosterId: id,
            objective,
            label,
            win,
            loss,
            swing,
          });
      }
  const bubble = input.teams
    .map((t) => ({ ...t, ...result.teams.find((r) => r.rosterId === t.id)! }))
    .filter((t) =>
      t.rank > input.playoffTeams ? t.playoff >= 0.1 : t.playoff < 0.8,
    )
    .sort(
      (a, b) =>
        Number(a.rank <= input.playoffTeams) -
          Number(b.rank <= input.playoffTeams) ||
        (a.rank > input.playoffTeams
          ? b.playoff - a.playoff
          : a.playoff - b.playoff),
    )
    .map((t) => {
      const effects = unresolved
        .map((f) => fixtureSwing(f, t.id))
        .filter((x) => x !== null)
        .sort((a, b) => b.swing - a.swing);
      return {
        ...t,
        label:
          t.rank > input.playoffTeams
            ? 'Sniffing around'
            : 'Looking over their shoulder',
        keyGame:
          effects.find((f) => f.home === t.id || f.away === t.id) ?? null,
        helpfulGame:
          effects.find((f) => f.home !== t.id && f.away !== t.id) ?? null,
      };
    });
  return { bubble, stakes };
}
export type Insights = ReturnType<typeof getInsights>;
export function percentage(p: number, actual = false) {
  return actual
    ? `${Math.round(p * 100)}%`
    : p < 0.01
      ? '<1%'
      : p > 0.99
        ? '>99%'
        : `${Math.round(p * 100)}%`;
}
export function percentagePoints(delta: number) {
  const value = delta * 100;
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} pp`;
}
