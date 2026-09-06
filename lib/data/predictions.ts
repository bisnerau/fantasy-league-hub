import { leagueConfig } from '@/lib/config/league.config';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getSupabaseReadClient } from '@/lib/supabase/read';
import { matchupScore } from '@/lib/sleeper/scores';
import {
  isGradingEligible,
  sundayKickoffForWeek,
} from '@/lib/predictions/rules';
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
  SleeperNFLState,
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
  projectedPoints: number | null;
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
  projectedScore: number | null;
  actualScore: number | null;
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
  lockAt: string;
  locked: boolean;
  finalized: boolean;
  databaseReady: boolean;
  availability: 'ready' | 'waiting' | 'unavailable';
  sourceComplete: boolean;
  gradingEligible: boolean;
  matchups: PredictionMatchup[];
};

type StoredMatchup = {
  id: number;
  sleeper_matchup_id: number;
  home_roster_id: number;
  away_roster_id: number;
  home_projected: number | string;
  away_projected: number | string;
  home_final: number | string | null;
  away_final: number | string | null;
  status: 'scheduled' | 'locked' | 'final';
};

const STORED_FIELDS =
  'id,sleeper_matchup_id,home_roster_id,away_roster_id,home_projected,away_projected,home_final,away_final,status';

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

function projectionFor(
  playerId: string,
  projectionByPlayer: Map<string, SleeperProjection>,
) {
  const stats = projectionByPlayer.get(playerId)?.stats;
  const value = stats?.pts_ppr ?? stats?.pts_half_ppr ?? stats?.pts_std;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
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
    .sort(
      (a, b) =>
        (b.projectedPoints ?? -Infinity) - (a.projectedPoints ?? -Infinity) ||
        0,
    );

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
    projectedScore: starters.every((player) => player.projectedPoints != null)
      ? starters.reduce((total, player) => total + player.projectedPoints!, 0)
      : null,
    actualScore: matchupScore(matchup),
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

type SourceContext = {
  league: SleeperLeague;
  state: SleeperNFLState;
  rosters: SleeperRoster[];
  users: SleeperUser[];
  players: Record<string, SleeperPlayer>;
};

async function getSourceContext(): Promise<SourceContext> {
  const id = leagueConfig.sleeperLeagueId;
  const [league, state, rosters, users, players] = await Promise.all([
    getLeague(id),
    getNFLState(),
    getLeagueRosters(id),
    getLeagueUsers(id),
    getPlayers().catch(() => ({})),
  ]);
  return { league, state, rosters, users, players };
}

function currentPredictionWeek({ league, state }: SourceContext) {
  if (league.status === 'complete')
    return Math.max(
      1,
      Math.min(18, Number(league.settings.last_scored_leg ?? 18)),
    );
  if (state.season !== league.season || state.season_type === 'pre') return 1;
  return state.season_type === 'post'
    ? 18
    : Math.max(1, Math.min(18, state.week));
}

async function loadPredictionSource(
  context: SourceContext,
  requestedWeek?: number,
): Promise<PredictionWeekData> {
  const { league, state, rosters, users, players } = context;
  const currentWeek = currentPredictionWeek(context);
  const week = Math.max(
    1,
    Math.min(
      currentWeek,
      Number.isInteger(requestedWeek) ? requestedWeek! : currentWeek,
    ),
  );
  const season = league.season;
  const lockAt = sundayKickoffForWeek(Number(season), week).toISOString();
  const [entries, projections] = await Promise.all([
    getMatchups(league.league_id, week),
    getWeeklyProjections(season, week).catch(() => []),
  ]);
  const matchups = buildMatchups(
    entries,
    rosters,
    users,
    league,
    players,
    projections,
  );
  const ids = new Set(entries.map((entry) => entry.roster_id));
  const groupedIds = new Set(
    entries.flatMap((entry) =>
      entry.matchup_id == null ? [] : [entry.matchup_id],
    ),
  );
  const sourceComplete =
    entries.length === ids.size &&
    rosters.length === league.total_rosters &&
    rosters.every((roster) => ids.has(roster.roster_id)) &&
    matchups.length === groupedIds.size &&
    matchups.length > 0;
  const weekHasEnded =
    Number(state.season) > Number(season) ||
    (state.season === season &&
      (state.season_type === 'post' ||
        (state.season_type === 'regular' && state.week > week)));
  return {
    leagueId: league.league_id,
    season,
    week,
    currentWeek,
    lockAt,
    locked: Date.now() >= new Date(lockAt).getTime(),
    finalized: false,
    databaseReady: false,
    availability: matchups.length ? 'ready' : 'waiting',
    sourceComplete,
    gradingEligible: weekHasEnded && isGradingEligible(lockAt),
    matchups,
  };
}

function withStoredMatchups(
  data: PredictionWeekData,
  rows: StoredMatchup[],
): PredictionWeekData {
  const byId = new Map(rows.map((row) => [row.sleeper_matchup_id, row]));
  const complete =
    data.sourceComplete &&
    data.matchups.every((matchup) => {
      const row = byId.get(matchup.sleeperMatchupId);
      return (
        row &&
        row.home_roster_id === matchup.home.rosterId &&
        row.away_roster_id === matchup.away.rosterId
      );
    });
  return {
    ...data,
    databaseReady: complete,
    finalized:
      complete &&
      data.matchups.every((matchup) => {
        const row = byId.get(matchup.sleeperMatchupId)!;
        return (
          row.status === 'final' &&
          row.home_final != null &&
          row.away_final != null &&
          Number.isFinite(Number(row.home_final)) &&
          Number.isFinite(Number(row.away_final))
        );
      }),
    matchups: data.matchups.map((matchup) => {
      const row = byId.get(matchup.sleeperMatchupId);
      if (
        !row ||
        row.home_roster_id !== matchup.home.rosterId ||
        row.away_roster_id !== matchup.away.rosterId
      )
        return matchup;
      return {
        ...matchup,
        databaseId: row.id,
        home: {
          ...matchup.home,
          actualScore:
            row.status === 'final' && row.home_final != null
              ? Number(row.home_final)
              : matchup.home.actualScore,
        },
        away: {
          ...matchup.away,
          actualScore:
            row.status === 'final' && row.away_final != null
              ? Number(row.away_final)
              : matchup.away.actualScore,
        },
      };
    }),
  };
}

/** Read-only: visiting the clubhouse or a historical week never grades results. */
export async function getPredictionWeekData(
  requestedWeek?: number,
): Promise<PredictionWeekData> {
  let season = leagueConfig.season ?? '';
  let currentWeek = 1;
  try {
    if (!leagueConfig.sleeperLeagueId) throw new Error('League not configured');
    const context = await getSourceContext();
    season = context.league.season;
    currentWeek = currentPredictionWeek(context);
    const data = await loadPredictionSource(context, requestedWeek);
    const readClient = getSupabaseReadClient();
    if (!readClient) return data;
    const { data: weekRow, error: weekError } = await readClient
      .from('prediction_weeks')
      .select('id,locks_at')
      .eq('league_id', data.leagueId)
      .eq('season', Number(data.season))
      .eq('week', data.week)
      .maybeSingle();
    if (weekError) return { ...data, availability: 'unavailable' };
    if (!weekRow) return data;
    const { data: rows, error } = await readClient
      .from('prediction_matchups')
      .select(STORED_FIELDS)
      .eq('prediction_week_id', weekRow.id);
    if (error || !rows) return { ...data, availability: 'unavailable' };
    return withStoredMatchups(
      {
        ...data,
        lockAt: weekRow.locks_at,
        locked: Date.now() >= new Date(weekRow.locks_at).getTime(),
      },
      rows as StoredMatchup[],
    );
  } catch {
    const week = Math.max(
      1,
      Math.min(
        currentWeek,
        Number.isInteger(requestedWeek) ? requestedWeek! : currentWeek,
      ),
    );
    return {
      leagueId: leagueConfig.sleeperLeagueId,
      season,
      week,
      currentWeek,
      lockAt: season
        ? sundayKickoffForWeek(Number(season), week).toISOString()
        : '',
      locked: true,
      finalized: false,
      databaseReady: false,
      availability: 'unavailable',
      sourceComplete: false,
      gradingEligible: false,
      matchups: [],
    };
  }
}

/** Only the authenticated cron route calls this write path. Never touches votes. */
async function syncPredictionWeek(data: PredictionWeekData) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error('Prediction sync is not configured');
  const { data: weekRow, error: weekError } = await admin
    .from('prediction_weeks')
    .upsert(
      {
        league_id: data.leagueId,
        season: Number(data.season),
        week: data.week,
        locks_at: data.lockAt,
      },
      { onConflict: 'league_id,season,week', ignoreDuplicates: true },
    )
    .select('id');
  if (weekError) throw new Error('Could not prepare prediction week');
  let weekId = weekRow?.[0]?.id;
  if (weekId == null) {
    const existing = await admin
      .from('prediction_weeks')
      .select('id,locks_at')
      .eq('league_id', data.leagueId)
      .eq('season', Number(data.season))
      .eq('week', data.week)
      .single();
    if (existing.error || !existing.data)
      throw new Error('Could not read prediction week');
    weekId = existing.data.id;
    data = {
      ...data,
      lockAt: existing.data.locks_at,
      locked: Date.now() >= new Date(existing.data.locks_at).getTime(),
      gradingEligible:
        data.gradingEligible && isGradingEligible(existing.data.locks_at),
    };
  }
  if (!data.matchups.length) return data;
  if (!data.sourceComplete)
    throw new Error('Sleeper returned an incomplete matchup schedule');
  const { error: insertError } = await admin.from('prediction_matchups').upsert(
    data.matchups.map((matchup) => ({
      prediction_week_id: weekId,
      sleeper_matchup_id: matchup.sleeperMatchupId,
      home_roster_id: matchup.home.rosterId,
      away_roster_id: matchup.away.rosterId,
      home_projected: matchup.home.projectedScore ?? 0,
      away_projected: matchup.away.projectedScore ?? 0,
      status: data.locked ? 'locked' : 'scheduled',
    })),
    {
      onConflict: 'prediction_week_id,sleeper_matchup_id',
      ignoreDuplicates: true,
    },
  );
  if (insertError) throw new Error('Could not prepare prediction matchups');
  const stored = await admin
    .from('prediction_matchups')
    .select(STORED_FIELDS)
    .eq('prediction_week_id', weekId);
  if (stored.error || !stored.data)
    throw new Error('Could not read prediction matchups');
  const rows = stored.data as StoredMatchup[];
  const byId = new Map(rows.map((row) => [row.sleeper_matchup_id, row]));
  const scoresReady =
    data.gradingEligible &&
    data.matchups.every(
      (matchup) =>
        matchup.home.actualScore != null && matchup.away.actualScore != null,
    );

  for (const matchup of data.matchups) {
    const row = byId.get(matchup.sleeperMatchupId);
    if (
      !row ||
      row.home_roster_id !== matchup.home.rosterId ||
      row.away_roster_id !== matchup.away.rosterId
    )
      throw new Error('Stored matchup does not match Sleeper');
    if (row.status === 'final') continue;
    const homeScore = matchup.home.actualScore;
    const awayScore = matchup.away.actualScore;
    const updates =
      scoresReady && homeScore != null && awayScore != null
        ? {
            home_final: homeScore,
            away_final: awayScore,
            winner_roster_id:
              homeScore === awayScore
                ? null
                : homeScore > awayScore
                  ? matchup.home.rosterId
                  : matchup.away.rosterId,
            status: 'final',
          }
        : data.locked
          ? { status: 'locked' }
          : {
              home_projected: matchup.home.projectedScore ?? row.home_projected,
              away_projected: matchup.away.projectedScore ?? row.away_projected,
              status: 'scheduled',
            };
    const updated = await admin
      .from('prediction_matchups')
      .update(updates)
      .eq('id', row.id)
      .neq('status', 'final')
      .select(STORED_FIELDS);
    if (updated.error) throw new Error('Could not save prediction results');
  }
  const confirmed = await admin
    .from('prediction_matchups')
    .select(STORED_FIELDS)
    .eq('prediction_week_id', weekId);
  if (confirmed.error || !confirmed.data)
    throw new Error('Could not confirm prediction results');
  const result = withStoredMatchups(data, confirmed.data as StoredMatchup[]);
  if (scoresReady && !result.finalized)
    throw new Error('Prediction results were not fully saved');
  return result;
}

