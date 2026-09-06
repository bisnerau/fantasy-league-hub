import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';

// Explicit dummy credentials. Never read .env.local or call a production service.
process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID = 'fixture-league';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fixture.invalid';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'fixture-public-key';
process.env.SUPABASE_SECRET_KEY = 'fixture-server-key';
process.env.CRON_SECRET = 'fixture-cron-key';

const {
  getPredictionWeekData,
  syncPredictionWeeksForCron,
  predictionInternals,
} = await import('../lib/data/predictions.ts');
const { getDashboardData } = await import('../lib/data/dashboard.ts');
const { GET } = await import('../app/api/cron/predictions/route.ts');

const league = {
  league_id: 'fixture-league',
  name: 'MAC 12 fixture',
  season: '2026',
  status: 'in_season',
  total_rosters: 2,
  previous_league_id: null,
  roster_positions: ['QB', 'BN'],
  settings: { playoff_week_start: 15 },
  scoring_settings: { rec: 1 },
};
const roster = (id) => ({
  roster_id: id,
  owner_id: `user-${id}`,
  players: [`player-${id}`],
  starters: [`player-${id}`],
  settings: {
    wins: 0,
    losses: 0,
    ties: 0,
    fpts: id === 1 ? 1795 : 1200,
    fpts_decimal: 8,
  },
});
const users = [1, 2].map((id) => ({
  user_id: `user-${id}`,
  display_name: `Manager ${id}`,
  avatar: null,
}));
let state;
let entries;
let weeks;
let matchups;
let writes;
let fail;

