import type { PredictionWeekData } from './predictions';
import { weekFourPublishedAt } from './newsletters/2026-week-4';
import { weekFivePublishedAt } from './newsletters/2026-week-5';

// Preview-day homepage copy is separate from the frozen Tuesday ranking archive.
const editions = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    publishedAt: weekFivePublishedAt,
    points: [
      {
        title: 'Keenan’s perfect start meets Karl’s 59.50-point Thursday.',
        text: 'Irving and Pickens have already put Karl in charge of our Friday Match of the Week. Andrew is 4–0, has Barkley benched and paid $6 for Mitchell. The unbeaten record finally has a difficult appointment.',
        href: '/matchups?week=5#matchup-2',
      },
      {
        title: 'Niall’s $20 Shipley comes with competition.',
        text: 'Barkley missed Thursday practice, but the Eagles have also promoted Dameon Pierce. Shipley is still on Niall’s bench. Shane has only 2.90 from Lamb and Lamar missed another practice: our Friday upset call goes to Murray.',
        href: '/matchups?week=5#matchup-3',
      },
      {
        title: 'Friday morning check: practising does not mean cleared.',
        text: 'Chase remains in concussion protocol; Higgins and McConkey missed Thursday practice. Charbonnet is limited and still on PUP. All six outlooks use news checked 9 October, after TB–DAL; final Friday designations are still pending.',
        href: '/matchups?week=5',
      },
    ],
  },
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
