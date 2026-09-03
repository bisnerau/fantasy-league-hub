import { leagueConfig } from '@/lib/config/league.config';
import {
  getDrafts,
  getLeague,
  getLeagueRosters,
  getLeagueUsers,
  getMatchups,
  getNFLState,
  getPlayers,
  getTransactions,
  getTrendingPlayers,
} from '@/lib/sleeper/client';
import type {
  SleeperMatchup,
  SleeperPlayer,
  SleeperRoster,
  SleeperTransaction,
  SleeperUser,
} from '@/lib/sleeper/types';

export type TeamStanding = {
  rosterId: number;
  ownerId: string;
  teamName: string;
  ownerName: string;
  avatar: string | null;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  medianWins: number;
  medianLosses: number;
  streak: string;
  rank: number;
};

export type MatchupCard = {
  matchupId: number;
  home: TeamStanding;
  away: TeamStanding;
  homeScore: number;
  awayScore: number;
  state: 'live' | 'final' | 'scheduled';
};

export type ActivityItem = {
  id: string;
  type: 'trade' | 'waiver' | 'free_agent';
  title: string;
  detail: string;
  time: string;
};

export type TrendingItem = {
  id: string;
  name: string;
  position: string;
  team: string;
  count: number;
  available: boolean;
  rosteredBy?: string;
};

export type DashboardData = {
  mode: 'live' | 'demo';
  leagueName: string;
  season: string;
  week: number;
  statusLabel: string;
  updatedAt: string;
  standings: TeamStanding[];
  matchups: MatchupCard[];
  activities: ActivityItem[];
  trending: TrendingItem[];
  narratives: string[];
  draft: {
    id: string;
    startTime: number;
    status: string;
    type: string;
    rounds: number;
    pickTimer: number;
    orderSet: boolean;
    maxKeepers: number;
    rosterSize: number;
    pickOrder: { slot: number; teamName: string; avatar: string | null }[];
  } | null;
  reigningChampion: {
    teamName: string;
    ownerName: string;
    avatar: string | null;
    wins: number;
    losses: number;
    season: string;
  } | null;
};

const DEMO_NAMES = [
  ['Fourth & Long', 'Marcus Reed'],
  ['Gridiron Ghosts', 'Ava Patel'],
  ['Sunday Scaries', 'Liam Walsh'],
  ['End Zone Empire', 'Nora Brooks'],
  ['Waiver Wiretap', 'Theo Chen'],
  ['The Red Zone', 'Maya Johnson'],
  ['Blitz Brigade', 'Jack Murphy'],
  ['Punt Intended', 'Sofia Garcia'],
  ['Goal Line Stand', 'Ethan King'],
  ['Hail Mary Club', 'Zoe Martin'],
  ['Bench Mob', 'Noah Quinn'],
  ['Monday Blues', 'Isla Hughes'],
] as const;

const DEMO_PF = [
  1284.6, 1258.2, 1219.8, 1191.4, 1178.9, 1155.2, 1139.6, 1118.4, 1094.7,
  1068.2, 1019.5, 987.3,
];
const DEMO_PA = [
  1098.3, 1142.1, 1104.8, 1165.9, 1190.3, 1128.6, 1177.4, 1202.1, 1118.6,
  1214.5, 1240.9, 1227.7,
];

