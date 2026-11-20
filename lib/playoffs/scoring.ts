// Sleeper's raw projections need the same kicker/defence conversion as Weekly
// Picks. There is no second NFL-opponent multiplier in the playoff model.
export function normalCdf(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const tail =
    0.3989422804014327 *
    Math.exp((-x * x) / 2) *
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - tail : tail;
}
export function leaguePoints(
  stats: Record<string, number>,
  scoring: Record<string, number>,
) {
  return Object.entries(scoring).reduce(
    (s, [k, w]) => s + (stats[k] ?? 0) * w,
    0,
  );
}
export function projectionPoints(
  raw: Record<string, number>,
  position: string,
  scoring: Record<string, number>,
) {
  const stats = { ...raw };
  if (position === 'K' && stats.fgm_50p != null && stats.fgm_50_59 == null)
    stats.fgm_50_59 = stats.fgm_50p;
  if (position === 'DEF' && Number.isFinite(stats.pts_allow)) {
    const buckets = [
      [0, 0, 'pts_allow_0'],
      [1, 6, 'pts_allow_1_6'],
      [7, 13, 'pts_allow_7_13'],
      [14, 20, 'pts_allow_14_20'],
      [21, 27, 'pts_allow_21_27'],
      [28, 34, 'pts_allow_28_34'],
      [35, 99, 'pts_allow_35p'],
    ] as const;
    for (const [lo, hi, key] of buckets)
      stats[key] =
        normalCdf((hi + 0.5 - stats.pts_allow) / 9) -
        normalCdf((lo - 0.5 - stats.pts_allow) / 9);
  }
  return leaguePoints(stats, scoring);
}
