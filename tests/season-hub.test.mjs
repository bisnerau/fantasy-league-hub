import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getSeasonHubData } from '../lib/data/season-hub.ts';
const league = {
  season: '2026',
  total_rosters: 12,
  status: 'in_season',
  settings: {
    playoff_week_start: 15,
    playoff_teams: 6,
    league_average_match: 0,
  },
};
const weekRows = (week) =>
  Array.from({ length: 12 }, (_, i) => ({
    roster_id: i + 1,
    matchup_id: Math.floor(i / 2) + 1,
    points: week > 7 ? 2000 - i : 120 - i * 5,
    players: [],
    starters: [],
    players_points: {},
  }));
void test('season hub reads historical Week 7 rather than current standings and never writes', async () => {
  const original = globalThis.fetch,
    now = Date.now;
  const paths = [];
  Date.now = () => new Date('2026-11-05T12:00:00Z').getTime();
  globalThis.fetch = async (url, options) => {
    assert.ok(!options?.method || options.method === 'GET');
    const path = new URL(url).pathname;
    paths.push(path);
    const data = path.endsWith('/state/nfl')
      ? { season: '2026', season_type: 'regular', week: 9 }
      : path.includes('/transactions/')
        ? []
        : path.includes('/matchups/')
          ? weekRows(Number(path.split('/').at(-1)))
          : league;
    return new Response(JSON.stringify(data));
  };
  try {
    const data = await getSeasonHubData({ includeActivity: true });
    assert.equal(data.half.length, 12);
    assert.ok(!('transactions' in data.activity));
    assert.ok(!('players_points' in data.activity.weeks[0].rows[0]));
    assert.equal(data.half[0].points, 840);
    assert.equal(data.awards.length, 8);
    assert.equal(data.final, null);
    assert.equal(data.receipts.length, 0);
    assert.ok(!paths.some((p) => p.includes('supabase')));
  } finally {
    globalThis.fetch = original;
    Date.now = now;
  }
});
void test('incomplete historical results do not fabricate a halfway review or an award', async () => {
  const original = globalThis.fetch,
    now = Date.now;
  Date.now = () => new Date('2026-11-05T12:00:00Z').getTime();
  globalThis.fetch = async (url) => {
    const path = new URL(url).pathname;
    if (path.endsWith('/matchups/7'))
      return new Response('{}', { status: 503 });
    return new Response(
      JSON.stringify(
        path.endsWith('/state/nfl')
          ? { season: '2026', season_type: 'regular', week: 9 }
          : path.includes('/transactions/')
            ? []
            : path.includes('/matchups/')
              ? weekRows(1)
              : league,
      ),
    );
  };
  try {
    const data = await getSeasonHubData();
    assert.equal(data.half, null);
    assert.equal(data.awards.find((w) => w.week === 7).result, null);
    assert.ok(data.awards.find((w) => w.week === 6).result);
  } finally {
    globalThis.fetch = original;
    Date.now = now;
  }
});

void test('postseason state still loads the full 2026 transaction archive', async () => {
  const original = globalThis.fetch,
    now = Date.now;
  const paths = [];
  Date.now = () => new Date('2027-02-01T12:00:00Z').getTime();
  globalThis.fetch = async (url) => {
    const path = new URL(url).pathname;
    paths.push(path);
    return new Response(
      JSON.stringify(
        path.endsWith('/state/nfl')
          ? { season: '2026', season_type: 'post', week: 1 }
          : path.includes('/transactions/')
            ? []
            : path.includes('/matchups/')
              ? weekRows(1)
              : league,
      ),
    );
  };
  try {
    const data = await getSeasonHubData();
    assert.equal(data.completedWeeks.length, 17);
    assert.ok(paths.some((p) => p.endsWith('/transactions/17')));
  } finally {
    globalThis.fetch = original;
    Date.now = now;
  }
});
