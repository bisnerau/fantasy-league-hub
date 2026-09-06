import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  weeklyAwards,
  validWeek,
  halfwayTable,
  finalTable,
  compareForecast,
  againstTheRoom,
  reviewTrade,
  weekStart,
} from '../lib/season/features.ts';
const rows = (scores = [110, 120, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10]) =>
  scores.map((points, i) => ({
    roster_id: i + 1,
    matchup_id: Math.floor(i / 2) + 1,
    points,
    players: [],
    starters: [],
    players_points: {},
  }));
void test('schedule awards require a majority and use adjusted scores', () => {
  const result = weeklyAwards(rows(), [], 1);
  assert.deepEqual(
    result.awards.map((a) => [a.kind, a.rosterId]),
    [
      ['solicitor', 1],
      ['escape', 11],
    ],
  );
  const adjusted = rows();
  adjusted[0].custom_points = 150;
  assert.equal(
    weeklyAwards(adjusted, [], 1).awards.find((a) => a.kind === 'solicitor')
      .rosterId,
    2,
  );
  const ties = rows(Array(12).fill(100));
  assert.equal(weeklyAwards(ties, [], 1).awards.length, 0);
  assert.equal(validWeek(rows().slice(0, -1)), false);
  const bad = rows();
  bad[0].points = null;
  assert.equal(weeklyAwards(bad, [], 1), null);
});
void test('waiver award counts only completed same-week acquisitions who actually started, shares ties, and fails closed on missing points', () => {
  const w = rows();
  for (const r of w.slice(0, 2)) {
    r.players = ['p' + r.roster_id];
    r.starters = r.players;
    r.players_points = { [r.players[0]]: 15 };
  }
  const tx = [1, 2].map((id) => ({
    status: 'complete',
    leg: 1,
    type: 'waiver',
    adds: { ['p' + id]: id },
  }));
  assert.equal(
    weeklyAwards(w, tx, 1).awards.filter((a) => a.kind === 'waiver').length,
    2,
  );
  assert.equal(
    weeklyAwards(w, tx, 2).awards.filter((a) => a.kind === 'waiver').length,
    0,
  );
  w[0].players_points = {};
  const incomplete = weeklyAwards(w, tx, 1);
  assert.equal(incomplete.waiverReady, false);
  assert.equal(
    incomplete.awards.some((a) => a.kind === 'waiver'),
    false,
  );
  assert.equal(weeklyAwards(rows(), null, 1).waiverReady, false);
});
void test('halfway table uses exactly seven complete weeks and prediction scores reject malformed ballots', () => {
  const weeks = Array.from({ length: 7 }, () => rows());
  const half = halfwayTable(weeks);
  assert.equal(half[0].rosterId, 2);
  assert.equal(half[0].wins, 7);
  assert.equal(half[0].points, 840);
  assert.equal(halfwayTable(weeks.slice(0, 6)), null);
  assert.equal(
    halfwayTable(Array.from({ length: 7 }, () => rows(Array(12).fill(100)))),
    null,
  );
  const actual = Array.from({ length: 12 }, (_, i) => i + 1);
  const forecast = [2, 1, ...actual.slice(2)];
  const score = compareForecast(forecast, actual);
  assert.equal(score.total, 2);
  assert.equal(score.exact, 10);
  assert.equal(compareForecast([...Array(12).fill(1)], actual), null);
});
void test('final review requires all championship and consolation places without duplicate teams', () => {
  const bracket = (offset) =>
    [1, 3, 5].map((p) => ({ p, w: p + offset, l: p + offset + 1 }));
  assert.deepEqual(
    finalTable(bracket(0), bracket(6)),
    Array.from({ length: 12 }, (_, i) => i + 1),
  );
  assert.equal(finalTable(bracket(0), bracket(6).slice(0, 2)), null);
  assert.equal(finalTable(bracket(0), bracket(0)), null);
});
void test('against the room requires six distinct voters and a strict losing majority, excludes ties', () => {
  const game = { id: 1, week: 1, home: 1, away: 2, winner: 1 };
  const votes = Array.from({ length: 6 }, (_, i) => ({
    matchup_id: 1,
    voter_id: String(i),
    selected_roster_id: i < 2 ? 1 : 2,
  }));
  assert.equal(againstTheRoom([game], votes).length, 2);
  assert.equal(againstTheRoom([game], votes.slice(0, 5)).length, 0);
  assert.equal(againstTheRoom([{ ...game, winner: null }], votes).length, 0);
  votes[2].selected_roster_id = 1;
  assert.equal(againstTheRoom([game], votes).length, 0);
});
void test('trade reviews use full contiguous weeks, stop at departure, preserve the first three weeks, and distinguish bench points', () => {
  const trade = {
    transaction_id: 't',
    type: 'trade',
    status: 'complete',
    status_updated: weekStart(2026, 1) + 1000,
    roster_ids: [1, 2],
    adds: { p: 1 },
  };
  const week = (w) => ({
    week: w,
    rows: [
      {
        roster_id: 1,
        players: ['p'],
        starters: w === 3 ? [] : ['p'],
        players_points: { p: 10 },
      },
    ],
  });
  const weeks = [1, 2, 3, 4, 5].map(week);
  const review = reviewTrade(trade, weeks, [trade]);
  assert.equal(review.firstWeek, 2);
  assert.equal(review.initialReady, true);
  assert.deepEqual(review.weeks.slice(0, 3), [2, 3, 4]);
  assert.equal(review.sides[0].players[0].contributions[1].started, 0);
  assert.equal(review.sides[0].players[0].contributions[1].total, 10);
  const moved = {
    transaction_id: 'next',
    type: 'trade',
    status: 'complete',
    status_updated: weekStart(2026, 4) + 1000,
    adds: { p: 2 },
    drops: { p: 1 },
  };
  const stopped = reviewTrade(trade, weeks, [trade, moved]);
  assert.deepEqual(
    stopped.sides[0].players[0].contributions.map((c) => c.started),
    [10, 0, 0, 0],
  );
  assert.equal(
    reviewTrade(
      trade,
      weeks.filter((w) => w.week !== 3),
      [trade],
    ).initialReady,
    false,
  );
  assert.equal(
    reviewTrade({ ...trade, status_updated: undefined }, weeks, [trade]),
    null,
  );
  const missing = week(2);
  missing.rows[0].players_points = {};
  assert.equal(
    reviewTrade(trade, [missing], [trade]).sides[0].players[0].contributions[0]
      .total,
    null,
  );
});
