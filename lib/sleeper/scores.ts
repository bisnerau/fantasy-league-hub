/** Sleeper stores season totals as an integer plus hundredths, not a string. */
export function rosterScore(
  whole: unknown,
  hundredths: unknown = 0,
): number | null {
  if (typeof whole !== 'number' || !Number.isFinite(whole)) return null;
  const fraction = hundredths == null ? 0 : hundredths;
  if (
    typeof fraction !== 'number' ||
    !Number.isInteger(fraction) ||
    fraction < 0 ||
    fraction > 99
  )
    return null;
  return Math.round((whole + fraction / 100) * 100) / 100;
}

export function matchupScore(matchup: {
  points?: unknown;
  custom_points?: unknown;
}): number | null {
  const value = matchup.custom_points ?? matchup.points;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function formatScore(
  value: number | null | undefined,
  digits = 1,
): string {
  return value != null && Number.isFinite(value)
    ? value.toFixed(digits)
    : 'Unavailable';
}
