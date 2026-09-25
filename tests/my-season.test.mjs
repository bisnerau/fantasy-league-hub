import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  acquisitionReceipts,
  acquisitionSummary,
  formGuide,
  leagueFaith,
  personalResults,
  pickAttendance,
  tradeScore,
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

void test('form guide marks results, byes, missing weeks and upcoming weeks without inventing scores', () => {
  const tiles = formGuide(
    {
      games: [
        { week: 1, points: 120, opponent: 2, against: 100 },
        { week: 2, points: 90, opponent: 3, against: 90 },
      ],
      byes: [3],
      missing: [4],
    },
    [1, 2, 3, 4],
  );
  assert.equal(tiles.length, 14);
  assert.deepEqual(
    tiles.slice(0, 5).map((t) => t.state),
    ['W', 'T', 'bye', 'missing', 'upcoming'],
  );
  assert.equal('points' in tiles[3], false);
  assert.equal(
    formGuide({ games: [], byes: [], missing: [] }, [15]).length,
    15,
  );
});

void test('league faith leaves out your own pick and counts believers, doubters and Bankers', () => {
  const games = [
    { id: 1, week: 1, home: 1, away: 2, winner: 1, settled: true },
    { id: 2, week: 2, home: 3, away: 1, winner: null, settled: false },
    { id: 3, week: 2, home: 4, away: 5, winner: 4, settled: true },
  ];
  const votes = [
    { matchup_id: 1, voter_id: 'me', selected_roster_id: 1 },
    { matchup_id: 1, voter_id: 'a', selected_roster_id: 2 },
    { matchup_id: 1, voter_id: 'b', selected_roster_id: 2 },
    { matchup_id: 1, voter_id: 'c', selected_roster_id: 1 },
    { matchup_id: 2, voter_id: 'a', selected_roster_id: 3 },
    { matchup_id: 2, voter_id: 'c', selected_roster_id: 1 },
    { matchup_id: 2, voter_id: 'd', selected_roster_id: 99 },
    { matchup_id: 3, voter_id: 'a', selected_roster_id: 4 },
  ];
  const room = leagueFaith(games, votes, 1, 'me', [
    { matchup_id: 1, voter_id: 'a' },
  ]);
  assert.equal(room.weeks.length, 2);
  assert.deepEqual(
    room.weeks.map((w) => [w.for, w.against, w.result]),
    [
      [1, 2, 'won'],
      [1, 1, null],
    ],
  );
  assert.equal(room.backed, 2);
  assert.equal(room.total, 5);
  assert.deepEqual(
    room.believers.map((v) => v.voterId),
    ['c'],
  );
  assert.deepEqual(
    room.doubters.map((v) => v.voterId),
    ['a'],
  );
  assert.deepEqual(
    room.provedWrong.map((w) => w.week),
    [1],
  );
  assert.equal(room.weeks[0].bankersAgainst, 1);
  assert.equal(
    leagueFaith(games, votes, 1, 'me').weeks[0].bankersAgainst,
    null,
  );
  assert.equal(leagueFaith(games, [], 1, 'me').total, 0);
});

void test('picks attendance counts locked weeks only', () => {
  const games = [
    { id: 1, week: 1, home: 1, away: 2, winner: 1, locked: true },
    { id: 2, week: 1, home: 3, away: 4, winner: 3, locked: true },
    { id: 3, week: 2, home: 1, away: 3, winner: null, locked: true },
    { id: 4, week: 3, home: 1, away: 4, winner: null, locked: false },
  ];
  assert.deepEqual(
    pickAttendance(games, [{ matchup_id: 1 }, { matchup_id: 3 }]),
    [
      { week: 1, saved: 1, total: 2, full: false },
      { week: 2, saved: 1, total: 1, full: true },
    ],
  );
});

void test('trade score sums starter points and stays unavailable when a week is unknown', () => {
  const side = (rosterId, contributions) => ({
    rosterId,
    players: [{ playerId: `p${rosterId}`, exited: false, contributions }],
  });
  const review = {
    firstWeek: 3,
    weeks: [3, 4],
    initialReady: false,
    sides: [
      side(1, [
        { week: 3, started: 12.5, total: 12.5, excluded: false },
        { week: 4, started: 0, total: 8, excluded: false },
      ]),
      side(2, [
        { week: 3, started: 20, total: 20, excluded: false },
        { week: 4, started: 0, total: 0, excluded: true },
      ]),
    ],
  };
  assert.deepEqual(tradeScore(review), {
    status: 'scored',
    weeks: 2,
    initialReady: false,
    sides: [
      { rosterId: 1, points: 12.5 },
      { rosterId: 2, points: 20 },
    ],
  });
  review.sides[0].players[0].contributions[1].started = null;
  assert.equal(tradeScore(review).status, 'unavailable');
  assert.deepEqual(tradeScore(review).sides, []);
  assert.equal(tradeScore(null).status, 'waiting');
  assert.equal(tradeScore({ ...review, weeks: [] }).status, 'waiting');
});
