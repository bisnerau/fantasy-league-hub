import { acquisitionReceipts } from '@/lib/season/my-season';
import {
  getLeague,
  getNFLState,
  getMatchups,
  getTransactions,
  getWinnersBracket,
  getLosersBracket,
  getPlayers,
} from '@/lib/sleeper/client';
import {
  isGradingEligible,
  sundayKickoffForWeek,
} from '@/lib/predictions/rules';
import {
  weeklyAwards,
  halfwayTable,
  finalTable,
  reviewTrade,
  type TradeWeek,
} from '@/lib/season/features';
import { draftRecapContent } from './draft-recap-content';
import { scheduleSnapshot } from './schedule-snapshot';
import type { SleeperTransaction } from '@/lib/sleeper/types';

export const featureLeagueId = scheduleSnapshot.leagueId;
export const featureSeason = 2026;
async function batch<T, R>(items: T[], fn: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += 6)
    results.push(...(await Promise.all(items.slice(i, i + 6).map(fn))));
  return results;
}
export async function getSeasonHubData({
  includeActivity = false,
}: { includeActivity?: boolean } = {}) {
  const [leagueResult, stateResult] = await Promise.allSettled([
    getLeague(featureLeagueId),
    getNFLState(),
  ]);
  if (leagueResult.status === 'rejected' || stateResult.status === 'rejected')
    return null;
  const league = leagueResult.value,
    state = stateResult.value;
  if (
    league.season !== '2026' ||
    league.total_rosters !== 12 ||
    league.settings.playoff_week_start !== 15 ||
    league.settings.playoff_teams !== 6 ||
    league.settings.league_average_match
  )
    return null;
  const completedWeeks = Array.from({ length: 17 }, (_, i) => i + 1).filter(
    (w) =>
      isGradingEligible(sundayKickoffForWeek(2026, w).toISOString()) &&
      (Number(state.season) > 2026 ||
        (state.season === '2026' &&
          (state.season_type === 'post' || state.week > w))),
  );
  const currentWeek = Math.min(
    17,
    Math.max(
      1,
      state.season === '2026'
        ? state.season_type === 'post'
          ? 17
          : state.week
        : Number(state.season) > 2026
          ? 17
          : 1,
    ),
  );
  const [weekResults, txResults] = await Promise.all([
    batch(completedWeeks, async (week) => {
      try {
        return { week, rows: await getMatchups(featureLeagueId, week) };
      } catch {
        return { week, rows: null };
      }
    }),
    batch(
      Array.from({ length: currentWeek + 1 }, (_, i) => i),
      async (week) => {
        try {
          const rows = await getTransactions(featureLeagueId, week);
          return { week, rows: Array.isArray(rows) ? rows : null };
        } catch {
          return { week, rows: null };
        }
      },
    ),
  ]);
  const transactionReady = txResults.every((r) => r.rows !== null);
  const transactions = [
    ...new Map(
      txResults
        .flatMap((r) => r.rows ?? [])
        .filter((t) => t.status === 'complete')
        .map((t) => [t.transaction_id, t]),
    ).values(),
  ];
  const weeks: TradeWeek[] = weekResults.flatMap((w) =>
    w.rows ? [{ week: w.week, rows: w.rows }] : [],
  );
  const awards = weekResults
    .filter((w) => w.week <= 14)
    .map((w) => ({
      week: w.week,
      result: w.rows
        ? weeklyAwards(
            w.rows,
            txResults.find((t) => t.week === w.week)?.rows ?? null,
            w.week,
          )
        : null,
    }));
  const halfwayReady = completedWeeks.includes(7);
  const half = halfwayReady
    ? halfwayTable(
        Array.from(
          { length: 7 },
          (_, i) => weeks.find((w) => w.week === i + 1)?.rows ?? [],
        ),
      )
    : null;
  let final: number[] | null = null;
  if (league.status === 'complete' && completedWeeks.includes(17)) {
    try {
      const [w, l] = await Promise.all([
        getWinnersBracket(featureLeagueId),
        getLosersBracket(featureLeagueId),
      ]);
      final = finalTable(w, l);
    } catch {
      /* Final review waits for complete brackets. */
    }
  }
  const trades = transactions
    .filter((t) => t.type === 'trade')
    .sort(
      (a, b) =>
        (b.status_updated ?? b.created) - (a.status_updated ?? a.created),
    );
  const relevantIds = new Set(
    transactions.flatMap((t) => [
      ...Object.keys(t.adds ?? {}),
      ...Object.keys(t.drops ?? {}),
    ]),
  );
  const names: Record<string, string> = {};
  if (relevantIds.size) {
    try {
      const players = await getPlayers();
      for (const id of relevantIds)
        names[id] =
          (players[id]?.full_name ??
            [players[id]?.first_name, players[id]?.last_name]
              .filter(Boolean)
              .join(' ')) ||
          id;
    } catch {
      /* IDs remain visibly labelled when player names are unavailable. */
    }
  }
  const receipts = trades.map((trade: SleeperTransaction) => ({
    trade,
    review: transactionReady ? reviewTrade(trade, weeks, transactions) : null,
  }));
  return {
    activity: includeActivity
      ? {
          acquisitions: transactionReady
            ? acquisitionReceipts(transactions, weeks, completedWeeks)
            : null,
          weeks: weeks.map((w) => ({
            week: w.week,
            rows: w.rows.map((r) => ({
              roster_id: r.roster_id,
              matchup_id: r.matchup_id,
              points: r.points,
              custom_points: r.custom_points,
            })),
          })),
        }
      : null,
    leagueId: featureLeagueId,
    season: featureSeason,
    completedWeeks,
    awards,
    half,
    halfwayReady,
    final,
    finalReady: league.status === 'complete',
    receipts,
    transactionReady,
    names,
    managers: draftRecapContent.entries.map((e) => ({
      rosterId: e.rosterId,
      name: e.managerName,
    })),
    editorial: [...draftRecapContent.entries]
      .sort((a, b) => a.predictedFinish - b.predictedFinish)
      .map((e) => e.rosterId),
  };
}
export type SeasonHubData = NonNullable<
  Awaited<ReturnType<typeof getSeasonHubData>>
>;
