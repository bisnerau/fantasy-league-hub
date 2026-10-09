// Familiar fractional prices for Weekly Picks. The displayed fraction is the
// price: returns must use it, not the unrounded model probability.
const ladder = [
  [1, 100],
  [1, 50],
  [1, 33],
  [1, 25],
  [1, 20],
  [1, 16],
  [1, 12],
  [1, 10],
  [1, 8],
  [1, 6],
  [1, 5],
  [2, 9],
  [1, 4],
  [2, 7],
  [1, 3],
  [4, 11],
  [2, 5],
  [4, 9],
  [1, 2],
  [8, 15],
  [4, 7],
  [8, 13],
  [4, 6],
  [8, 11],
  [4, 5],
  [5, 6],
  [10, 11],
  [1, 1],
  [11, 10],
  [6, 5],
  [5, 4],
  [11, 8],
  [6, 4],
  [13, 8],
  [7, 4],
  [15, 8],
  [2, 1],
  [9, 4],
  [5, 2],
  [11, 4],
  [3, 1],
  [10, 3],
  [7, 2],
  [4, 1],
  [9, 2],
  [5, 1],
  [11, 2],
  [6, 1],
  [13, 2],
  [7, 1],
  [8, 1],
  [9, 1],
  [10, 1],
  [12, 1],
  [14, 1],
  [16, 1],
  [20, 1],
  [25, 1],
  [33, 1],
  [40, 1],
  [50, 1],
  [66, 1],
  [100, 1],
] as const;

/** The nearest familiar fraction to a win probability. */
export function fractionalPrice(chance: number) {
  if (!Number.isFinite(chance) || chance <= 0 || chance >= 1) {
    throw new RangeError('Win probability must be between zero and one');
  }
  const profit = 1 / chance - 1;
  const [numerator, denominator] = ladder.reduce((best, candidate) =>
    Math.abs(candidate[0] / candidate[1] - profit) <
    Math.abs(best[0] / best[1] - profit)
      ? candidate
      : best,
  );
  return { numerator, denominator };
}

export function fractionalOdds(chance: number) {
  const { numerator, denominator } = fractionalPrice(chance);
  return {
    label: `${numerator}/${denominator}`,
    payout: Math.round((1 + numerator / denominator) * 100) / 100,
  };
}

/**
 * Win chance from two projected totals: a logistic curve on a 20-point
 * scale, so a 20-point projected edge is roughly a 73% favourite.
 */
export function winChance(total: number, opponentTotal: number) {
  return 1 / (1 + Math.exp(-(total - opponentTotal) / 20));
}

/** A published, frozen price for one team in one matchup. */
export type TeamPrice = {
  numerator: number;
  denominator: number;
  /** "3/1", or "Evens" for 1/1. */
  label: string;
  /** Points for a correct pick: 1 plus the fraction, e.g. 3/1 returns 4. */
  payout: number;
};

export function priceFromFraction(
  numerator: number,
  denominator: number,
): TeamPrice {
  return {
    numerator,
    denominator,
    label: numerator === denominator ? 'Evens' : `${numerator}/${denominator}`,
    payout: Math.round((1 + numerator / denominator) * 100) / 100,
  };
}

/**
 * Points a correct pick returns. Unpriced weeks keep the original rules
 * (1 point); a correct Banker doubles the return.
 */
export function pickReturn(
  price: TeamPrice | null | undefined,
  banker: boolean,
) {
  return Math.round((price?.payout ?? 1) * (banker ? 2 : 1) * 100) / 100;
}

/** True once a week's prices are published; earlier weeks score 1 per winner. */
export function isPricedWeek(
  matchups: { home: { price?: TeamPrice | null } }[],
) {
  return matchups.some((matchup) => matchup.home.price != null);
}

/** Points shown to two decimals only when needed: 4, 1.57, 13. */
export function formatPoints(points: number) {
  return Number.isInteger(points) ? String(points) : points.toFixed(2);
}
