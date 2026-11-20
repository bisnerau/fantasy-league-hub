import { getSupabaseReadClient } from '@/lib/supabase/read';
import { leagueConfig } from '@/lib/config/league.config';
import { refreshCompletedGames } from '@/lib/playoffs/feeds';
import { simulate } from '@/lib/playoffs/model';
import { validateInput, validateResult } from '@/lib/playoffs/validation';
import type { ForecastResponse, ForecastSnapshot } from '@/lib/playoffs/types';
let cached: { expires: number; response: ForecastResponse } | null = null;
let pending: Promise<ForecastResponse> | null = null;
export async function getPlayoffForecast(): Promise<ForecastResponse> {
  if (cached && cached.expires > Date.now()) return cached.response;
  if (pending) return pending;
  pending = readForecast().finally(() => {
    pending = null;
  });
  return pending;
}
async function readForecast(): Promise<ForecastResponse> {
  let snapshot: ForecastSnapshot | null = cached?.response.snapshot ?? null,
    previous = cached?.response.previous ?? null;
  try {
    const client = getSupabaseReadClient();
    if (!client) throw Error('Forecast storage is unavailable');
    const { data, error } = await client
      .from('playoff_snapshots')
      .select('id,input,result,forecast_date')
      .eq('league_id', leagueConfig.sleeperLeagueId)
      .order('created_at', { ascending: false })
      .limit(2);
    if (error || !data?.length)
      throw Error('No published forecast is available yet');
    const candidate = data[0] as ForecastSnapshot;
    validateInput(candidate.input);
    validateResult(candidate.input, candidate.result);
    snapshot =
      snapshot?.id === candidate.id &&
      Date.parse(snapshot.input.sourceCutoff) >
        Date.parse(candidate.input.sourceCutoff)
        ? snapshot
        : candidate;
    previous = (data[1] as ForecastSnapshot | undefined)?.result ?? null;
    const input = await refreshCompletedGames(snapshot.input);
    if (input !== snapshot.input) {
      const result = simulate(input);
      validateResult(input, result);
      snapshot = { ...snapshot, input, result };
    }
    const stale = Date.now() - Date.parse(snapshot.input.asOf) > 36 * 3600_000;
    const response = {
      snapshot,
      previous,
      stale,
      notice: stale
        ? 'The daily forecast is overdue. Showing the last valid inputs.'
        : null,
    };
    cached = { expires: Date.now() + 300_000, response };
    return response;
  } catch (error) {
    const response: ForecastResponse = {
      snapshot,
      previous,
      stale: true,
      notice: snapshot
        ? 'A source could not be verified. Showing the last valid forecast.'
        : 'Playoff Chances is temporarily unavailable. A complete, verified forecast has not been published.',
    };
    console.error(
      'Playoff forecast read:',
      error instanceof Error ? error.message : 'unknown error',
    );
    cached = { expires: Date.now() + 300_000, response };
    return response;
  }
}