export async function syncPredictionWeeksForCron() {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error('Prediction sync is not configured');
  const context = await getSourceContext();
  const currentWeek = currentPredictionWeek(context);
  const { data: storedWeeks, error } = await admin
    .from('prediction_weeks')
    .select('week,prediction_matchups(status)')
    .eq('league_id', context.league.league_id)
    .eq('season', Number(context.league.season));
  if (error) throw new Error('Could not find unresolved prediction weeks');
  const pending = (storedWeeks ?? []).filter(
    (row) =>
      !row.prediction_matchups.length ||
      row.prediction_matchups.some(
        (matchup: { status: string }) => matchup.status !== 'final',
      ),
  );
  const weeks = [
    ...new Set([currentWeek, ...pending.map((row) => Number(row.week))]),
  ]
    .filter((week) => week >= 1 && week <= currentWeek)
    .sort((a, b) => a - b);
  return Promise.all(
    weeks.map(async (week) => {
      try {
        const result = await syncPredictionWeek(
          await loadPredictionSource(context, week),
        );
        return {
          season: result.season,
          week: result.week,
          matchups: result.matchups.length,
          finalized: result.finalized,
          ok:
            (result.availability === 'waiting' && !result.gradingEligible) ||
            (result.databaseReady &&
              (!result.gradingEligible || result.finalized)),
        };
      } catch {
        return {
          season: context.league.season,
          week,
          matchups: 0,
          finalized: false,
          ok: false,
        };
      }
    }),
  );
}

export const predictionInternals = {
  sundayKickoffForWeek,
  withStoredMatchups,
  syncPredictionWeek,
};
