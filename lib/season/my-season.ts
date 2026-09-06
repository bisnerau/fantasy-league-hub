import type { SleeperTransaction } from '@/lib/sleeper/types';
import { starterPoints, weekStart, type TradeWeek } from './features';

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
