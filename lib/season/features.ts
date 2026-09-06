import type {
  SleeperMatchup,
  SleeperTransaction,
  SleeperBracketMatch,
} from '@/lib/sleeper/types';
import { matchupScore } from '@/lib/sleeper/scores';
import { sundayKickoffForWeek } from '@/lib/predictions/rules';

export type Award = {
  kind: 'solicitor' | 'escape' | 'waiver';
  rosterId: number;
  detail: string;
  playerId?: string;
};
export const awardNames = {
  solicitor: 'The Schedule Solicitor',
  escape: 'The Get Away With It Award',
  waiver: 'The Waiver Receipt',
};
export function validWeek(rows: SleeperMatchup[]) {
  if (
    !Array.isArray(rows) ||
    rows.length !== 12 ||
    new Set(rows.map((r) => r.roster_id)).size !== 12 ||
    rows.some(
      (r) =>
        !Number.isInteger(r.roster_id) ||
        r.roster_id < 1 ||
        r.roster_id > 12 ||
        matchupScore(r) === null ||
        !Number.isInteger(r.matchup_id),
    )
  )
    return false;
  return rows.every(
    (r) => rows.filter((o) => o.matchup_id === r.matchup_id).length === 2,
  );
}
export function starterPoints(row: SleeperMatchup, playerId: string) {
  const index = row.starters.indexOf(playerId);
  if (index < 0) return null;
  const score = row.starters_points?.[index] ?? row.players_points?.[playerId];
  return typeof score === 'number' && Number.isFinite(score) ? score : null;
}
export function weeklyAwards(
  rows: SleeperMatchup[],
  transactions: SleeperTransaction[] | null,
  week: number,
) {
  if (!validWeek(rows)) return null;
  const awards: Award[] = [];
  const losses = rows.filter(
    (r) =>
      matchupScore(r)! <
      matchupScore(
        rows.find(
          (o) => o.matchup_id === r.matchup_id && o.roster_id !== r.roster_id,
        )!,
      )!,
  );
  const wins = rows.filter(
    (r) =>
      matchupScore(r)! >
      matchupScore(
        rows.find(
          (o) => o.matchup_id === r.matchup_id && o.roster_id !== r.roster_id,
        )!,
      )!,
  );
  const high = Math.max(...losses.map((r) => matchupScore(r)!));
  const low = Math.min(...wins.map((r) => matchupScore(r)!));
  for (const row of losses.filter((r) => matchupScore(r) === high)) {
    const beaten = rows.filter(
      (o) => o.roster_id !== row.roster_id && matchupScore(o)! < high,
    ).length;
    if (beaten >= 6)
      awards.push({
        kind: 'solicitor',
        rosterId: row.roster_id,
        detail: `Lost with ${high.toFixed(2)} points, but would have beaten ${beaten} of 11 other teams. The complaints department has evidence.`,
      });
  }
  for (const row of wins.filter((r) => matchupScore(r) === low)) {
    const beatenBy = rows.filter(
      (o) => o.roster_id !== row.roster_id && matchupScore(o)! > low,
    ).length;
    if (beatenBy >= 6)
      awards.push({
        kind: 'escape',
        rosterId: row.roster_id,
        detail: `Won with ${low.toFixed(2)} points; ${beatenBy} of 11 other teams would have beaten them. Collect the win and leave quietly.`,
      });
  }
  let waiverReady =
    transactions !== null &&
    transactions.every(
      (t) =>
        t.status !== 'complete' ||
        !['waiver', 'free_agent'].includes(t.type) ||
        Number.isInteger(t.leg),
    );
  const candidates = new Map<
    string,
    { rosterId: number; playerId: string; points: number }
  >();
  for (const tx of transactions ?? []) {
    if (
      tx.status !== 'complete' ||
      !['waiver', 'free_agent'].includes(tx.type) ||
      tx.leg !== week
    )
      continue;
    for (const [playerId, rosterId] of Object.entries(tx.adds ?? {})) {
      const row = rows.find((r) => r.roster_id === rosterId);
      if (!row?.starters.includes(playerId)) continue;
      const points = starterPoints(row, playerId);
      if (points === null) {
        waiverReady = false;
        continue;
      }
      candidates.set(`${rosterId}:${playerId}`, { rosterId, playerId, points });
    }
  }
  const best = Math.max(...[...candidates.values()].map((c) => c.points));
  if (waiverReady && best > 0)
    for (const c of candidates.values())
      if (c.points === best)
        awards.push({
          kind: 'waiver',
          rosterId: c.rosterId,
          playerId: c.playerId,
          detail: `Added this scoring week and delivered ${c.points.toFixed(2)} starting-lineup points. A waiver claim with something to show for itself.`,
        });
  return { awards, waiverReady };
}

