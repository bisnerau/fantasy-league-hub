import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';

process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID = 'fixture-league';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fixture.invalid';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'fixture-public-key';
process.env.SUPABASE_SECRET_KEY = '';

const { getSeasonForecastSettings } =
  await import('../lib/data/season-forecasts.ts');
afterEach(() => mock.restoreAll());

void test('forecast pages read the seeded window without a server secret or writes', async () => {
  mock.method(globalThis, 'fetch', async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.hostname, 'fixture.invalid');
    assert.equal(init.method, 'GET');
    assert.equal(url.searchParams.get('league_id'), 'eq.fixture-league');
    return new Response(
      JSON.stringify({ locks_at: '2026-09-13T17:00:00+00:00', team_count: 12 }),
      {
        headers: { 'content-type': 'application/json' },
      },
    );
  });
  const result = await getSeasonForecastSettings(2026, 12);
  assert.equal(result.databaseReady, true);
  assert.equal(result.lockAt, '2026-09-13T17:00:00.000Z');
});

void test('missing or mismatched forecast windows fail closed', async () => {
  for (const data of [
    null,
    { locks_at: '2026-09-06T17:00:00Z', team_count: 12 },
    { locks_at: '2026-09-13T17:00:00Z', team_count: 10 },
  ]) {
    mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response(JSON.stringify(data), {
          headers: { 'content-type': 'application/json' },
        }),
    );
    assert.equal(
      (await getSeasonForecastSettings(2026, 12)).databaseReady,
      false,
    );
    mock.restoreAll();
  }
});
