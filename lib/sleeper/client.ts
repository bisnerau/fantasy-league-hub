import type {
  SleeperBracketMatch,
  SleeperDraft,
  SleeperDraftPick,
  SleeperLeague,
  SleeperMatchup,
  SleeperNFLState,
  SleeperPlayer,
  SleeperRoster,
  SleeperTransaction,
  SleeperTrendingPlayer,
  SleeperUser,
} from './types';

const API_ROOT = 'https://api.sleeper.app/v1';

class SleeperAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'SleeperAPIError';
  }
}

async function sleeperFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new SleeperAPIError(
      `Sleeper request failed: ${path}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

export const getLeague = (leagueId: string) =>
  sleeperFetch<SleeperLeague>(`/league/${leagueId}`, 3600);

export const getLeagueUsers = (leagueId: string) =>
  sleeperFetch<SleeperUser[]>(`/league/${leagueId}/users`, 3600);

export const getLeagueRosters = (leagueId: string) =>
  sleeperFetch<SleeperRoster[]>(`/league/${leagueId}/rosters`, 900);

export const getMatchups = (leagueId: string, week: number) =>
  sleeperFetch<SleeperMatchup[]>(`/league/${leagueId}/matchups/${week}`, 300);

export const getNFLState = () =>
  sleeperFetch<SleeperNFLState>('/state/nfl', 3600);

export const getTransactions = (leagueId: string, round: number) =>
  sleeperFetch<SleeperTransaction[]>(
    `/league/${leagueId}/transactions/${round}`,
    900,
  );

export const getDrafts = (leagueId: string) =>
  sleeperFetch<SleeperDraft[]>(`/league/${leagueId}/drafts`, 86400);

export const getDraftPicks = (draftId: string) =>
  sleeperFetch<SleeperDraftPick[]>(`/draft/${draftId}/picks`, 86400);

export const getDraftTradedPicks = (draftId: string) =>
  sleeperFetch<Array<Record<string, unknown>>>(
    `/draft/${draftId}/traded_picks`,
    86400,
  );

export const getWinnersBracket = (leagueId: string) =>
  sleeperFetch<SleeperBracketMatch[]>(
    `/league/${leagueId}/winners_bracket`,
    3600,
  );

export const getLosersBracket = (leagueId: string) =>
  sleeperFetch<SleeperBracketMatch[]>(
    `/league/${leagueId}/losers_bracket`,
    3600,
  );

export const getLeagueTradedPicks = (leagueId: string) =>
  sleeperFetch<Array<Record<string, unknown>>>(
    `/league/${leagueId}/traded_picks`,
    3600,
  );

export const getPlayers = () =>
  sleeperFetch<Record<string, SleeperPlayer>>('/players/nfl', 86400);

export const getTrendingPlayers = (type: 'add' | 'drop', limit = 25) =>
  sleeperFetch<SleeperTrendingPlayer[]>(
    `/players/nfl/trending/${type}?lookback_hours=24&limit=${limit}`,
    900,
  );

export { SleeperAPIError };
