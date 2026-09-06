import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  analyseDraftPicks,
  draftPersonalities,
  personalityCopy,
} from '../lib/data/draft-personality.ts';
import { draftAdpByPick } from '../lib/data/draft-adp.ts';

const pick = (overall, round = 1, position = 'WR') => ({
  overall,
  round,
  position,
  player: `Player ${overall}`,
  nflTeam: 'BUF',
});
void test('ADP analysis distinguishes early reaches from falls and uses absolute distance', () => {
  const stats = analyseDraftPicks([pick(1), pick(20), pick(30), pick(40)], {
    1: 8,
    20: 13,
    30: 36,
    40: 34,
  });
  assert.equal(stats.meanDistance, 6.5);
  assert.equal(stats.reaches, 1);
  assert.equal(stats.falls, 1);
  assert.equal(stats.close, 2);
  assert.equal(stats.biggestReach.overall, 1);
  assert.equal(stats.biggestFall.overall, 20);
});
void test('later rounds, specialists and unavailable benchmarks do not distort main comparison', () => {
  const stats = analyseDraftPicks(
    [pick(1), pick(2, 1, 'K'), pick(3, 1, 'DEF'), pick(4), pick(5), pick(6, 8)],
    { 1: 1, 2: 90, 3: 90, 4: null, 6: 100 },
  );
  assert.equal(stats.earlyCount, 1);
  assert.equal(stats.meanDistance, 0);
  assert.equal(stats.biggestReach.overall, 6);
  assert.equal(stats.biggestFall, null);
  assert.equal(stats.evidence.find((p) => p.overall === 5).gap, null);
  assert.equal(analyseDraftPicks([pick(1)], {}).meanDistance, null);
});
void test('published cohort covers all managers and all 180 picks with seven comparable core selections each', () => {
  assert.equal(draftPersonalities.length, 12);
  const picks = draftPersonalities.flatMap((d) =>
    d.evidence.map((p) => p.overall),
  );
  assert.equal(new Set(picks).size, 180);
  assert.equal(Object.keys(draftAdpByPick).length, 180);
  for (const d of draftPersonalities) {
    assert.equal(d.earlyCount, 7);
    assert.equal(d.close + d.reaches + d.falls, 7);
    assert.ok(personalityCopy[d.rosterId]);
  }
  assert.equal(draftPersonalities[0].rosterId, 1);
  assert.equal(draftPersonalities.at(-1).rosterId, 8);
});
