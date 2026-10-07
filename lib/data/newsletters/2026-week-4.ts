import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks, written AFTER PIT–CLE. These are not pre-kickoff calls.
// Reviews revisit those Friday calls; the outlooks themselves stay frozen.
// Current PPR estimates and Thursday's recorded points are separate measures.
// Evidence and commissioner-supplied chat context: docs/research/2026-week-4.md.
export const weekFourPublishedAt = '2026-10-02T10:18:00Z';
// Tuesday-cycle reviews, published Wednesday 7 October after Supabase settled
// all six results on 6 October. Evidence: docs/research/2026-week-4-results.json.
export const weekFourReviewPublishedAt = '2026-10-07T10:39:00Z';

const reviewSources = [
  {
    label: 'Sleeper Week 4 results and recorded player points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/4',
  },
];

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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFourReviewPublishedAt,
      headline: 'Sharpe finally breaks 100, then finds Maye on the bench',
      summary:
        'Keenan 121.68, Sharpe 118.08. David’s first three-figure score of the season arrived in the same week as his second straight defeat. Drake Maye watched from the bench with 26.16. Andrew is 4–0 and has still not scored 122.',
      sections: [
        {
          title: 'The hundred arrives. The win does not.',
          text: 'Sharpe went 2–0 without reaching 100 and has now lost twice in a row, the second time with his best score of the season. McMillan supplied 45.20, the biggest individual total in the league this week. Nobody can say David failed to bring a team. Having brought one, he made some unusual choices about which of them should play.',
        },
        {
          title: 'The quarterback committee meets on the bench',
          text: 'Jordan Love, collected for zero FAAB in Week 3, started and scored 13.08. Maye sat behind him with 26.16, a gap more than three times the 3.60 margin. Brian Robinson, selected on Friday, made way for MarShawn Lloyd and then scored 25.70 from the bench on Monday night. Friday’s estimates gave Robinson barely four, so that one had a case. Lloyd scored 9.90 against the man who dropped him. The returns policy survives. The quarterback policy does not.',
        },
        {
          title: 'The Friday call: Andrew Keenan, correct',
          text: 'We took Keenan, and he reached 4–0 without fuss: Flowers 25.80, Goff 20.48, Jeanty 18.60, while Saquon managed 2.00 on four snaps. Andrew has scored between 110.92 and 121.68 every week and has conceded fewer points than anyone. Unbeaten, steady and faintly unremarkable. After two ninth-place finishes, that counts as a renaissance.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFourReviewPublishedAt,
      headline:
        'Hugo has his best week in a month. Shane has another ordinary one.',
      summary:
        'Shane 151.78, Hugo 121.30. Hugo’s highest score since the opener would have beaten six teams this week. Unfortunately, he played the league leader. Lamb scored 41.30, Shane goes to 4–0, and back at the house Alan had the week’s top score.',
      sections: [
        {
          title: 'The good news, presented first',
          text: 'Higgins 26.70, Taylor 22.70 and Bowers 20.60 gave Hugo his best total since Week 1. The schedule then assigned him the one manager who has not dropped below 138.70 all season. Hugo has now conceded 540.76 points, more than anyone in MAC 12. Bad luck is real. So, unfortunately, is 1–3.',
        },
        {
          title: 'The flex that bore watching, watched',
          text: 'Friday’s preview flagged McConkey’s questionable tag. He played 24 snaps and scored zero in the flex, while Allgeier made 12.90 on the bench. Kalif Raymond, the $15 waiver purchase, contributed 2.60 from the same bench. None of it decided a 30.48-point defeat, but the purchasing department has had better weeks.',
        },
        {
          title: 'The Friday call: Shane Marmion, correct',
          text: 'Lamb’s 41.30 did most of the talking; Hubbard added 25.90 from the flex and Kittle 17. Stroud, the free pickup, scored 23.08 on the bench, which suggests Shane has more quarterbacks than he has interest. Marmion has 596.04 points and a 40–4 all-play record. Hugo returns home to Alan, who scored 152.72 and will happily explain how.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFourReviewPublishedAt,
      headline: 'Bryce Young returns to conduct Burns’ exit interview',
      summary:
        'Karl 142.46, Burns 113.84. The quarterback Burns briefly employed outscored the one he kept. Then the commissioner’s bench outscored the margin. Three straight defeats, and a third consecutive review the website’s owner would rather not host.',
      sections: [
        {
          title: 'The HR department’s worst fears confirmed',
          text: 'Bryce Young scored 21.46 for Karl. Shough, retained by Burns, scored 15.94. Bijan added 27.70, Doubs 23.80 and Seattle’s defence 11. Karl’s season total now trails only Shane and Alan, and three straight wins have left the scheduling complaints department unusually quiet.',
        },
        {
          title: 'Collins delivers. The bench delivers more.',
          text: 'Friday’s preview said a productive Collins would make Burns credible. Collins scored 30.80 and Kyren 36.70; Chase managed 5.70 on 15 snaps. The real problem was selection. Carnell Tate, in Friday’s lineup, was benched for Wicks and outscored him 21.50 to 4.80. Emanuel Wilson, added on Saturday, scored 27 on the bench while Swift made 7.40. That is 36.30 points of available improvement in a 28.62-point defeat.',
        },
        {
          title: 'The Friday call: Karl Moroney, correct',
          text: 'We took Karl narrowly and he won comfortably. Burns is 1–3 with the fourth-highest points total in the league. He will mention that he has conceded 493.66. He will be less keen to mention who picked the lineup. Karl has nothing to complain about for once, which may be more uncomfortable for him than losing.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFourReviewPublishedAt,
      headline:
        'Murphy’s free agents earn their keep. Niall’s finally gets released.',
      summary:
        'Murphy 137.00, Niall 105.08. Our upset call held. Aidan’s free-agent kicker and tight end scored 33.50 between them, while Niall’s three weakest starters produced 9.50. On Wednesday, Schultz was finally shown the door.',
      sections: [
        {
          title: 'The new arrivals report for duty',
          text: 'Reichard scored 17 and Strange 16.50, both added through free agency last week. Kamara added 22.80 and Metcalf’s Thursday 16.50 duly counted. Murphy has now scored 130.46, 129.94 and 137.00; the 57-point opener is starting to look like a clerical error. Judkins made 21.60 on the bench, in case anyone missed the depth.',
        },
        {
          title: 'Walker cannot do this on his own',
          text: 'Kenneth Walker scored 30.90 and Chase Brown 19.10. Parker Washington, Downs and Schultz scored 9.50 between them. Niall’s last three totals are 88.96, 105.88 and 105.08: consistent, in all the wrong ways. On Wednesday he paid $20 for Will Shipley and swapped Schultz, his $14 tight end, for Hockenson at no cost. The Schultz receipt has been filed under lessons.',
        },
        {
          title: 'The Friday call: Aidan Murphy, correct',
          text: 'We backed Murphy against frozen PPR estimates that favoured Niall by about fourteen. He won by 31.92. Aidan reaches 2–2 and, on this form, his perfect playoff record may get another season. Niall slips to 1–3, and that 169-point opener increasingly resembles a holiday photo from somebody else’s summer.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFourReviewPublishedAt,
      headline: 'Joe wins one, and our Match of the Week call goes in the bin',
      summary:
        'Joe 116.42, Jack 93.42. We backed Jack’s established core. Jack’s established core produced the week’s lowest total. Joe is off the mark, and the $31 Ollie Gordon scored 18 on the bench to make sure nobody stops talking about him.',
      sections: [
        {
          title: 'We called it, and it was wrong',
          text: 'Friday’s Match of the Week took Jack, citing Allen, McCaffrey and Henry. They scored 50.42 between them, which was fine. Kincaid, Jennings and Egbuka scored 6.80 between them, which was not. Jack’s 93.42 was Week 4’s lowest score and his third straight drop since 130.56 in Week 1. The Finest Wagyu has been in the fridge a while.',
        },
        {
          title: 'The rescue operation finds a pulse',
          text: 'Nabers 23.20, LaPorta 22.40 and St. Brown 15.50 did the heavy lifting. Darnold, collected from free agency, started over Hurts and lost that private contest by 0.20, which nobody will mention except us. Gordon, the $31 purchase, scored 18 on the bench. Joe can now argue that the price was right and the coaching staff was wrong. That is not the defence he thinks it is.',
        },
        {
          title: 'The verdict on our call',
          text: 'Joe avoids 0–4, so the group chat needs fresh material and the trade offers arrive with marginally more credibility. Jack falls to 2–2, the point at which the 2020 trophy starts being used to change the subject. We called a narrow Jack win. Joe won by 23, and we accept the invoice. Unlike Gordon’s, it will not be settled in FAAB.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFourReviewPublishedAt,
      headline: 'Alan wins the week. Tommy’s $13 tight end wins nothing.',
      summary:
        'Alan 152.72, Tommy 103.08. The champion posted the week’s top score, while Sadiq, reclaimed for $13 FAAB, played 22 snaps and scored zero. Tommy is 0–4. Hugo is 1–3 and lives with Alan, so he will hear about this too.',
      sections: [
        {
          title: 'The champion changes another lightbulb',
          text: 'Javonte Williams scored 31.30, Burrow 23.72 and Olave 19.60. Gibbs managed only 17.70 and Alan still topped the league. Four straight scores above 128 and a 36–8 all-play record: this is no longer a fluky title defence, merely an inconvenient one. The Titanic tour now feels far enough away to need its own museum.',
        },
        {
          title: 'Twenty-nine FAAB for 12.90 points',
          text: 'Tommy paid $16 for Denzel Boston and dropped Sadiq, then paid $13 to bring Sadiq back. Boston scored 12.90 on Thursday. Sadiq scored nothing. Monangai (28) and Puka (27.70) gave Tommy a fighting chance, while Stevenson made 18.40 on the bench. Sadiq is now benched for Loveland. The round trip continues.',
        },
        {
          title: 'The Friday call: Alan Horgan, correct',
          text: 'We backed Alan and he won by 49.64. Tommy is 0–4, with the league’s lowest points total (355.62) and a 5–39 all-play record. He knows more football than anyone in MAC 12 and can doubtless explain each of those numbers in detail. Two previous Wall of Shame visits suggest he has also rehearsed the speech.',
        },
      ],
      sources: reviewSources,
    },
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
