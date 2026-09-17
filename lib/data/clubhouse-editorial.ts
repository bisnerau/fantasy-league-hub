import type { PredictionWeekData } from './predictions';
import { getMatchOfTheWeek } from './match-of-the-week';
import { getPowerRankingEditions } from './power-rankings';

export function getClubhouseEditorial(
  data: PredictionWeekData,
  reviewData: PredictionWeekData | null,
  now = Date.now(),
) {
  const feature = getMatchOfTheWeek(data, undefined, now);
  const featuredMatchup = data.matchups.find(
    (m) => m.sleeperMatchupId === feature?.sleeperMatchupId,
  );
  const previews = data.matchups.filter((m) => m.preview);
  const validReviews =
    reviewData?.finalized &&
    reviewData.leagueId === data.leagueId &&
    reviewData.season === data.season &&
    reviewData.week <= data.week;
  const reviews = validReviews
    ? reviewData.matchups.filter((m) => m.review)
    : [];
  const currentMatchup = data.finalized
    ? featuredMatchup?.review
      ? featuredMatchup
      : data.matchups.find((m) => m.review)
    : featuredMatchup?.preview
      ? featuredMatchup
      : previews[0];
  const currentStory = data.finalized
    ? currentMatchup?.review
    : currentMatchup?.preview;
  const lead =
    currentMatchup && currentStory
      ? {
          story: currentStory,
          matchup: currentMatchup,
          week: data.week,
          kind: data.finalized ? ('review' as const) : ('preview' as const),
          featured: currentMatchup === featuredMatchup,
        }
      : reviews[0]?.review
        ? {
            story: reviews[0].review,
            matchup: reviews[0],
            week: reviewData!.week,
            kind: 'review' as const,
            featured: false,
          }
        : null;
  const ranking = getPowerRankingEditions(data.leagueId, data.season, now).find(
    (e) => e.week <= data.week,
  );
  return {
    lead,
    previews,
    reviews,
    ranking,
    talkingPoints: ranking?.week === data.week ? ranking.talkingPoints : [],
  };
}
