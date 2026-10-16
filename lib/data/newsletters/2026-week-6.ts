import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks after SEA–DEN. Thursday points are known; final Friday
// designations are pending. Preserve these calls when adding settled reviews.
export const weekSixPublishedAt = '2026-10-16T09:31:36Z';
const sources = [
  {
    label: 'Sleeper: Friday Week 6 lineups and Thursday points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
  },
  {
    label: 'Sleeper: completed Week 5 scores',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/5',
  },
  {
    label: 'Sleeper: Wednesday waivers (filed under Week 5)',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/5',
  },
  {
    label: 'Sleeper: later Week 6 moves, including Friday waivers',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
  },
];
const eagles = {
  label:
    'Eagles, Thursday: Hurts out; Barkley and Shipley absent; Smith limited',
  url: 'https://www.philadelphiaeagles.com/news/panthers-vs-eagles-injury-report-2026-nfl-week-6-saquon-barkley-devonta-smith',
};
const ravens = {
  label: 'Ravens, Thursday: Jackson absent; Flowers added as limited',
  url: 'https://www.baltimoreravens.com/news/lamar-jackson-injury-report-ankle-ravens-browns-rashod-bateman-matt-hibner',
};
const chargers = {
  label: 'Chargers–Chiefs, Thursday: McConkey limited; Rice absent again',
  url: 'https://www.chargers.com/news/chiefs-injury-report-ladd-mcconkey-week-6',
};

