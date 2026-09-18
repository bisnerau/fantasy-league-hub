import type { PredictionWeekData } from './predictions';
import { scheduleSnapshot } from './schedule-snapshot';
import { getSupabaseReadClient } from '@/lib/supabase/read';

export type RivalryGame = {
  season: number;
  week: number;
  home: number;
  away: number;
  homePoints: number;
  awayPoints: number;
};

export function summarizeRivalry(
  games: RivalryGame[],
  home: number,
  away: number,
  before: { season: number; week: number },
) {
  const meetings = games
    .filter(
      (game) =>
        ((game.home === home && game.away === away) ||
          (game.home === away && game.away === home)) &&
        (game.season < before.season ||
          (game.season === before.season && game.week < before.week)) &&
        Number.isFinite(game.homePoints) &&
        Number.isFinite(game.awayPoints),
    )
    .map((game) => ({
      ...game,
      home,
      away,
      homePoints: game.home === home ? game.homePoints : game.awayPoints,
      awayPoints: game.home === home ? game.awayPoints : game.homePoints,
    }))
    .sort((a, b) => b.season - a.season || b.week - a.week);
  return {
    meetings: meetings.length,
    homeWins: meetings.filter((g) => g.homePoints > g.awayPoints).length,
    awayWins: meetings.filter((g) => g.homePoints < g.awayPoints).length,
    ties: meetings.filter((g) => g.homePoints === g.awayPoints).length,
    last: meetings[0] ?? null,
    biggest:
      [...meetings]
        .filter((g) => g.homePoints !== g.awayPoints)
        .sort(
          (a, b) =>
            Math.abs(b.homePoints - b.awayPoints) -
            Math.abs(a.homePoints - a.awayPoints),
        )[0] ?? null,
  };
}

export type Rivalry = ReturnType<typeof summarizeRivalry> & {
  scope: string;
  partial: boolean;
};

/** The snapshot maps owners to 2026 roster IDs: never reuse it for another league/season. */
export async function getWeeklyRivalries(
  data: PredictionWeekData,
): Promise<Record<number, Rivalry>> {
  if (
    data.leagueId !== scheduleSnapshot.leagueId ||
    Number(data.season) !== scheduleSnapshot.season ||
    !data.matchups.length
  )
    return {};
  const games: RivalryGame[] = scheduleSnapshot.history.map((g) => ({
    ...g,
    season: 2025,
  }));
  let partial = false;
  if (data.week > 1) {
    try {
      const client = getSupabaseReadClient();
      if (!client) throw new Error('History unavailable');
      const { data: weeks, error } = await client
        .from('prediction_weeks')
        .select(
          'week,prediction_matchups(status,home_roster_id,away_roster_id,home_final,away_final)',
        )
        .eq('league_id', data.leagueId)
        .eq('season', Number(data.season))
        .lt('week', data.week)
        .abortSignal(AbortSignal.timeout(5000));
      if (error || !weeks) throw new Error('History unavailable');
      partial = weeks.length !== data.week - 1;
      for (const week of weeks) {
        const matchups = week.prediction_matchups;
        if (!matchups.length || (week.week <= 14 && matchups.length !== 6))
          partial = true;
        for (const g of matchups) {
          if (
            g.status !== 'final' ||
            g.home_final == null ||
            g.away_final == null ||
            !Number.isFinite(Number(g.home_final)) ||
            !Number.isFinite(Number(g.away_final))
          ) {
            partial = true;
            continue;
          }
          games.push({
            season: Number(data.season),
            week: week.week,
            home: g.home_roster_id,
            away: g.away_roster_id,
            homePoints: Number(g.home_final),
            awayPoints: Number(g.away_final),
          });
        }
      }
    } catch {
      partial = true;
    }
  }
  return Object.fromEntries(
    data.matchups.map((m) => [
      m.sleeperMatchupId,
      {
        ...summarizeRivalry(games, m.home.rosterId, m.away.rosterId, {
          season: Number(data.season),
          week: data.week,
        }),
        scope:
          data.week > 1
            ? `2025 regular season + settled 2026 games before Week ${data.week}`
            : '2025 regular season',
        partial,
      },
    ]),
  );
}