function demoData(): DashboardData {
  const standings = DEMO_NAMES.map(([teamName, ownerName], index) => ({
    rosterId: index + 1,
    ownerId: `demo-${index + 1}`,
    teamName,
    ownerName,
    avatar: null,
    wins: [9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 3, 2][index],
    losses: [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9][index],
    ties: 0,
    pointsFor: DEMO_PF[index],
    pointsAgainst: DEMO_PA[index],
    medianWins: [9, 8, 7, 8, 6, 7, 5, 5, 6, 4, 3, 2][index],
    medianLosses: [2, 3, 4, 3, 5, 4, 6, 6, 5, 7, 8, 9][index],
    streak: [
      'W4',
      'W2',
      'L1',
      'W3',
      'L2',
      'W1',
      'L1',
      'W1',
      'L3',
      'W1',
      'L5',
      'L2',
    ][index],
    rank: index + 1,
  }));

  const scores = [
    [132.8, 118.4],
    [104.2, 110.7],
    [96.4, 95.9],
    [121.5, 124.1],
    [87.7, 101.3],
    [113.2, 92.6],
  ];
  const matchups = scores.map(([homeScore, awayScore], index) => ({
    matchupId: index + 1,
    home: standings[index],
    away: standings[11 - index],
    homeScore,
    awayScore,
    state: index < 2 ? ('live' as const) : ('final' as const),
  }));

  return {
    mode: 'demo',
    leagueName: leagueConfig.name,
    season: '2026',
    week: 11,
    statusLabel: 'Week 11 · Sunday slate',
    updatedAt: 'Demo preview',
    standings,
    matchups,
    activities: [
      {
        id: 'a1',
        type: 'trade',
        title: 'Two-team blockbuster',
        detail:
          'Gridiron Ghosts received C. Lamb · The Red Zone received B. Hall + a 2027 2nd',
        time: '18m',
      },
      {
        id: 'a2',
        type: 'waiver',
        title: 'Waiver claim · $17 FAAB',
        detail: 'Punt Intended added T. Benson and dropped R. Dowdle',
        time: '3h',
      },
      {
        id: 'a3',
        type: 'free_agent',
        title: 'Free agent move',
        detail: 'Sunday Scaries added SEA D/ST',
        time: '5h',
      },
    ],
    trending: [
      {
        id: 'p1',
        name: 'TreVeyon Henderson',
        position: 'RB',
        team: 'NE',
        count: 12491,
        available: true,
      },
      {
        id: 'p2',
        name: 'Xavier Worthy',
        position: 'WR',
        team: 'KC',
        count: 9724,
        available: false,
        rosteredBy: 'Fourth & Long',
      },
      {
        id: 'p3',
        name: 'Colston Loveland',
        position: 'TE',
        team: 'CHI',
        count: 7391,
        available: true,
      },
    ],
    narratives: [
      'Fourth & Long has won four straight and owns the league’s best point differential.',
      'Only 0.5 points separated Sunday Scaries and Goal Line Stand. The closest finish this season.',
      'Gridiron Ghosts moved into the No. 2 seed after a league-high 146.8 points last week.',
    ],
    draft: null,
    reigningChampion: null,
  };
}

function score(roster: SleeperRoster, key: 'fpts' | 'fpts_against') {
  return Number(
    `${roster.settings[key]}.${roster.settings[`${key}_decimal` as keyof typeof roster.settings] ?? 0}`,
  );
}

function teamNameFor(user: SleeperUser | undefined, roster: SleeperRoster) {
  const ownerId = roster.owner_id ?? '';
  return (
    leagueConfig.ownerNameOverrides[ownerId] ??
    roster.metadata?.team_name ??
    user?.metadata?.team_name ??
    user?.display_name ??
    `Team ${roster.roster_id}`
  );
}

function createStandings(rosters: SleeperRoster[], users: SleeperUser[]) {
  const userById = new Map(users.map((user) => [user.user_id, user]));
  return rosters
    .map((roster) => {
      const user = roster.owner_id ? userById.get(roster.owner_id) : undefined;
      return {
        rosterId: roster.roster_id,
        ownerId: roster.owner_id ?? '',
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
        pointsFor: score(roster, 'fpts'),
        pointsAgainst: score(roster, 'fpts_against'),
        medianWins: 0,
        medianLosses: 0,
        streak: '—',
        rank: 0,
      };
    })
    .sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor)
    .map((team, index) => ({ ...team, rank: index + 1 }));
}

function createMatchups(
  matchups: SleeperMatchup[],
  standings: TeamStanding[],
  live: boolean,
) {
  const byTeam = new Map(standings.map((team) => [team.rosterId, team]));
  const groups = new Map<number, SleeperMatchup[]>();
  for (const matchup of matchups) {
    if (matchup.matchup_id == null) continue;
    groups.set(matchup.matchup_id, [
      ...(groups.get(matchup.matchup_id) ?? []),
      matchup,
    ]);
  }
  return [...groups.entries()].flatMap(([matchupId, pair]) => {
    if (pair.length < 2) return [];
    const home = byTeam.get(pair[0].roster_id);
    const away = byTeam.get(pair[1].roster_id);
    if (!home || !away) return [];
    return [
      {
        matchupId,
        home,
        away,
        homeScore: pair[0].points ?? 0,
        awayScore: pair[1].points ?? 0,
        state: live ? ('live' as const) : ('final' as const),
      },
    ];
  });
}

