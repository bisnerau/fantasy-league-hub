// Builds the local odds-playground snapshot for one week from public Sleeper
// feeds. Experimental and local only: never used for production voting.
//
//   node scripts/build-odds-snapshot.mjs 5            # best possible lineup
//   node scripts/build-odds-snapshot.mjs 5 --as-set   # lineup as set, with cover
//
// Method (matches the Week 4 trial):
// - Every rostered player is projected in MAC 12 scoring from Sleeper's
//   weekly projections. Games already played keep their recorded points.
// - By default each team fields its best legal lineup (QB, 2 RB, 2 WR, TE,
//   RB/WR flex, K, DEF), bench included, so moving players to the bench
//   cannot move the price. Selected starters who are not playing (bye, no
//   projection) are listed as "missing". Pass --as-set to price the lineup as
//   set instead, with the best eligible bench player covering anyone who is
//   not playing (bye, no projection, or Out/IR/PUP/suspended).
// - The "opponent adjusted" total nudges each QB/RB/WR/TE projection by how
//   many points that opponent has allowed to the position this season,
//   halved towards average and capped at ±12%.
// - The playground turns the projected margin into a win chance with a
//   logistic curve (20-point scale) and rounds it to fractional odds.
import { readFileSync, writeFileSync } from 'node:fs';

const week = Number(process.argv[2]);
const lineupBasis = process.argv.includes('--as-set') ? 'set' : 'best';
if (!Number.isInteger(week) || week < 2) {
  throw new Error('Usage: node scripts/build-odds-snapshot.mjs <week>');
}
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const leagueId = env.match(/NEXT_PUBLIC_SLEEPER_LEAGUE_ID=(\S+)/)?.[1];
if (!leagueId) throw new Error('NEXT_PUBLIC_SLEEPER_LEAGUE_ID missing');

