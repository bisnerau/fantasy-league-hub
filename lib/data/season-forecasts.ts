import { leagueConfig } from '@/lib/config/league.config';
import { predictionInternals } from '@/lib/data/predictions';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

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
  const admin = getSupabaseAdminClient();

  if (!leagueId || !admin || teamCount < 2) {
    return {
      leagueId,
      season,
      lockAt: lockAt.toISOString(),
      locked: Date.now() >= lockAt.getTime(),
      databaseReady: false,
    };
  }

  const { error } = await admin.from('season_forecast_windows').upsert(
    {
      league_id: leagueId,
      season,
      locks_at: lockAt.toISOString(),
      team_count: teamCount,
    },
    { onConflict: 'league_id,season' },
  );

  return {
    leagueId,
    season,
    lockAt: lockAt.toISOString(),
    locked: Date.now() >= lockAt.getTime(),
    databaseReady: !error,
  };
}
