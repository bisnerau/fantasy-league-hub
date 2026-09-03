import type { SleeperProjection } from './types';

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

async function getUnofficialFeed(
  kind: 'projections' | 'stats',
  year: string,
  week: number,
): Promise<SleeperProjection[]> {
  try {
    const query = POSITIONS.map((position) => `position[]=${position}`).join(
      '&',
    );
    const response = await fetch(
      `https://api.sleeper.app/${kind}/nfl/${year}/${week}?season_type=regular&${query}`,
      { next: { revalidate: 900 } },
    );
    if (!response.ok) return [];
    return (await response.json()) as SleeperProjection[];
  } catch {
    return [];
  }
}

export const getWeeklyProjections = (year: string, week: number) =>
  getUnofficialFeed('projections', year, week);

export const getWeeklyStats = (year: string, week: number) =>
  getUnofficialFeed('stats', year, week);
