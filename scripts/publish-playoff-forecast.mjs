// node --env-file=.env.local --experimental-transform-types --import ./tests/register.mjs scripts/publish-playoff-forecast.mjs [--publish]
import { writeFileSync } from 'node:fs';
import { buildInput } from '../lib/playoffs/feeds.ts';
import { simulate } from '../lib/playoffs/model.ts';
import { validateResult } from '../lib/playoffs/validation.ts';
import { getSupabaseAdminClient } from '../lib/supabase/admin.ts';
const client = getSupabaseAdminClient();
const prior = client
  ? await client
      .from('playoff_snapshots')
      .select('input')
      .eq('league_id', process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID)
      .order('created_at', { ascending: false })
      .limit(1)
  : null;
const input = await buildInput(
    process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID,
    prior?.data?.[0]?.input,
  ),
  result = simulate(input);
validateResult(input, result);
writeFileSync(
  '/private/tmp/mac12-playoff-release.json',
  JSON.stringify({ input, result }, null, 2) + '\n',
);
if (process.argv.includes('--publish')) {
  if (!client) throw Error('Missing server credentials');
  const { data, error } = await client
    .from('playoff_snapshots')
    .upsert(
      {
        league_id: input.leagueId,
        season: input.season,
        forecast_date: input.asOf.slice(0, 10),
        model_version: input.version,
        input,
        result,
      },
      { onConflict: 'league_id,season,forecast_date', ignoreDuplicates: true },
    )
    .select('id,created_at');
  if (error) throw Error(error.message);
  console.log({ published: data });
} else
  console.log(
    'Validated preview written to /private/tmp/mac12-playoff-release.json; no database writes.',
  );