function response(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
function matches(row, url) {
  return [...url.searchParams.entries()].every(([key, value]) => {
    if (value.startsWith('eq.')) return String(row[key]) === value.slice(3);
    if (value.startsWith('neq.')) return String(row[key]) !== value.slice(4);
    return true;
  });
}

function seedWeek(week, status = 'locked') {
  const locks = predictionInternals
    .sundayKickoffForWeek(2026, week)
    .toISOString();
  weeks.push({
    id: week,
    league_id: league.league_id,
    season: 2026,
    week,
    locks_at: locks,
  });
  matchups.push({
    id: week,
    prediction_week_id: week,
    sleeper_matchup_id: 1,
    home_roster_id: 1,
    away_roster_id: 2,
    home_projected: 110,
    away_projected: 90,
    home_final: status === 'final' ? 110 : null,
    away_final: status === 'final' ? 90 : null,
    winner_roster_id: status === 'final' ? 1 : null,
    status,
  });
}

beforeEach(() => {
  state = { season: '2026', week: 2, season_type: 'regular' };
  entries = [1, 2].map((id) => ({
    roster_id: id,
    matchup_id: 1,
    points: id === 1 ? 110 : 90,
    starters: [`player-${id}`],
    players: [`player-${id}`],
  }));
  weeks = [];
  matchups = [];
  writes = [];
  fail = null;
  mock.method(Date, 'now', () => Date.parse('2026-09-16T10:00:00Z'));
  mock.method(globalThis, 'fetch', async (input, options = {}) => {
    const url = new URL(
      typeof input === 'string' ? input : (input.url ?? input.href),
    );
    const method = options.method ?? 'GET';
    if (url.hostname === 'api.sleeper.app') {
      if (fail === 'sleeper') return response({ error: 'fixture outage' }, 503);
      if (url.pathname === '/v1/state/nfl') return response(state);
      if (url.pathname.endsWith('/users')) return response(users);
      if (url.pathname.endsWith('/rosters'))
        return response([roster(1), roster(2)]);
      if (url.pathname.includes('/matchups/')) return response(entries);
      if (url.pathname.endsWith('/drafts'))
        return fail === 'drafts' ? response({}, 503) : response([]);
      if (url.pathname === '/v1/league/fixture-league') return response(league);
      if (url.pathname === '/v1/players/nfl') return response({});
      if (url.pathname.startsWith('/projections/')) return response([]);
      throw new Error(`Unmocked Sleeper endpoint: ${url.pathname}`);
    }
    assert.equal(
      url.hostname,
      'fixture.invalid',
      'No external network access is allowed in regression tests',
    );
    const isWeek = url.pathname === '/rest/v1/prediction_weeks';
    assert.ok(
      isWeek || url.pathname === '/rest/v1/prediction_matchups',
      'Sync must never write member votes or profiles',
    );
    const table = isWeek ? weeks : matchups;
    if (method === 'POST') {
      const payload = JSON.parse(options.body);
      for (const value of Array.isArray(payload) ? payload : [payload]) {
        const exists = table.some((row) =>
          isWeek
            ? row.week === value.week &&
              row.season === value.season &&
              row.league_id === value.league_id
            : row.prediction_week_id === value.prediction_week_id &&
              row.sleeper_matchup_id === value.sleeper_matchup_id,
        );
        if (!exists) {
          const row = {
            id: isWeek ? value.week : value.prediction_week_id,
            home_final: null,
            away_final: null,
            winner_roster_id: null,
            ...value,
          };
          table.push(row);
        }
      }
      writes.push({ method, table: url.pathname });
      // Simulate an idempotent conflict, forcing the production read-back branch.
      return response([]);
    }
    let selected = table.filter((row) => matches(row, url));
    if (method === 'PATCH') {
      writes.push({ method, table: url.pathname });
      if (fail === 'write')
        return response({ message: 'fixture write failure' }, 503);
      if (fail !== 'silent-write')
        selected.forEach((row) => Object.assign(row, JSON.parse(options.body)));
    }
    if (fail === 'read' && method === 'GET')
      return response({ message: 'fixture read failure' }, 503);
    if (
      isWeek &&
      url.searchParams.get('select')?.includes('prediction_matchups')
    )
      selected = selected.map((row) => ({
        ...row,
        prediction_matchups: matchups
          .filter((matchup) => matchup.prediction_week_id === row.id)
          .map((matchup) => ({ status: matchup.status })),
      }));
    const headers = new Headers(options.headers);
    return headers.get('accept') === 'application/vnd.pgrst.object+json'
      ? response(selected[0] ?? null)
      : response(selected);
  });
});
afterEach(() => mock.restoreAll());

void test('page rendering is read-only and does not mark timed-out matchups final', async () => {
  seedWeek(1);
  const data = await getPredictionWeekData(1);
  assert.equal(data.databaseReady, true);
  assert.equal(data.finalized, false);
  assert.equal(data.matchups[0].home.projectedScore, null);
  assert.deepEqual(writes, []);
});
void test('new ballots are prepared only by the scheduled sync, not a page request', async () => {
  const page = await getPredictionWeekData(1);
  assert.equal(page.databaseReady, false);
  assert.deepEqual(writes, []);
  const result = await syncPredictionWeeksForCron();
  assert.equal(result[0].ok, true);
  assert.equal(weeks.length, 1);
  assert.equal(matchups.length, 1);
});
void test('Wednesday sync grades a previous week and never writes votes', async () => {
  seedWeek(1);
  const results = await syncPredictionWeeksForCron();
  assert.equal(results.find((row) => row.week === 1).finalized, true);
  assert.equal(
    matchups.find((row) => row.prediction_week_id === 1).winner_roster_id,
    1,
  );
  assert.ok(results.every((row) => row.ok));
});
void test('failed result writes remain unresolved and are retried successfully', async () => {
  seedWeek(1);
  fail = 'write';
  const first = await syncPredictionWeeksForCron();
  assert.equal(first.find((row) => row.week === 1).ok, false);
  assert.equal(matchups[0].status, 'locked');
  fail = null;
  const retry = await syncPredictionWeeksForCron();
  assert.equal(retry.find((row) => row.week === 1).finalized, true);
  assert.equal(
    matchups.filter((row) => row.prediction_week_id === 1).length,
    1,
  );
});
void test('silent write failures cannot produce a successful grading response', async () => {
  seedWeek(1);
  fail = 'silent-write';
  assert.equal(
    (await syncPredictionWeeksForCron()).find((row) => row.week === 1).ok,
    false,
  );
});
void test('backlog scan retries weeks older than the immediately preceding week', async () => {
  state.week = 5;
  mock.method(Date, 'now', () => Date.parse('2026-10-07T10:00:00Z'));
  seedWeek(1);
  seedWeek(2);
  seedWeek(3, 'final');
  const results = await syncPredictionWeeksForCron();
  assert.deepEqual(
    results.map((row) => row.week),
    [1, 2, 5],
  );
  assert.equal(results[0].finalized, true);
  assert.equal(results[1].finalized, true);
});
void test('missing score data never becomes a zero-point result', async () => {
  seedWeek(1);
  delete entries[0].points;
  const result = (await syncPredictionWeeksForCron()).find(
    (row) => row.week === 1,
  );
  assert.equal(result.finalized, false);
  assert.equal(result.ok, false);
  assert.equal(matchups[0].home_final, null);
});
void test('a missing matchup row cannot finalize an incomplete week', async () => {
  seedWeek(1);
  entries.pop();
  const result = (await syncPredictionWeeksForCron()).find(
    (row) => row.week === 1,
  );
  assert.equal(result.ok, false);
  assert.equal(result.finalized, false);
});
void test('ties settle without awarding a winner', async () => {
  seedWeek(1);
  entries[1].custom_points = 110;
  assert.equal(
    (await syncPredictionWeeksForCron()).find((row) => row.week === 1)
      .finalized,
    true,
  );
  assert.equal(matchups[0].winner_roster_id, null);
});
void test('concurrent cron runs are idempotent', async () => {
  seedWeek(1);
  const runs = await Promise.all([
    syncPredictionWeeksForCron(),
    syncPredictionWeeksForCron(),
  ]);
  assert.ok(runs.flat().every((row) => row.ok));
  assert.equal(
    matchups.filter((row) => row.prediction_week_id === 1).length,
    1,
  );
});
void test('the page uses confirmed stored final scores, not a later partial response', async () => {
  seedWeek(1, 'final');
  entries[0].points = 0;
  const data = await getPredictionWeekData(1);
  assert.equal(data.finalized, true);
  assert.equal(data.matchups[0].home.actualScore, 110);
  assert.deepEqual(writes, []);
});
void test('database read errors disable saving with an honest unavailable state', async () => {
  seedWeek(1);
  fail = 'read';
  const data = await getPredictionWeekData(1);
  assert.equal(data.availability, 'unavailable');
  assert.equal(data.databaseReady, false);
});
void test('dashboard outages never substitute fictional teams', async () => {
  fail = 'sleeper';
  const dashboard = await getDashboardData();
  assert.equal(dashboard.mode, 'unavailable');
  assert.deepEqual(dashboard.standings, []);
});
void test('optional draft feed failure does not discard real standings', async () => {
  fail = 'drafts';
  const dashboard = await getDashboardData();
  assert.equal(dashboard.mode, 'live');
  assert.equal(dashboard.standings[0].pointsFor, 1795.08);
  assert.equal(dashboard.standings[0].pointsAgainst, null);
});
void test('cron rejects unauthenticated requests without touching the database', async () => {
  const response = await GET(
    new Request('https://fixture.invalid/api/cron/predictions'),
  );
  assert.equal(response.status, 401);
  assert.deepEqual(writes, []);
});
void test('cron returns a retryable failure when the backing service is unavailable', async () => {
  fail = 'sleeper';
  const response = await GET(
    new Request('https://fixture.invalid/api/cron/predictions', {
      headers: { authorization: 'Bearer fixture-cron-key' },
    }),
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