const api = 'https://api.sleeper.app';
const get = async (path) => {
  const res = await fetch(`${api}${path}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
};

const [league, users, rosters, matchups, players] = await Promise.all([
  get(`/v1/league/${leagueId}`),
  get(`/v1/league/${leagueId}/users`),
  get(`/v1/league/${leagueId}/rosters`),
  get(`/v1/league/${leagueId}/matchups/${week}`),
  get('/v1/players/nfl'),
]);
const season = league.season;
const positions =
  'position[]=QB&position[]=RB&position[]=WR&position[]=TE&position[]=K&position[]=DEF';
const projections = new Map(
  (
    await get(
      `/projections/nfl/${season}/${week}?season_type=regular&${positions}`,
    )
  ).map((row) => [row.player_id, row]),
);
const pastStats = await Promise.all(
  Array.from({ length: week - 1 }, (_, i) =>
    get(`/stats/nfl/${season}/${i + 1}?season_type=regular`),
  ),
);

const scoring = league.scoring_settings;
const score = (stats) =>
  Object.entries(scoring).reduce(
    (sum, [key, weight]) => sum + (stats[key] ?? 0) * weight,
    0,
  );

// Kicker projections bucket 50+ yards together; league scoring splits them.
// Defence projections give an expected points-allowed figure, so spread it
// across the league's buckets rather than trusting one bucket flag.
const allowedBuckets = [
  [0, 0, 'pts_allow_0'],
  [1, 6, 'pts_allow_1_6'],
  [7, 13, 'pts_allow_7_13'],
  [14, 20, 'pts_allow_14_20'],
  [21, 27, 'pts_allow_21_27'],
  [28, 34, 'pts_allow_28_34'],
  [35, 99, 'pts_allow_35p'],
];
const normalCdf = (x) => {
  const t = 1 / (1 + (0.3275911 * Math.abs(x)) / Math.SQRT2);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-(x * x) / 2);
  return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
};
function projectedPoints(row, position) {
  const stats = { ...row.stats };
  if (position === 'K' && stats.fgm_50p != null && stats.fgm_50_59 == null) {
    stats.fgm_50_59 = stats.fgm_50p;
  }
  if (position === 'DEF' && Number.isFinite(stats.pts_allow)) {
    for (const [, , key] of allowedBuckets) delete stats[key];
    const sd = 9;
    for (const [low, high, key] of allowedBuckets) {
      stats[key] =
        normalCdf((high + 0.5 - stats.pts_allow) / sd) -
        normalCdf((low - 0.5 - stats.pts_allow) / sd);
    }
  }
  return score(stats);
}

// Points allowed by each NFL defence to each position, per game played.
const allowed = new Map();
for (const weekRows of pastStats) {
  const games = new Map();
  for (const row of weekRows) {
    const pos = players[row.player_id]?.position;
    if (!row.opponent || !['QB', 'RB', 'WR', 'TE'].includes(pos)) continue;
    const key = `${row.opponent}:${pos}`;
    games.set(key, (games.get(key) ?? 0) + score(row.stats));
  }
  for (const [key, points] of games) {
    const entry = allowed.get(key) ?? { points: 0, games: 0 };
    allowed.set(key, { points: entry.points + points, games: entry.games + 1 });
  }
}
const allowedRank = new Map();
const allowedFactor = new Map();
for (const pos of ['QB', 'RB', 'WR', 'TE']) {
  const rows = [...allowed]
    .filter(([key]) => key.endsWith(`:${pos}`))
    .map(([key, v]) => [key, v.points / v.games]);
  const average = rows.reduce((s, [, v]) => s + v, 0) / rows.length;
  rows.sort((a, b) => a[1] - b[1]);
  rows.forEach(([key, perGame], index) => {
    allowedRank.set(key, index + 1);
    const factor = 1 + 0.5 * (perGame / average - 1);
    allowedFactor.set(key, Math.min(1.12, Math.max(0.88, factor)));
  });
}
const teamsRanked = Math.max(...allowedRank.values());

const userById = new Map(users.map((u) => [u.user_id, u]));
const rosterById = new Map(rosters.map((r) => [r.roster_id, r]));
const previous = JSON.parse(
  readFileSync(
    new URL('../lib/data/experiments/odds-week-four.json', import.meta.url),
    'utf8',
  ),
);
const colors = new Map(
  previous.matchups.flatMap((m) => m.teams.map((t) => [t.id, t.color])),
);
const managerNames = new Map(
  previous.matchups.flatMap((m) => m.teams.map((t) => [t.id, t.name])),
);
const now = Date.now();
const todayEastern = new Date(now).toLocaleDateString('en-CA', {
  timeZone: 'America/New_York',
});

function playerEntry(id, matchup, adjusted) {
  const meta = players[id] ?? {};
  const position = meta.position ?? (id.length <= 3 ? 'DEF' : '?');
  const name =
    position === 'DEF'
      ? `${meta.first_name ?? id} ${meta.last_name ?? ''}`.trim()
      : (meta.full_name ?? `${meta.first_name} ${meta.last_name}`);
  const row = projections.get(id);
  // A game dated before today (US Eastern) is finished: its recorded points,
  // including a genuine zero, replace the projection.
  const finished = Boolean(row?.date && row.date < todayEastern);
  if (finished) {
    const recorded = matchup.players_points?.[id] ?? 0;
    return { name, position, points: recorded, locked: true };
  }
  if (!row?.stats || !row.opponent) return { name, position, points: null };
  let points = projectedPoints(row, position);
  let note = null;
  if (adjusted && ['QB', 'RB', 'WR', 'TE'].includes(position)) {
    const key = `${row.opponent}:${position}`;
    const factor = allowedFactor.get(key) ?? 1;
    points *= factor;
    const rank = allowedRank.get(key);
    if (rank && (rank <= 3 || rank > teamsRanked - 3)) {
      note = `${name} vs ${row.opponent}: ${
        rank > teamsRanked - 3 ? 'favourable' : 'difficult'
      } ${position} matchup (${rank}/${teamsRanked}; ${teamsRanked} is easiest).`;
    }
  }
  return {
    name,
    position,
    points: Math.round(points * 100) / 100,
    locked: false,
    note,
  };
}

const slots = league.roster_positions.filter((s) => s !== 'BN');
const eligible = (slot, position) =>
  slot === 'WRRB_FLEX' ? ['WR', 'RB'].includes(position) : slot === position;

function bestLineup(matchup, adjusted) {
  const roster = rosterById.get(matchup.roster_id);
  const entries = (roster.players ?? []).map((id) => ({
    id,
    ...playerEntry(id, matchup, adjusted),
  }));
  // Players whose game has finished are fixed where they were at kickoff:
  // starters keep their slot and points; bench players cannot come in.
  const lockedStarters = new Map(
    matchup.starters.flatMap((id, index) => {
      const entry = entries.find((p) => p.id === id);
      return entry?.locked ? [[index, entry]] : [];
    }),
  );
  const pool = entries
    .filter((p) => p.points != null && !p.locked)
    .sort((a, b) => b.points - a.points);
  const used = new Set();
  // Fixed slots first, then flex: optimal for a single RB/WR flex.
  const order = slots
    .map((slot, index) => ({ slot, index }))
    .sort(
      (a, b) => Number(a.slot === 'WRRB_FLEX') - Number(b.slot === 'WRRB_FLEX'),
    );
  const filled = order.map(({ slot, index }) => {
    if (lockedStarters.has(index)) return lockedStarters.get(index);
    const pick = pool.find(
      (p) => !used.has(p.id) && eligible(slot, p.position),
    );
    if (pick) used.add(pick.id);
    return pick;
  });
  const lineup = filled.filter(Boolean).map((p) => ({
    name: p.name,
    position: p.position,
    points: p.points,
    locked: p.locked,
    fromBench: !matchup.starters.includes(p.id),
    note: p.note ?? null,
  }));
  const missing = matchup.starters
    .filter((id) => id !== '0')
    .filter((id) => playerEntry(id, matchup, false).points == null)
    .map((id) => playerEntry(id, matchup, false).name);
  return { lineup, missing };
}

const unavailable = new Set(['Out', 'IR', 'PUP', 'Sus']);
const isOut = (id, entry) =>
  id === '0' ||
  entry.points == null ||
  (!entry.locked && unavailable.has(players[id]?.injury_status));

function setLineup(matchup, adjusted) {
  const roster = rosterById.get(matchup.roster_id);
  const bench = (roster.players ?? [])
    .filter((id) => !matchup.starters.includes(id))
    .map((id) => ({ id, ...playerEntry(id, matchup, adjusted) }))
    .filter((p) => !isOut(p.id, p))
    .sort((a, b) => b.points - a.points);
  const used = new Set();
  const missing = [];
  const lineup = slots.flatMap((slot, index) => {
    const id = matchup.starters[index] ?? '0';
    const entry = { id, ...playerEntry(id, matchup, adjusted) };
    let pick = entry;
    if (isOut(id, entry)) {
      if (id !== '0') missing.push(entry.name);
      pick = bench.find((p) => !used.has(p.id) && eligible(slot, p.position));
      if (!pick) return [];
      used.add(pick.id);
    }
    return [
      {
        name: pick.name,
        position: pick.position,
        points: pick.points,
        locked: pick.locked,
        fromBench: pick !== entry,
        note: pick.note ?? null,
      },
    ];
  });
  return { lineup, missing };
}

const buildLineup = lineupBasis === 'best' ? bestLineup : setLineup;

const byMatchup = new Map();
for (const m of matchups) {
  byMatchup.set(m.matchup_id, [...(byMatchup.get(m.matchup_id) ?? []), m]);
}
const round = (n) => Math.round(n * 100) / 100;
const snapshot = {
  snapshot: new Date(now).toISOString(),
  season: Number(season),
  week,
  lineupBasis,
  method: `MAC 12 scoring on Sleeper weekly projections; ${
    lineupBasis === 'best'
      ? 'best legal lineup including bench'
      : 'lineup as set, with the best eligible bench player covering any starter who is not playing'
  }; opponent adjustment from points allowed by position this season, halved and capped at ±12%.`,
  matchups: [...byMatchup]
    .sort(([a], [b]) => a - b)
    .map(([id, pair]) => ({
      id,
      teams: pair
        .sort((a, b) => a.roster_id - b.roster_id)
        .map((m) => {
          const roster = rosterById.get(m.roster_id);
          const user = userById.get(roster.owner_id) ?? {};
          const base = buildLineup(m, false);
          const adjusted = buildLineup(m, true);
          const sum = (lineup) =>
            round(lineup.reduce((s, p) => s + p.points, 0));
          const strip = (lineup) => lineup.map(({ note: _note, ...p }) => p);
          return {
            id: m.roster_id,
            name: managerNames.get(m.roster_id) ?? user.display_name,
            color: colors.get(m.roster_id) ?? '#888888',
            baseTotal: sum(base.lineup),
            adjustedTotal: sum(adjusted.lineup),
            banked: round(
              base.lineup
                .filter((p) => p.locked)
                .reduce((s, p) => s + p.points, 0),
            ),
            missing: base.missing,
            matchupNotes: adjusted.lineup.flatMap((p) =>
              p.note ? [p.note] : [],
            ),
            teamName: user.metadata?.team_name ?? user.display_name,
            avatar: user.avatar ?? null,
            wins: roster.settings.wins,
            losses: roster.settings.losses,
            ties: roster.settings.ties,
            lineup: strip(base.lineup),
            adjustedLineup: strip(adjusted.lineup),
          };
        }),
    })),
};

const words = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
];
const out = new URL(
  `../lib/data/experiments/odds-week-${words[week]}.json`,
  import.meta.url,
);
writeFileSync(out, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${out.pathname}`);
for (const m of snapshot.matchups) {
  console.log(
    m.id,
    m.teams
      .map(
        (t) =>
          `${t.name} ${t.baseTotal}/${t.adjustedTotal}${t.missing.length ? ` missing:${t.missing.join(',')}` : ''}`,
      )
      .join('  v  '),
  );
}
