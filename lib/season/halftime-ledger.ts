import type { SleeperMatchup, SleeperTransaction } from '@/lib/sleeper/types';
import { acquisitionReceipts, acquisitionSummary } from './my-season';
import { reviewTrade, starterPoints, weekStart } from './features';

export type HalftimeEvidence = {
  retrievedAt: string;
  cutoff: string;
  picks: { player_id: string; roster_id: number }[];
  transactions: SleeperTransaction[];
  weeks: { week: number; rows: SleeperMatchup[] }[];
  names: Record<string, string>;
};
const rounded = (value: number) => Math.round(value * 100) / 100;

/** Frozen Weeks 1–7 only. A move made after the cutoff never earns first-half credit. */
export function buildHalftimeLedger(evidence: HalftimeEvidence) {
  const cutoff = Date.parse(evidence.cutoff);
  const weeks = evidence.weeks.filter((w) => w.week >= 1 && w.week <= 7);
  if (
    new Set(weeks.map((w) => w.week)).size !== 7 ||
    weeks.some((w) => w.rows.length !== 12)
  )
    throw Error('Seven complete scoring weeks required');
  const transactions = [
    ...new Map(
      evidence.transactions
        .filter(
          (t) =>
            t.status === 'complete' &&
            (t.status_updated == null || t.status_updated < cutoff),
        )
        .map((t) => [t.transaction_id, t]),
    ).values(),
  ];
  const receipts = acquisitionReceipts(
    transactions,
    weeks,
    [1, 2, 3, 4, 5, 6, 7],
  );
  const pickups = receipts.map((r) => ({
    id: r.id,
    transactionId: r.transactionId,
    rosterId: r.rosterId,
    player: evidence.names[r.playerId] ?? r.playerId,
    playerId: r.playerId,
    type: r.type,
    week: r.firstWeek,
    acquired: r.acquired,
    cost: r.type === 'free_agent' ? 0 : r.faab,
    points: r.points == null ? null : rounded(r.points),
    starts: r.starts,
    evidence: r.evidence,
  }));
  const trades = transactions
    .filter((t) => t.type === 'trade')
    .map((t) => {
      const review = reviewTrade(t, weeks, transactions);
      return {
        id: t.transaction_id,
        acquired: t.status_updated ?? null,
        firstWeek: review?.firstWeek ?? null,
        weeks: review?.weeks ?? [],
        sides: t.roster_ids.map((rosterId) => {
          const side = review?.sides.find((s) => s.rosterId === rosterId);
          const points = side?.players.flatMap((p) =>
            p.contributions.map((c) => c.started),
          );
          return {
            rosterId,
            received: Object.entries(t.adds ?? {})
              .filter(([, id]) => id === rosterId)
              .map(([id]) => evidence.names[id] ?? id),
            points:
              !points || points.some((p) => p === null)
                ? null
                : rounded(points.reduce<number>((sum, p) => sum + p!, 0)),
            players: side?.players ?? [],
          };
        }),
      };
    });
  const ids = weeks[0].rows.map((r) => r.roster_id);
  const teams = ids.map((rosterId) => {
    const own = receipts.filter((r) => r.rosterId === rosterId);
    const summary = acquisitionSummary(own);
    const ownPickups = pickups.filter((p) => p.rosterId === rosterId);
    const categories = { drafted: 0, pickups: 0, trades: 0, unassigned: 0 };
    let total = 0;
    for (const week of weeks) {
      const row = week.rows.find((r) => r.roster_id === rosterId)!;
      const end = weekStart(2026, week.week + 1);
      const score = row.custom_points ?? row.points;
      if (!Number.isFinite(score)) throw Error('Missing weekly score');
      total += score;
      let attributed = 0;
      for (const playerId of row.starters.filter((id) => id !== '0')) {
        const points = starterPoints(row, playerId);
        if (points === null) continue;
        const pickup = own.find(
          (r) =>
            r.playerId === playerId &&
            r.evidence?.some(
              (e) =>
                e.week === week.week &&
                e.started &&
                !e.excluded &&
                e.points !== null,
            ),
        );
        const trade = trades.some((t) =>
          t.sides.some(
            (s) =>
              s.rosterId === rosterId &&
              s.players.some(
                (p) =>
                  p.playerId === playerId &&
                  p.contributions.some(
                    (c) =>
                      c.week === week.week && !c.excluded && c.started !== null,
                  ),
              ),
          ),
        );
        const drafted = evidence.picks.some(
          (p) => p.roster_id === rosterId && p.player_id === playerId,
        );
        const departed = transactions.some(
          (t) =>
            (t.drops?.[playerId] === rosterId ||
              (t.type === 'trade' &&
                t.adds?.[playerId] !== undefined &&
                t.adds[playerId] !== rosterId)) &&
            (t.status_updated == null || t.status_updated < end),
        );
        if (pickup) {
          categories.pickups += points;
          attributed += points;
        } else if (trade) {
          categories.trades += points;
          attributed += points;
        } else if (drafted && !departed) {
          categories.drafted += points;
          attributed += points;
        }
      }
      categories.unassigned += score - attributed;
    }
    const moves = [
      ...ownPickups
        .filter((p) => p.points !== null)
        .map((p) => ({
          kind: 'pickup' as const,
          id: p.id,
          title: p.player,
          points: p.points!,
          acquired: p.acquired,
          cost: p.cost,
          starts: p.starts,
          weeks:
            p.evidence?.filter((e) => !e.excluded).map((e) => e.week) ?? [],
        })),
      ...trades.flatMap((t) =>
        t.sides
          .filter((s) => s.rosterId === rosterId && s.points !== null)
          .map((s) => ({
            kind: 'trade' as const,
            id: t.id,
            title: s.received.join(' + '),
            points: s.points!,
            acquired: t.acquired,
            cost: null,
            starts: null,
            weeks: t.weeks,
          })),
      ),
    ].sort((a, b) => b.points - a.points);
    return {
      rosterId,
      total: rounded(total),
      categories: Object.fromEntries(
        Object.entries(categories).map(([key, value]) => [key, rounded(value)]),
      ) as typeof categories,
      additions: summary.additions,
      faab: summary.faab,
      pickupPoints: summary.points == null ? null : rounded(summary.points),
      pickupStarts: summary.starts,
      incompleteReturns: ownPickups.filter((p) => p.points === null).length,
      definingMove: moves.find((m) => m.points > 0) ?? null,
    };
  });
  return {
    retrievedAt: evidence.retrievedAt,
    cutoff: evidence.cutoff,
    teams,
    pickups,
    trades,
  };
}
export type HalftimeActivity = ReturnType<typeof buildHalftimeLedger>;
