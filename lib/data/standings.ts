import { matchupScore } from '@/lib/sleeper/scores';
import type { SleeperMatchup } from '@/lib/sleeper/types';

export type Result = 'W' | 'L' | 'T';
export type Record3 = { wins: number; losses: number; ties: number };

export type TeamStanding = {
  rosterId: number;
  ownerId: string;
  franchiseId: string | null;
  teamName: string;
  ownerName: string;
  avatar: string | null;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number | null;
  pointsAgainst: number | null;
  medianWins: number;
  medianLosses: number;
  streak: string;
  /** Head-to-head results, oldest first. Empty when history is unavailable. */
  form: Result[];
  /** Record against every other scored team each week, or null without history. */
  allPlay: Record3 | null;
  /** Seed before the latest completed week, or null when it cannot be verified. */
  previousRank: number | null;
  rank: number;
};

type Rankable = Pick<TeamStanding, 'rosterId' | 'wins' | 'ties' | 'pointsFor'>;

/** Sleeper's order: wins, then ties, then points for, then roster id. */
export function compareStandings(a: Rankable, b: Rankable) {
  return (
    b.wins - a.wins ||
    b.ties - a.ties ||
    (b.pointsFor ?? -Infinity) - (a.pointsFor ?? -Infinity) ||
    a.rosterId - b.rosterId
  );
}

const scored = (week: SleeperMatchup[]) =>
  week.filter(
    (entry) => entry.matchup_id != null && matchupScore(entry) != null,
  );

function headToHead(week: SleeperMatchup[], rosterId: number) {
  const valid = scored(week);
  const own = valid.find((entry) => entry.roster_id === rosterId);
  if (!own) return null;
  const opponent = valid.find(
    (entry) =>
      entry.matchup_id === own.matchup_id && entry.roster_id !== rosterId,
  );
  if (!opponent) return null;
  const points = matchupScore(own)!;
  const against = matchupScore(opponent)!;
  const result: Result =
    points === against ? 'T' : points > against ? 'W' : 'L';
  return { result, points };
}

/** Rebuilds the table from matchups alone, or null if any result is missing. */
function rebuildOrder(rosterIds: number[], weeks: SleeperMatchup[][]) {
  const rows: (Rankable & Record3)[] = [];
  for (const rosterId of rosterIds) {
    const row = { rosterId, wins: 0, losses: 0, ties: 0, pointsFor: 0 };
    for (const week of weeks) {
      const game = headToHead(week, rosterId);
      if (!game) return null;
      if (game.result === 'W') row.wins += 1;
      else if (game.result === 'L') row.losses += 1;
      else row.ties += 1;
      row.pointsFor += game.points;
    }
    rows.push(row);
  }
  return rows.sort(compareStandings);
}

/**
 * Seeds before the latest completed week. Returns null unless replaying every
 * week reproduces Sleeper's current order and records exactly.
 */
export function getPreviousRanks(
  standings: TeamStanding[],
  weeks: SleeperMatchup[][],
): Map<number, number> | null {
  if (weeks.length < 2 || !standings.length) return null;
  const ids = standings.map((team) => team.rosterId);
  const current = rebuildOrder(ids, weeks);
  const bySeed = [...standings].sort((a, b) => a.rank - b.rank);
  const matches =
    current?.every((row, index) => {
      const team = bySeed[index];
      return (
        row.rosterId === team.rosterId &&
        row.wins === team.wins &&
        row.losses === team.losses &&
        row.ties === team.ties
      );
    }) ?? false;
  if (!matches) return null;
  const previous = rebuildOrder(ids, weeks.slice(0, -1));
  if (!previous) return null;
  return new Map(previous.map((row, index) => [row.rosterId, index + 1]));
}

/** Adds median record, streak, form, all-play and verified movement. */
export function getWeeklyPerformance(
  standings: TeamStanding[],
  weeks: SleeperMatchup[][],
): TeamStanding[] {
  const previousRanks = getPreviousRanks(standings, weeks);
  return standings.map((team) => {
    let medianWins = 0;
    let medianLosses = 0;
    let allPlay: Record3 | null = null;
    const form: Result[] = [];
    for (const week of weeks) {
      const valid = scored(week);
      const own = valid.find((entry) => entry.roster_id === team.rosterId);
      if (!own) continue;
      const points = matchupScore(own)!;
      const scores = valid
        .map((entry) => matchupScore(entry)!)
        .sort((a, b) => a - b);
      const middle = Math.floor(scores.length / 2);
      const median =
        scores.length % 2
          ? scores[middle]
          : (scores[middle - 1] + scores[middle]) / 2;
      if (points >= median) medianWins += 1;
      else medianLosses += 1;
      allPlay ??= { wins: 0, losses: 0, ties: 0 };
      for (const entry of valid) {
        if (entry.roster_id === team.rosterId) continue;
        const other = matchupScore(entry)!;
        if (points > other) allPlay.wins += 1;
        else if (points < other) allPlay.losses += 1;
        else allPlay.ties += 1;
      }
      const game = headToHead(week, team.rosterId);
      if (game) form.push(game.result);
    }
    const last = form.at(-1);
    let streak = 0;
    for (
      let index = form.length - 1;
      index >= 0 && form[index] === last;
      index -= 1
    )
      streak += 1;
    return {
      ...team,
      medianWins,
      medianLosses,
      streak: last ? `${last}${streak}` : '—',
      form,
      allPlay,
      previousRank: previousRanks?.get(team.rosterId) ?? null,
    };
  });
}

