import { leagueConfig } from '@/lib/config/league.config';
import { getFranchiseRecords } from '@/lib/data/historical';
import { leagueMembers, type LeagueMember } from '@/lib/data/member-directory';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getMatchups,
  getNFLState,
  getPlayers,
} from '@/lib/sleeper/client';
import { getWeeklyProjections } from '@/lib/sleeper/projections';
import type {
  SleeperLeague,
  SleeperMatchup,
  SleeperPlayer,
  SleeperProjection,
  SleeperRoster,
  SleeperUser,
} from '@/lib/sleeper/types';

export type PredictionPlayer = {
  id: string;
  name: string;
  position: string;
  nflTeam: string;
  slot: string;
  projectedPoints: number;
  starter: boolean;
};

export type PredictionTeam = {
  rosterId: number;
  teamName: string;
  ownerName: string;
  avatar: string | null;
  wins: number;
  losses: number;
  ties: number;
  projectedScore: number;
  actualScore: number;
  starters: PredictionPlayer[];
  bench: PredictionPlayer[];
};

export type PredictionMatchup = {
  databaseId: number | null;
  sleeperMatchupId: number;
  home: PredictionTeam;
  away: PredictionTeam;
};

export type PredictionWeekData = {
  leagueId: string;
  season: string;
  week: number;
  currentWeek: number;
  isTestWeek: boolean;
  lockAt: string;
  locked: boolean;
  finalized: boolean;
  databaseReady: boolean;
  matchups: PredictionMatchup[];
};

type StoredMatchup = {
  id: number;
  sleeper_matchup_id: number;
  home_projected: number | string;
  away_projected: number | string;
};

export const predictionTestLeagueId = 'mac12-prediction-test';

const testProjectedScores = [
  118.7, 116.4, 123.1, 121.8, 109.6, 111.3, 127.2, 124.9, 114.5, 112.8, 119.3,
  120.1,
];

const testStarterBlueprint = [
  { slot: 'QB', position: 'QB', points: 22.4 },
  { slot: 'RB', position: 'RB', points: 15.8 },
  { slot: 'RB', position: 'RB', points: 12.6 },
  { slot: 'WR', position: 'WR', points: 16.3 },
  { slot: 'WR', position: 'WR', points: 13.9 },
  { slot: 'TE', position: 'TE', points: 9.1 },
  { slot: 'FLEX', position: 'FLEX', points: 12.2 },
  { slot: 'K', position: 'K', points: 8.4 },
  { slot: 'DEF', position: 'DEF', points: 8 },
];

const testPairings = [
  [0, 11],
  [1, 10],
  [2, 9],
  [3, 8],
  [4, 7],
  [5, 6],
] as const;

function teamNameFor(user: SleeperUser | undefined, roster: SleeperRoster) {
  const ownerId = roster.owner_id ?? '';
  return (
    leagueConfig.ownerNameOverrides[ownerId] ??
    roster.metadata?.team_name ??
    user?.metadata?.team_name?.trim() ??
    user?.display_name ??
    `Team ${roster.roster_id}`
  );
}

function firstSundayOfSeason(season: number) {
  const date = new Date(Date.UTC(season, 8, 7));
  while (date.getUTCDay() !== 0) {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return date;
}

function sundayKickoffForWeek(season: number, week: number) {
  const date = firstSundayOfSeason(season);
  date.setUTCDate(date.getUTCDate() + (week - 1) * 7);

  const easternHour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    hourCycle: 'h23',
  });

  for (const utcHour of [17, 18]) {
    const candidate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        utcHour,
      ),
    );
    if (easternHour.format(candidate) === '13') return candidate;
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 18),
  );
}

function projectionFor(
  playerId: string,
  projectionByPlayer: Map<string, SleeperProjection>,
) {
  const stats = projectionByPlayer.get(playerId)?.stats;
  return Number(stats?.pts_ppr ?? stats?.pts_half_ppr ?? stats?.pts_std ?? 0);
}

function playerName(player: SleeperPlayer | undefined, playerId: string) {
  const fallback = [player?.first_name, player?.last_name]
    .filter(Boolean)
    .join(' ');
  return (player?.full_name ?? fallback) || playerId;
}

