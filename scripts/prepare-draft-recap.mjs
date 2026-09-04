import { writeFile } from 'node:fs/promises';

const apiRoot = 'https://api.sleeper.app/v1';
const leagueId = process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID;

if (!leagueId) {
  throw new Error('NEXT_PUBLIC_SLEEPER_LEAGUE_ID is required.');
}

async function sleeper(path) {
  const response = await fetch(`${apiRoot}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Sleeper request failed (${response.status}): ${path}`);
  }

  return response.json();
}

function playerName(pick, player) {
  const metadataName = [pick.metadata?.first_name, pick.metadata?.last_name]
    .filter(Boolean)
    .join(' ');

  return player?.full_name || metadataName || pick.player_id;
}

const [league, drafts, rosters, users] = await Promise.all([
  sleeper(`/league/${leagueId}`),
  sleeper(`/league/${leagueId}/drafts`),
  sleeper(`/league/${leagueId}/rosters`),
  sleeper(`/league/${leagueId}/users`),
]);

const draft =
  drafts.find((candidate) => candidate.season === league.season) ?? drafts[0];

if (!draft) {
  throw new Error('Sleeper has not created a draft for this league yet.');
}

if (draft.status !== 'complete') {
  throw new Error(
    `The draft is currently “${draft.status}”. Run this again after Sleeper marks it complete.`,
  );
}

const picks = await sleeper(`/draft/${draft.draft_id}/picks`);
const rounds = Number(draft.settings?.rounds ?? draft.rounds ?? 0);
const expectedPicks = Number(league.total_rosters) * rounds;

if (!picks.length || (expectedPicks && picks.length < expectedPicks)) {
  throw new Error(
    `Sleeper returned ${picks.length} picks; expected ${expectedPicks}. The draft may still be settling.`,
  );
}

// Sleeper asks consumers to retrieve the full player map no more than once per
// day. It is fetched only after the completed-draft checks above have passed.
const players = await sleeper('/players/nfl');
const usersById = new Map(users.map((user) => [user.user_id, user]));
const rosterById = new Map(
  rosters.map((roster) => [Number(roster.roster_id), roster]),
);

const teams = [...Array(Number(league.total_rosters))].map((_, index) => {
  const rosterId = index + 1;
  const roster = rosterById.get(rosterId);
  const owner = usersById.get(roster?.owner_id ?? '');
  const rosterPicks = picks
    .filter((pick) => Number(pick.roster_id) === rosterId)
    .sort((a, b) => Number(a.pick_no) - Number(b.pick_no));
  const positionCounts = {};

  const normalizedPicks = rosterPicks.map((pick) => {
    const player = players[pick.player_id];
    const position = pick.metadata?.position ?? player?.position ?? 'Unknown';
    const searchRank = Number(player?.search_rank);
    positionCounts[position] = (positionCounts[position] ?? 0) + 1;

    return {
      round: Number(pick.round),
      overall: Number(pick.pick_no),
      draftSlot: Number(pick.draft_slot),
      playerId: pick.player_id,
      player: playerName(pick, player),
      position,
      nflTeam: pick.metadata?.team ?? player?.team ?? 'FA',
      age: Number.isFinite(Number(player?.age)) ? Number(player.age) : null,
      yearsExperience: Number.isFinite(Number(player?.years_exp))
        ? Number(player.years_exp)
        : null,
      injuryStatus:
        player?.injury_status ?? pick.metadata?.injury_status ?? null,
      sleeperRank: Number.isFinite(searchRank) ? searchRank : null,
      valueAgainstSleeperRank: Number.isFinite(searchRank)
        ? Number(pick.pick_no) - searchRank
        : null,
    };
  });

  return {
    rosterId,
    draftSlot: normalizedPicks[0]?.draftSlot ?? null,
    manager: owner?.display_name ?? `Roster ${rosterId}`,
    teamName:
      roster?.metadata?.team_name ??
      owner?.metadata?.team_name ??
      owner?.display_name ??
      `Team ${rosterId}`,
    ownerId: roster?.owner_id ?? null,
    avatar: owner?.metadata?.avatar ?? owner?.avatar ?? null,
    positionCounts,
    picks: normalizedPicks,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  source: 'Sleeper',
  league: {
    id: league.league_id,
    name: league.name,
    season: league.season,
    rosterPositions: league.roster_positions,
    scoringSettings: league.scoring_settings,
  },
  draft: {
    id: draft.draft_id,
    status: draft.status,
    type: draft.type,
    rounds,
    completedPicks: picks.length,
    expectedPicks,
  },
  gradingRubric: {
    startingLineupStrength: 30,
    valueAtDraftPosition: 25,
    rosterConstruction: 20,
    depthAndUpside: 15,
    injuryByeAndVolatilityRisk: 10,
  },
  editorialRules: {
    tone: 'Sharp, funny and fair',
    managerContext: 'Use the existing MAC 12 manager biographies and history',
    leinsterPool: 'Current players and former Leinster favourites',
    freshness:
      'Research current NFL and Leinster information immediately before writing',
    researchMinimums: {
      currentFantasyExpertSources: 3,
      consensusAdpRequired: true,
      expertConsensusRankingsRequired: true,
      seasonProjectionsRequired: true,
      officialNflStatusChecksRequired: true,
      leagueScoringAdjustmentRequired: true,
      publishedSourceLinksRequired: true,
    },
  },
  teams,
};

const outputPath = `/private/tmp/mac12-draft-recap-${league.season}.json`;
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(
  `Draft recap input ready: ${teams.length} teams and ${picks.length} picks written to ${outputPath}`,
);
