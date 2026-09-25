import type { SleeperTransaction } from '@/lib/sleeper/types';
import {
  starterPoints,
  weekStart,
  type FinalPickGame,
  type reviewTrade,
  type TradeWeek,
} from './features';

/** One ownership spell per acquisition. Reacquisitions remain separate receipts. */
export function acquisitionReceipts(
  transactions: SleeperTransaction[],
  weeks: TradeWeek[],
  completedWeeks: number[],
) {
  return transactions
    .filter(
      (t) =>
        t.status === 'complete' && ['waiver', 'free_agent'].includes(t.type),
    )
    .flatMap((tx) =>
      Object.entries(tx.adds ?? {}).map(([playerId, rosterId]) => {
        const acquired = tx.status_updated;
        const firstWeek =
          typeof tx.leg === 'number' && tx.leg >= 1 && tx.leg <= 17
            ? tx.leg
            : acquired && acquired < weekStart(2026, 1)
              ? 1
              : null;
        const uncertain = transactions.some(
          (t) =>
            t.status === 'complete' &&
            !Number.isFinite(t.status_updated) &&
            (t.drops?.[playerId] === rosterId ||
              t.adds?.[playerId] !== undefined),
        );
        const exit = acquired
          ? transactions
              .filter(
                (t) =>
                  t.status === 'complete' &&
                  t.transaction_id !== tx.transaction_id &&
                  t.status_updated &&
                  t.status_updated > acquired &&
                  (t.drops?.[playerId] === rosterId ||
                    (t.type === 'trade' &&
                      t.adds?.[playerId] !== undefined &&
                      t.adds[playerId] !== rosterId)),
              )
              .sort((a, b) => a.status_updated! - b.status_updated!)[0]
          : undefined;
        const evidence =
          firstWeek === null || !acquired || uncertain
            ? null
            : completedWeeks
                .filter(
                  (w) => w >= firstWeek && weekStart(2026, w + 1) > acquired,
                )
                .map((week) => {
                  if (exit && exit.status_updated! < weekStart(2026, week + 1))
                    return { week, points: 0, started: false, excluded: true };
                  const row = weeks
                    .find((w) => w.week === week)
                    ?.rows.find((r) => r.roster_id === rosterId);
                  if (!row?.players?.includes(playerId))
                    return {
                      week,
                      points: null,
                      started: false,
                      excluded: false,
                    };
                  const started = row.starters.includes(playerId);
                  return {
                    week,
                    points: started ? starterPoints(row, playerId) : 0,
                    started,
                    excluded: false,
                  };
                });
        return {
          id: `${tx.transaction_id}:${playerId}`,
          transactionId: tx.transaction_id,
          playerId,
          rosterId,
          type: tx.type,
          acquired: acquired ?? tx.created,
          firstWeek,
          faab:
            typeof tx.settings?.waiver_bid === 'number'
              ? tx.settings.waiver_bid
              : null,
          exited: Boolean(exit),
          drops: Object.entries(tx.drops ?? {})
            .filter(([, owner]) => owner === rosterId)
            .map(([id]) => id),
          evidence,
          starts: evidence?.filter((e) => e.started).length ?? 0,
          points:
            evidence === null || evidence.some((e) => e.points === null)
              ? null
              : evidence.reduce((n, e) => n + e.points!, 0),
        };
      }),
    )
    .sort((a, b) => b.acquired - a.acquired || a.id.localeCompare(b.id));
}
export function acquisitionSummary(
  receipts: ReturnType<typeof acquisitionReceipts>,
) {
  const txs = new Map(receipts.map((r) => [r.transactionId, r]));
  const paid = [...txs.values()].filter((r) => r.type === 'waiver');
  return {
    additions: receipts.length,
    points: receipts.some((r) => r.points === null)
      ? null
      : receipts.reduce((n, r) => n + r.points!, 0),
    starts: receipts.reduce((n, r) => n + r.starts, 0),
    faab: paid.some((r) => r.faab === null)
      ? null
      : paid.reduce((n, r) => n + r.faab!, 0),
  };
}

export type ResultRow = {
  roster_id: number;
  matchup_id: number | null;
  points: number;
  custom_points?: number | null;
};
export function personalResults(
  weeks: { week: number; rows: ResultRow[] }[],
  rosterId: number,
  expectedWeeks: number[],
) {
  const games: {
    week: number;
    points: number;
    opponent: number;
    against: number;
  }[] = [];
  const byes: number[] = [],
    missing: number[] = [];
  const score = (row: ResultRow) => {
    const value = row.custom_points ?? row.points;
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  };
  for (const week of expectedWeeks) {
    const rows = weeks.find((w) => w.week === week)?.rows;
    const own = rows?.find((r) => r.roster_id === rosterId);
    if (!own) {
      missing.push(week);
      continue;
    }
    if (own.matchup_id === null) {
      byes.push(week);
      continue;
    }
    const others = rows!.filter(
      (r) => r.matchup_id === own.matchup_id && r.roster_id !== rosterId,
    );
    if (
      others.length !== 1 ||
      score(own) === null ||
      score(others[0]) === null
    ) {
      missing.push(week);
      continue;
    }
    games.push({
      week,
      points: score(own)!,
      opponent: others[0].roster_id,
      against: score(others[0])!,
    });
  }
  return { games, byes, missing };
}