function createPlayer(
  playerId: string,
  slot: string,
  starter: boolean,
  players: Record<string, SleeperPlayer>,
  projectionByPlayer: Map<string, SleeperProjection>,
): PredictionPlayer {
  if (playerId === '0') {
    return {
      id: `${slot}-empty`,
      name: 'Empty lineup slot',
      position: slot,
      nflTeam: '—',
      slot,
      projectedPoints: 0,
      starter,
    };
  }

  const player = players[playerId];
  return {
    id: playerId,
    name: playerName(player, playerId),
    position: player?.position ?? slot,
    nflTeam: player?.team ?? 'FA',
    slot,
    projectedPoints: projectionFor(playerId, projectionByPlayer),
    starter,
  };
}

function createTeam(
  matchup: SleeperMatchup,
  roster: SleeperRoster,
  user: SleeperUser | undefined,
  league: SleeperLeague,
  players: Record<string, SleeperPlayer>,
  projectionByPlayer: Map<string, SleeperProjection>,
): PredictionTeam {
  const starterSlots = league.roster_positions.filter(
    (position) => !['BN', 'IR', 'TAXI'].includes(position),
  );
  const starterIds = matchup.starters ?? roster.starters ?? [];
  const starters = starterSlots.map((slot, index) =>
    createPlayer(
      starterIds[index] ?? '0',
      slot,
      true,
      players,
      projectionByPlayer,
    ),
  );
  const starterSet = new Set(starterIds);
  const bench = (matchup.players ?? roster.players ?? [])
    .filter((playerId) => playerId !== '0' && !starterSet.has(playerId))
    .map((playerId) =>
      createPlayer(playerId, 'BN', false, players, projectionByPlayer),
    )
    .sort((a, b) => b.projectedPoints - a.projectedPoints);

  return {
    rosterId: roster.roster_id,
    teamName: teamNameFor(user, roster),
    ownerName: user?.display_name ?? 'Unassigned',
    avatar:
      leagueConfig.teamAvatarOverrides[roster.owner_id ?? ''] ??
      user?.metadata?.avatar ??
      user?.avatar ??
      null,
    wins: roster.settings.wins,
    losses: roster.settings.losses,
    ties: roster.settings.ties,
    projectedScore: starters.reduce(
      (total, player) => total + player.projectedPoints,
      0,
    ),
    actualScore: matchup.points ?? 0,
    starters,
    bench,
  };
}

function buildMatchups(
  entries: SleeperMatchup[],
  rosters: SleeperRoster[],
  users: SleeperUser[],
  league: SleeperLeague,
  players: Record<string, SleeperPlayer>,
  projections: SleeperProjection[],
) {
  const rosterById = new Map(
    rosters.map((roster) => [roster.roster_id, roster]),
  );
  const userById = new Map(users.map((user) => [user.user_id, user]));
  const projectionByPlayer = new Map(
    projections.map((projection) => [projection.player_id, projection]),
  );
  const grouped = new Map<number, SleeperMatchup[]>();

  for (const entry of entries) {
    if (entry.matchup_id == null) continue;
    grouped.set(entry.matchup_id, [
      ...(grouped.get(entry.matchup_id) ?? []),
      entry,
    ]);
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([sleeperMatchupId, pair]) => {
      if (pair.length !== 2) return [];
      const [homeEntry, awayEntry] = [...pair].sort(
        (a, b) => a.roster_id - b.roster_id,
      );
      const homeRoster = rosterById.get(homeEntry.roster_id);
      const awayRoster = rosterById.get(awayEntry.roster_id);
      if (!homeRoster || !awayRoster) return [];

      return [
        {
          databaseId: null,
          sleeperMatchupId,
          home: createTeam(
            homeEntry,
            homeRoster,
            homeRoster.owner_id ? userById.get(homeRoster.owner_id) : undefined,
            league,
            players,
            projectionByPlayer,
          ),
          away: createTeam(
            awayEntry,
            awayRoster,
            awayRoster.owner_id ? userById.get(awayRoster.owner_id) : undefined,
            league,
            players,
            projectionByPlayer,
          ),
        },
      ];
    });
}

