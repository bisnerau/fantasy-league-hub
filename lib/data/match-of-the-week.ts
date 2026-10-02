import type { PredictionMatchup, PredictionWeekData } from './predictions';
import type { NewsletterKey } from './matchup-newsletters';

export type MatchOfTheWeek = NewsletterKey & {
  selectedAt: string;
  reason: string;
  buildUp: string;
};

// One editorial selection per league/week. Normally chosen before kickoff;
// late editions explicitly disclose their actual Friday selection in the copy.
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
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 1,
    homeRosterId: 10,
    awayRosterId: 11,
    selectedAt: '2026-09-24T15:25:09Z',
    reason:
      'The only meeting of unbeaten teams this week: Shane has scored 114.92 more points than David, yet both are 2–0. A 3–0 start is at stake, and Sharpe finally faces a manager whose opponents have been putting up a fight.',
    buildUp:
      'Shane brings Lamar, Lamb and JSN. David brings two wins without reaching 100 and a free Jordan Love to sit behind Maye. One has assembled a contender; the other keeps being waved through security without showing a boarding pass. A 3–0 start is waiting. We have asked Shane to check the tickets.',
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 5,
    homeRosterId: 7,
    awayRosterId: 9,
    selectedAt: '2026-10-02T10:18:00Z',
    reason:
      'Friday selection, after Thursday’s NFL game: Joe’s $31 Gordon bid, the trade offers and the threat of 0–4 meet Jack’s established core. Only 0.41 separates the current PPR estimates; neither team has starter points banked yet.',
    buildUp:
      'The group chat has already reviewed Joe’s purchase. Jack gets to review the team. Ennis needs his first win before the rescue operation becomes a clearance sale; Ringrose can reach 3–1 without having to explain the size of the league when he won his trophy. This is a Friday outlook, with the call made now rather than before the week began.',
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
