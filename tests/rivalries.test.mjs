import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarizeRivalry, getWeeklyRivalries } from '../lib/data/rivalries.ts';
import { scheduleSnapshot } from '../lib/data/schedule-snapshot.ts';

const game = (season, week, home, away, homePoints, awayPoints) => ({
  season,
  week,
  home,
  away,
  homePoints,
  awayPoints,
});
void test('rivalry record orients scores correctly, preserves ties, and excludes the viewed week and future results', () => {
  const games = [
    game(2025, 2, 1, 2, 100, 90),
    game(2025, 9, 2, 1, 125.15, 100.05),
    game(2026, 1, 2, 1, 100, 100),
    game(2026, 2, 1, 2, 80, 110),
    game(2026, 3, 1, 2, 80, 110),
    game(2025, 1, 1, 3, 10, 300),
    game(2025, 1, 1, 2, NaN, 300),
  ];
  const before = { season: 2026, week: 2 };
  const record = summarizeRivalry(games, 1, 2, before);
  assert.equal(record.meetings, 3);
  assert.equal(record.homeWins, 1);
  assert.equal(record.awayWins, 1);
  assert.equal(record.ties, 1);
  assert.equal(record.last.season, 2026);
  assert.equal(record.last.week, 1);
  assert.equal(record.biggest.homePoints, 100.05);
  assert.equal(record.biggest.awayPoints, 125.15);
  const reverse = summarizeRivalry(games, 2, 1, before);
  assert.equal(reverse.homeWins, record.awayWins);
  assert.equal(reverse.biggest.homePoints, record.biggest.awayPoints);
  assert.equal(summarizeRivalry([], 1, 2, before).last, null);
  assert.equal(
    summarizeRivalry([game(2025, 1, 1, 2, 0, 0)], 1, 2, before).biggest,
    null,
  );
});

void test('archived history is scoped to the verified league and owner mapping season', async () => {
  const data = {
    leagueId: scheduleSnapshot.leagueId,
    season: '2026',
    week: 1,
    matchups: [
      { sleeperMatchupId: 1, home: { rosterId: 1 }, away: { rosterId: 3 } },
    ],
  };
  assert.deepEqual(
    await getWeeklyRivalries({ ...data, leagueId: 'other' }),
    {},
  );
  assert.deepEqual(await getWeeklyRivalries({ ...data, season: '2027' }), {});
  const records = await getWeeklyRivalries(data);
  assert.ok(records[1].meetings > 0);
  assert.equal(records[1].scope, '2025 regular season');
  assert.equal(records[1].partial, false);
});
