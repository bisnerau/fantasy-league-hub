import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  acquisitionReceipts,
  acquisitionSummary,
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
