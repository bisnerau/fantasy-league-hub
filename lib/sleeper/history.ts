import {
  getDraftPicks,
  getDrafts,
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getLosersBracket,
  getMatchups,
  getTransactions,
  getWinnersBracket,
} from './client';
import type {
  SleeperBracketMatch,
  SleeperDraft,
  SleeperDraftPick,
  SleeperLeague,
  SleeperMatchup,
  SleeperRoster,
  SleeperTransaction,
  SleeperUser,
} from './types';

export type SleeperSeasonArchive = {
  league: SleeperLeague;
  users: SleeperUser[];
  rosters: SleeperRoster[];
  matchups: Record<number, SleeperMatchup[]>;
  transactions: Record<number, SleeperTransaction[]>;
  drafts: Array<SleeperDraft & { picks: SleeperDraftPick[] }>;
  winnersBracket: SleeperBracketMatch[];
  losersBracket: SleeperBracketMatch[];
};

export async function crawlLeagueHistory(
  startingLeagueId: string,
  maxSeasons = 12,
): Promise<SleeperSeasonArchive[]> {
  const seasons: SleeperSeasonArchive[] = [];
  const seen = new Set<string>();
  let leagueId: string | null = startingLeagueId;

  while (leagueId && seasons.length < maxSeasons && !seen.has(leagueId)) {
    seen.add(leagueId);
    const seasonLeagueId = leagueId;
    const league: SleeperLeague = await getLeague(seasonLeagueId);
    const regularWeeks = league.settings.playoff_week_start
      ? Number(league.settings.playoff_week_start) - 1
      : 14;

    const [users, rosters, drafts, winnersBracket, losersBracket] =
      await Promise.all([
        getLeagueUsers(seasonLeagueId),
        getLeagueRosters(seasonLeagueId),
        getDrafts(seasonLeagueId),
        getWinnersBracket(seasonLeagueId).catch(() => []),
        getLosersBracket(seasonLeagueId).catch(() => []),
      ]);

    const weeks = Array.from({ length: Math.min(18, regularWeeks + 4) }, (_, i) => i + 1);
    const [weeklyMatchups, weeklyTransactions, draftsWithPicks] = await Promise.all([
      Promise.all(
        weeks.map(async (week) => [week, await getMatchups(seasonLeagueId, week)] as const),
      ),
      Promise.all(
        weeks.map(async (week) => [week, await getTransactions(seasonLeagueId, week)] as const),
      ),
      Promise.all(
        drafts.map(async (draft) => ({
          ...draft,
          picks: await getDraftPicks(draft.draft_id),
        })),
      ),
    ]);

    seasons.push({
      league,
      users,
      rosters,
      matchups: Object.fromEntries(weeklyMatchups),
      transactions: Object.fromEntries(weeklyTransactions),
      drafts: draftsWithPicks,
      winnersBracket,
      losersBracket,
    });

    leagueId = league.previous_league_id;
  }

  return seasons;
}
