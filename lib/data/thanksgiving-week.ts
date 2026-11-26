import type { PredictionWeekData } from './predictions';

export function isThanksgivingWeek(
  data: Pick<PredictionWeekData, 'leagueId' | 'season' | 'week' | 'finalized'>,
  now = Date.now(),
) {
  return (
    data.leagueId === '1389706813993160704' &&
    data.season === '2026' &&
    data.week === 12 &&
    !data.finalized &&
    now >= Date.parse('2026-11-26T00:00:00Z') &&
    now < Date.parse('2026-12-01T11:00:00Z')
  );
}
