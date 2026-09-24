export const TWO_MINUTE_WARNING_MS = 2 * 60 * 60 * 1000;

export function getRemaining(target: number, now = Date.now()) {
  const distance = Math.max(0, target - now);
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
  };
}

/** The final two hours before the Sunday lock, while picks can still change. */
export function isTwoMinuteWarning(lockAt: string, now = Date.now()) {
  const lock = Date.parse(lockAt);
  return (
    Number.isFinite(lock) && now < lock && lock - now <= TWO_MINUTE_WARNING_MS
  );
}
