import type { PredictionWeekData } from './predictions';
import { weekFourPublishedAt } from './newsletters/2026-week-4';

// Preview-day homepage copy is separate from the frozen Tuesday ranking archive.
const editions = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    publishedAt: weekFourPublishedAt,
    points: [
      {
        title: 'Joe’s $31 purchase comes with free group-chat analysis.',
        text: 'Gordon is on the bench in Friday’s snapshot; the dodgy trade offers are still circulating. At 0–3, Joe faces Jack in our Friday Match of the Week. The projections are separated by less than half a point.',
        href: '/matchups?week=4#matchup-5',
      },
      {
        title: 'Dave’s $3 rescue comes from this week’s opponent.',
        text: 'Sharpe’s main waiver run added Tucker but no running back. Lloyd arrived Friday after Keenan dropped him. Andrew is 3–0 and already has 17.70 from Thursday; after-sales assistance seems unlikely.',
        href: '/matchups?week=4#matchup-1',
      },
      {
        title: 'Friday edition: Thursday’s points are already in the book.',
        text: 'All six outlooks and winner calls were written after the opening game. Warren, Metcalf and Boston have already contributed. Tommy has also paid $13 to reclaim Sadiq, who he dropped last week. Progress takes many forms.',
        href: '/matchups?week=4',
      },
    ],
  },
];

export function getPreviewTalkingPoints(
  data: Pick<PredictionWeekData, 'leagueId' | 'season' | 'week' | 'finalized'>,
  now = Date.now(),
) {
  if (data.finalized) return null;
  return (
    editions.find(
      (edition) =>
        edition.leagueId === data.leagueId &&
        edition.season === data.season &&
        edition.week === data.week &&
        Date.parse(edition.publishedAt) <= now,
    )?.points ?? null
  );
}
