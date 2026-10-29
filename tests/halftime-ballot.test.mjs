import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bracketGames,
  changeOfHeart,
  halftimeBallotSummary,
  isCompleteHalftimeBallot,
  validPicks,
} from '../lib/season/halftime-ballot.ts';

// Seeds are roster ids 101..112 so seeds and ids never coincide.
const table = Array.from({ length: 12 }, (_, i) => 101 + i);
const seed = (n) => table[n - 1];
const ids = [...table];

void test('championship pairs 4v5 and 3v6, then the byes meet the winners', () => {
  const games = bracketGames(table, [], 'championship');
  assert.deepEqual(games[0].teams, [seed(4), seed(5)]);
  assert.deepEqual(games[1].teams, [seed(3), seed(6)]);
  assert.deepEqual(games[2].teams, [seed(1), null]);
  assert.deepEqual(games[3].teams, [seed(2), null]);
  const picked = bracketGames(
    table,
    [seed(5), seed(3), seed(1), seed(3), seed(3)],
    'championship',
  );
  assert.deepEqual(picked[2].teams, [seed(1), seed(5)]);
  assert.deepEqual(picked[3].teams, [seed(2), seed(3)]);
  assert.deepEqual(picked[4].teams, [seed(1), seed(3)]);
  assert.equal(picked[4].pick, seed(3));
});

void test('loser bowl pairs 8v9 and 7v10, with byes for 12 and 11', () => {
  const games = bracketGames(
    table,
    [seed(9), seed(7), seed(12), seed(7), seed(12)],
    'loserBowl',
  );
  assert.deepEqual(games[0].teams, [seed(8), seed(9)]);
  assert.deepEqual(games[1].teams, [seed(7), seed(10)]);
  // The team picked in each game is the one going through: the loser.
  assert.deepEqual(games[2].teams, [seed(12), seed(9)]);
  assert.deepEqual(games[3].teams, [seed(11), seed(7)]);
  assert.deepEqual(games[4].teams, [seed(12), seed(7)]);
  assert.deepEqual(
    games.map((g) => g.week),
    [15, 15, 16, 16, 17],
  );
});

void test('a pick that no longer fits the table drops later picks too', () => {
  const picks = [seed(5), seed(3), seed(5), seed(3), seed(5)];
  // Swap seeds 5 and 7: the old seed-5 team leaves the championship bracket.
  const moved = [...table];
  [moved[4], moved[6]] = [moved[6], moved[4]];
  assert.deepEqual(validPicks(moved, picks, 'championship'), [
    null,
    seed(3),
    null,
    seed(3),
    null,
  ]);
});

void test('only complete, consistent ballots count', () => {
  const ballot = {
    rankings: table,
    championship: [seed(4), seed(3), seed(1), seed(3), seed(1)],
    loserBowl: [seed(9), seed(10), seed(9), seed(11), seed(11)],
  };
  assert.equal(isCompleteHalftimeBallot(ballot, ids), true);
  assert.equal(
    isCompleteHalftimeBallot(
      {
        ...ballot,
        championship: [seed(4), seed(3), seed(2), seed(3), seed(1)],
      },
      ids,
    ),
    false,
  );
  assert.equal(
    isCompleteHalftimeBallot({ ...ballot, loserBowl: [seed(9)] }, ids),
    false,
  );
  assert.equal(
    isCompleteHalftimeBallot({ ...ballot, rankings: table.slice(1) }, ids),
    false,
  );
});

void test('summary counts champion and punishment votes from valid ballots only', () => {
  const base = {
    rankings: table,
    loserBowl: [seed(9), seed(10), seed(9), seed(11), seed(11)],
  };
  const summary = halftimeBallotSummary(
    [
      {
        voter_id: 'a',
        ...base,
        championship: [seed(4), seed(3), seed(1), seed(3), seed(1)],
      },
      {
        voter_id: 'b',
        ...base,
        championship: [seed(5), seed(6), seed(5), seed(2), seed(2)],
      },
      {
        voter_id: 'c',
        ...base,
        championship: [seed(4), seed(3), seed(1), seed(3), seed(1)],
      },
      { voter_id: 'd', ...base, championship: [seed(1)] },
    ],
    ids,
  );
  assert.equal(summary.count, 3);
  assert.deepEqual(summary.champions[0], {
    rosterId: seed(1),
    voters: ['a', 'c'],
  });
  // The punishment is twelfth in the table, not the loser bowl result.
  assert.deepEqual(summary.spoons, [
    { rosterId: seed(12), voters: ['a', 'b', 'c'] },
  ]);
  assert.equal(summary.consensus[0].rosterId, seed(1));
});

void test('change of heart finds the biggest single move', () => {
  const preseason = [1, 2, 3, 4];
  assert.deepEqual(changeOfHeart(preseason, [4, 1, 2, 3]), {
    rosterId: 4,
    from: 4,
    to: 1,
  });
  assert.equal(changeOfHeart(preseason, preseason), null);
  assert.equal(changeOfHeart([], [1]), null);
});

void test('the second-half ballot locks at Week 8 kickoff and the house ballot is valid', async () => {
  const { sundayKickoffForWeek } = await import('../lib/predictions/rules.ts');
  const { houseBallot } = await import('../lib/data/halftime/house-ballot.ts');
  assert.equal(
    sundayKickoffForWeek(2026, 8).toISOString(),
    '2026-11-01T18:00:00.000Z',
  );
  const rosters = Array.from({ length: 12 }, (_, i) => i + 1);
  assert.equal(isCompleteHalftimeBallot(houseBallot, rosters), true);
});
