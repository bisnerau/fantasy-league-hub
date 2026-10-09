// Familiar fractional prices for the local experiment. The displayed fraction
// is the price: returns must use it, not the unrounded model probability.
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

export function fractionalOdds(chance: number) {
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
  return {
    label: `${numerator}/${denominator}`,
    payout: Math.round((1 + numerator / denominator) * 100) / 100,
  };
}