function addWeeklyPerformance(
  standings: TeamStanding[],
  weeks: SleeperMatchup[][],
): TeamStanding[] {
  const medianRecords = new Map<number, { wins: number; losses: number }>();
  const results = new Map<number, Array<'W' | 'L' | 'T'>>();

  for (const week of weeks) {
    const valid = week.filter((entry) => entry.matchup_id != null);
    if (!valid.length) continue;
    const scores = valid.map((entry) => entry.points).sort((a, b) => a - b);
    const middle = Math.floor(scores.length / 2);
    const median =
      scores.length % 2
        ? scores[middle]
        : (scores[middle - 1] + scores[middle]) / 2;
    for (const entry of valid) {
      const record = medianRecords.get(entry.roster_id) ?? {
        wins: 0,
        losses: 0,
      };
      if (entry.points >= median) record.wins += 1;
      else record.losses += 1;
      medianRecords.set(entry.roster_id, record);
    }
    const groups = new Map<number, SleeperMatchup[]>();
    for (const entry of valid)
      groups.set(entry.matchup_id!, [
        ...(groups.get(entry.matchup_id!) ?? []),
        entry,
      ]);
    for (const pair of groups.values()) {
      if (pair.length !== 2) continue;
      const first =
        pair[0].points === pair[1].points
          ? 'T'
          : pair[0].points > pair[1].points
            ? 'W'
            : 'L';
      results.set(pair[0].roster_id, [
        ...(results.get(pair[0].roster_id) ?? []),
        first,
      ]);
      results.set(pair[1].roster_id, [
        ...(results.get(pair[1].roster_id) ?? []),
        first === 'W' ? 'L' : first === 'L' ? 'W' : 'T',
      ]);
    }
  }

  return standings.map((team) => {
    const median = medianRecords.get(team.rosterId) ?? { wins: 0, losses: 0 };
    const teamResults = results.get(team.rosterId) ?? [];
    const last = teamResults.at(-1);
    let streak = 0;
    for (
      let index = teamResults.length - 1;
      index >= 0 && teamResults[index] === last;
      index -= 1
    )
      streak += 1;
    return {
      ...team,
      medianWins: median.wins,
      medianLosses: median.losses,
      streak: last ? `${last}${streak}` : '—',
    };
  });
}

function playerName(playerId: string, players: Record<string, SleeperPlayer>) {
  return (
    players[playerId]?.full_name ?? players[playerId]?.last_name ?? playerId
  );
}

