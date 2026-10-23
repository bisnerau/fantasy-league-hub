import type { PredictionMatchup, PredictionWeekData } from './predictions';
import type { NewsletterKey } from './matchup-newsletters';
import { weekFivePublishedAt } from './newsletters/2026-week-5';
import { weekSixPublishedAt } from './newsletters/2026-week-6';
import { weekSevenPublishedAt } from './newsletters/2026-week-7';

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
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 2,
    homeRosterId: 3,
    awayRosterId: 5,
    selectedAt: weekFivePublishedAt,
    reason:
      'Friday selection, after Thursday’s game: unbeaten Keenan meets Karl’s three-game winning streak. Karl already has 59.50 from Irving and Pickens against Andrew’s four from Aubrey. Third meets fourth in our rankings, with a perfect record on the line.',
    buildUp:
      'Keenan has won four without scoring 122; Karl has brought 59.50 before Sunday and still has Bijan and McBride to come. Andrew’s $6 Mitchell purchase faces an immediate performance review while Barkley sits on his bench. This is a Friday selection with Thursday’s scoring known, not a reconstructed pre-kickoff prediction. We take Karl to end the unbeaten run and leave both managers 4–1.',
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 5,
    homeRosterId: 1,
    awayRosterId: 6,
    selectedAt: weekSixPublishedAt,
    reason:
      'Friday selection, after Thursday’s game: the 1–4 commissioner faces the 3–2 champion, with both priced at Evens. Alan leads 14.60–5.20; Burns needs to stop four straight defeats before his perfect playoff attendance becomes a historical footnote.',
    buildUp:
      'Burns spent $25 on four waiver additions; Alan spent $4 covering a bye week. The best-lineup model separates them by 0.39 points. The commissioner has Kyren and Collins; the champion has a Thursday lead and Daniel Jones holding the fort for Burrow. We narrowly take Alan in this Friday call. Burns built the Wall of Shame page, which would at least make any future bug reports unusually well informed.',
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 2,
    homeRosterId: 5,
    awayRosterId: 9,
    selectedAt: weekSevenPublishedAt,
    reason:
      'Friday selection, after Thursday’s game: 5–1 Karl faces 4–2 Jack after trading Irving for Garrett Wilson and Coleman. Only 2.29 separates the adjusted best-lineup estimates, and neither has starter points banked. Karl is 10/11; Jack is 11/10.',
    buildUp:
      'Karl has won five straight and made the season’s first trade to repair his receiving depth. Jack has beaten Burns and Keenan in consecutive weeks and now gets a third contender. Wilson makes his Karl debut opposite McCaffrey and Henry; Egbuka’s missed practices leave Jack a decision to watch. We narrowly back Karl in this Friday call. A sixth straight win should make the scheduling complaints harder to sustain, although we admire his commitment to trying.',
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