function createTestTeam(
  member: LeagueMember,
  projectedScore: number,
): PredictionTeam {
  const currentName =
    getFranchiseRecords().find(
      (record) => record.franchiseId === member.franchiseId,
    )?.currentName ?? member.displayName;
  const baseTotal = testStarterBlueprint.reduce(
    (total, player) => total + player.points,
    0,
  );
  const adjustment = projectedScore - baseTotal;
  const starters = testStarterBlueprint.map((player, index) => ({
    id: `test-${member.rosterId}-starter-${index}`,
    name: `Practice ${player.position}${index > 0 ? ` ${index + 1}` : ''}`,
    position: player.position,
    nflTeam: 'TST',
    slot: player.slot,
    projectedPoints: Number(
      (player.points + (index === 0 ? adjustment : 0)).toFixed(1),
    ),
    starter: true,
  }));
  const bench = [10.2, 8.4, 5.6].map((projectedPoints, index) => ({
    id: `test-${member.rosterId}-bench-${index}`,
    name: `Practice bench ${index + 1}`,
    position: ['RB', 'WR', 'TE'][index],
    nflTeam: 'TST',
    slot: 'BN',
    projectedPoints,
    starter: false,
  }));

  return {
    rosterId: member.rosterId,
    teamName: currentName,
    ownerName: member.displayName,
    avatar: null,
    wins: 0,
    losses: 0,
    ties: 0,
    projectedScore,
    actualScore: 0,
    starters,
    bench,
  };
}

function buildTestMatchups(): PredictionMatchup[] {
  return testPairings.map(([homeIndex, awayIndex], index) => ({
    databaseId: null,
    sleeperMatchupId: index + 1,
    home: createTestTeam(
      leagueMembers[homeIndex],
      testProjectedScores[homeIndex],
    ),
    away: createTestTeam(
      leagueMembers[awayIndex],
      testProjectedScores[awayIndex],
    ),
  }));
}

async function getTestLockAt(season: string) {
  const fallback = '2099-01-01T18:00:00.000Z';
  const admin = getSupabaseAdminClient();
  if (!admin) return fallback;

  const { data } = await admin
    .from('prediction_weeks')
    .select('locks_at')
    .eq('league_id', predictionTestLeagueId)
    .eq('season', Number(season))
    .eq('week', 1)
    .maybeSingle();

  return data?.locks_at ?? fallback;
}

async function syncPredictionWeek(
  data: Omit<PredictionWeekData, 'databaseReady'>,
) {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ...data, databaseReady: false };

  const { data: weekRow, error: weekError } = await admin
    .from('prediction_weeks')
    .upsert(
      {
        league_id: data.leagueId,
        season: Number(data.season),
        week: data.week,
        locks_at: data.lockAt,
      },
      { onConflict: 'league_id,season,week' },
    )
    .select('id')
    .single();

  if (weekError || !weekRow) return { ...data, databaseReady: false };

  const { data: storedRows, error: storedError } = await admin
    .from('prediction_matchups')
    .select('id,sleeper_matchup_id,home_projected,away_projected')
    .eq('prediction_week_id', weekRow.id);

  if (storedError) return { ...data, databaseReady: false };

  const storedBySleeperId = new Map(
    (storedRows as StoredMatchup[]).map((row) => [row.sleeper_matchup_id, row]),
  );
  const finalScoresReady =
    Date.now() >= new Date(data.lockAt).getTime() + 64 * 60 * 60 * 1000;
  const synced: PredictionMatchup[] = [];

  for (const matchup of data.matchups) {
    let stored = storedBySleeperId.get(matchup.sleeperMatchupId);

    if (!stored) {
      const { data: inserted, error } = await admin
        .from('prediction_matchups')
        .insert({
          prediction_week_id: weekRow.id,
          sleeper_matchup_id: matchup.sleeperMatchupId,
          home_roster_id: matchup.home.rosterId,
          away_roster_id: matchup.away.rosterId,
          home_projected: matchup.home.projectedScore,
          away_projected: matchup.away.projectedScore,
          status: data.locked ? 'locked' : 'scheduled',
        })
        .select('id,sleeper_matchup_id,home_projected,away_projected')
        .single();
      if (error || !inserted) continue;
      stored = inserted as StoredMatchup;
    } else if (!data.locked) {
      const { data: updated } = await admin
        .from('prediction_matchups')
        .update({
          home_roster_id: matchup.home.rosterId,
          away_roster_id: matchup.away.rosterId,
          home_projected: matchup.home.projectedScore,
          away_projected: matchup.away.projectedScore,
          status: 'scheduled',
        })
        .eq('id', stored.id)
        .select('id,sleeper_matchup_id,home_projected,away_projected')
        .single();
      if (updated) stored = updated as StoredMatchup;
    }

    if (data.locked) {
      const homeScore = matchup.home.actualScore;
      const awayScore = matchup.away.actualScore;
      const hasFinalScores = finalScoresReady;
      const winnerRosterId = hasFinalScores
        ? homeScore === awayScore
          ? null
          : homeScore > awayScore
            ? matchup.home.rosterId
            : matchup.away.rosterId
        : null;

      await admin
        .from('prediction_matchups')
        .update(
          hasFinalScores
            ? {
                home_final: homeScore,
                away_final: awayScore,
                winner_roster_id: winnerRosterId,
                status: 'final',
              }
            : { status: 'locked' },
        )
        .eq('id', stored.id);
    }

    synced.push({
      ...matchup,
      databaseId: stored.id,
      home: {
        ...matchup.home,
        projectedScore: Number(stored.home_projected),
      },
      away: {
        ...matchup.away,
        projectedScore: Number(stored.away_projected),
      },
    });
  }

  return {
    ...data,
    matchups: synced,
    databaseReady: synced.length === data.matchups.length,
  };
}

