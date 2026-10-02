import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks, written AFTER PIT–CLE. These are not pre-kickoff calls.
// Current PPR estimates and Thursday's recorded points are separate measures.
// Evidence and commissioner-supplied chat context: docs/research/2026-week-4.md.
export const weekFourPublishedAt = '2026-10-02T10:18:00Z';

const sources = [
  {
    label: 'Sleeper Week 4 lineups and recorded points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/4',
  },
  {
    label: 'Sleeper Week 3 results',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
  },
  {
    label: 'Main midweek waiver run (filed under Week 3)',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
  },
  {
    label: 'Later Week 4 moves, including Lloyd',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/4',
  },
];

export const weekFourReports: MatchupNewsletter[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 1,
    homeRosterId: 3,
    awayRosterId: 11,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFourPublishedAt,
      pickRosterId: 3,
      homeProjection: 119.59,
      awayProjection: 100.19,
      headline: 'Dave buys a lifeboat from the man trying to sink him',
      summary:
        'Friday outlook, after Thursday’s game: Keenan has 17.70 banked and a 3–0 record. Dave has bought MarShawn Lloyd for $3 FAAB. The previous owner? Keenan. Customer support may be limited this weekend.',
      sections: [
        {
          title: 'The emergency response takes a scenic route',
          text: 'Achane is out for the season with a torn ACL. Dave’s main waiver run produced a free Tre Tucker, but no running-back reinforcement. Friday finally brought Lloyd for $3, replacing Chris Brooks. Sharpe did make a move; it just took the running-back department a little longer to locate the emergency exit. Lloyd is still benched in our Friday snapshot, with Brian Robinson and Hampton selected.',
        },
        {
          title: 'Please retain your receipt',
          text: 'Andrew dropped Lloyd while paying $4 for Chris Bell, then spent another dollar on Pittsburgh’s defence. That defence supplied six on Thursday; Fannin added 11.7. Keenan’s 17.70 is real scoring already on the board, not a forecast. Last week he beat Burns by 0.36, so he knows the value of small contributions. The commissioner knows it to two decimal places and has not enjoyed the lesson.',
        },
        {
          title: 'The Friday call: Andrew Keenan',
          text: 'David has yet to reach 100 in three completed weeks. Rice, McMillan and Michael Wilson offer a way back, but the thin backfield makes another escape difficult. Andrew gets the call to reach 4–0. If Lloyd eventually becomes Dave’s saviour, he can thank Andrew. If it happens against Andrew, the returns policy will be amended immediately.',
        },
      ],
      sources: [
        ...sources,
        {
          label: 'NFL: Achane injury update',
          url: 'https://www.nfl.com/news/dolphins-rb-devon-achane-miss-2026-season-acl-tear',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 2,
    homeRosterId: 8,
    awayRosterId: 10,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFourPublishedAt,
      pickRosterId: 10,
      homeProjection: 125.45,
      awayProjection: 139.62,
      headline:
        'Hugo spends fifteen dollars. Shane brings the entire league’s problem.',
      summary:
        'Friday outlook, after Thursday’s game: Warren has already supplied Shane with 15.60. Hugo has paid $15 FAAB for Kalif Raymond and left him on the bench. At least somebody has bought a comfortable seat for this.',
      sections: [
        {
          title: 'The difficult follow-up appointment',
          text: 'Hugo’s opening 156.06 has been followed by two defeats and two scores below 103. His reward is the league’s leading scorer, unbeaten and fresh from administering Sharpe’s 77.74-point reality check. Shane has not scored below 138.70 all season. There are kinder ways to establish whether your team has recovered, including simply asking it and believing the answer.',
        },
        {
          title: 'A purchase and an actual sighting',
          text: 'Walsh dropped Mark Andrews for Raymond in the main waiver run. The Friday lineup still puts Malik Washington at receiver and McConkey in the flex; Sleeper flags McConkey as questionable, so that selection bears watching. Shane picked up C.J. Stroud for free and dropped Singletary. An actual Marmion transaction is encouraging evidence that the league leader remembers which app this is.',
        },
        {
          title: 'The Friday call: Shane Marmion',
          text: 'Mahomes, Taylor and Bowers give Hugo enough quality to make this uncomfortable. Warren’s Thursday return alone settles nothing. But Lamar, Lamb and JSN still await their turn, and Shane’s sustained scoring earns the vote. Hugo needs a rebound before the household conversation with Alan becomes exclusively about what winning feels like. Shane needs to keep opening the app. Historically, one of those tasks has been surprisingly difficult.',
        },
      ],
      sources,
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 3,
    homeRosterId: 1,
    awayRosterId: 5,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFourPublishedAt,
      pickRosterId: 5,
      homeProjection: 123.56,
      awayProjection: 130.17,
      headline: 'Karl brings Burns’ former employee to the performance review',
      summary:
        'Friday outlook, after Thursday’s game: both teams are still on zero. Burns lost by 0.36 last week. Now Bryce Young, briefly employed by the commissioner, gets a chance to make the exit interview considerably more awkward.',
      sections: [
        {
          title: 'The HR department has questions',
          text: 'Karl won with Young at quarterback last week while Burns lost a game in which Shough actually delivered. There is no neat lesson there, which will not stop either manager finding one. Moroney arrives at 2–1 after Bijan powered a 131.34 total. Burns is 1–2 despite scoring more across the season than Karl. The scheduling complaint has crossed the table. Please allow three working days for Karl to notice the irony.',
        },
        {
          title: 'Staff turnover remains brisk',
          text: 'Burns claimed Keaton Mitchell for free, then replaced him with Jaylen Wright less than an hour later. Apparently last week’s Bryce Young induction was considered too lengthy. Karl spent $9 FAAB on Keenan Allen and dropped Baker Mayfield; Allen is benched in this snapshot. Burns has Collins and Swift selected with Sleeper questionable tags, while Karl has the same flag on Bucky Irving. Friday lineups are still a moving target.',
        },
        {
          title: 'The Friday call: Karl Moroney',
          text: 'Bijan and McBride give Karl the stronger foundation, with roughly seven points separating the current PPR estimates. Chase and a productive Collins would make Burns a very credible winner, but Karl gets the narrow nod. If the commissioner loses another close one, expect a perfectly professional round-up followed by several unrelated improvements to the website’s definition of bad luck.',
        },
      ],
      sources,
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 4,
    homeRosterId: 2,
    awayRosterId: 12,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFourPublishedAt,
      pickRosterId: 12,
      homeProjection: 128.59,
      awayProjection: 114.54,
      headline:
        'Murphy discovers momentum. Niall would like his September back.',
      summary:
        'Friday outlook, after Thursday’s game: Metcalf has put 16.50 on Murphy’s side of the board. Both managers are 1–2, but Aidan’s last two scores look much healthier than Niall’s. We are backing the awkward direction of travel.',
      sections: [
        {
          title: 'Same record, different conversations',
          text: 'Murphy followed his 57-point opener with 130.46 and 129.94. Niall followed 169 with 88.96 and 105.88. One manager would like us to forget opening weekend; the other would like the season judged exclusively on it. Murray still owns the larger total, but Aidan has spent a fortnight looking like the team his five consecutive playoff appearances say he should be.',
        },
        {
          title: 'The set-and-forget man keeps pressing buttons',
          text: 'Murphy added Will Reichard for Trey Smack and picked up Brenton Strange, both through free agency. Both are selected. Niall has no completed acquisition in the checked window since Tuesday and again starts Schultz, last week’s $14 FAAB purchase. Walker and Brown remain the route to a Murray recovery. Murphy counters with Cook, London and Adams, plus Metcalf’s Thursday contribution already recorded.',
        },
        {
          title: 'The Friday call: Aidan Murphy',
          text: 'This is the upset call: Niall leads the frozen full-lineup PPR estimates by about fourteen, but Murphy’s recent scoring and useful Thursday start sway it. Those estimates are not a fresh final-score forecast and the 16.50 is not being added on top of them. Aidan gets the nod to make it two wins running. Niall may need a new team name; the current one has stopped distracting us from the results.',
        },
      ],
      sources,
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 5,
    homeRosterId: 7,
    awayRosterId: 9,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFourPublishedAt,
      pickRosterId: 9,
      homeProjection: 122.31,
      awayProjection: 121.9,
      headline: 'Joe spends $31 to give the group chat a new hobby',
      summary:
        'Friday Match of the Week outlook: Joe is 0–3, Ollie Gordon cost $31 FAAB, and the dodgy trade offers are still going out. Jack is 2–1. The projections are almost level. For once, the price is the least negotiable part.',
      sections: [
        {
          title: 'An expensive seat on the bench',
          text: 'Joe’s Gordon bid was the largest successful claim in the checked midweek run, and the group chat has duly supplied its valuation. Gordon is benched in Friday’s snapshot behind Skattebo and Braelon Allen. Buying help for the weeks ahead is defensible. Paying $31 while scoring 71.62 last week does, however, invite questions about whether delivery was included. Burns collected Jaylen Wright for free. Nobody is suggesting Joe enjoyed that comparison.',
        },
        {
          title: 'All offers considered. Most should not be.',
          text: 'The commissioner reports that Joe has also been circulating dodgy trade proposals. No invented packages are required: at 0–3, his negotiating position already comes with its own punchline. He paid $2 to bring Baltimore’s defence back and now has free-agent Sam Darnold selected over Hurts. Jack added Chicago’s defence and Jauan Jennings without a bid, then returned to the reassuring business of owning Allen, McCaffrey and Henry.',
        },
        {
          title: 'The Friday call: Jack Ringrose',
          text: 'Only 0.41 separates the PPR estimates, narrowly favouring Joe; neither side has starter points banked from Thursday. We take Jack’s established core over Ennis’ increasingly elaborate rescue operation. Joe’s receivers can absolutely overturn that call. If they do, expect the Gordon invoice to be presented as visionary management. If he reaches 0–4, even fourth place will start declining his trade requests.',
        },
      ],
      sources,
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    sleeperMatchupId: 6,
    homeRosterId: 4,
    awayRosterId: 6,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFourPublishedAt,
      pickRosterId: 6,
      homeProjection: 112.83,
      awayProjection: 129.92,
      headline: 'Tommy pays to undo his own homework',
      summary:
        'Friday outlook, after Thursday’s game: Boston has given Tommy 12.90 to begin with. He has also paid $13 FAAB to reclaim Sadiq, the player he dropped to buy Boston. Alan’s title defence has a simpler accounting system: Gibbs scores, Alan wins.',
      sections: [
        {
          title: 'The return journey costs extra',
          text: 'Last week Tommy paid $16 for Boston and dropped Sadiq. This week he paid $13 to bring Sadiq back, dropping Antonio Williams. Twenty-nine FAAB to arrive with both players is an unusually detailed way to demonstrate conviction. Boston’s Thursday return is at least something tangible for the receipt folder. Sadiq is selected but carries a Sleeper questionable flag, as does Puka. The weekend still requires attention.',
        },
        {
          title: 'The champion changes one lightbulb',
          text: 'Alan replaced Detroit’s defence with Green Bay through free agency. No grand rebuild, no circular tight-end procurement programme. Three straight scores above 128 and Gibbs’ 41.4 last week provide a decent argument for leaving most things alone. Tommy’s 105.60 against Jack was progress after two sub-75 weeks, but it still left him 0–3. Becoming more respectable is useful; the standings continue to insist on becoming victorious.',
        },
        {
          title: 'The Friday call: Alan Horgan',
          text: 'Boston’s points give Tommy a start, not a seventeen-point answer to the gap in full-lineup PPR estimates. Wilson and Puka give him an upset route if the lineup holds together. Alan’s Gibbs–Olave core and steadier supporting cast get the call. Tommy knows enough football to explain every part of this predicament. Alan currently needs to explain considerably less, which must be infuriating.',
        },
      ],
      sources,
    },
  },
];
