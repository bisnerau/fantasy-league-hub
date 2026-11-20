import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { leagueConfig } from '@/lib/config/league.config';
import { buildInput } from '@/lib/playoffs/feeds';
import { simulate } from '@/lib/playoffs/model';
import type { ForecastInput } from '@/lib/playoffs/types';
import { validateResult } from '@/lib/playoffs/validation';
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const client = getSupabaseAdminClient();
    if (!client) throw Error('Storage unavailable');
    const { data: prior, error: readError } = await client
      .from('playoff_snapshots')
      .select('input')
      .eq('league_id', leagueConfig.sleeperLeagueId)
      .order('created_at', { ascending: false })
      .limit(1);
    if (readError) throw readError;
    const input = await buildInput(
        leagueConfig.sleeperLeagueId,
        prior?.[0]?.input as ForecastInput | undefined,
      ),
      result = simulate(input);
    validateResult(input, result);
    const { error } = await client.from('playoff_snapshots').upsert(
      {
        league_id: input.leagueId,
        season: input.season,
        forecast_date: input.asOf.slice(0, 10),
        model_version: input.version,
        input,
        result,
      },
      {
        onConflict: 'league_id,season,forecast_date',
        ignoreDuplicates: true,
      },
    );
    if (error) throw error;
    return Response.json({ ok: true, asOf: input.asOf });
  } catch (error) {
    console.error(
      'Playoff refresh failed',
      error instanceof Error ? error.message : 'storage error',
    );
    return Response.json(
      { error: 'Refresh failed; previous snapshot retained' },
      { status: 503 },
    );
  }
}
