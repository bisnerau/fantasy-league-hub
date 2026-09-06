import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  acquisitionReceipts,
  acquisitionSummary,
  personalResults,
} from '../lib/season/my-season.ts';
import { weekStart } from '../lib/season/features.ts';
const claim = (id, week = 1) => ({
  transaction_id: id,
  type: 'waiver',
  status: 'complete',
  status_updated: weekStart(2026, week) + 1000,
  created: weekStart(2026, week),
  leg: week,
  adds: { p: 1 },
  drops: { old: 1 },
  settings: { waiver_bid: 10 },
});
const week = (w, started = true, score = 20) => ({
  week: w,
  rows: [
    {
      roster_id: 1,
      players: ['p'],
      starters: started ? ['p'] : [],
      players_points: { p: score },
    },
  ],
});
void test('pickup receipts count acquisition-week starts, ignore bench points, and attach cost and dropped player', () => {
  const receipts = acquisitionReceipts(
    [claim('a')],
    [week(1), week(2, false)],
    [1, 2],
  );
  assert.equal(receipts[0].points, 20);
  assert.equal(receipts[0].starts, 1);
  assert.deepEqual(receipts[0].drops, ['old']);
  assert.deepEqual(acquisitionSummary(receipts), {
    additions: 1,
    points: 20,
    starts: 1,
    faab: 10,
  });
});
void test('reacquired players receive separate receipts without counting the previous ownership spell twice', () => {
  const first = claim('a'),
    second = claim('b', 3);
  const drop = {
    transaction_id: 'drop',
    type: 'free_agent',
    status: 'complete',
    status_updated: weekStart(2026, 2) + 1000,
    drops: { p: 1 },
  };
  const receipts = acquisitionReceipts(
    [first, drop, second],
    [week(1), week(2), week(3)],
    [1, 2, 3],
  );
  assert.equal(receipts.find((r) => r.transactionId === 'a').points, 20);
  assert.equal(receipts.find((r) => r.transactionId === 'b').points, 20);
  assert.equal(acquisitionSummary(receipts).points, 40);
  assert.equal(acquisitionSummary(receipts).faab, 20);
});
void test('missing weeks, missing timing, and missing starter points are unavailable, not zero', () => {
  assert.equal(
    acquisitionReceipts([claim('a')], [week(1)], [1, 2])[0].points,
    null,
  );
  assert.equal(
    acquisitionReceipts(
      [{ ...claim('a'), status_updated: undefined }],
      [week(1)],
      [1],
    )[0].points,
    null,
  );
  const missing = week(1);
  missing.rows[0].players_points = {};
  assert.equal(
    acquisitionReceipts([claim('a')], [missing], [1])[0].points,
    null,
  );
  assert.equal(acquisitionReceipts([claim('a')], [], [])[0].points, 0);
});
void test('FAAB is counted once per successful transaction and unsuccessful claims do not appear', () => {
  const multi = { ...claim('a'), adds: { p: 1, q: 1 } };
  const result = acquisitionSummary(
    acquisitionReceipts(
      [multi, { ...claim('failed'), status: 'failed' }],
      [],
      [],
    ),
  );
  assert.equal(result.additions, 2);
  assert.equal(result.faab, 10);
});

void test('unpaired playoff weeks are excluded from highs and lows, while missing results are reported', () => {
  const w = (week, rows) => ({ week, rows });
  const own = { roster_id: 1, matchup_id: 1, points: 110 };
  const other = { roster_id: 2, matchup_id: 1, points: 100 };
  const result = personalResults(
    [
      w(14, [own, other]),
      w(15, [{ ...own, matchup_id: null, points: 0 }]),
      w(16, [own, { ...other, points: null }]),
    ],
    1,
    [14, 15, 16, 17],
  );
  assert.deepEqual(result.games, [
    { week: 14, points: 110, opponent: 2, against: 100 },
  ]);
  assert.deepEqual(result.byes, [15]);
  assert.deepEqual(result.missing, [16, 17]);
});
