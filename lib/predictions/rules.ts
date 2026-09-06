export const GRADING_DELAY_MS = 64 * 60 * 60 * 1000;

export function sundayKickoffForWeek(season: number, week: number) {
  const date = new Date(Date.UTC(season, 8, 7));
  while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1);
  date.setUTCDate(date.getUTCDate() + (week - 1) * 7);
  const easternHour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    hourCycle: 'h23',
  });
  for (const hour of [17, 18]) {
    date.setUTCHours(hour, 0, 0, 0);
    if (easternHour.format(date) === '13') return date;
  }
  throw new Error('Unable to calculate Sunday pick deadline');
}

export function formatLockTime(value: string) {
  return `${new Intl.DateTimeFormat('en-IE', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Dublin' }).format(new Date(value))} · Irish time`;
}

export function isGradingEligible(lockAt: string, now = Date.now()) {
  return now >= new Date(lockAt).getTime() + GRADING_DELAY_MS;
}

export function signInErrorMessage(
  error: { code?: string; status?: number },
  online = true,
) {
  if (!online) return 'You’re offline. Reconnect, then try signing in again.';
  if (error.code === 'invalid_credentials')
    return 'That password did not match this manager account. Need help? Ask the commissioner.';
  if (error.status === 429 || error.code === 'over_request_rate_limit')
    return 'Too many sign-in attempts. Wait a moment, then try again.';
  return 'Sign-in is unavailable right now. Please try again. Your password may still be correct.';
}
