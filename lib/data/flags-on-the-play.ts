import type { PredictionWeekData } from './predictions';

export type FlagOnThePlay = {
  leagueId: string;
  season: string;
  week: number;
  rosterId: number;
  manager: string;
  /** The referee's call, e.g. "Illegal formation". */
  call: string;
  /** One or two sentences with a verified stat. */
  text: string;
  /** The comic penalty, e.g. "15 yards and loss of dignity". */
  penalty: string;
  publishedAt: string;
};

// Authored with Tuesday's reviews from verified Sleeper stats; never generated.
// One flag per league/week at most, shown only once that week has settled.
export const flagsOnThePlay: readonly FlagOnThePlay[] = [];

export function getFlagOnThePlay(
  data: Pick<PredictionWeekData, 'leagueId' | 'season' | 'week' | 'finalized'>,
  flags: readonly FlagOnThePlay[] = flagsOnThePlay,
  now = Date.now(),
): FlagOnThePlay | null {
  if (!data.finalized) return null;
  const editions = flags.filter(
    (flag) =>
      flag.leagueId === data.leagueId &&
      flag.season === data.season &&
      flag.week === data.week,
  );
  // Ambiguous editorial configuration should not throw two flags.
  if (editions.length !== 1) return null;
  return Date.parse(editions[0].publishedAt) <= now ? editions[0] : null;
}
