import type { PredictionMatchup } from '@/lib/data/predictions';

type LineMatchup = Pick<PredictionMatchup, 'home' | 'away'>;

export type Line =
  | { favourite: null; spread: 0; label: string }
  | {
      favourite: 'home' | 'away';
      rosterId: number;
      spread: number;
      label: string;
    };

export type LineResult = 'covered' | 'short' | 'push' | 'upset';

export const lineResultLabels: Record<LineResult, string> = {
  covered: 'Covered',
  short: 'Didn’t cover',
  push: 'Push',
  upset: 'Upset',
};

/**
 * A betting-style spread from the two Sleeper PPR estimates, rounded to the
 * nearest half point. It follows the latest projections rather than freezing
 * an opening line, and there is no line when either projection is missing.
 */
export function getLine(matchup: LineMatchup): Line | null {
  const { home, away } = matchup;
  if (home.projectedScore == null || away.projectedScore == null) return null;
  const difference = home.projectedScore - away.projectedScore;
  const spread = Math.round(Math.abs(difference) * 2) / 2;
  if (spread < 0.5) return { favourite: null, spread: 0, label: 'Pick’em' };
  const favourite = difference > 0 ? 'home' : 'away';
  const team = matchup[favourite];
  return {
    favourite,
    rosterId: team.rosterId,
    spread,
    label: `${team.ownerName} −${spread}`,
  };
}

/** How the favourite fared against the line; null until both scores exist. */
export function getLineResult(
  matchup: LineMatchup,
  line: Line | null,
): LineResult | null {
  if (!line?.favourite) return null;
  const favourite = matchup[line.favourite].actualScore;
  const underdog =
    matchup[line.favourite === 'home' ? 'away' : 'home'].actualScore;
  if (favourite == null || underdog == null) return null;
  const margin = Math.round((favourite - underdog) * 100) / 100;
  if (margin < 0) return 'upset';
  if (margin > line.spread) return 'covered';
  if (margin === line.spread) return 'push';
  return 'short';
}