export const weekSixReports: MatchupNewsletter[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 1,
    homeRosterId: 5,
    awayRosterId: 11,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSixPublishedAt,
      pickRosterId: 5,
      homeProjection: 120.75,
      awayProjection: 108.81,
      headline: 'Karl has run out of opponents to blame',
      summary:
        'Friday outlook, after Thursday’s game: Karl’s four straight wins meet Sharpe’s newly discovered ability to score 100. Denver has banked Karl 13; Myers has given David eight. The complaints department is enjoying a quiet month.',
      sections: [
        {
          title: 'The schedule has been suspiciously fair lately',
          text: 'Karl’s 171.46 last week was the biggest score of the season so far. He is 4–1, first in our rankings and still has Bijan, Irving and McBride to play. At this rate he will have to invent a complaint about winning too comfortably. Denver’s 13 gives him another useful Thursday start. McLaurin carries a Sleeper questionable flag ahead of Monday, so there is still a little paperwork for the universe to lose.',
        },
        {
          title: 'David discovers the third digit',
          text: 'Sharpe finally broke 100 with 135.34 against Hugo, helped by Maye’s 39.46. Now comes the awkward business of doing it twice. His $3 Spears is on the bench; Lloyd and Hampton remain the selected backs. Rice missed both Wednesday and Thursday practice with hamstring/knee issues on the Chiefs report. David has Godwin and Tucker in reserve if needed. Owning alternatives is a promising development for a man whose usual contingency plan is Sunday happening anyway.',
        },
        {
          title: 'The Friday call: Karl Moroney',
          text: 'Karl is 4/7; Sharpe is 7/4. Bijan and McBride give Karl the stronger base, while Rice’s availability threatens David’s route to another big score. Maye can make this uncomfortable, but we are backing the four-game streak. Karl approaching 5–1 with no grievance prepared would be a serious test of his personality.',
        },
      ],
      sources: [...sources, chargers],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 2,
    homeRosterId: 2,
    awayRosterId: 8,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSixPublishedAt,
      pickRosterId: 2,
      homeProjection: 119.34,
      awayProjection: 102.77,
      headline: 'Hugo buys another chance for $11',
      summary:
        'Friday outlook, after Thursday’s game: Niall has just beaten Shane; Hugo has lost four straight. Neither has starter points banked. Two former forfeit residents meet, with Hugo looking uncomfortably familiar with the directions.',
      sections: [
        {
          title: 'The Eagles running-back raffle',
          text: 'Hugo paid $11 for Pierce and put him straight into the lineup. Niall’s $20 Shipley remains on the bench. Philadelphia says Barkley and Shipley both missed Thursday practice, so Pierce has a possible opening, although a guaranteed workload would be a generous thing to print on the receipt. Hugo also dropped Allgeier, briefly added Vidal, then replaced Vidal with San Francisco’s defence. Grafton Street buskers generally make fewer changes between songs.',
        },
        {
          title: 'Niall would accept another ugly win',
          text: 'Murray’s 2.90-point escape against Shane brought him to 2–3. Walker and Parker Washington lead this week’s case, with Evans carrying a Sleeper questionable flag. Hugo needs Taylor and Bowers to support a receiving group currently containing Raymond and Lemon. McConkey was limited Thursday with a foot injury; Caleb Williams also retains a Sleeper questionable tag. Mahomes is available on Hugo’s bench. This is a Friday snapshot, with final designations still to come.',
        },
        {
          title: 'The Friday call: Niall Murray',
          text: 'Niall is 4/9 against Hugo’s 9/4. Taylor can ruin the forecast, and Pierce could justify the bid, but Murray has more convincing routes to a competitive total. Back Niall to reach 3–3. Hugo at 1–5 would have Alan checking whether a guitar counts towards the household contents insurance.',
        },
      ],
      sources: [...sources, eagles, chargers],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 3,
    homeRosterId: 3,
    awayRosterId: 9,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSixPublishedAt,
      pickRosterId: 9,
      homeProjection: 93.82,
      awayProjection: 109.68,
      headline: 'Two disputed champions, one missing quarterback',
      summary:
        'Friday outlook, after Thursday’s game: Keenan is 4–1 but currently has Goff selected on Detroit’s bye, with no other quarterback rostered. Jack is 3–2 and has Josh Allen. The eight-team champion has counted to nine starters.',
      sections: [
        {
          title: 'Andrew has until Sunday to find a passer',
          text: 'The quarterback gap is real in this snapshot, not a verdict that Keenan will leave it that way. His best-lineup price has no imaginary waiver replacement built in. Friday’s $10 Allgeier replaces last week’s $6 Mitchell, while Barkley stays benched after missing Thursday practice. Flowers was newly limited with a toe injury, too. Having your unbeaten run ended by Karl was unpleasant; following it with a quarterback sabbatical would be a bold recovery strategy.',
        },
        {
          title: 'Jack shops in the premium aisle',
          text: 'Ringrose paid $15 for Darius Cooper and $7 for Higbee, both selected this morning. Kincaid remains on the bench despite the higher PPR estimate. The Eagles have confirmed Hurts is out and McKee will start, so Cooper’s new employer has a quarterback change to consider. Allen, McCaffrey and Henry give Jack a substantial core. For once, the most questionable thing about his team may be a tight-end choice rather than the size of the league when he won it.',
        },
        {
          title: 'The Friday call: Jack Ringrose',
          text: 'Jack is 2/5; Keenan is 5/2. A quarterback pickup could improve Andrew’s outlook considerably, but prices freeze on the roster available now. We favour Jack’s established core to bring both managers to 4–2. Their trophies can then continue arguing over which one required fewer opponents.',
        },
      ],
      sources: [...sources, eagles, ravens],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 4,
    homeRosterId: 4,
    awayRosterId: 10,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSixPublishedAt,
      pickRosterId: 10,
      homeProjection: 122.51,
      awayProjection: 138.37,
      headline: 'Tommy wins once. Shane requests a second opinion.',
      summary:
        'Friday outlook, after Thursday’s game: Tommy’s 157.12 finally made the lectures compulsory listening. Shane has already replied with 25.40 from JSN against three from Tommy’s Seattle defence. The honeymoon lasted until Thursday.',
      sections: [
        {
          title: 'One win and the syllabus gets longer',
          text: 'Stafford and Puka supplied 65.02 in Tommy’s first win. They remain his best argument against another defeat, with Garrett Wilson and Stevenson adding support. The new $1 Seattle defence has delivered three points. That is excellent value per dollar and less impressive value per starting slot. After four weeks of theoretical upside, Tommy has finally produced evidence. Unfortunately, Shane appears to have read the appendix.',
        },
        {
          title: 'Check the quarterback before celebrating',
          text: 'JSN’s 25.40 gives Shane a 22.40-point banked advantage, but Lamar missed Thursday practice again with his ankle injury. Stroud is available on the bench if required. Kittle remains selected ahead of Likely, whose 32.40 bench points helped earn Shane last week’s flag. Choosing between them is legitimate; hearing about last week’s choice until Christmas is also part of the rules. The 4–1 record still looks good, provided Shane actually opens the app.',
        },
        {
          title: 'The Friday call: Shane Marmion',
          text: 'Shane is 4/11; Tommy is 11/4. The price includes Lamar’s current projection, so his availability remains a real caveat. Even with Stroud as cover, JSN’s points and Lamb’s ceiling keep us on Shane. Tommy can absolutely win through Stafford–Puka again. We would just prefer to watch the sequel before agreeing to another lecture series.',
        },
      ],
      sources: [...sources, ravens],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 5,
    homeRosterId: 1,
    awayRosterId: 6,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSixPublishedAt,
      pickRosterId: 6,
      homeProjection: 125.16,
      awayProjection: 111.53,
      headline: 'Burns runs the website. Alan would like to run the score up.',
      summary:
        'Friday Match of the Week, after Thursday’s game: the commissioner is 1–4, the champion is 3–2, and the prices are Evens each. Harvey has given Alan 14.60 against Wilson’s 5.20 for Burns. Home advantage apparently does not include administrator access.',
      sections: [
        {
          title: 'Twenty-five dollars to fix a one-win team',
          text: 'Burns spent $16 on Germie Bernard, $5 on New England’s defence, $3 on Butker and $1 on Roschon Johnson. Bernard and Roschon sit on the bench; the defence and kicker go straight in. Four consecutive defeats have made the commissioner unusually sympathetic to software updates promising improved performance. Chase is on Cincinnati’s bye, leaving Collins, Tate and Kyren to support Shough. The man with six straight playoff appearances is getting an early look at the other end of his own website.',
        },
        {
          title: 'Alan brings the trophy and a replacement battery',
          text: 'Burrow and Gibbs are on bye, so Alan has bought Daniel Jones for $2 and Indianapolis’s defence for another $2. Harvey’s Thursday return already beats the 1.70 he and Dallas’s defence combined for last week. Olave and Diggs carry Sleeper questionable flags, making the final reports worth checking. Alan’s title defence has reached the stage where Daniel Jones is essential equipment. There should be a warranty card inside the trophy.',
        },
        {
          title: 'The Friday call: Alan Horgan',
          text: 'The best-lineup model separates them by only 0.39 points and prices both at Evens. Burns has the higher selected-lineup PPR estimate, but it still includes Thursday projections, not the actual returns. We narrowly take Alan with his 9.40-point banked lead. A fifth straight Burns defeat would make the league’s most urgent feature request a button that hides the commissioner’s record.',
        },
      ],
      sources,
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    sleeperMatchupId: 6,
    homeRosterId: 7,
    awayRosterId: 12,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSixPublishedAt,
      pickRosterId: 12,
      homeProjection: 107.6,
      awayProjection: 124.34,
      headline: 'Joe sacks the employee of the week',
      summary:
        'Friday outlook, after Thursday’s game: Brissett helped Joe beat the champion, then got dropped for a $3 tight end. Cousins is the new $6 quarterback. Murphy, also 2–3, would appreciate Joe spending the weekend managing his own team for a change.',
      sections: [
        {
          title: 'The leaving card has barely been signed',
          text: 'Brissett’s 25.28 helped deliver Joe’s second straight win. On Wednesday he was cut for Freiermuth; on Friday Cousins arrived for $6, with Deebo leaving. Hurts has been ruled out by Philadelphia, while Jefferson, St. Brown and LaPorta are on bye. Dobbins has supplied 13.60 from Thursday, giving the replacements a start. Joe’s receiving room looked luxurious last week. This week Golden and Nabers are covering several colleagues’ annual leave.',
        },
        {
          title: 'Murphy has found the purchase button',
          text: 'Aidan spent $8 on Kansas City’s defence and $3 on Pineiro, then selected both. Andrews was dropped after his 4.80 last week; Strange returns at tight end. Cook, London and Adams give Murphy enough quality to avoid relying on an eleven-dollar special-teams rescue. Four consecutive totals above 120 make a decent case for him, even after Tommy’s breakout handed him a loss. Set-and-forget is becoming set-and-submit-an-expense-claim.',
        },
        {
          title: 'The Friday call: Aidan Murphy',
          text: 'Murphy is 10/11 against Joe’s 11/10: close enough that Dobbins’ start matters, with the best-lineup model already including it. We prefer Aidan’s available receiving strength over Joe’s bye-week cover. One manager reaches 3–3; the other gets to explain why a promising recovery has stalled. Joe has extensive experience explaining why the journey towards fourth takes time.',
        },
      ],
      sources: [...sources, eagles],
    },
  },
];
