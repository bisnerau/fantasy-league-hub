import { weekTwoPowerRankings } from './power-rankings/2026-week-2';
import { weekThreePowerRankings } from './power-rankings/2026-week-3';

export type PowerRankingEntry = {
  rosterId: number;
  manager: string;
  record: string;
  recentPoints: number;
  verdict: string;
};
export type PowerRankingEdition = {
  leagueId: string;
  season: string;
  week: number;
  throughWeek: number;
  publishedAt: string;
  headline: string;
  introduction: string;
  entries: PowerRankingEntry[];
  // First-edition arrows use the frozen, published preseason forecast.
  // Later editions derive movement from the preceding published weekly list.
  preseasonBaseline?: { rosterId: number; rank: number }[];
  talkingPoints: { title: string; text: string; href: string }[];
  sources: { label: string; url: string }[];
};

export const powerRankingEditions: readonly PowerRankingEdition[] = [
  weekTwoPowerRankings,
  weekThreePowerRankings,
];

export function getPowerRankingEditions(
  leagueId: string,
  season?: string,
  now = Date.now(),
  editions: readonly PowerRankingEdition[] = powerRankingEditions,
) {
  return editions
    .filter(
      (edition) =>
        edition.leagueId === leagueId &&
        (!season || edition.season === season) &&
        Date.parse(edition.publishedAt) <= now,
    )
    .sort((a, b) => Number(b.season) - Number(a.season) || b.week - a.week);
}

export function getPowerRankingComparison(
  edition: PowerRankingEdition,
  editions: readonly PowerRankingEdition[] = powerRankingEditions,
) {
  const previous = getPowerRankingEditions(
    edition.leagueId,
    edition.season,
    Date.parse(edition.publishedAt),
    editions,
  ).find((candidate) => candidate.week < edition.week);
  const ranks = previous
    ? previous.entries.map((entry, index) => ({
        rosterId: entry.rosterId,
        rank: index + 1,
      }))
    : (edition.preseasonBaseline ?? []);
  return {
    label: previous
      ? `vs Week ${previous.week}`
      : ranks.length
        ? 'vs preseason forecast'
        : 'First edition',
    href: previous
      ? `/power-rankings?season=${previous.season}&week=${previous.week}`
      : ranks.length
        ? '/draft-recap'
        : null,
    ranks: new Map(ranks.map((entry) => [entry.rosterId, entry.rank])),
  };
}

export type RankMove = {
  rosterId: number;
  rank: number;
  previousRank?: number;
  /** Places gained since the comparison; negative is a drop. */
  change?: number;
};

/** Head-to-head record as written in an edition, e.g. `2–0` or `1–1–1`. */
export function parseRecord(record: string) {
  const [wins = 0, losses = 0, ties = 0] = record
    .split(/[–—-]/)
    .map((part) => Number(part.trim()) || 0);
  return { wins, losses, ties };
}

export function getRankMoves(
  edition: PowerRankingEdition,
  comparison: { ranks: Map<number, number> },
): RankMove[] {
  return edition.entries.map((entry, index) => {
    const previousRank = comparison.ranks.get(entry.rosterId);
    return {
      rosterId: entry.rosterId,
      rank: index + 1,
      previousRank,
      change: previousRank === undefined ? undefined : previousRank - index - 1,
    };
  });
}

/** Biggest riser and heaviest faller; ties go to the better current rank. */
export function getMarketMovers(moves: RankMove[]) {
  const pick = (direction: 1 | -1) =>
    moves
      .filter((move) => (move.change ?? 0) * direction > 0)
      .sort(
        (a, b) => (b.change! - a.change!) * direction || a.rank - b.rank,
      )[0];
  return { riser: pick(1), faller: pick(-1) };
}

export type MarketReportItem = {
  key: 'riser' | 'faller' | 'unbeaten' | 'winless';
  label: string;
  rosterId: number;
  value: string;
};

