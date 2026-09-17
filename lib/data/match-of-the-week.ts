import type { PredictionMatchup, PredictionWeekData } from './predictions';
import type { NewsletterKey } from './matchup-newsletters';

export type MatchOfTheWeek = NewsletterKey & {
  selectedAt: string;
  reason: string;
  buildUp: string;
};

// One editorial selection per league/week, chosen before the opening NFL game.
// Preserve selections in the archive; never derive them from votes or results.
export const matchOfTheWeekSelections: readonly MatchOfTheWeek[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 2,
    sleeperMatchupId: 4,
    homeRosterId: 6,
    awayRosterId: 8,
    selectedAt: '2026-09-17T21:42:40.000Z',
    reason:
      'Alan is defending the title and chasing his first head-to-head win. Hugo wants to go 2–0. They also live together, which gives the loser considerably fewer places to hide than anyone else in MAC 12.',
    buildUp:
      'Hugo can send the champion to 0–2 and turn every ordinary household encounter into a post-match interview. Alan can level their records and resume bringing the trophy into unrelated conversations. Most managers get to put their phone down when the slagging starts. These two would have to move out. That deserves top billing.',
  },
];

function matchesFixture(matchup: PredictionMatchup, selection: MatchOfTheWeek) {
  return (
    matchup.sleeperMatchupId === selection.sleeperMatchupId &&
    matchup.home.rosterId === selection.homeRosterId &&
    matchup.away.rosterId === selection.awayRosterId
  );
}

export function getMatchOfTheWeek(
  data: Pick<PredictionWeekData, 'leagueId' | 'season' | 'week' | 'matchups'>,
  selections: readonly MatchOfTheWeek[] = matchOfTheWeekSelections,
  now = Date.now(),
): MatchOfTheWeek | null {
  const editions = selections.filter(
    (entry) =>
      entry.leagueId === data.leagueId &&
      entry.season === data.season &&
      entry.week === data.week,
  );
  // Ambiguous editorial configuration should not feature multiple games.
  if (editions.length !== 1) return null;
  const selection = editions[0];
  return Date.parse(selection.selectedAt) <= now &&
    data.matchups.some((matchup) => matchesFixture(matchup, selection))
    ? selection
    : null;
}

export function orderMatchupsForDisplay(
  matchups: PredictionMatchup[],
  selection: MatchOfTheWeek | null,
) {
  const featured = selection
    ? matchups.find((matchup) => matchesFixture(matchup, selection))
    : undefined;
  return featured
    ? [featured, ...matchups.filter((matchup) => matchup !== featured)]
    : [...matchups];
}
