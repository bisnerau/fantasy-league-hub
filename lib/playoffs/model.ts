import { projectLineup } from './lineups';
import { normalCdf } from './scoring';
import { SIMULATIONS } from './types';
import type {
  ForecastInput,
  ForecastResult,
  Scenario,
  ConditionalChances,
} from './types';

export function randomGenerator(seed: number) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) + 0.5) / 4294967296;
  };
}
export function seedFrom(value: string) {
  let hash = 2166136261;
  for (const c of value) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619);
  return hash >>> 0;
}
// Acklam's inverse normal approximation. Inputs are strictly inside (0, 1).
export function inverseNormal(p: number) {
  const a = [
    -39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269,
    -30.6647980661472, 2.50662827745924,
  ];
  const b = [
    -54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197,
    -13.2806815528857,
  ];
  const c = [
    -0.00778489400243029, -0.322396458041136, -2.40075827716184,
    -2.54973253934373, 4.37466414146497, 2.93816398269878,
  ];
  const d = [
    0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742,
  ];
  if (p < 0.02425 || p > 0.97575) {
    const q = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
    const x =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    return p < 0.5 ? x : -x;
  }
  const q = p - 0.5,
    r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

export function rankTeams(
  a: { units: number; pf: number; pa: number },
  b: { units: number; pf: number; pa: number },
) {
  return b.units - a.units || b.pf - a.pf || b.pa - a.pa;
}

type Distribution = { mean: number; variance: number; complete: boolean };
// Conditional bivariate Gaussian draw: the margin is truncated to the requested
// winner, then the home score is drawn conditional on that margin. This retains
// the relationship between winning and points-for, unlike overwriting a result.
export function drawMatch(
  home: Distribution,
  away: Distribution,
  chosen: 0 | 1 | null,
  u: number,
  z1: number,
  z2: number,
) {
  const variance = home.variance + away.variance;
  if (variance === 0) {
    const result = home.mean > away.mean ? 0 : home.mean < away.mean ? 1 : 2;
    return {
      home: home.mean,
      away: away.mean,
      likelihood: chosen === null || result === chosen ? 1 : 0,
    };
  }
  if (chosen === null)
    return {
      home: home.mean + Math.sqrt(home.variance) * z1,
      away: away.mean + Math.sqrt(away.variance) * z2,
      likelihood: 1,
    };
  const sign = chosen === 0 ? 1 : -1;
  const margin = sign * (home.mean - away.mean),
    sd = Math.sqrt(variance);
  const lower = normalCdf(-margin / sd),
    probability = 1 - lower;
  if (probability < 1e-12) return { home: 0, away: 0, likelihood: 0 };
  const quantile = Math.min(1 - Number.EPSILON, lower + u * probability);
  const difference = sign * (margin + sd * inverseNormal(quantile));
  const h =
    home.mean +
    (home.variance / variance) * (difference - (home.mean - away.mean)) +
    Math.sqrt((home.variance * away.variance) / variance) * z2;
  return { home: h, away: h - difference, likelihood: probability };
}

export function simulate(
  input: ForecastInput,
  scenario: Scenario = {},
  iterations = SIMULATIONS,
  seed = seedFrom(input.asOf),
  progress?: (value: number) => void,
): ForecastResult {
  const n = input.teams.length,
    m = input.fixtures.length;
  if (n < 2 || n > 16 || !Number.isInteger(iterations) || iterations < 1)
    throw new Error('Invalid simulation size');
  const indices = new Map(input.teams.map((t, i) => [t.id, i]));
  const pairs = input.fixtures.map((f) => {
    const h = indices.get(f.home),
      a = indices.get(f.away);
    if (h === undefined || a === undefined || h === a)
      throw new Error('Invalid forecast fixture');
    return [h, a] as const;
  });
  for (const [key, id] of Object.entries(scenario)) {
    const fixture = input.fixtures.find((f) => f.key === key);
    if (!fixture || ![fixture.home, fixture.away].includes(id))
      throw new Error('Invalid scenario selection');
  }
  const lineupMap = new Map(
    input.lineups.map((l) => [`${l.week}:${l.rosterId}`, l]),
  );
  const distributions = new Map<string, Distribution>();
  const distribution = (
    week: number,
    id: number,
    returns: Record<string, number>,
  ) => {
    const key = `${week}:${id}:${Object.values(returns).join(',')}`;
    const cached = distributions.get(key);
    if (cached) return cached;
    const lineup = lineupMap.get(`${week}:${id}`);
    if (!lineup) throw new Error('Missing forecast lineup');
    const result = projectLineup(input, lineup, returns);
    distributions.set(key, result);
    return result;
  };
  const playoffs = new Uint16Array(iterations),
    lasts = new Uint8Array(iterations);
  const outcomes = new Uint8Array(iterations * m),
    logWeights = new Float64Array(iterations);
  let maxLogWeight = -Infinity;
  let final = m === 0;
  const resolved = input.fixtures.map((f) => {
    const h = distribution(f.week, f.home, {}),
      a = distribution(f.week, f.away, {});
    return h.complete && a.complete;
  });
  final ||= resolved.every(Boolean);
  for (let trial = 0; trial < iterations; trial++) {
    const random = randomGenerator(seed ^ Math.imul(trial + 1, 0x9e3779b9));
    const returns: Record<string, number> = {};
    for (const window of input.returns)
      returns[window.playerId] =
        window.earliestWeek +
        Math.floor(random() * (window.latestWeek - window.earliestWeek + 1));
    const table = input.teams.map((t, i) => ({
      index: i,
      units: t.wins * 2 + t.ties,
      pf: Math.round(t.pointsFor * 100),
      pa: Math.round(t.pointsAgainst * 100),
      coin: random(),
    }));
    let logWeight = 0;
    for (let j = 0; j < m; j++) {
      const f = input.fixtures[j],
        [hi, ai] = pairs[j];
      const home = distribution(f.week, f.home, returns),
        away = distribution(f.week, f.away, returns);
      const chosen =
        scenario[f.key] === undefined
          ? null
          : scenario[f.key] === f.home
            ? 0
            : 1;
      const u = random(),
        z1 = inverseNormal(random()),
        z2 = inverseNormal(random());
      const scores = drawMatch(home, away, chosen, u, z1, z2);
      // Quantise once to league score precision. A conditional tie produced by
      // rounding is rejected, never converted into a win with invented points.
      let h = Math.round(scores.home * 100),
        a = Math.round(scores.away * 100);
      if (
        chosen !== null &&
        scores.likelihood > 0 &&
        (chosen === 0 ? h <= a : a <= h)
      ) {
        let accepted = false;
        for (let retry = 0; retry < 100; retry++) {
          const next = drawMatch(
            home,
            away,
            chosen,
            random(),
            inverseNormal(random()),
            inverseNormal(random()),
          );
          h = Math.round(next.home * 100);
          a = Math.round(next.away * 100);
          if (chosen === 0 ? h > a : a > h) {
            accepted = true;
            break;
          }
        }
        if (!accepted) logWeight = -Infinity;
      }
      logWeight +=
        scores.likelihood > 0 ? Math.log(scores.likelihood) : -Infinity;
      const result = h > a ? 0 : h < a ? 1 : 2;
      outcomes[trial * m + j] = result;
      table[hi].pf += h;
      table[hi].pa += a;
      table[ai].pf += a;
      table[ai].pa += h;
      table[hi].units += result === 0 ? 2 : result === 2 ? 1 : 0;
      table[ai].units += result === 1 ? 2 : result === 2 ? 1 : 0;
    }
    table.sort((a, b) => rankTeams(a, b) || a.coin - b.coin);
    for (let i = 0; i < input.playoffTeams; i++)
      playoffs[trial] |= 1 << table[i].index;
    lasts[trial] = table[n - 1].index;
    logWeights[trial] = logWeight;
    maxLogWeight = Math.max(maxLogWeight, logWeight);
    if (trial % 10_000 === 0) progress?.(trial / iterations);
  }
  if (!Number.isFinite(maxLogWeight))
    throw new Error(
      'These choices have no supported scoring outcomes. Clear a selection and try again.',
    );
  const counts = new Float64Array(n * 2),
    weights = new Float64Array(m * 3),
    squares = new Float64Array(m * 3);
  const effects = new Float64Array(m * 3 * n * 2);
  let sum = 0,
    sumSquared = 0;
  for (let trial = 0; trial < iterations; trial++) {
    const w = Math.exp(logWeights[trial] - maxLogWeight);
    if (!w) continue;
    sum += w;
    sumSquared += w * w;
    for (let t = 0; t < n; t++) {
      if (playoffs[trial] & (1 << t)) counts[t * 2] += w;
      if (lasts[trial] === t) counts[t * 2 + 1] += w;
    }
    for (let j = 0; j < m; j++) {
      const cell = j * 3 + outcomes[trial * m + j];
      weights[cell] += w;
      squares[cell] += w * w;
      for (let t = 0; t < n; t++) {
        if (playoffs[trial] & (1 << t)) effects[cell * n * 2 + t * 2] += w;
        if (lasts[trial] === t) effects[cell * n * 2 + t * 2 + 1] += w;
      }
    }
  }
  const effectiveSamples = (sum * sum) / sumSquared;
  const conditional = (cell: number, t: number): ConditionalChances | null => {
    const ess = squares[cell] ? weights[cell] ** 2 / squares[cell] : 0;
    return ess >= 1000
      ? {
          playoff: effects[cell * n * 2 + t * 2] / weights[cell],
          last: effects[cell * n * 2 + t * 2 + 1] / weights[cell],
          effectiveSamples: ess,
        }
      : null;
  };
  return {
    iterations,
    effectiveSamples,
    reliable: effectiveSamples >= 1000,
    final,
    teams: input.teams.map((t, i) => ({
      rosterId: t.id,
      playoff: counts[i * 2] / sum,
      last: counts[i * 2 + 1] / sum,
    })),
    fixtures: input.fixtures.map((f, j) => ({
      ...f,
      homeWin: weights[j * 3] / sum,
      tie: weights[j * 3 + 2] / sum,
      resolved: resolved[j],
      effects: input.teams.map((t, i) => ({
        rosterId: t.id,
        homeWin: conditional(j * 3, i),
        awayWin: conditional(j * 3 + 1, i),
      })),
    })),
  };
}
