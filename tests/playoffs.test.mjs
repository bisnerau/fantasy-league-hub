import test from 'node:test';
import assert from 'node:assert/strict';
import {
  simulate,
  rankTeams,
  drawMatch,
  inverseNormal,
} from '../lib/playoffs/model.ts';
import { projectLineup } from '../lib/playoffs/lineups.ts';
import {
  route,
  getInsights,
  percentage,
  percentagePoints,
  fixtureSwing,
  finishingBounds,
} from '../lib/playoffs/insights.ts';
import { validateInput, validateResult } from '../lib/playoffs/validation.ts';
const player = (id, mean = 10, variance = 25) => ({
  id,
  name: id,
  position: 'QB',
  team: 'X',
  mean,
  variance,
  available: true,
  gameId: id,
  kickoff: '2026-12-01T18:00:00Z',
  state: 'pre',
  actual: null,
});
function input(n = 2) {
  return {
    version: 'test',
    leagueId: 'test',
    season: 2026,
    asOf: '2026-11-20T10:00:00Z',
    sourceCutoff: '2026-11-20T10:00:00Z',
    completedThrough: 0,
    regularSeasonWeeks: 1,
    playoffTeams: n / 2,
    slots: ['QB'],
    calibration: { teamVarianceScale: 1 },
    returns: [],
    teams: Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      name: `Team ${i + 1}`,
      manager: `Manager ${i + 1}`,
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      rank: i + 1,
    })),
    fixtures: Array.from({ length: n / 2 }, (_, i) => ({
      key: `1:${i + 1}`,
      week: 1,
      matchupId: i + 1,
      home: i * 2 + 1,
      away: i * 2 + 2,
    })),
    lineups: Array.from({ length: n }, (_, i) => ({
      week: 1,
      rosterId: i + 1,
      players: [player(`${i + 1}`)],
      locked: [],
      notes: [],
    })),
  };
}
void test('whole-league probabilities total the available positions, reproducibly', () => {
  const i = input(12);
  const a = simulate(i);
  assert.deepEqual(a, simulate(i));
  validateInput(i);
  validateResult(i, a);
  assert.ok(Math.abs(a.teams.reduce((s, t) => s + t.playoff, 0) - 6) < 1e-8);
  assert.equal(a.iterations, 100000);
  assert.ok(a.teams.every((t) => t.finishes.length === 12));
  for (let position = 0; position < 12; position++)
    assert.ok(
      Math.abs(a.teams.reduce((s, t) => s + t.finishes[position], 0) - 1) <
        1e-8,
    );
});
void test('exact symmetric two-team league is 50/50; chosen winner qualifies', () => {
  const i = input();
  const baseline = simulate(i),
    conditional = simulate(i, { '1:1': 1 });
  assert.ok(Math.abs(baseline.teams[0].playoff - 0.5) < 0.01);
  assert.equal(conditional.teams[0].playoff, 1);
  assert.equal(conditional.teams[1].last, 1);
  assert.equal(conditional.fixtures[0].homeWin, 1);
  assert.deepEqual(conditional.teams[0].finishes, [1, 0]);
  assert.deepEqual(conditional.teams[1].finishes, [0, 1]);
  validateResult(i, conditional);
});
void test('all identical scores respect higher PA then random identical standings', () => {
  assert.ok(
    rankTeams({ units: 2, pf: 100, pa: 110 }, { units: 2, pf: 100, pa: 100 }) <
      0,
  );
  const i = input();
  for (const l of i.lineups) l.players[0].variance = 0;
  const r = simulate(i);
  assert.equal(r.fixtures[0].tie, 1);
  assert.ok(Math.abs(r.teams[0].playoff - 0.5) < 0.01);
});
void test('banked points have zero variance; in-progress games keep pregame estimates', () => {
  const i = input(),
    l = i.lineups[0];
  l.locked = [{ slot: 0, playerId: '1' }];
  l.players[0].state = 'in';
  l.players[0].actual = 100;
  assert.equal(projectLineup(i, l).mean, 10);
  assert.equal(projectLineup(i, l).variance, 25);
  l.players[0].state = 'post';
  assert.equal(projectLineup(i, l).mean, 100);
  assert.equal(projectLineup(i, l).variance, 0);
  l.players[0].actual = null;
  assert.throws(() => validateInput(i), /locked starter/);
});
void test('legal lineup reserves locked flex player before selecting other positions', () => {
  const i = input();
  i.slots = ['RB', 'WRRB_FLEX'];
  const l = i.lineups[0];
  l.players = [
    { ...player('lock', 30), position: 'RB', state: 'in' },
    { ...player('free', 10), position: 'RB' },
    { ...player('wr', 9), position: 'WR' },
  ];
  l.locked = [{ slot: 1, playerId: 'lock' }];
  assert.deepEqual(projectLineup(i, l).players, ['free', 'lock']);
});
void test('absences and byes never fill slots; a return window makes a player eligible only after return', () => {
  const i = input(),
    l = i.lineups[0];
  l.players[0].available = false;
  assert.equal(projectLineup(i, l).mean, 0);
  assert.equal(projectLineup(i, l, { 1: 2 }).mean, 0);
  assert.equal(projectLineup(i, l, { 1: 1 }).mean, 10);
  l.players = [];
  assert.equal(projectLineup(i, l).mean, 0);
});
void test('conditional return-week importance weights agree with rejection conditioning', () => {
  const i = input(4);
  i.playoffTeams = 1;
  i.returns = [{ playerId: '1', earliestWeek: 1, latestWeek: 2 }];
  i.lineups[0].players[0].available = false;
  i.lineups[0].players[0].mean = 20;
  const base = simulate(i, {}, 100000, 123),
    conditioned = simulate(i, { '1:1': 1 }, 100000, 123);
  const expected = base.fixtures[0].effects.find((e) => e.rosterId === 3)
    .homeWin.playoff;
  assert.ok(
    Math.abs(
      conditioned.teams.find((t) => t.rosterId === 3).playoff - expected,
    ) < 0.015,
  );
  assert.ok(conditioned.effectiveSamples < 100000);
  validateResult(i, conditioned);
});
void test('conditional score draws preserve the winner and raise winning score expectations', () => {
  let score = 0;
  for (let j = 1; j <= 10000; j++) {
    const draw = drawMatch(
      { mean: 10, variance: 25 },
      { mean: 10, variance: 25 },
      0,
      j / 10001,
      0,
      0,
    );
    assert.ok(draw.home > draw.away);
    score += draw.home;
  }
  assert.ok(score / 10000 > 12);
  assert.ok(Math.abs(inverseNormal(0.975) - 1.95996) < 0.0001);
});
void test('missing schedules, duplicate slots and non-finite scoring inputs fail validation', () => {
  const i = input();
  i.fixtures = [];
  assert.throws(() => validateInput(i), /Missing remaining/);
  const j = input();
  j.lineups[0].players[0].mean = NaN;
  assert.throws(() => validateInput(j), /scoring inputs/);
});
function proof(units) {
  const i = input(4);
  i.teams.forEach((t, j) => {
    t.wins = Math.floor(units[j] / 2);
    t.ties = units[j] % 2;
  });
  i.fixtures = i.fixtures.slice(0, 1);
  return i;
}
void test('must-win proof distinguishes loss, tie and surviving win', () => {
  const i = proof([2, 3, 3, 5]);
  assert.equal(route(i, {}, 1, 2, '1:1', 'win'), 'possible');
  assert.equal(route(i, {}, 1, 2, '1:1', 'tie'), 'impossible');
  assert.equal(route(i, {}, 1, 2, '1:1', 'loss'), 'impossible');
  const r = simulate(i);
  assert.ok(
    getInsights(i, r).stakes.some(
      (s) => s.rosterId === 1 && s.label === 'Must win',
    ),
  );
});
void test('cannot-lose proof permits a surviving tied game', () => {
  const i = proof([3, 2, 3, 5]);
  assert.equal(route(i, {}, 1, 2, '1:1', 'loss'), 'impossible');
  assert.equal(route(i, {}, 1, 2, '1:1', 'tie'), 'possible');
  assert.ok(
    getInsights(i, simulate(i)).stakes.some(
      (s) => s.rosterId === 1 && s.label === 'Can’t lose',
    ),
  );
});
void test('unresolved scoring tiebreakers and exhausted proof budgets cannot prove elimination', () => {
  const i = proof([2, 2, 3, 5]);
  // The opponent retains its PF lead when both receive the same tied score.
  i.teams[1].pointsFor = 100;
  assert.equal(route(i, {}, 1, 2, '1:1', 'tie'), 'unknown');
  assert.equal(route(i, {}, 1, 2, '1:1', 'win', 0), 'unknown');
});
void test('a favourable PF witness proves a surviving tie without inventing independent tied scores', () => {
  const i = proof([2, 2, 3, 5]);
  assert.equal(route(i, {}, 1, 2, '1:1', 'tie'), 'possible');
  assert.ok(
    getInsights(i, simulate(i)).stakes.some(
      (s) =>
        s.rosterId === 1 &&
        s.objective === 'playoffs' &&
        s.label === 'Can’t lose',
    ),
  );
  i.teams[1].pointsFor = 100;
  assert.equal(route(i, {}, 1, 2, '1:1', 'tie'), 'unknown');
  assert.ok(
    !getInsights(i, simulate(i)).stakes.some(
      (s) =>
        s.rosterId === 1 &&
        s.objective === 'playoffs' &&
        s.label === 'Can’t lose',
    ),
  );
});
void test('a scoring witness cannot alter fixed scores to manufacture survival', () => {
  const i = proof([2, 2, 3, 5]);
  i.lineups[0].players[0].variance = 0;
  i.lineups[1].players[0].variance = 0;
  i.lineups[1].players[0].mean = 20;
  assert.equal(route(i, {}, 1, 2, '1:1', 'tie'), 'unknown');
  assert.equal(route(i, {}, 1, 2, '1:1', 'win'), 'unknown');
});
void test('already eliminated teams receive no must-win playoff label', () => {
  const i = proof([0, 8, 8, 8]);
  assert.ok(
    !getInsights(i, simulate(i)).stakes.some(
      (s) =>
        s.rosterId === 1 &&
        s.objective === 'playoffs' &&
        s.label !== 'Big swing game',
    ),
  );
});
void test('last-place objective has its own mathematical test', () => {
  const i = proof([2, 3, 3, 5]);
  assert.equal(route(i, {}, 1, 3, '1:1', 'loss'), 'impossible');
  assert.equal(route(i, {}, 1, 3, '1:1', 'win'), 'possible');
});
void test('zero simulated successes are not displayed as mathematical elimination', () => {
  assert.equal(percentage(0), '<1%');
  assert.equal(percentage(1), '>99%');
  assert.equal(percentage(0, true), '0%');
  assert.equal(percentage(0, false, true), '0%');
  assert.equal(percentage(0.001, false, true), '<1%');
  assert.equal(percentagePoints(0.231), ' +23.1 pp'.trim());
  assert.equal(percentagePoints(-0.00001), '0.0 pp');
  assert.equal(percentagePoints(0.00001), '0.0 pp');
});
void test('record bounds rule out last place without treating unresolved scoring ties as decided', () => {
  const i = input(4);
  i.teams.forEach((t, j) => {
    t.wins = [7, 7, 6, 2][j];
  });
  const bounds = finishingBounds(i);
  assert.equal(bounds.get(1).worst, 3);
  assert.equal(bounds.get(2).worst, 3);
  assert.equal(bounds.get(4).best, 4);
  const result = simulate(i);
  assert.equal(result.teams[0].last, 0);
  assert.equal(
    percentage(result.teams[0].last, false, bounds.get(1).worst < 4),
    '0%',
  );
  i.teams[3].wins = 6;
  assert.equal(finishingBounds(i).get(1).worst, 4);
  // Two current ties count as one win when bounding the final record.
  i.teams[3].wins = 5;
  i.teams[3].ties = 2;
  assert.equal(finishingBounds(i).get(1).worst, 4);
});
void test('record bounds honour scenario winners, reset, and confirmed final games', () => {
  const i = input();
  assert.deepEqual(finishingBounds(i).get(1), { best: 1, worst: 2 });
  assert.deepEqual(finishingBounds(i, { '1:1': 1 }).get(1), {
    best: 1,
    worst: 1,
  });
  assert.deepEqual(finishingBounds(i, { '1:1': 1 }).get(2), {
    best: 2,
    worst: 2,
  });
  assert.deepEqual(finishingBounds(i).get(1), { best: 1, worst: 2 });
  for (const l of i.lineups) {
    l.locked = [{ slot: 0, playerId: String(l.rosterId) }];
    l.players[0].state = l.rosterId === 1 ? 'post' : 'in';
    l.players[0].actual = l.rosterId === 1 ? 20 : 99;
  }
  assert.deepEqual(finishingBounds(i).get(1), { best: 1, worst: 2 });
  i.lineups[1].players[0].state = 'post';
  // Actual final scores override a prior hypothetical winner.
  assert.deepEqual(finishingBounds(i, { '1:1': 1 }).get(1), {
    best: 2,
    worst: 2,
  });
  i.lineups[1].players[0].actual = 20;
  assert.deepEqual(finishingBounds(i).get(1), { best: 1, worst: 2 });
});
void test('bubble thresholds and sorting are editorial; helpful winner follows conditional effect', () => {
  const i = input(12),
    r = simulate(i);
  r.teams.forEach((t) => (t.playoff = t.rosterId <= 6 ? 0.9 : 0.05));
  r.teams.find((t) => t.rosterId === 6).playoff = 0.79;
  r.teams.find((t) => t.rosterId === 7).playoff = 0.1;
  r.teams.find((t) => t.rosterId === 8).playoff = 0.3;
  r.teams.find((t) => t.rosterId === 9).playoff = 0.099;
  const b = getInsights(i, r).bubble;
  assert.deepEqual(
    b.map((t) => t.id),
    [8, 7, 6],
  );
  assert.equal(b[0].label, 'Sniffing around');
  assert.equal(b[2].label, 'Looking over their shoulder');
  const f = r.fixtures[0];
  f.effects = [
    {
      rosterId: 7,
      homeWin: { playoff: 0.6, last: 0, effectiveSamples: 50000 },
      awayWin: { playoff: 0.2, last: 0, effectiveSamples: 50000 },
    },
  ];
  assert.equal(fixtureSwing(f, 7).helpfulWinner, f.home);
  assert.ok(Math.abs(fixtureSwing(f, 7).swing - 0.4) < 1e-9);
  f.effects[0].homeWin.playoff = 0.2001;
  assert.equal(fixtureSwing(f, 7), null);
});
void test('finished games are fixed during mathematical proofs and final scenarios close', () => {
  const i = input();
  for (const l of i.lineups) {
    l.players[0].state = 'post';
    l.players[0].actual = l.rosterId === 1 ? 20 : 10;
    l.locked = [{ slot: 0, playerId: String(l.rosterId) }];
  }
  const r = simulate(i);
  assert.equal(r.final, true);
  assert.equal(r.teams[0].playoff, 1);
  assert.equal(r.fixtures[0].resolved, true);
  assert.deepEqual(r.teams[0].finishes, [1, 0]);
  validateResult(i, r);
  assert.throws(() => simulate(i, { '1:1': 2 }), /no supported/);
});
void test('unavailable locked starter cannot be replaced by a healthy bench player', () => {
  const i = input(),
    l = i.lineups[0];
  l.players[0].state = 'in';
  l.players[0].available = false;
  l.players.push(player('bench', 50));
  l.locked = [{ slot: 0, playerId: '1' }];
  assert.deepEqual(projectLineup(i, l).players, ['1']);
  assert.equal(projectLineup(i, l).mean, 0);
  assert.equal(projectLineup(i, l).variance, 0);
  l.players[0].state = 'post';
  l.players[0].actual = 7;
  assert.equal(projectLineup(i, l).mean, 7);
});
void test('bounded schedule proof agrees with exhaustive small-league outcomes', () => {
  for (const units of [
    [0, 2, 4, 6],
    [3, 2, 3, 5],
    [2, 3, 3, 5],
    [1, 1, 1, 1],
    [6, 0, 3, 4],
  ]) {
    const i = proof(units);
    i.fixtures.push({ key: '1:2', week: 1, matchupId: 2, home: 3, away: 4 });
    for (const outcome of ['win', 'loss', 'tie']) {
      const base = [...units];
      base[0] += outcome === 'win' ? 2 : outcome === 'tie' ? 1 : 0;
      base[1] += outcome === 'loss' ? 2 : outcome === 'tie' ? 1 : 0;
      const ranks = [0, 1, 2].map((a) => {
        const u = [...base];
        u[2] += a;
        u[3] += 2 - a;
        return {
          optimistic: 1 + u.slice(1).filter((x) => x > u[0]).length,
        };
      });
      const result = route(i, {}, 1, 2, '1:1', outcome);
      if (result === 'impossible')
        assert.ok(ranks.every((r) => r.optimistic > 2));
      if (result === 'possible')
        assert.ok(ranks.some((r) => r.optimistic <= 2));
      if (ranks.every((r) => r.optimistic > 2))
        assert.equal(result, 'impossible');
    }
  }
});
