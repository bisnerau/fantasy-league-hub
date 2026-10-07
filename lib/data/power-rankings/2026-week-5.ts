import type { PowerRankingEdition } from '../power-rankings';
import { weekFourReviewPublishedAt } from '../newsletters/2026-week-4';

// Tuesday-cycle edition, published Wednesday 7 October after all six Week 4
// results settled; earlier editions stay frozen.
// Evidence: docs/research/2026-week-5-power-rankings.json.
export const weekFivePowerRankings: PowerRankingEdition = {
  leagueId: '1389706813993160704',
  season: '2026',
  week: 5,
  throughWeek: 4,
  publishedAt: weekFourReviewPublishedAt,
  headline: 'Two unbeatens left. Only one of them looks it.',
  introduction:
    'The reset after Week 4: Shane and Alan hold the top two, Karl and Murphy climb two places each, and Jack drops three after the week’s lowest score. Keenan is 4–0 and stays fourth; Tommy is 0–4 and now last. These are strength rankings heading into Week 5, using all four completed weeks. Movement is versus the Week 4 edition; the points beside each team are their settled Week 4 score.',
  entries: [
    {
      rosterId: 10,
      manager: 'Shane Marmion',
      record: '4–0',
      recentPoints: 151.78,
      verdict:
        '596.04 points, nothing below 138.70 and a 40–4 all-play record. Lamb’s 41.3 ended Hugo’s best week since the opener. Lamar’s ankle sprain has Stroud, the free pickup, starting this week. Shane appears to have had a contingency plan ready. Concerning.',
    },
    {
      rosterId: 6,
      manager: 'Alan Horgan',
      record: '3–1',
      recentPoints: 152.72,
      verdict:
        'The week’s top score, a fourth straight total above 128 and a 36–8 all-play record. Javonte Williams’ 31.3 and Burrow’s 23.72 meant Gibbs could have a quiet one. Alan is the clear second-best team in the league. Hugo, who lives with him, may wish to look into soundproofing.',
    },
    {
      rosterId: 5,
      manager: 'Karl Moroney',
      record: '3–1',
      recentPoints: 142.46,
      verdict:
        'Three straight wins and the third-highest points total. Bryce Young’s 21.46 against his former employer was a personal touch. Daniels is due back at Washington this week, giving Karl a proper quarterback choice. Up two places, and the scheduling complaints have entered a period of unexplained silence.',
    },
    {
      rosterId: 3,
      manager: 'Andrew Keenan',
      record: '4–0',
      recentPoints: 121.68,
      verdict:
        'Unbeaten, with every score between 110.92 and 121.68 and the fewest points conceded. The 24–20 all-play record says Andrew is good and fortunate in roughly equal measure. Saquon’s hamstring takes a back off the board for now. Fourth again: the record is perfect, the team is merely solid.',
    },
    {
      rosterId: 12,
      manager: 'Aidan Murphy',
      record: '2–2',
      recentPoints: 137,
      verdict:
        '130.46, 129.94 and now 137.00: three strong weeks and a 26–18 all-play record that betters Keenan’s. Free-agent additions Reichard and Strange scored 33.5 between them. Up two places. The set-and-forget man has started setting things. The forgetting may be over.',
    },
    {
      rosterId: 9,
      manager: 'Jack Ringrose',
      record: '2–2',
      recentPoints: 93.42,
      verdict:
        '130.56, 126.62, 113.86, 93.42: each week lower than the last, finishing with the league’s lowest Week 4 score. Allen, McCaffrey and Henry are still a strong core, which keeps Jack sixth. Kincaid, Jennings and Egbuka scoring 6.8 between them is why he is not higher.',
    },
    {
      rosterId: 1,
      manager: 'Emmet Burns',
      record: '1–3',
      recentPoints: 113.84,
      verdict:
        'The fourth-highest points total and three straight defeats. Kyren and Collins scored 67.5; the bench scored more than the margin. Chase is now in the concussion protocol, according to Zac Taylor. Burns drops one place. The commissioner has received his own flag, and appealed to himself.',
    },
    {
      rosterId: 8,
      manager: 'Hugo Walsh',
      record: '1–3',
      recentPoints: 121.3,
      verdict:
        '121.30 was Hugo’s best since Week 1 and would have beaten six teams. He has conceded 540.76, the most in the league, so this one rises. Mahomes is on bye, hence the $4 Kirk Cousins. Higgins and McConkey both picked up injuries on Sunday. Up one place, with the paperwork piling up.',
    },
    {
      rosterId: 2,
      manager: 'Niall Murray',
      record: '1–3',
      recentPoints: 105.08,
      verdict:
        '88.96, 105.88, 105.08 since the 169-point opener. Walker’s 30.9 deserved better support than 9.5 from Parker Washington, Downs and Schultz. Schultz is gone, Hockenson has arrived, and $20 bought Will Shipley in an Eagles backfield short of Barkley. Down one place. At least the waiver office is open.',
    },
    {
      rosterId: 7,
      manager: 'Joe Ennis',
      record: '1–3',
      recentPoints: 116.42,
      verdict:
        'A first win, delivered by Nabers, LaPorta and St. Brown. The $31 Gordon scored 18 on the bench and now starts. Joe stays tenth: one win does not erase 71.62, but it does make the trade offers marginally harder to ignore. Fourth place is now a realistic ambition again.',
    },
    {
      rosterId: 11,
      manager: 'David Sharpe',
      record: '2–2',
      recentPoints: 118.08,
      verdict:
        'A first score above 100 at last, and McMillan’s 45.2 was the best individual total of the week. Maye’s 26.16 on the bench cost him the game. The 11–32 all-play record says the 2–2 is generous. Up one place, mainly because somebody had to be last and it is no longer him.',
    },
    {
      rosterId: 4,
      manager: 'Tommy O’Brien',
      record: '0–4',
      recentPoints: 103.08,
      verdict:
        'Four defeats, the lowest points total and a 5–39 all-play record. Monangai and Puka gave him a chance; Sadiq’s zero did not help. Twenty-nine FAAB spent on Boston and Sadiq has returned 12.9 points. Last place. The Shark Boy costume is presumably still in the wardrobe.',
    },
  ],
  talkingPoints: [
    {
      title: 'Joe wins one. Our Match of the Week call loses one.',
      text: 'We backed Jack. Jack’s team produced the week’s lowest score while Nabers and LaPorta delivered Joe’s first win. The $31 Gordon scored 18 on the bench, which settles nothing and will be quoted forever.',
      href: '/matchups?week=4#matchup-5',
    },
    {
      title: 'The commissioner’s bench outscores the margin.',
      text: 'Tate and Saturday pickup Emanuel Wilson scored 48.5 on Burns’ bench in a 28.62-point defeat to Karl. The flag on the play was thrown by the referee. The referee also built the website.',
      href: '/matchups?week=4#matchup-3',
    },
    {
      title: 'Two unbeatens. 124.44 points between them.',
      text: 'Shane and Keenan are both 4–0, but Shane has scored 596.04 and Andrew 471.60. Keenan stays fourth in the rankings; Karl and Murphy climb two places and Jack drops three.',
      href: '/power-rankings?season=2026&week=5',
    },
  ],
  sources: [
    {
      label: 'Sleeper Week 1–4 results and recorded player points',
      url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/4',
    },
    {
      label: 'Sleeper current rosters and head-to-head records',
      url: 'https://api.sleeper.app/v1/league/1389706813993160704/rosters',
    },
    {
      label: 'Bengals: Chase enters concussion protocol (NBC Sports)',
      url: 'https://www.nbcsports.com/fantasy/football/player-news/2026-10-05/taylor-chase-in-concussion-protocol-to-start-week',
    },
    {
      label: 'Ravens: Lamar Jackson ankle injury',
      url: 'https://www.baltimoreravens.com/news/lamar-jackson-ankle-injury-ravens-titans-tyler-huntley',
    },
  ],
};