export async function getPredictionWeekData(
  requestedWeek?: number,
): Promise<PredictionWeekData> {
  const leagueId = leagueConfig.sleeperLeagueId;
  const nflState = await getNFLState();
  const currentWeek = Math.max(1, Math.min(18, nflState.week));
  const week = Math.max(1, Math.min(currentWeek, requestedWeek ?? currentWeek));
  const season = leagueConfig.season ?? nflState.season;
  const lockAt = sundayKickoffForWeek(Number(season), week);
  const locked = Date.now() >= lockAt.getTime();

  if (!leagueId) {
    return {
      leagueId: '',
      season,
      week,
      currentWeek,
      isTestWeek: false,
      lockAt: lockAt.toISOString(),
      locked,
      finalized: false,
      databaseReady: false,
      matchups: [],
    };
  }

  const [league, rosters, users, entries, players, projections] =
    await Promise.all([
      getLeague(leagueId),
      getLeagueRosters(leagueId),
      getLeagueUsers(leagueId),
      getMatchups(leagueId, week),
      getPlayers(),
      getWeeklyProjections(season, week),
    ]);
  const matchups = buildMatchups(
    entries,
    rosters,
    users,
    league,
    players,
    projections,
  );
  const finalized =
    locked && Date.now() >= lockAt.getTime() + 64 * 60 * 60 * 1000;

  return syncPredictionWeek({
    leagueId,
    season,
    week,
    currentWeek,
    isTestWeek: false,
    lockAt: lockAt.toISOString(),
    locked,
    finalized,
    matchups,
  });
}

export async function getPredictionTestWeekData(): Promise<PredictionWeekData> {
  const season = String(new Date().getUTCFullYear());
  const lockAt = await getTestLockAt(season);
  const locked = Date.now() >= new Date(lockAt).getTime();

  return syncPredictionWeek({
    leagueId: predictionTestLeagueId,
    season,
    week: 1,
    currentWeek: 1,
    isTestWeek: true,
    lockAt,
    locked,
    finalized: false,
    matchups: buildTestMatchups(),
  });
}

export async function syncPredictionWeeksForCron() {
  const state = await getNFLState();
  const weeks = [...new Set([state.week - 1, state.week])].filter(
    (week) => week >= 1 && week <= 18,
  );
  return Promise.all(weeks.map((week) => getPredictionWeekData(week)));
}

export const predictionInternals = {
  sundayKickoffForWeek,
};
