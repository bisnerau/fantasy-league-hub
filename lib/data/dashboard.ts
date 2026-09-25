import { leagueConfig } from '@/lib/config/league.config';
import { ownerFranchiseMap } from '@/lib/data/verified-history';
import {
  getDrafts,
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getMatchups,
  getNFLState,
} from '@/lib/sleeper/client';
import {
  compareStandings,
  getWeeklyPerformance,
  type TeamStanding,
} from '@/lib/data/standings';
import { rosterScore } from '@/lib/sleeper/scores';
import type {
  SleeperLeague,
  SleeperRoster,
  SleeperUser,
} from '@/lib/sleeper/types';

export type { TeamStanding } from '@/lib/data/standings';

export type MatchupCard = {
  matchupId: number;
  home: TeamStanding;
  away: TeamStanding;
  homeScore: number;
  awayScore: number;
  state: 'live' | 'final' | 'scheduled';
};

export type DashboardData = {
  mode: 'live' | 'unavailable';
  leagueName: string;
  season: string;
  week: number;
  leagueStatus: SleeperLeague['status'] | null;
  standings: TeamStanding[];
  weeklyHistoryAvailable: boolean;
  /** Playoff places; Sleeper's setting, else the league's six-team bracket. */
  playoffTeams: number;
  draft: {
    id: string;
    startTime: number;
    status: string;
    type: string;
    rounds: number;
    pickTimer: number;
  } | null;
  reigningChampion: {
    teamName: string;
    ownerName: string;
    franchiseId: string | null;
    avatar: string | null;
    wins: number;
    losses: number;
    season: string;
  } | null;
};

function teamNameFor(user: SleeperUser | undefined, roster: SleeperRoster) {
  return (
    leagueConfig.ownerNameOverrides[roster.owner_id ?? ''] ??
    roster.metadata?.team_name ??
    user?.metadata?.team_name?.trim() ??
    user?.display_name ??
    `Team ${roster.roster_id}`
  );
}

function createStandings(
  rosters: SleeperRoster[],
  users: SleeperUser[],
): TeamStanding[] {
  const userById = new Map(users.map((user) => [user.user_id, user]));
  return rosters
    .map((roster) => {
      const ownerId = roster.owner_id ?? '';
      const user = userById.get(ownerId);
      return {
        rosterId: roster.roster_id,
        ownerId,
        franchiseId: ownerFranchiseMap[ownerId] ?? null,
        teamName: teamNameFor(user, roster),
        ownerName: user?.display_name ?? 'Unassigned',
        avatar:
          leagueConfig.teamAvatarOverrides[ownerId] ??
          user?.metadata?.avatar ??
          user?.avatar ??
          null,
        wins: roster.settings.wins,
        losses: roster.settings.losses,
        ties: roster.settings.ties,
        pointsFor: rosterScore(
          roster.settings.fpts,
          roster.settings.fpts_decimal,
        ),
        pointsAgainst: rosterScore(
          roster.settings.fpts_against,
          roster.settings.fpts_against_decimal,
        ),
        medianWins: 0,
        medianLosses: 0,
        streak: '—',
        form: [],
        allPlay: null,
        previousRank: null,
        rank: 0,
      };
    })
    .sort(compareStandings)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}

async function getReigningChampion(
  previousLeagueId: string | null,
): Promise<DashboardData['reigningChampion']> {
  if (!previousLeagueId) return null;
  try {
    const [league, users, rosters] = await Promise.all([
      getLeague(previousLeagueId),
      getLeagueUsers(previousLeagueId),
      getLeagueRosters(previousLeagueId),
    ]);
    const roster = rosters.find(
      (candidate) =>
        candidate.roster_id ===
        Number(league.metadata?.latest_league_winner_roster_id),
    );
    if (!roster) return null;
    const user = users.find(
      (candidate) => candidate.user_id === roster.owner_id,
    );
    return {
      teamName: teamNameFor(user, roster),
      ownerName: user?.display_name ?? 'League champion',
      franchiseId: ownerFranchiseMap[roster.owner_id ?? ''] ?? null,
      avatar: user?.metadata?.avatar ?? user?.avatar ?? null,
      wins: roster.settings.wins,
      losses: roster.settings.losses,
      season: league.season,
    };
  } catch {
    return null;
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const leagueId = leagueConfig.sleeperLeagueId;
  const unavailable: DashboardData = {
    mode: 'unavailable',
    leagueName: leagueConfig.name,
    season: leagueConfig.season ?? '',
    week: 1,
    leagueStatus: null,
    standings: [],
    weeklyHistoryAvailable: false,
    playoffTeams: 6,
    draft: null,
    reigningChampion: null,
  };
  if (!leagueId) return unavailable;
  try {
    const [state, league, users, rosters] = await Promise.all([
      getNFLState(),
      getLeague(leagueId),
      getLeagueUsers(leagueId),
      getLeagueRosters(leagueId),
    ]);
    const week = Math.max(
      1,
      Math.min(
        18,
        league.status === 'complete'
          ? Number(league.settings.last_scored_leg ?? 18)
          : state.season === league.season && state.season_type === 'regular'
            ? state.week
            : 1,
      ),
    );
    const completedWeekCount =
      league.status === 'pre_draft' || league.status === 'drafting'
        ? 0
        : Math.min(
            league.status === 'complete' ? week : week - 1,
            Number(league.settings.playoff_week_start ?? 15) - 1,
          );
    const [drafts, reigningChampion, completedWeeks] = await Promise.all([
      getDrafts(leagueId).catch(() => []),
      getReigningChampion(league.previous_league_id),
      Promise.all(
        Array.from({ length: completedWeekCount }, (_, index) =>
          getMatchups(leagueId, index + 1),
        ),
      ).catch(() => null),
    ]);
    const draft = drafts.find((entry) => entry.season === league.season);
    return {
      mode: 'live',
      leagueName: league.name,
      season: league.season,
      week,
      leagueStatus: league.status,
      standings: getWeeklyPerformance(
        createStandings(rosters, users),
        completedWeeks ?? [],
      ),
      weeklyHistoryAvailable: completedWeeks != null,
      playoffTeams:
        Number(league.settings.playoff_teams) > 0
          ? Number(league.settings.playoff_teams)
          : 6,
      draft: draft
        ? {
            id: draft.draft_id,
            startTime: draft.start_time,
            status: draft.status,
            type: draft.type,
            rounds: draft.settings.rounds ?? draft.rounds,
            pickTimer: draft.settings.pick_timer ?? 0,
          }
        : null,
      reigningChampion,
    };
  } catch {
    return unavailable;
  }
}
