import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getLeagueWire } from '../lib/data/league-wire.ts';
import { getFlagOnThePlay } from '../lib/data/flags-on-the-play.ts';
import {
  getRemaining,
  isTwoMinuteWarning,
  TWO_MINUTE_WARNING_MS,
} from '../lib/countdown.ts';

const team = (rosterId, ownerName, actualScore, record, starters = []) => ({
  rosterId,
  ownerName,
  teamName: `${ownerName} FC`,
  avatar: null,
  wins: record[0],
  losses: record[1],
  ties: 0,
  projectedScore: null,
  actualScore,
  starters,
  bench: [],
});
const player = (name, actualPoints) => ({
  id: name,
  name,
  position: 'WR',
  nflTeam: 'DAL',
  slot: 'WR',
  projectedPoints: null,
  actualPoints,
  eligiblePositions: ['WR'],
  starter: true,
});
const week = (overrides = {}) => ({
  leagueId: 'league',
  season: '2026',
  week: 2,
  currentWeek: 3,
  lockAt: '2026-09-20T17:00:00.000Z',
  locked: true,
  finalized: true,
  databaseReady: true,
  availability: 'ready',
  sourceComplete: true,
  gradingEligible: true,
  matchups: [
    {
      databaseId: 1,
      sleeperMatchupId: 1,
      home: team(1, 'Alan', 128.48, [1, 1], [player('Lamb', 31.2)]),
      away: team(2, 'Hugo', 93.42, [1, 1], [player('Kelce', null)]),
    },
    {
      databaseId: 2,
      sleeperMatchupId: 2,
      home: team(3, 'David', 99.1, [2, 0], [player('Nacua', 18.5)]),
      away: team(4, 'Emmet', 98.8, [0, 2]),
    },
    {
      databaseId: 3,
      sleeperMatchupId: 3,
      home: team(5, 'Karl', null, [1, 1]),
      away: team(6, 'Niall', 140, [1, 1]),
    },
  ],
  ...overrides,
});

void test('the league wire reports only settled facts and skips missing scores', () => {
  const items = getLeagueWire(week());
  assert.deepEqual(items, [
    { label: 'Week 2 high', text: 'Alan FC 128.48' },
    { label: 'Week 2 low', text: 'Hugo FC 93.42' },
    { label: 'Closest call', text: 'David FC by 0.30 over Emmet FC' },
    { label: 'Biggest win', text: 'Alan FC by 35.06 over Hugo FC' },
    { label: 'Top starter', text: 'Lamb 31.20 for Alan FC' },
    { label: 'Unbeaten', text: 'David FC' },
    { label: 'Still winless', text: 'Emmet FC' },
  ]);
  // Niall's 140 is excluded because his opponent has no score.
  assert.ok(!items.some((item) => item.text.includes('Niall')));
});

void test('the league wire stays silent until the week is settled', () => {
  assert.deepEqual(getLeagueWire(week({ finalized: false })), []);
  assert.deepEqual(getLeagueWire(week({ matchups: [] })), []);
});

void test('a tied matchup never becomes a closest call or biggest win', () => {
  const tied = week({
    matchups: [
      {
        databaseId: 1,
        sleeperMatchupId: 1,
        home: team(1, 'Alan', 100, [1, 0]),
        away: team(2, 'Hugo', 100, [0, 1]),
      },
    ],
  });
  const labels = getLeagueWire(tied).map((item) => item.label);
  assert.ok(!labels.includes('Closest call'));
  assert.ok(!labels.includes('Biggest win'));
});

const flag = {
  leagueId: 'league',
  season: '2026',
  week: 2,
  rosterId: 4,
  manager: 'Emmet',
  call: 'Delay of game',
  text: 'Lost by 0.30 with a kicker on the bench.',
  penalty: '5 yards',
  publishedAt: '2026-09-22T10:00:00.000Z',
};
const published = Date.parse('2026-09-23T10:00:00.000Z');

void test('a flag appears only for its settled, published week', () => {
  assert.equal(getFlagOnThePlay(week(), [flag], published), flag);
  assert.equal(
    getFlagOnThePlay(week({ finalized: false }), [flag], published),
    null,
  );
  assert.equal(getFlagOnThePlay(week({ week: 3 }), [flag], published), null);
  assert.equal(
    getFlagOnThePlay(week({ season: '2025' }), [flag], published),
    null,
  );
  assert.equal(
    getFlagOnThePlay(week(), [flag], Date.parse(flag.publishedAt) - 1),
    null,
  );
});

void test('duplicate flags for one week are treated as ambiguous', () => {
  assert.equal(getFlagOnThePlay(week(), [flag, { ...flag }], published), null);
});

void test('the two-minute warning covers only the final two hours before lock', () => {
  const lockAt = '2026-09-27T17:00:00.000Z';
  const lock = Date.parse(lockAt);
  assert.equal(
    isTwoMinuteWarning(lockAt, lock - TWO_MINUTE_WARNING_MS - 1),
    false,
  );
  assert.equal(isTwoMinuteWarning(lockAt, lock - TWO_MINUTE_WARNING_MS), true);
  assert.equal(isTwoMinuteWarning(lockAt, lock - 1), true);
  assert.equal(isTwoMinuteWarning(lockAt, lock), false);
  assert.equal(isTwoMinuteWarning('not a date', lock), false);
});

void test('remaining time never goes negative', () => {
  assert.deepEqual(getRemaining(1_000, 5_000), {
    days: 0,
    hours: 0,
    minutes: 0,
  });
  assert.deepEqual(getRemaining(90_061_000, 0), {
    days: 1,
    hours: 1,
    minutes: 1,
  });
});
