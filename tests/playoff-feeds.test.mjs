import test from 'node:test';
import assert from 'node:assert/strict';
import { refreshCompletedGames } from '../lib/playoffs/feeds.ts';
import { simulate } from '../lib/playoffs/model.ts';
const saved = {
  version: 'test',
  leagueId: 'fixture-league',
  season: 2026,
  asOf: '2026-11-19T10:00:00Z',
  sourceCutoff: '2026-11-19T10:00:00Z',
  completedThrough: 0,
  regularSeasonWeeks: 1,
  playoffTeams: 1,
  slots: ['QB'],
  returns: [],
  calibration: { teamVarianceScale: 1 },
  teams: [1, 2].map((id) => ({
    id,
    name: `Team ${id}`,
    manager: `Manager ${id}`,
    wins: 0,
    losses: 0,
    ties: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    rank: id,
  })),
  fixtures: [{ key: '1:1', week: 1, matchupId: 1, home: 1, away: 2 }],
  lineups: [1, 2].map((id) => ({
    rosterId: id,
    week: 1,
    starterIds: [`${id}`],
    locked: [],
    notes: [],
    players: [
      {
        id: `${id}`,
        name: `Player ${id}`,
        position: 'QB',
        team: 'X',
        mean: 10,
        variance: 25,
        available: true,
        gameId: `${id}`,
        kickoff: '2026-01-01T18:00:00Z',
        state: 'pre',
        actual: null,
      },
    ],
  })),
};
const original = globalThis.fetch;
void test('read-only completion refresh banks only confirmed final points and preserves saved snapshot', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, method: options?.method ?? 'GET' });
    return Response.json(
      (url instanceof Request ? url.url : url.toString()).includes('espn.com')
        ? {
            events: [
              { id: '1', status: { type: { state: 'post', completed: true } } },
              { id: '2', status: { type: { state: 'in', completed: false } } },
            ],
          }
        : [
            { roster_id: 1, starters: ['1'], players_points: { 1: 0 } },
            { roster_id: 2, starters: ['2'], players_points: { 2: 99 } },
          ],
    );
  };
  try {
    const input = await refreshCompletedGames(saved);
    assert.equal(input.lineups[0].players[0].actual, 0);
    assert.equal(input.lineups[1].players[0].actual, null);
    assert.equal(input.lineups[1].players[0].mean, 10);
    assert.equal(saved.lineups[0].players[0].state, 'pre');
    assert.ok(calls.every((c) => c.method === 'GET'));
    assert.ok(simulate(input).teams[1].playoff > 0.95);
  } finally {
    globalThis.fetch = original;
  }
});
void test('failed or incomplete completion feeds reject refresh instead of inventing final scores', async () => {
  try {
    globalThis.fetch = async () => new Response('Unavailable', { status: 503 });
    await assert.rejects(refreshCompletedGames(saved), /source unavailable/);
    globalThis.fetch = async (url) =>
      Response.json(
        (url instanceof Request ? url.url : url.toString()).includes('espn.com')
          ? {
              events: [
                {
                  id: '1',
                  status: { type: { state: 'post', completed: true } },
                },
              ],
            }
          : [{ roster_id: 1, starters: ['1'], players_points: {} }],
      );
    await assert.rejects(
      refreshCompletedGames(saved),
      /Missing final score|Missing NFL game status/,
    );
  } finally {
    globalThis.fetch = original;
  }
});
void test('public forecast reads cannot publish and retain valid snapshot when NFL status fails', async () => {
  process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID = 'fixture-league';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fixture.invalid';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'fixture-key';
  const snapshot = { id: 'fixture', input: saved, result: simulate(saved) },
    calls = [];
  // Existing daily snapshots remain immutable; their inputs can supply the new bye odds.
  const expected = structuredClone(snapshot.result);
  snapshot.result.teams.forEach((t) => delete t.bye);
  snapshot.result.fixtures.forEach((f) =>
    f.effects.forEach((e) => {
      if (e.homeWin) delete e.homeWin.bye;
      if (e.awayWin) delete e.awayWin.bye;
    }),
  );
  globalThis.fetch = async (url, options) => {
    calls.push(options?.method ?? 'GET');
    return (url instanceof Request ? url.url : url.toString()).includes(
      'fixture.invalid',
    )
      ? Response.json([snapshot])
      : new Response('unavailable', { status: 503 });
  };
  try {
    const { getPlayoffForecast } =
      await import('../lib/data/playoff-chances.ts');
    const response = await getPlayoffForecast();
    assert.equal(response.snapshot.id, 'fixture');
    assert.equal(response.stale, true);
    assert.match(response.notice, /last valid forecast/);
    assert.deepEqual(response.snapshot.result, expected);
    assert.ok(snapshot.result.teams.every((t) => !('bye' in t)));
    assert.ok(calls.every((m) => m === 'GET'));
  } finally {
    globalThis.fetch = original;
  }
});
