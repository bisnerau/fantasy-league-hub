import { rankTeams } from './model';
import { projectLineup } from './lineups';
import type {
  ForecastInput,
  ForecastResult,
  Scenario,
  FixtureForecast,
  ConditionalChances,
} from './types';
export type Route = 'possible' | 'impossible' | 'unknown';
// Conservative record bounds: tied records remain undecided because future
// scoring tiebreaks can favour either team. Simulation samples are not a proof.
export function finishingBounds(input: ForecastInput, scenario: Scenario = {}) {
  const records = new Map(
    input.teams.map((t) => [
      t.id,
      { min: 2 * t.wins + t.ties, max: 2 * t.wins + t.ties },
    ]),
  );
  for (const fixture of input.fixtures) {
    const home = projectLineup(
        input,
        input.lineups.find(
          (l) => l.week === fixture.week && l.rosterId === fixture.home,
        )!,
      ),
      away = projectLineup(
        input,
        input.lineups.find(
          (l) => l.week === fixture.week && l.rosterId === fixture.away,
        )!,
      );
    const h = records.get(fixture.home)!,
      a = records.get(fixture.away)!;
    if (home.complete && away.complete) {
      const hp = Math.round(home.mean * 100),
        ap = Math.round(away.mean * 100);
      const homeUnits = hp > ap ? 2 : hp === ap ? 1 : 0;
      h.min += homeUnits;
      h.max += homeUnits;
      a.min += 2 - homeUnits;
      a.max += 2 - homeUnits;
    } else if (scenario[fixture.key] !== undefined) {
      const winner = records.get(scenario[fixture.key])!;
      winner.min += 2;
      winner.max += 2;
    } else {
      h.max += 2;
      a.max += 2;
    }
  }
  return new Map(
    input.teams.map((team) => {
      const own = records.get(team.id)!;
      const others = [...records]
        .filter(([id]) => id !== team.id)
        .map(([, record]) => record);
      return [
        team.id,
        {
          best: 1 + others.filter((r) => r.min > own.max).length,
          worst:
            input.teams.length - others.filter((r) => r.max < own.min).length,
        },
      ];
    }),
  );
}
export type Stake = {
  fixtureKey: string;
  rosterId: number;
  objective: 'playoffs' | 'avoid last';
  label: string;
  win: number | null;
  loss: number | null;
  swing: number | null;
};
export type MatchStake = {
  fixtureKey: string;
  rosterId: number;
  objective: 'bye' | 'playoffs' | 'avoid last';
  label: 'Must win' | 'Can’t lose';
  reason: string;
  win: number;
  loss: number;
  swing: number;
};
type ProofGame = {
  a: number;
  b: number;
  home: { mean: number; variance: number; complete: boolean };
  away: { mean: number; variance: number; complete: boolean };
  outcome: 0 | 1 | 2;
};
// Construct, then independently rank, a scoring witness for this schedule.
// Unresolved scores can vary; banked/fixed scores cannot. Increasing the focal
// team's scores tests favourable PF tiebreaks without pretending every tied
// record can be ordered independently. Failure is inconclusive, never elimination.
function scoringWitness(
  input: ForecastInput,
  units: number[],
  games: ProofGame[],
  target: number,
  qualifying: number,
) {
  const scale =
    1 +
    Math.max(...input.teams.map((t) => Math.abs(t.pointsFor))) +
    games.reduce(
      (s, g) => s + Math.abs(g.home.mean) + Math.abs(g.away.mean),
      0,
    );
  for (const multiplier of [0, 1, 4, 16]) {
    const table = input.teams.map((t, i) => ({
      units: units[i],
      pf: Math.round(t.pointsFor * 100),
      pa: Math.round(t.pointsAgainst * 100),
    }));
    let valid = true;
    for (const g of games) {
      const fixedH = g.home.variance === 0,
        fixedA = g.away.variance === 0;
      let h = Math.round(
        (g.a === target && !fixedH && multiplier
          ? scale * multiplier
          : g.home.mean) * 100,
      );
      let a = Math.round(
        (g.b === target && !fixedA && multiplier
          ? scale * multiplier
          : g.away.mean) * 100,
      );
      if (g.outcome === 2) {
        if (fixedH && !fixedA) a = h;
        else if (fixedA && !fixedH) h = a;
        else if (!fixedH && !fixedA) {
          const score =
            g.a === target ? h : g.b === target ? a : Math.max(h, a);
          h = score;
          a = score;
        }
      } else if (g.outcome === 0 && h <= a) {
        if (!fixedH && (g.b !== target || fixedA)) h = a + 1;
        else if (!fixedA) a = h - 1;
      } else if (g.outcome === 1 && a <= h) {
        if (!fixedA && (g.a !== target || fixedH)) a = h + 1;
        else if (!fixedH) h = a - 1;
      }
      if ((h > a ? 0 : h < a ? 1 : 2) !== g.outcome) {
        valid = false;
        break;
      }
      table[g.a].pf += h;
      table[g.a].pa += a;
      table[g.b].pf += a;
      table[g.b].pa += h;
    }
    // Exact record/PF/PA ties can be won by Sleeper's final random tiebreak.
    if (
      valid &&
      table.filter((t, i) => i !== target && rankTeams(t, table[target]) < 0)
        .length < qualifying
    )
      return true;
  }
  return false;
}
// Bounded exhaustive schedule proof, including ties. A favourable scoring
// witness proves existence; unresolved leaves and exhausted budgets stay unknown.
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
    remaining: { a: number; b: number; game: ProofGame }[] = [];
  const games: ProofGame[] = [];
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
    if (!home || !away) throw Error('Missing lineup for schedule proof');
    const game: ProofGame = {
      a,
      b,
      home: projectLineup(input, home),
      away: projectLineup(input, away),
      outcome: 2,
    };
    games.push(game);
    {
      const h = game.home,
        v = game.away;
      if (h.complete && v.complete) {
        const hp = Math.round(h.mean * 100),
          ap = Math.round(v.mean * 100);
        game.outcome = hp > ap ? 0 : hp < ap ? 1 : 2;
        units[a] += hp > ap ? 2 : hp === ap ? 1 : 0;
        units[b] += ap > hp ? 2 : hp === ap ? 1 : 0;
        continue;
      }
    }
    if (f.key === fixtureKey) {
      if (outcome === 'tie') {
        game.outcome = 2;
        units[a]++;
        units[b]++;
        continue;
      }
      winner = outcome === 'win' ? teamId : f.home === teamId ? f.away : f.home;
    }
    if (winner !== undefined) {
      game.outcome = winner === f.home ? 0 : 1;
      units[ids.indexOf(winner)] += 2;
      continue;
    }
    if (a === index || b === index) {
      game.outcome = a === index ? 0 : 1;
      units[index] += 2;
      continue;
    }
    remaining.push({ a, b, game });
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
      return scoringWitness(input, units, games, index, qualifying)
        ? 'possible'
        : 'unknown';
    }
    const { a, b, game } = remaining[i];
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
      game.outcome = x === 2 ? 0 : y === 2 ? 1 : 2;
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
  field: 'playoff' | 'last' | 'bye',
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
  field: 'playoff' | 'last' | 'bye' = 'playoff',
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
  const matchStakes: MatchStake[] = [];
  for (const f of unresolved)
    for (const id of [f.home, f.away])
      for (const objective of ['bye', 'playoffs', 'avoid last'] as const) {
        const field =
            objective === 'playoffs'
              ? 'playoff'
              : objective === 'bye'
                ? 'bye'
                : 'last',
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
        if (
          objective !== 'bye' &&
          route(input, scenario, id, k, f.key, 'loss') === 'impossible'
        ) {
          const winRoute = route(input, scenario, id, k, f.key, 'win'),
            tieRoute = route(input, scenario, id, k, f.key, 'tie');
          if (tieRoute === 'possible') label = 'Can’t lose';
          else if (winRoute === 'possible' && tieRoute === 'impossible')
            label = 'Must win';
        }
        const swing =
          win !== null && loss !== null ? Math.abs(win - loss) : null;
        if (
          win !== null &&
          loss !== null &&
          swing !== null &&
          swing >= 0.2 &&
          fixtureSwing(f, id, field)
        ) {
          if (!label) label = 'Big swing game';
          const rank = input.teams.find((t) => t.id === id)!.rank;
          const chasing =
            objective === 'bye'
              ? rank > 2
              : objective === 'playoffs'
                ? rank > input.playoffTeams
                : rank === input.teams.length;
          matchStakes.push({
            fixtureKey: f.key,
            rosterId: id,
            objective,
            label: chasing ? 'Must win' : 'Can’t lose',
            reason:
              objective === 'bye'
                ? chasing
                  ? 'to chase a top-two bye'
                  : 'to protect a top-two place'
                : objective === 'playoffs'
                  ? chasing
                    ? 'to boost the playoff push'
                    : 'to protect a playoff spot'
                  : chasing
                    ? 'to climb away from last place'
                    : 'to avoid being dragged into last place',
            win,
            loss,
            swing,
          });
        }
        if (label && objective !== 'bye')
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
  return { bubble, stakes, matchStakes };
}
export type Insights = ReturnType<typeof getInsights>;
export function percentage(p: number, actual = false, ruledOut = false) {
  return actual || (p === 0 && ruledOut)
    ? `${Math.round(p * 100)}%`
    : p < 0.01
      ? '<1%'
      : p > 0.99
        ? '>99%'
        : `${Math.round(p * 100)}%`;
}
export function percentagePoints(delta: number) {
  const value = Number((delta * 100).toFixed(1));
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} pp`;
}