export function halfwayTable(weeks: SleeperMatchup[][]) {
  if (weeks.length !== 7 || weeks.some((w) => !validWeek(w))) return null;
  const table = weeks[0].map((r) => ({
    rosterId: r.roster_id,
    wins: 0,
    losses: 0,
    ties: 0,
    points: 0,
  }));
  for (const rows of weeks)
    for (const team of table) {
      const row = rows.find((r) => r.roster_id === team.rosterId);
      if (!row) return null;
      const opponent = rows.find(
        (r) => r.matchup_id === row.matchup_id && r.roster_id !== row.roster_id,
      )!;
      const a = matchupScore(row)!,
        b = matchupScore(opponent)!;
      team.points += a;
      if (a > b) team.wins++;
      else if (a < b) team.losses++;
      else team.ties++;
    }
  table.sort(
    (a, b) =>
      b.wins + b.ties / 2 - (a.wins + a.ties / 2) ||
      b.points - a.points ||
      a.rosterId - b.rosterId,
  );
  // Do not invent an official placing when the win record and points also tie.
  if (
    table.some(
      (t, i) =>
        i > 0 &&
        t.wins + t.ties / 2 === table[i - 1].wins + table[i - 1].ties / 2 &&
        Math.round(t.points * 100) === Math.round(table[i - 1].points * 100),
    )
  )
    return null;
  return table;
}
export function finalTable(
  winners: SleeperBracketMatch[],
  consolation: SleeperBracketMatch[],
) {
  const places = new Map<number, number>();
  for (const [bracket, offset] of [
    [winners, 0],
    [consolation, 6],
  ] as const) {
    for (const position of [1, 3, 5]) {
      const games = bracket.filter((g) => g.p === position);
      if (games.length !== 1) return null;
      const game = games[0];
      if (!game.w || !game.l || game.w === game.l) return null;
      places.set(position + offset, game.w);
      places.set(position + offset + 1, game.l);
    }
  }
  const table = Array.from({ length: 12 }, (_, i) => places.get(i + 1)!);
  return new Set(table).size === 12 &&
    table.every((id) => Number.isInteger(id) && id >= 1 && id <= 12)
    ? table
    : null;
}
export function compareForecast(prediction: number[], actual: number[]) {
  if (
    actual.length !== 12 ||
    new Set(actual).size !== 12 ||
    prediction.length !== 12 ||
    new Set(prediction).size !== 12 ||
    prediction.some((id) => !actual.includes(id))
  )
    return null;
  const rows = prediction.map((rosterId, i) => ({
    rosterId,
    predicted: i + 1,
    actual: actual.indexOf(rosterId) + 1,
    gap: Math.abs(i - actual.indexOf(rosterId)),
  }));
  return {
    rows,
    total: rows.reduce((sum, r) => sum + r.gap, 0),
    exact: rows.filter((r) => r.gap === 0).length,
    biggest: Math.max(...rows.map((r) => r.gap)),
  };
}
export type FinalPickGame = {
  id: number;
  week: number;
  home: number;
  away: number;
  winner: number | null;
};
export type AwardVote = {
  matchup_id: number;
  voter_id: string;
  selected_roster_id: number;
};
export function againstTheRoom(games: FinalPickGame[], votes: AwardVote[]) {
  const awards: {
    week: number;
    voterId: string;
    winner: number;
    backers: number;
    voters: number;
  }[] = [];
  for (const game of games) {
    if (game.winner === null) continue;
    const unique = new Map(
      votes
        .filter(
          (v) =>
            v.matchup_id === game.id &&
            [game.home, game.away].includes(v.selected_roster_id),
        )
        .map((v) => [v.voter_id, v]),
    );
    const ballot = [...unique.values()];
    const correct = ballot.filter((v) => v.selected_roster_id === game.winner);
    if (
      ballot.length < 6 ||
      correct.length === 0 ||
      correct.length * 2 >= ballot.length
    )
      continue;
    for (const vote of correct)
      awards.push({
        week: game.week,
        voterId: vote.voter_id,
        winner: game.winner,
        backers: correct.length,
        voters: ballot.length,
      });
  }
  // One trophy per manager per week; retain all their qualifying calls as evidence.
  return awards;
}

