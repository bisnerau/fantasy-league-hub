import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateSeasonConsensus,
  isCompleteForecast,
} from '../lib/predictions/season-consensus.ts';

void test('consensus averages complete ballots with equal manager weight', () => {
  const rows = calculateSeasonConsensus(
    [
      { voter_id: 'a', rankings: [1, 2, 3] },
      { voter_id: 'b', rankings: [2, 1, 3] },
      { voter_id: 'c', rankings: [2, 3, 1] },
    ],
    [1, 2, 3],
  );
  assert.deepEqual(
    rows.map((r) => r.rosterId),
    [2, 1, 3],
  );
  assert.equal(rows[0].averagePosition, 4 / 3);
  assert.equal(rows[0].firstPlaceVotes, 2);
  assert.equal(rows[0].ballots, 3);
});

void test('invalid ballots never become zero-position votes and duplicate voters count once', () => {
  const rows = calculateSeasonConsensus(
    [
      { voter_id: 'a', rankings: [3, 2, 1] },
      { voter_id: 'a', rankings: [1, 2, 3] },
      { voter_id: 'missing', rankings: [1, 2] },
      { voter_id: 'duplicate', rankings: [1, 1, 3] },
      { voter_id: 'unknown', rankings: [1, 2, 99] },
    ],
    [1, 2, 3],
  );
  assert.deepEqual(
    rows.map((r) => r.averagePosition),
    [1, 2, 3],
  );
  assert(rows.every((r) => r.ballots === 1));
  assert.equal(isCompleteForecast(['1', 2, 3], [1, 2, 3]), false);
  assert.equal(isCompleteForecast(null, [1, 2, 3]), false);
  assert.deepEqual(calculateSeasonConsensus([], [1, 2, 3]), []);
});

void test('equal averages break on first-place votes then stable roster order', () => {
  const rows = calculateSeasonConsensus(
    [
      { voter_id: 'a', rankings: [1, 2, 3] },
      { voter_id: 'b', rankings: [3, 2, 1] },
    ],
    [3, 2, 1],
  );
  assert.deepEqual(
    rows.map((r) => r.rosterId),
    [1, 3, 2],
  );
  assert(rows.every((r) => r.averagePosition === 2));
});