export type FormTile =
  | {
      week: number;
      state: 'W' | 'L' | 'T';
      points: number;
      against: number;
      opponent: number;
    }
  | { week: number; state: 'bye' }
  | { week: number; state: 'missing' }
  | { week: number; state: 'upcoming' };
/** One tile per regular-season week, plus any settled playoff weeks. */
export function formGuide(
  results: ReturnType<typeof personalResults>,
  completedWeeks: number[],
  regularSeasonWeeks = 14,
): FormTile[] {
  const last = Math.max(regularSeasonWeeks, ...completedWeeks);
  return Array.from({ length: last }, (_, i): FormTile => {
    const week = i + 1;
    const game = results.games.find((g) => g.week === week);
    if (game)
      return {
        week,
        state:
          game.points > game.against
            ? 'W'
            : game.points < game.against
              ? 'L'
              : 'T',
        points: game.points,
        against: game.against,
        opponent: game.opponent,
      };
    if (results.byes.includes(week)) return { week, state: 'bye' };
    if (results.missing.includes(week) || completedWeeks.includes(week))
      return { week, state: 'missing' };
    return { week, state: 'upcoming' };
  });
}

export type RoomGame = FinalPickGame & { settled: boolean };
export type RoomVote = {
  matchup_id: number;
  voter_id: string;
  selected_roster_id: number;
};
export type RoomVoter = { voterId: string; for: number; against: number };
/**
 * How the other managers picked your games once each week locked. Your own
 * pick is left out; a pick for neither side is ignored.
 */
export function leagueFaith(
  games: RoomGame[],
  votes: RoomVote[],
  rosterId: number,
  selfId: string,
  bankers: { matchup_id: number; voter_id: string }[] | null = null,
) {
  const mine = games
    .filter((g) => g.home === rosterId || g.away === rosterId)
    .sort((a, b) => a.week - b.week);
  const voters = new Map<string, RoomVoter>();
  const weeks = mine.map((game) => {
    const opponent = game.home === rosterId ? game.away : game.home;
    const ballot = new Map(
      votes
        .filter(
          (v) =>
            v.matchup_id === game.id &&
            v.voter_id !== selfId &&
            [rosterId, opponent].includes(v.selected_roster_id),
        )
        .map((v) => [v.voter_id, v.selected_roster_id]),
    );
    let backers = 0;
    for (const [voterId, side] of ballot) {
      const entry = voters.get(voterId) ?? { voterId, for: 0, against: 0 };
      if (side === rosterId) {
        entry.for += 1;
        backers += 1;
      } else entry.against += 1;
      voters.set(voterId, entry);
    }
    const banked = bankers?.filter(
      (b) => b.matchup_id === game.id && ballot.has(b.voter_id),
    );
    return {
      week: game.week,
      matchupId: game.id,
      opponent,
      for: backers,
      against: ballot.size - backers,
      result:
        !game.settled || game.winner === null
          ? null
          : game.winner === rosterId
            ? ('won' as const)
            : ('lost' as const),
      bankersFor: banked
        ? banked.filter((b) => ballot.get(b.voter_id) === rosterId).length
        : null,
      bankersAgainst: banked
        ? banked.filter((b) => ballot.get(b.voter_id) !== rosterId).length
        : null,
    };
  });
  const counted = weeks.filter((w) => w.for + w.against > 0);
  const backed = counted.reduce((n, w) => n + w.for, 0);
  const total = counted.reduce((n, w) => n + w.for + w.against, 0);
  const leaders = (key: 'for' | 'against') => {
    const eligible = [...voters.values()].filter(
      (v) => v.for + v.against >= 2 && v[key] > 0,
    );
    const top = Math.max(0, ...eligible.map((v) => v[key]));
    return eligible.filter((v) => v[key] === top);
  };
  return {
    weeks: counted,
    backed,
    total,
    believers: leaders('for'),
    doubters: leaders('against'),
    provedWrong: counted.filter((w) => w.result === 'won' && w.against > w.for),
  };
}

/** Weeks whose ballot has locked: did you pick every matchup? */
export function pickAttendance(
  games: (FinalPickGame & { locked: boolean })[],
  votes: { matchup_id: number }[],
) {
  const weeks = [
    ...new Set(games.filter((g) => g.locked).map((g) => g.week)),
  ].sort((a, b) => a - b);
  return weeks.map((week) => {
    const ballot = games.filter((g) => g.week === week);
    const saved = ballot.filter((g) =>
      votes.some((v) => v.matchup_id === g.id),
    ).length;
    return { week, saved, total: ballot.length, full: saved === ballot.length };
  });
}

/**
 * Starter points each side has had from the players it received, over the
 * trade's verified review weeks. Any unknown week makes the score unavailable.
 */
export function tradeScore(review: ReturnType<typeof reviewTrade>) {
  if (!review || !review.weeks.length)
    return { status: 'waiting' as const, weeks: 0, sides: [] };
  let unknown = false;
  const sides = review.sides.map((side) => ({
    rosterId: side.rosterId,
    points: side.players.reduce(
      (sum, player) =>
        sum +
        player.contributions.reduce((n, c) => {
          if (c.excluded) return n;
          if (c.started === null) {
            unknown = true;
            return n;
          }
          return n + c.started;
        }, 0),
      0,
    ),
  }));
  if (unknown)
    return {
      status: 'unavailable' as const,
      weeks: review.weeks.length,
      sides: [],
    };
  return {
    status: 'scored' as const,
    weeks: review.weeks.length,
    initialReady: review.initialReady,
    sides,
  };
}