export function weekStart(season: number, week: number) {
  const d = sundayKickoffForWeek(season, week);
  d.setUTCDate(d.getUTCDate() - 5);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}
export type TradeWeek = { week: number; rows: SleeperMatchup[] };
export function reviewTrade(
  tx: SleeperTransaction,
  weeks: TradeWeek[],
  allTransactions: SleeperTransaction[],
  season = 2026,
) {
  const completed = tx.status_updated;
  if (!completed || !Number.isFinite(completed)) return null;
  const acquired = new Set(Object.keys(tx.adds ?? {}));
  if (
    allTransactions.some(
      (t) =>
        t.status === 'complete' &&
        !Number.isFinite(t.status_updated) &&
        [...Object.keys(t.adds ?? {}), ...Object.keys(t.drops ?? {})].some(
          (id) => acquired.has(id),
        ),
    )
  )
    return null;
  const eligible = weeks
    .filter((w) => weekStart(season, w.week) > completed)
    .sort((a, b) => a.week - b.week);
  const firstWeek = Array.from({ length: 17 }, (_, i) => i + 1).find(
    (w) => weekStart(season, w) > completed,
  );
  if (!firstWeek)
    return { firstWeek: null, weeks: [], initialReady: false, sides: [] };
  // Keep periods contiguous; a missing week cannot silently become a zero-point week.
  const period: TradeWeek[] = [];
  for (const w of eligible) {
    if (w.week !== firstWeek + period.length) break;
    period.push(w);
  }
  const sides = tx.roster_ids.map((rosterId) => {
    const players = Object.entries(tx.adds ?? {})
      .filter(([, owner]) => owner === rosterId)
      .map(([playerId]) => {
        const exit = allTransactions
          .filter(
            (t) =>
              t.status === 'complete' &&
              t.transaction_id !== tx.transaction_id &&
              t.status_updated &&
              t.status_updated > completed &&
              (t.drops?.[playerId] === rosterId ||
                (t.type === 'trade' &&
                  t.adds?.[playerId] !== undefined &&
                  t.adds[playerId] !== rosterId)),
          )
          .sort((a, b) => a.status_updated! - b.status_updated!)[0];
        const contributions = period.map((w) => {
          const row = w.rows.find((r) => r.roster_id === rosterId);
          const end = weekStart(season, w.week + 1);
          const stillOwned = !exit || exit.status_updated! >= end;
          // Exclude the departure week as well as the acquisition week to avoid attribution across a midweek move.
          if (!stillOwned)
            return { week: w.week, started: 0, total: 0, excluded: true };
          if (!row || !row.players?.includes(playerId))
            return {
              week: w.week,
              started: null,
              total: null,
              excluded: false,
            };
          const total = row.players_points?.[playerId];
          return {
            week: w.week,
            started: row.starters.includes(playerId)
              ? starterPoints(row, playerId)
              : 0,
            total:
              typeof total === 'number' && Number.isFinite(total)
                ? total
                : null,
            excluded: false,
          };
        });
        return { playerId, exited: Boolean(exit), contributions };
      });
    return { rosterId, players };
  });
  return {
    firstWeek,
    weeks: period.map((w) => w.week),
    initialReady: period.length >= 3,
    sides,
  };
}
