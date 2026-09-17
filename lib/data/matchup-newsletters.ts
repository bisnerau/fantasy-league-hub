import type { MatchupPreview, MatchupStory } from '@/lib/predictions/stories';
import { weekOneNewsletters } from './newsletters/2026-week-1';
import { weekTwoReports } from './newsletters/2026-week-2';

export type NewsletterKey = {
  leagueId: string;
  season: string;
  week: number;
  sleeperMatchupId: number;
  homeRosterId: number;
  awayRosterId: number;
};
export type MatchupNewsletter = NewsletterKey & {
  preview?: MatchupPreview;
  review?: MatchupStory & { publishedAt: string };
};

// Editions are researched and written when the commissioner prompts us.
// Append each verified matchup here and deploy. Preserve a published preview
// and its winner call; write the review alongside it after results settle.
// Never backdate a preview or label a reconstructed outlook as a pregame call.
export const matchupNewsletters: readonly MatchupNewsletter[] = [
  ...weekOneNewsletters,
  ...weekTwoReports,
];

export function getMatchupNewsletter(
  key: NewsletterKey,
  editions: readonly MatchupNewsletter[] = matchupNewsletters,
  now = Date.now(),
) {
  const edition = editions.find(
    (entry) =>
      entry.leagueId === key.leagueId &&
      entry.season === key.season &&
      entry.week === key.week &&
      entry.sleeperMatchupId === key.sleeperMatchupId &&
      entry.homeRosterId === key.homeRosterId &&
      entry.awayRosterId === key.awayRosterId,
  );
  return {
    preview:
      edition?.preview &&
      Date.parse(edition.preview.publishedAt) <= now &&
      [key.homeRosterId, key.awayRosterId].includes(
        edition.preview.pickRosterId,
      )
        ? edition.preview
        : null,
    review:
      edition?.review && Date.parse(edition.review.publishedAt) <= now
        ? edition.review
        : null,
  };
}
