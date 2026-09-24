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