function createActivities(
  transactions: SleeperTransaction[],
  teams: TeamStanding[],
  players: Record<string, SleeperPlayer>,
): ActivityItem[] {
  const byRoster = new Map(teams.map((team) => [team.rosterId, team.teamName]));
  return transactions
    .filter((transaction) => transaction.status === 'complete')
    .sort((a, b) => b.created - a.created)
    .slice(0, 6)
    .map((transaction) => {
      const added = Object.keys(transaction.adds ?? {}).map((id) =>
        playerName(id, players),
      );
      const dropped = Object.keys(transaction.drops ?? {}).map((id) =>
        playerName(id, players),
      );
      const actors = transaction.roster_ids
        .map((id) => byRoster.get(id))
        .filter(Boolean)
        .join(' & ');
      const detail = [
        added.length ? `added ${added.join(', ')}` : '',
        dropped.length ? `dropped ${dropped.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      return {
        id: transaction.transaction_id,
        type:
          transaction.type === 'trade'
            ? 'trade'
            : transaction.type === 'waiver'
              ? 'waiver'
              : 'free_agent',
        title:
          transaction.type === 'trade'
            ? `Trade · ${actors}`
            : actors || 'League transaction',
        detail,
        time: new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
        }).format(new Date(transaction.created)),
      };
    });
}

async function getReigningChampion(previousLeagueId: string | null) {
  if (!previousLeagueId) return null;
  try {
    const [league, users, rosters] = await Promise.all([
      getLeague(previousLeagueId),
      getLeagueUsers(previousLeagueId),
      getLeagueRosters(previousLeagueId),
    ]);
    const winningRosterId = Number(
      league.metadata?.latest_league_winner_roster_id ?? 0,
    );
    const roster = rosters.find(
      (candidate) => candidate.roster_id === winningRosterId,
    );
    if (!roster) return null;
    const user = users.find(
      (candidate) => candidate.user_id === roster.owner_id,
    );
    return {
      teamName: teamNameFor(user, roster),
      ownerName: user?.display_name ?? 'League champion',
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
  if (!leagueId) return demoData();

  try {
    const state = await getNFLState();
    const league = await getLeague(leagueId);
    const week =
      league.status === 'complete'
        ? Number(league.settings.last_scored_leg ?? state.week)
        : state.week;
    const completedWeekCount =
      league.status === 'complete' ? week : Math.max(0, week - 1);
    const [
      users,
      rosters,
      matchups,
      transactions,
      trending,
      players,
      completedWeeks,
      drafts,
      reigningChampion,
    ] = await Promise.all([
      getLeagueUsers(leagueId),
      getLeagueRosters(leagueId),
      getMatchups(leagueId, week),
      getTransactions(leagueId, week),
      getTrendingPlayers('add', 5),
      getPlayers(),
      Promise.all(
        Array.from({ length: completedWeekCount }, (_, index) =>
          getMatchups(leagueId, index + 1),
        ),
      ),
      getDrafts(leagueId),
      getReigningChampion(league.previous_league_id),
    ]);
    const standings = addWeeklyPerformance(
      createStandings(rosters, users),
      completedWeeks,
    );
    const rostered = new Map(
      rosters.flatMap((roster) =>
        (roster.players ?? []).map((id) => [id, roster.roster_id] as const),
      ),
    );
    const byRoster = new Map(
      standings.map((team) => [team.rosterId, team.teamName]),
    );
    const matchupCards = createMatchups(
      matchups,
      standings,
      league.status === 'in_season',
    );
    const high = [...matchupCards]
      .flatMap((m) => [
        [m.home.teamName, m.homeScore] as const,
        [m.away.teamName, m.awayScore] as const,
      ])
      .sort((a, b) => b[1] - a[1])[0];

    const draft = drafts[0];
    return {
      mode: 'live',
      leagueName: league.name,
      season: league.season,
      week,
      statusLabel:
        league.status === 'in_season'
          ? `Week ${week} · Live league data`
          : `Week ${week} · ${league.status.replace('_', ' ')}`,
      updatedAt: 'Updated moments ago',
      standings,
      matchups: matchupCards,
      activities: createActivities(transactions, standings, players),
      trending: trending.slice(0, 3).map((item) => {
        const player = players[item.player_id];
        const owner = rostered.get(item.player_id);
        return {
          id: item.player_id,
          name: player?.full_name ?? item.player_id,
          position: player?.position ?? '—',
          team: player?.team ?? 'FA',
          count: item.count,
          available: owner == null,
          rosteredBy: owner ? byRoster.get(owner) : undefined,
        };
      }),
      narratives: [
        high
          ? `${high[0]} set this week’s pace with ${high[1].toFixed(1)} points.`
          : `Week ${week} is ready for kickoff.`,
        `${standings[0]?.teamName ?? 'The leader'} holds the top seed at ${standings[0]?.wins ?? 0}-${standings[0]?.losses ?? 0}.`,
        `${standings.filter((team) => team.wins >= (standings[5]?.wins ?? 0)).length} teams are currently at or above the playoff line.`,
      ],
      draft: draft
        ? {
            id: draft.draft_id,
            startTime: draft.start_time,
            status: draft.status,
            type: draft.type,
            rounds: draft.settings.rounds ?? draft.rounds,
            pickTimer: draft.settings.pick_timer ?? 0,
            orderSet: Boolean(
              draft.draft_order && Object.keys(draft.draft_order).length,
            ),
            maxKeepers: Number(league.settings.max_keepers ?? 0),
            rosterSize: league.roster_positions.length,
            pickOrder: draft.draft_order
              ? Object.entries(draft.draft_order)
                  .map(([userId, slot]) => {
                    const user = users.find((u) => u.user_id === userId);
                    const roster = rosters.find((r) => r.owner_id === userId);
                    const teamName =
                      roster && user
                        ? (roster.metadata?.team_name ??
                          user.metadata?.team_name?.trim() ??
                          user.display_name ??
                          `Team ${slot}`)
                        : `Team ${slot}`;
                    return { slot, teamName, avatar: user?.avatar ?? null };
                  })
                  .sort((a, b) => a.slot - b.slot)
              : [],
          }
        : null,
      reigningChampion,
    };
  } catch {
    return demoData();
  }
}
