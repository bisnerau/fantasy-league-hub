import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  compareStandings,
  getCutLine,
  getSuperlatives,
  getWeeklyPerformance,
  sortStandings,
} from '../lib/data/standings.ts';

const team = (rosterId, wins, losses, pointsFor, extra = {}) => ({
  rosterId,
  ownerId: `owner-${rosterId}`,
  franchiseId: null,
  teamName: `Team ${rosterId}`,
  ownerName: `Owner ${rosterId}`,
  avatar: null,
  wins,
  losses,
  ties: 0,
  pointsFor,
  pointsAgainst: null,
  medianWins: 0,
  medianLosses: 0,
  streak: '—',
  form: [],
  allPlay: null,
  previousRank: null,
  rank: 0,
  ...extra,
});
const ranked = (teams) =>
  [...teams].sort(compareStandings).map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
// Each pair [home, away] of points plays in its own matchup.
const week = (...scores) =>
  scores.flatMap(([rosterId, points], index) => ({
    roster_id: rosterId,
    matchup_id: Math.floor(index / 2) + 1,
    points,
    players: [],
    starters: [],
    players_points: {},
  }));

// Week 1: 1 beats 2, 3 beats 4. Week 2: 4 beats 1, 2 beats 3.
const weeks = [
  week([1, 120], [2, 100], [3, 110], [4, 90]),
  week([1, 95], [4, 130], [2, 105], [3, 80]),
];
const sleeper = ranked([
  team(1, 1, 1, 215),
  team(2, 1, 1, 205),
  team(3, 1, 1, 190),
  team(4, 1, 1, 220),
]);

void test('weekly performance adds form, all-play and verified movement', () => {
  const rows = getWeeklyPerformance(sleeper, weeks);
  const byId = new Map(rows.map((row) => [row.rosterId, row]));
  assert.deepEqual(byId.get(1).form, ['W', 'L']);
  assert.equal(byId.get(1).streak, 'L1');
  // Week 1: 120 beats all three; week 2: 95 beats only 80.
  assert.deepEqual(byId.get(1).allPlay, { wins: 4, losses: 2, ties: 0 });
  // After week 1 the order was 1, 3 (110), 2 (100), 4 (90).
  assert.equal(byId.get(1).previousRank, 1);
  assert.equal(byId.get(3).previousRank, 2);
  assert.equal(byId.get(4).previousRank, 4);
  assert.equal(byId.get(4).rank, 1);
});

void test('movement hides unless replaying reproduces Sleeper exactly', () => {
  const disagreeing = ranked([
    team(1, 2, 0, 215),
    team(2, 1, 1, 205),
    team(3, 0, 2, 190),
    team(4, 1, 1, 220),
  ]);
  assert.ok(
    getWeeklyPerformance(disagreeing, weeks).every(
      (row) => row.previousRank == null,
    ),
  );
  assert.ok(
    getWeeklyPerformance(sleeper, weeks.slice(0, 1)).every(
      (row) => row.previousRank == null,
    ),
  );
});

void test('missing scores are left out rather than counted as zero', () => {
  const partial = [week([1, 120], [2, null], [3, 110], [4, 90])];
  const rows = getWeeklyPerformance(sleeper, partial);
  const byId = new Map(rows.map((row) => [row.rosterId, row]));
  assert.deepEqual(byId.get(1).allPlay, { wins: 2, losses: 0, ties: 0 });
  assert.equal(byId.get(2).allPlay, null);
  assert.deepEqual(byId.get(2).form, []);
  assert.deepEqual(byId.get(1).form, []);
  assert.ok(rows.every((row) => row.previousRank == null));
});

void test('sort chips keep missing values below real ones', () => {
  const rows = ranked([
    team(1, 2, 0, null),
    team(2, 1, 1, 300),
    team(3, 0, 2, 250, { allPlay: { wins: 5, losses: 1, ties: 0 } }),
  ]);
  assert.deepEqual(
    sortStandings(rows, 'pointsFor').map((row) => row.rosterId),
    [2, 3, 1],
  );
  assert.deepEqual(
    sortStandings(rows, 'allPlay').map((row) => row.rosterId),
    [3, 1, 2],
  );
  assert.deepEqual(
    sortStandings(rows, 'rank').map((row) => row.rosterId),
    [1, 2, 3],
  );
});

void test('the cut line reports a win gap, or points when level', () => {
  const level = ranked([
    team(1, 2, 0, 300),
    team(2, 1, 1, 250.4),
    team(3, 1, 1, 236.2),
  ]);
  assert.equal(getCutLine(level, 2).gap, 'Level on wins · 14.2 PF apart');
  assert.equal(getCutLine(level, 2).firstOut.rosterId, 3);
  assert.equal(getCutLine(level, 1).gap, '1 win apart');
  assert.equal(getCutLine(level, 3), null);
  assert.equal(
    getCutLine(ranked([team(1, 0, 0, null), team(2, 0, 0, null)]), 1),
    null,
  );
});

void test('superlatives hide when their inputs are missing', () => {
  const rows = ranked([
    team(1, 2, 0, 300, {
      pointsAgainst: 260,
      allPlay: { wins: 3, losses: 3, ties: 0 },
    }),
    team(2, 0, 2, 280, { allPlay: { wins: 3, losses: 3, ties: 0 } }),
  ]);
  assert.deepEqual(
    getSuperlatives(rows).map((item) => [item.key, item.team.rosterId]),
    [
      ['scorer', 1],
      ['schedule', 1],
      ['luck', 1],
    ],
  );
  assert.equal(getSuperlatives(rows).at(-1).value, '2-0 · all-play 3-3');
  const bare = ranked([team(1, 1, 0, null), team(2, 0, 1, null)]);
  assert.deepEqual(getSuperlatives(bare), []);
});