export function ordinal(rank: number) {
  const tens = rank % 100;
  const suffix =
    tens >= 11 && tens <= 13
      ? 'th'
      : (({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[rank % 10] ??
        'th');
  return `${rank}${suffix}`;
}

/**
 * Stat cards derived only from the edition: movement, and records that
 * disagree with the editorial order. Each card is omitted when it would not
 * be true.
 */
export function getMarketReport(
  edition: PowerRankingEdition,
  moves: RankMove[],
): MarketReportItem[] {
  const items: MarketReportItem[] = [];
  const { riser, faller } = getMarketMovers(moves);
  const places = (n: number) => `${n} ${n === 1 ? 'place' : 'places'}`;
  if (riser)
    items.push({
      key: 'riser',
      label: 'Biggest riser',
      rosterId: riser.rosterId,
      value: `▲ ${places(riser.change!)} · ${ordinal(riser.previousRank!)} → ${ordinal(riser.rank)}`,
    });
  if (faller)
    items.push({
      key: 'faller',
      label: 'Heaviest faller',
      rosterId: faller.rosterId,
      value: `▼ ${places(-faller.change!)} · ${ordinal(faller.previousRank!)} → ${ordinal(faller.rank)}`,
    });
  const rows = edition.entries.map((entry, index) => ({
    entry,
    rank: index + 1,
    ...parseRecord(entry.record),
  }));
  const played = (row: (typeof rows)[number]) =>
    row.wins + row.losses + row.ties > 0;
  const unbeaten = rows.filter((row) => played(row) && row.losses === 0).at(-1);
  if (
    unbeaten &&
    rows.some((row) => row.rank < unbeaten.rank && row.losses > 0)
  )
    items.push({
      key: 'unbeaten',
      label: 'Unbeaten, unconvinced',
      rosterId: unbeaten.entry.rosterId,
      value: `${unbeaten.entry.record} and ranked ${ordinal(unbeaten.rank)}`,
    });
  const winless = rows.find((row) => played(row) && row.wins === 0);
  if (winless && rows.some((row) => row.rank > winless.rank && row.wins > 0))
    items.push({
      key: 'winless',
      label: 'Winless, respected',
      rosterId: winless.entry.rosterId,
      value: `${winless.entry.record} and ranked ${ordinal(winless.rank)}`,
    });
  return items;
}

export type RankHistory = {
  /** `week` is null for the preseason forecast column. */
  columns: { label: string; week: number | null; published: boolean }[];
  series: Map<number, (number | null)[]>;
};

/**
 * Every published edition in a season, oldest first, with the preseason
 * forecast when the first edition used it. Unpublished weeks between editions
 * stay as empty columns so the chart shows the gap rather than hiding it.
 */
export function getRankHistory(
  leagueId: string,
  season: string,
  now = Date.now(),
  editions: readonly PowerRankingEdition[] = powerRankingEditions,
): RankHistory {
  const published = getPowerRankingEditions(
    leagueId,
    season,
    now,
    editions,
  ).reverse();
  const columns: RankHistory['columns'] = [];
  const ranks: Map<number, number>[] = [];
  const baseline = published[0]?.preseasonBaseline;
  if (baseline?.length) {
    columns.push({ label: 'Pre', week: null, published: true });
    ranks.push(new Map(baseline.map((row) => [row.rosterId, row.rank])));
  }
  published.forEach((edition, index) => {
    const previous = published[index - 1];
    if (previous)
      for (let week = previous.week + 1; week < edition.week; week++) {
        columns.push({ label: `W${week}`, week, published: false });
        ranks.push(new Map());
      }
    columns.push({
      label: `W${edition.week}`,
      week: edition.week,
      published: true,
    });
    ranks.push(
      new Map(edition.entries.map((entry, rank) => [entry.rosterId, rank + 1])),
    );
  });
  const rosterIds = new Set(
    published.flatMap((e) => e.entries.map((x) => x.rosterId)),
  );
  return {
    columns,
    series: new Map(
      [...rosterIds].map((rosterId) => [
        rosterId,
        ranks.map((column) => column.get(rosterId) ?? null),
      ]),
    ),
  };
}
