import type {
  SleeperLeague,
  SleeperRoster,
  SleeperUser,
  SleeperMatchup,
  SleeperPlayer,
} from '@/lib/sleeper/types';
import { matchupScore } from '@/lib/sleeper/scores';
import calibration from '../data/playoffs/calibration.json' with { type: 'json' };
import names from '../data/experiments/odds-week-eleven.json' with { type: 'json' };
import { returnWindows, injurySources } from '@/lib/data/playoffs/injuries';
import { MODEL_VERSION } from './types';
import type { ForecastInput, ForecastLineup, ForecastPlayer } from './types';
import { projectionPoints } from './scoring';
import { rankTeams } from './model';
import { validateInput } from './validation';

type Projection = {
  player_id: string;
  team: string;
  opponent: string;
  date: string;
  stats: Record<string, number>;
};
type Event = {
  id: string;
  date: string;
  status: { type: { state: string; completed: boolean } };
  competitions: { competitors: { team: { abbreviation: string } }[] }[];
};
const api = 'https://api.sleeper.app';
export async function feed<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(12_000),
    next: { revalidate: 300 },
  });
  if (!response.ok)
    throw Error(`Forecast source unavailable (${response.status})`);
  return response.json() as Promise<T>;
}
const normalize = (team: string) => ({ WSH: 'WAS', LAR: 'LA' })[team] ?? team;
async function scoreboard(dates: string[]) {
  const boards = await Promise.all(
    [...new Set(dates)].map((date) =>
      feed<{ events: Event[] }>(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date.replaceAll('-', '')}`,
      ),
    ),
  );
  if (boards.some((b) => !Array.isArray(b.events) || !b.events.length))
    throw Error('NFL completion feed is missing');
  return boards.flatMap((b) => b.events);
}
function gameFor(events: Event[], team: string, date: string) {
  const matches = events.filter(
    (e) =>
      e.competitions[0]?.competitors.some(
        (c) => normalize(c.team.abbreviation) === normalize(team),
      ) &&
      new Date(e.date).toLocaleDateString('en-CA', {
        timeZone: 'America/New_York',
      }) === date,
  );
  if (matches.length !== 1)
    throw Error(`Cannot verify NFL game for ${team} on ${date}`);
  return matches[0];
}
const stateOf = (game: Event): ForecastPlayer['state'] =>
  game.status.type.completed && game.status.type.state === 'post'
    ? 'post'
    : game.status.type.state === 'pre'
      ? 'pre'
      : 'in';
function groups(rows: SleeperMatchup[], count: number) {
  if (
    rows.length !== count ||
    new Set(rows.map((r) => r.roster_id)).size !== count
  )
    throw Error('Incomplete fantasy schedule');
  const pairs = new Map<number, SleeperMatchup[]>();
  for (const row of rows) {
    if (!row.matchup_id) throw Error('Missing fantasy fixture');
    const pair = pairs.get(row.matchup_id) ?? [];
    pair.push(row);
    pairs.set(row.matchup_id, pair);
  }
  if ([...pairs.values()].some((p) => p.length !== 2))
    throw Error('Unpaired fantasy fixture');
  return pairs;
}
export async function buildInput(
  leagueId: string,
  previous?: ForecastInput,
): Promise<ForecastInput> {
  const [league, rosters, users, players] = await Promise.all([
    feed<SleeperLeague>(`${api}/v1/league/${leagueId}`),
    feed<SleeperRoster[]>(`${api}/v1/league/${leagueId}/rosters`),
    feed<SleeperUser[]>(`${api}/v1/league/${leagueId}/users`),
    feed<Record<string, SleeperPlayer & { injury_status?: string | null }>>(
      `${api}/v1/players/nfl`,
    ),
  ]);
  const end = (league.settings.playoff_week_start ?? 0) - 1,
    completed = Math.min(league.settings.last_scored_leg ?? 0, end);
  if (
    end !== 14 ||
    league.settings.playoff_teams !== 6 ||
    league.total_rosters !== 12 ||
    league.settings.league_average_match
  )
    throw Error('Unsupported league format');
  if (calibration.throughWeek > completed)
    throw Error('Calibration is later than the forecast cutoff');
  const schedule = await Promise.all(
    Array.from({ length: end }, (_, i) =>
      feed<SleeperMatchup[]>(`${api}/v1/league/${leagueId}/matchups/${i + 1}`),
    ),
  );
  const baseline = new Map(
    rosters.map((r) => [
      r.roster_id,
      { wins: 0, losses: 0, ties: 0, pf: 0, pa: 0 },
    ]),
  );
  for (let w = 0; w < completed; w++)
    for (const [a, b] of groups(schedule[w], 12).values()) {
      if (matchupScore(a) === null || matchupScore(b) === null)
        throw Error('Missing completed score');
      for (const [team, other] of [
        [a, b],
        [b, a],
      ]) {
        const s = baseline.get(team.roster_id)!;
        s.pf += matchupScore(team)!;
        s.pa += matchupScore(other)!;
        s.wins += Number(matchupScore(team)! > matchupScore(other)!);
        s.losses += Number(matchupScore(team)! < matchupScore(other)!);
        s.ties += Number(matchupScore(team) === matchupScore(other));
      }
    }
  const teams = rosters
    .map((r) => {
      const b = baseline.get(r.roster_id)!,
        s = r.settings;
      const pf = (s.fpts ?? NaN) + (s.fpts_decimal ?? 0) / 100,
        pa = (s.fpts_against ?? NaN) + (s.fpts_against_decimal ?? 0) / 100;
      if (
        b.wins !== s.wins ||
        b.losses !== s.losses ||
        b.ties !== s.ties ||
        Math.abs(b.pf - pf) > 0.02 ||
        Math.abs(b.pa - pa) > 0.02
      )
        throw Error('Completed-week baseline disagrees with league standings');
      const user = users.find((u) => u.user_id === r.owner_id),
        known = names.matchups
          .flatMap((m) => m.teams)
          .find((t) => t.id === r.roster_id);
      return {
        id: r.roster_id,
        name:
          user?.metadata?.team_name ??
          user?.display_name ??
          `Team ${r.roster_id}`,
        manager: known?.name ?? user?.display_name ?? `Manager ${r.roster_id}`,
        wins: b.wins,
        losses: b.losses,
        ties: b.ties,
        pointsFor: pf,
        pointsAgainst: pa,
        rank: 0,
      };
    })
    .sort((a, b) =>
      rankTeams(
        { units: a.wins * 2 + a.ties, pf: a.pointsFor, pa: a.pointsAgainst },
        { units: b.wins * 2 + b.ties, pf: b.pointsFor, pa: b.pointsAgainst },
      ),
    );
  teams.forEach((t, i) => (t.rank = i + 1));
  const fixtures: ForecastInput['fixtures'] = [],
    lineups: ForecastLineup[] = [];
  const slots = league.roster_positions.filter((s) => s !== 'BN');
  for (let week = completed + 1; week <= end; week++) {
    const rows = schedule[week - 1];
    if (rows.some((r) => r.custom_points != null))
      throw Error(
        'Commissioner-adjusted remaining scores require reconciliation',
      );
    for (const [id, [a, b]] of groups(rows, 12))
      fixtures.push({
        key: `${week}:${id}`,
        week,
        matchupId: id,
        home: a.roster_id,
        away: b.roster_id,
      });
    const projections = await feed<Projection[]>(
      `${api}/projections/nfl/${league.season}/${week}?season_type=regular&position[]=QB&position[]=RB&position[]=WR&position[]=TE&position[]=K&position[]=DEF`,
    );
    if (!Array.isArray(projections) || projections.length < 200)
      throw Error('Incomplete weekly projections');
    const events = await scoreboard(
      projections.filter((p) => p.date).map((p) => p.date),
    );
    const projected = new Map(projections.map((p) => [p.player_id, p]));
    const playing = new Set(
      projections.filter((p) => p.date).map((p) => p.team),
    );
    for (const roster of rosters) {
      const row = rows.find((r) => r.roster_id === roster.roster_id)!;
      const lineup: ForecastLineup = {
        rosterId: roster.roster_id,
        week,
        players: [],
        locked: [],
        notes: [],
        starterIds: row.starters,
      };
      for (const id of new Set([
        ...(roster.players ?? []),
        ...row.starters.filter((id) => id !== '0'),
      ])) {
        const p = players[id];
        if (!p?.position || !p.team) continue;
        const name = p.full_name ?? `${p.first_name} ${p.last_name}`,
          status = p.injury_status ?? p.status;
        let projection = projected.get(id);
        const excluded =
          ['Out', 'IR', 'PUP', 'Sus', 'DNR', 'NA'].includes(status ?? '') ||
          (roster.reserve ?? []).includes(id);
        if (excluded)
          lineup.notes.push(
            `${name}: ${status ?? 'reserve'}; excluded through Week 14 without a documented return window (Sleeper, checked ${new Date().toISOString().slice(0, 10)}).`,
          );
        else if (status === 'Questionable')
          lineup.notes.push(
            `${name}: questionable; projection remains eligible (Sleeper, checked ${new Date().toISOString().slice(0, 10)}).`,
          );
        if (!projection?.date) {
          if (!playing.has(normalize(p.team))) {
            lineup.notes.push(`${name}: no scheduled NFL game this week.`);
            continue;
          }
          if (!excluded)
            throw Error(`Missing roster projection: ${name}, Week ${week}`);
          const event = events.find((e) =>
            e.competitions[0].competitors.some(
              (c) => normalize(c.team.abbreviation) === normalize(p.team!),
            ),
          );
          if (!event) throw Error('Missing NFL game for unavailable starter');
          projection = {
            player_id: id,
            team: p.team,
            opponent: '',
            date: new Date(event.date).toLocaleDateString('en-CA', {
              timeZone: 'America/New_York',
            }),
            stats: {},
          };
        }
        const game = gameFor(events, projection.team, projection.date),
          state = stateOf(game),
          slot = row.starters.indexOf(id);
        const actual = state === 'post' ? row.players_points?.[id] : null;
        if (state === 'post' && slot >= 0 && !Number.isFinite(actual))
          throw Error('Final starter points are missing');
        let mean = projectionPoints(
          projection.stats,
          p.position,
          league.scoring_settings,
        );
        if (state === 'in') {
          const pregame = previous?.lineups
            .find((l) => l.week === week && l.rosterId === roster.roster_id)
            ?.players.find((p) => p.id === id);
          if (!pregame)
            throw Error('No frozen pregame estimate for a game in progress');
          mean = pregame.mean;
        }
        lineup.players.push({
          id,
          name,
          position: p.position,
          team: p.team,
          mean,
          variance:
            calibration.positionVariance[
              p.position as keyof typeof calibration.positionVariance
            ],
          available: !excluded,
          gameId: game.id,
          kickoff: game.date,
          state,
          actual: actual ?? null,
        });
        if (state !== 'pre' && slot >= 0)
          lineup.locked.push({ slot, playerId: id });
      }
      lineups.push(lineup);
    }
  }
  const asOf = new Date().toISOString();
  const input: ForecastInput = {
    version: MODEL_VERSION,
    leagueId,
    season: Number(league.season),
    asOf,
    sourceCutoff: asOf,
    completedThrough: completed,
    regularSeasonWeeks: end,
    playoffTeams: 6,
    slots,
    teams,
    fixtures,
    lineups,
    returns: returnWindows,
    assumptions: injurySources,
    calibration,
  };
  validateInput(input);
  return input;
}
// Public reads bank newly final games in memory only. The published inputs and
// pregame means remain untouched; the next authorised daily run persists a snapshot.
export async function refreshCompletedGames(
  saved: ForecastInput,
): Promise<ForecastInput> {
  if (!saved.fixtures.length) return saved;
  const input = structuredClone(saved);
  const dates = input.lineups.flatMap((l) =>
    l.players
      .filter((p) => p.state !== 'post' && Date.parse(p.kickoff) <= Date.now())
      .map((p) =>
        new Date(p.kickoff).toLocaleDateString('en-CA', {
          timeZone: 'America/New_York',
        }),
      ),
  );
  if (!dates.length) return saved;
  const events = await scoreboard(dates),
    byId = new Map(events.map((e) => [e.id, e]));
  if (
    input.lineups.some((l) =>
      l.players.some(
        (p) =>
          p.state !== 'post' &&
          Date.parse(p.kickoff) <= Date.now() &&
          !byId.has(p.gameId),
      ),
    )
  )
    throw Error('Missing NFL game status');
  const weeks = [
    ...new Set(
      input.lineups
        .filter((l) => l.players.some((p) => byId.has(p.gameId)))
        .map((l) => l.week),
    ),
  ];
  const rows = new Map(
    await Promise.all(
      weeks.map(
        async (w) =>
          [
            w,
            await feed<SleeperMatchup[]>(
              `${api}/v1/league/${input.leagueId}/matchups/${w}`,
            ),
          ] as const,
      ),
    ),
  );
  let changed = false;
  for (const lineup of input.lineups) {
    const row = rows
      .get(lineup.week)
      ?.find((r) => r.roster_id === lineup.rosterId);
    if (!row) {
      if (rows.has(lineup.week)) throw Error('Incomplete current matchup feed');
      continue;
    }
    if (
      row.starters.some(
        (id) =>
          id !== '0' &&
          !lineup.players.some((p) => p.id === id) &&
          !lineup.starterIds?.includes(id),
      )
    )
      throw Error('New starter requires fresh daily roster inputs');
    for (const p of lineup.players) {
      const event = byId.get(p.gameId);
      if (!event) continue;
      const state = stateOf(event);
      if (state === p.state) continue;
      changed = true;
      p.state = state;
      const slot = row.starters.indexOf(p.id);
      if (slot >= 0) {
        const old = lineup.locked.find((l) => l.slot === slot);
        if (old && old.playerId !== p.id) throw Error('Locked starter changed');
        if (!old) lineup.locked.push({ slot, playerId: p.id });
      }
      if (state === 'post') {
        p.actual = row.players_points?.[p.id] ?? null;
        if (slot >= 0 && !Number.isFinite(p.actual))
          throw Error('Missing final score');
      }
    }
  }
  if (!changed) return saved;
  input.sourceCutoff = new Date().toISOString();
  validateInput(input);
  return input;
}
