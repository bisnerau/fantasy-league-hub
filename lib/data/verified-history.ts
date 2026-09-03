import { leagueConfig } from '@/lib/config/league.config';
import {
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getWinnersBracket,
} from '@/lib/sleeper/client';
import type {
  SleeperBracketMatch,
  SleeperRoster,
  SleeperUser,
} from '@/lib/sleeper/types';
import { historicalSeasons, type HistoricalSeason } from './historical';

export const ownerFranchiseMap: Record<string, string> = {
  '718453786330365952': 'burns',
  '737758275193470976': 'red',
  '738061436835819520': 'mint',
  '739055047446568960': 'purple',
  '740276106103533568': 'salmon',
  '740323403877249024': 'navy',
  '740522659250663424': 'magenta',
  '985665799148875776': 'bright-yellow',
  '1004602947642167296': 'lime',
  '1135343784256192512': 'lavender',
  '1135900845381681152': 'yellow',
  '1135908140857552896': 'cyan',
};

function rosterPoints(roster: SleeperRoster) {
  return Number(`${roster.settings.fpts}.${roster.settings.fpts_decimal ?? 0}`);
}

function getPodium(bracket: SleeperBracketMatch[]) {
  const championship = bracket.find((match) => match.p === 1);
  const thirdPlace = bracket.find((match) => match.p === 3);
  return {
    champion: championship?.w ?? null,
    runnerUp: championship?.l ?? null,
    thirdPlace: thirdPlace?.w ?? null,
  };
}

function getTeamName(user: SleeperUser | undefined, roster: SleeperRoster) {
  return (
    roster.metadata?.team_name ??
    user?.metadata?.team_name?.trim() ??
    user?.display_name ??
    `Team ${roster.roster_id}`
  );
}

async function getSeasonSummary(
  leagueId: string,
): Promise<HistoricalSeason | null> {
  const league = await getLeague(leagueId);
  if (league.status !== 'complete') return null;
  const [users, rosters, bracket] = await Promise.all([
    getLeagueUsers(leagueId),
    getLeagueRosters(leagueId),
    getWinnersBracket(leagueId).catch(() => []),
  ]);
  const userById = new Map(users.map((user) => [user.user_id, user]));
  const podium = getPodium(bracket);
  const podiumFinish = new Map<number, number>([
    ...(podium.champion ? [[podium.champion, 1] as const] : []),
    ...(podium.runnerUp ? [[podium.runnerUp, 2] as const] : []),
    ...(podium.thirdPlace ? [[podium.thirdPlace, 3] as const] : []),
  ]);
  const ordered = [...rosters].sort((a, b) => {
    const aPodium = podiumFinish.get(a.roster_id);
    const bPodium = podiumFinish.get(b.roster_id);
    if (aPodium || bPodium) return (aPodium ?? 99) - (bPodium ?? 99);
    return (
      b.settings.wins - a.settings.wins || rosterPoints(b) - rosterPoints(a)
    );
  });
  const standings = ordered.map((roster, index) => {
    const user = roster.owner_id ? userById.get(roster.owner_id) : undefined;
    return {
      franchiseId:
        ownerFranchiseMap[roster.owner_id ?? ''] ??
        `sleeper-${roster.owner_id ?? roster.roster_id}`,
      teamName: getTeamName(user, roster),
      finish: index + 1,
      wins: roster.settings.wins,
      losses: roster.settings.losses,
      ties: roster.settings.ties,
    };
  });
  const byRoster = new Map(
    ordered.map((roster) => [
      roster.roster_id,
      getTeamName(
        roster.owner_id ? userById.get(roster.owner_id) : undefined,
        roster,
      ),
    ]),
  );
  return {
    year: Number(league.season),
    source: 'sleeper',
    leagueId,
    champion: byRoster.get(podium.champion ?? -1) ?? 'Champion pending',
    runnerUp: byRoster.get(podium.runnerUp ?? -1) ?? 'Runner-up pending',
    thirdPlace: byRoster.get(podium.thirdPlace ?? -1) ?? 'Third place pending',
    standings,
  };
}

export async function getHistoricalArchive(): Promise<HistoricalSeason[]> {
  if (!leagueConfig.sleeperLeagueId) return historicalSeasons;
  try {
    const verified: HistoricalSeason[] = [];
    const seen = new Set<string>();
    let leagueId: string | null = leagueConfig.sleeperLeagueId;
    while (leagueId && !seen.has(leagueId) && verified.length < 12) {
      seen.add(leagueId);
      const league = await getLeague(leagueId);
      const summary = await getSeasonSummary(leagueId);
      if (summary) verified.push(summary);
      leagueId = league.previous_league_id;
    }
    const verifiedYears = new Set(verified.map((season) => season.year));
    return [
      ...historicalSeasons.filter((season) => !verifiedYears.has(season.year)),
      ...verified,
    ].sort((a, b) => a.year - b.year);
  } catch {
    return historicalSeasons;
  }
}