export type SortKey = 'rank' | 'pointsFor' | 'allPlay' | 'median';

const winShare = (record: Record3 | null) => {
  if (!record) return null;
  const games = record.wins + record.losses + record.ties;
  return games ? (record.wins + record.ties / 2) / games : null;
};

/** Sorts a copy for the chips; missing values always sink below real ones. */
export function sortStandings(standings: TeamStanding[], key: SortKey) {
  const value = (team: TeamStanding) =>
    key === 'pointsFor'
      ? team.pointsFor
      : key === 'allPlay'
        ? winShare(team.allPlay)
        : key === 'median'
          ? team.medianWins
          : -team.rank;
  return [...standings].sort((a, b) => {
    const left = value(a);
    const right = value(b);
    if (left == null || right == null)
      return left == null && right == null
        ? a.rank - b.rank
        : left == null
          ? 1
          : -1;
    return right - left || a.rank - b.rank;
  });
}

export const gamesPlayed = (team: Record3) =>
  team.wins + team.losses + team.ties;

export const formatRecord = (team: Record3) =>
  `${team.wins}-${team.losses}${team.ties ? `-${team.ties}` : ''}`;

const plural = (value: number, word: string) =>
  `${value} ${word}${value === 1 ? '' : 's'}`;

export type CutLine = {
  lastIn: TeamStanding;
  firstOut: TeamStanding;
  gap: string;
};

/** The last playoff seed against the first team outside it. */
export function getCutLine(
  standings: TeamStanding[],
  playoffTeams: number,
): CutLine | null {
  const bySeed = [...standings].sort((a, b) => a.rank - b.rank);
  const lastIn = bySeed[playoffTeams - 1];
  const firstOut = bySeed[playoffTeams];
  if (!lastIn || !firstOut || !bySeed.some((team) => gamesPlayed(team)))
    return null;
  const wins =
    lastIn.wins + lastIn.ties / 2 - (firstOut.wins + firstOut.ties / 2);
  if (wins)
    return { lastIn, firstOut, gap: `${plural(Math.abs(wins), 'win')} apart` };
  const points =
    lastIn.pointsFor != null && firstOut.pointsFor != null
      ? Math.abs(lastIn.pointsFor - firstOut.pointsFor)
      : null;
  return {
    lastIn,
    firstOut,
    gap:
      points == null
        ? 'Level on wins'
        : `Level on wins · ${points.toFixed(1)} PF apart`,
  };
}

export type Superlative = {
  key: 'scorer' | 'schedule' | 'luck';
  label: string;
  team: TeamStanding;
  value: string;
};

const top = <T>(items: T[], score: (item: T) => number | null): T | undefined =>
  items
    .filter((item) => score(item) != null)
    .sort((a, b) => score(b)! - score(a)!)[0];

/** Wins above what the team's all-play share predicts, or null. */
export function getLuck(team: TeamStanding) {
  const share = winShare(team.allPlay);
  const games = gamesPlayed(team);
  if (share == null || !games) return null;
  return team.wins + team.ties / 2 - share * games;
}

/** Up to three verified superlatives; each hides when its inputs are missing. */
export function getSuperlatives(standings: TeamStanding[]): Superlative[] {
  if (!standings.some((team) => gamesPlayed(team))) return [];
  const bySeed = [...standings].sort((a, b) => a.rank - b.rank);
  const scorer = top(bySeed, (team) => team.pointsFor);
  const schedule = top(bySeed, (team) => team.pointsAgainst);
  const lucky = top(bySeed, getLuck);
  const luck = lucky ? getLuck(lucky)! : null;
  return [
    scorer && {
      key: 'scorer' as const,
      label: 'Top scorer',
      team: scorer,
      value: `${scorer.pointsFor!.toFixed(1)} PF`,
    },
    schedule && {
      key: 'schedule' as const,
      label: 'Toughest schedule',
      team: schedule,
      value: `${schedule.pointsAgainst!.toFixed(1)} PA`,
    },
    lucky &&
      luck != null &&
      luck > 0 && {
        key: 'luck' as const,
        label: 'Luckiest',
        team: lucky,
        value: `${formatRecord(lucky)} · all-play ${formatRecord(lucky.allPlay!)}`,
      },
  ].filter((item): item is Superlative => Boolean(item));
}
