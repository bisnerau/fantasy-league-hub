import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';

process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID = 'schedule-fixture';
const { getDashboardData } = await import('../lib/data/dashboard.ts');

let requestedWeeks;
let nflWeek;
let playoffStart;
let status;
let unavailableWeek;
beforeEach(() => {
  requestedWeeks = [];
  nflWeek = 3;
  playoffStart = 15;
  status = 'in_season';
  unavailableWeek = null;
  mock.method(globalThis, 'fetch', async (input, options) => {
    const url = new URL(input);
    assert.equal(url.hostname, 'api.sleeper.app');
    assert.ok(!options.method || options.method === 'GET');
    let data;
    if (url.pathname === '/v1/state/nfl') {
      data = { season: '2026', season_type: 'regular', week: nflWeek };
    } else if (url.pathname.endsWith('/rosters')) {
      data = [1, 2].map((id) => ({
        roster_id: id,
        owner_id: `owner-${id}`,
        settings: { wins: 1, losses: 1, ties: 0, fpts: 210 },
      }));
    } else if (url.pathname.endsWith('/users')) {
      data = [1, 2].map((id) => ({
        user_id: `owner-${id}`,
        display_name: `Team ${id}`,
      }));
    } else if (url.pathname.endsWith('/drafts')) {
      data = [];
    } else if (url.pathname.includes('/matchups/')) {
      const week = Number(url.pathname.split('/').at(-1));
      requestedWeeks.push(week);
      if (week === unavailableWeek) return new Response('{}', { status: 503 });
      data = [1, 2].map((id) => ({
        roster_id: id,
        matchup_id: 1,
        points: id === week ? 110 : 100,
      }));
    } else {
      assert.equal(url.pathname, '/v1/league/schedule-fixture');
      data = {
        name: 'Schedule fixture',
        season: '2026',
        status,
        previous_league_id: null,
        settings: { playoff_week_start: playoffStart, last_scored_leg: 18 },
      };
    }
    return new Response(JSON.stringify(data), { status: 200 });
  });
});
afterEach(() => mock.restoreAll());

void test('dashboard matrix uses completed weeks and shares existing matchup reads', async () => {
  const data = await getDashboardData();
  assert.equal(data.scheduleMatrix.throughWeek, 2);
  assert.deepEqual(requestedWeeks, [1, 2]);
  assert.deepEqual(data.scheduleMatrix.rows[0].records[0], {
    scheduleRosterId: 1,
    wins: 1,
    losses: 1,
    ties: 0,
  });
});

void test('dashboard excludes playoff weeks from the schedule matrix, including after season completion', async () => {
  nflWeek = 4;
  playoffStart = 3;
  assert.equal((await getDashboardData()).scheduleMatrix.throughWeek, 2);
  assert.deepEqual(requestedWeeks, [1, 2]);
  requestedWeeks = [];
  status = 'complete';
  assert.equal((await getDashboardData()).scheduleMatrix.throughWeek, 2);
  assert.deepEqual(requestedWeeks, [1, 2]);
});

void test('missing history hides the matrix without discarding the standings', async () => {
  unavailableWeek = 1;
  const data = await getDashboardData();
  assert.equal(data.mode, 'live');
  assert.equal(data.standings.length, 2);
  assert.equal(data.scheduleMatrix, null);
  assert.equal(data.weeklyHistoryAvailable, false);
});
