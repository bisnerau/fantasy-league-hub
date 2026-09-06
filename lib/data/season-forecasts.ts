import { leagueConfig } from '@/lib/config/league.config';
import { predictionInternals } from '@/lib/data/predictions';
import { getSupabaseReadClient } from '@/lib/supabase/read';

export type SeasonForecastSettings = {
  leagueId: string;
  season: number;
  lockAt: string;
  locked: boolean;
  databaseReady: boolean;
};

export async function getSeasonForecastSettings(
  season: number,
  teamCount: number,
): Promise<SeasonForecastSettings> {
  const leagueId = leagueConfig.sleeperLeagueId;
  const lockAt = predictionInternals.sundayKickoffForWeek(season, 1);
  const client = getSupabaseReadClient();

  if (!leagueId || !client || teamCount < 2) {
    return {
      leagueId,
      season,
      lockAt: lockAt.toISOString(),
      locked: Date.now() >= lockAt.getTime(),
      databaseReady: false,
    };
  }

  const { data, error } = await client
    .from('season_forecast_windows')
    .select('locks_at, team_count')
    .eq('league_id', leagueId)
    .eq('season', season)
    .maybeSingle();

  return {
    leagueId,
    season,
    lockAt: lockAt.toISOString(),
    locked: Date.now() >= lockAt.getTime(),
    databaseReady:
      !error &&
      data?.team_count === teamCount &&
      new Date(data.locks_at).getTime() === lockAt.getTime(),
  };
}
