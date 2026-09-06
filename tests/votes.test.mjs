import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { createClient } from '@supabase/supabase-js';
import { persistPick } from '../lib/predictions/votes.ts';

const vote = {
  matchup_id: 1,
  voter_id: 'fixture-member',
  selected_roster_id: 2,
};
function fixture(fetch) {
  return createClient('https://fixture.invalid', 'fixture-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch },
  });
}
afterEach(() => mock.restoreAll());

void test('a saved pick is confirmed from the exact database response and persists on re-read', async () => {
  let row = null;
  const client = fixture(async (input, options) => {
    assert.match(
      String(input),
      /^https:\/\/fixture\.invalid\/rest\/v1\/prediction_votes/,
    );
    if (options.method === 'POST') row = JSON.parse(options.body);
    return Response.json(row);
  });
  assert.deepEqual((await persistPick(client, vote)).saved, vote);
  const reread = await client
    .from('prediction_votes')
    .select('*')
    .eq('matchup_id', 1)
    .single();
  assert.deepEqual(reread.data, vote);
  const changed = { ...vote, selected_roster_id: 1 };
  assert.deepEqual((await persistPick(client, changed)).saved, changed);
  assert.deepEqual(row, changed);
});
void test('a successful HTTP status with an incorrect or absent row is not a saved pick', async () => {
  for (const row of [
    null,
    { ...vote, voter_id: 'someone-else' },
    { ...vote, selected_roster_id: 1 },
  ]) {
    assert.equal(
      (
        await persistPick(
          fixture(async () => Response.json(row)),
          vote,
        )
      ).saved,
      null,
    );
  }
});
void test('the server-enforced deadline is reported as a rejected change', async () => {
  const client = fixture(async () =>
    Response.json(
      { message: 'Predictions are locked for this week' },
      { status: 400 },
    ),
  );
  assert.deepEqual(await persistPick(client, vote), {
    saved: null,
    locked: true,
  });
});
void test('network failures cannot be reported as saved picks', async () => {
  const client = fixture(async () => {
    throw new TypeError('Failed to fetch');
  });
  assert.equal((await persistPick(client, vote)).saved, null);
});
