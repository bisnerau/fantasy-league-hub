import type { PredictionWeekData } from './predictions';
import { weekFourReviewPublishedAt } from './newsletters/2026-week-4';

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
export const flagsOnThePlay: readonly FlagOnThePlay[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    rosterId: 11,
    manager: 'David Sharpe',
    call: 'False start',
    text: 'Sharpe started 2–0 without reaching 100, then brought 80.16 to Shane’s 157.90. The unbeaten record has been recalled after failing its first proper inspection.',
    penalty: '77.74 yards and surrender of the unbeaten badge',
    publishedAt: '2026-09-29T14:46:33Z',
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    rosterId: 1,
    manager: 'Emmet Burns',
    call: 'Illegal substitution',
    text: 'Burns benched Carnell Tate (21.50) for Wicks (4.80) and left Saturday pickup Emanuel Wilson (27.00) behind Swift (7.40). That is 36.30 points of bench in a 28.62-point defeat to Karl.',
    penalty:
      '28.62 yards and a lineup inquiry led by the commissioner, who is also the defendant',
    publishedAt: weekFourReviewPublishedAt,
  },
];

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
