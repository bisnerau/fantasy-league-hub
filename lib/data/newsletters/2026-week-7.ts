import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks after NE–CHI. Thursday points are already known; the
// latest practice reports are Thursday's, with final designations pending.
export const weekSevenPublishedAt = '2026-10-23T10:31:00Z';
export const weekSevenReviewPublishedAt = '2026-10-28T11:03:33Z';
// Commissioner-requested feature correction; original winner calls stay fixed.
export const weekSevenFeatureUpdatedAt = '2026-10-23T11:10:37Z';
const sources = [
  {
    label: 'Sleeper: Friday Week 7 lineups and Thursday points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
  },
  {
    label: 'Sleeper: settled Week 6 results',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
  },
  {
    label: 'Sleeper: Wednesday waivers filed under Week 6',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
  },
  {
    label: 'Sleeper: first trade and later Week 7 pickups',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
  },
];
const bucs = {
  label: 'Buccaneers: Thursday practice report; Friday designations pending',
  url: 'https://www.buccaneers.com/team/injury-report/',
};
const rams = {
  label: 'Rams–Raiders: Nacua limited, Bowers full on Thursday',
  url: 'https://www.therams.com/team/injury-report/',
};
const niners = {
  label: '49ers: Evans and Samuel absent, Kirk full on Thursday',
  url: 'https://www.49ers.com/team/injury-report/',
};

export const weekSevenReports: MatchupNewsletter[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 1,
    homeRosterId: 2,
    awayRosterId: 11,
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenReviewPublishedAt,
      headline: 'Dave buys the right Wilson. Niall buys himself more work.',
      summary:
        'Sharpe beats Niall 101.14–87.98 to reach 4–3, with his $15 Emanuel Wilson pickup paying off immediately. Murray fixed Friday’s defensive gap before kickoff, then produced the lowest score of the week. Our narrow Friday call went the wrong way.',
      sections: [
        {
          title: 'A receipt Dave can frame',
          text: 'Emanuel Wilson supplied 18.50 on his first start for Sharpe, enough to make the $15 claim look considerably more informed than the usual draft-and-disappear routine. Maye and Hunter Henry had already supplied 41.54 on Thursday. Dave needed the rest of the lineup to protect that start, and Wilson did most of the protecting. Burns dropped him the previous week; the commissioner has become a surprisingly useful public service.',
        },
        {
          title: 'The defence was present',
          text: 'Sunday’s Higbee-for-Steelers trade with Keenan resolved the empty defensive contribution raised in Friday’s preview. Pittsburgh scored eight, while Sunday pickup Caleb Douglas added 21.00. The trouble was elsewhere: Walker and Chase Brown combined for 19.50, and Downs supplied 3.80. Niall did the administration and still finished bottom of the weekly scoring. At least nobody can blame this one on scrolling.',
        },
        {
          title: 'The Friday call: Niall Murray — wrong',
          text: 'We preferred Murray’s backs; Sharpe’s new one helped settle it by 13.16. Niall falls to 3–4 after two straight wins, then trades Brown and Waddle to Alan for Olave on Tuesday. Wednesday’s $48 Kaelon Black claim adds another running-back bet. Dave gets the win without needing to explain any of that.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: final Week 7 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
        },
        {
          label:
            'Sleeper: Week 7 transactions, including Tuesday trades and Wednesday waivers',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
        },
        {
          label: 'Sleeper: latest Week 8 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label:
            '49ers, 26 October: McCaffrey has a mild hamstring strain; return after bye not guaranteed',
          url: 'https://www.49ers.com/news/after-further-review-shanahan-provides-mccaffrey-injury-update-breaks-down-week-7-game',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 2,
      homeProjection: 106.75,
      awayProjection: 97.31,
      headline: 'Dave buys a running back. Niall still needs a defence.',
      summary:
        'Friday outlook after Thursday: Maye and Henry have banked 41.54 for Sharpe, but both managers are 3–3 and the prices barely separate them. Niall’s selected Jaguars defence is on bye; Dave’s $15 rescue has arrived from Burns.',
      sections: [
        {
          title: 'Dave has found the transactions tab',
          text: 'Maye’s 27.44 and Hunter Henry’s 14.10 give Dave a proper start after last week’s 87.00. Friday’s $15 Emanuel Wilson claim replaces Spears and goes straight into the lineup, while the Jets defence cost another $2. Wilson was dropped by Burns on Wednesday. The commissioner has finally supplied a player without requiring a lengthy trade negotiation, and Dave has paid somebody else for the privilege.',
        },
        {
          title: 'Murray’s shopping is not quite finished',
          text: 'Niall added Rodgers for free to cover Lawrence’s bye and paid $6 for Higbee after Jack released him. Jacksonville’s defence remains selected with no alternative rostered at the Friday check, so the price includes no defensive contribution. Evans missed both Wednesday and Thursday practice with ribs/Achilles trouble. Walker and Chase Brown give Murray a route to a third straight win, provided the final roster check includes the bottom of the screen.',
        },
        {
          title: 'The Friday call: Niall Murray',
          text: 'Niall is 10/11 to Dave’s 11/10, with Thursday’s points included. We narrowly prefer Murray’s running backs; Sharpe’s lead makes this uncomfortable. A defensive pickup could help Niall, but the published price stays frozen. Dave has already done enough administration this week to request annual leave. Unfortunately, Sunday is still on the calendar.',
        },
      ],
      sources: [...sources, niners],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 2,
    homeRosterId: 5,
    awayRosterId: 9,
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenReviewPublishedAt,
      headline: 'Jack gives Karl a defeat the schedule cannot explain',
      summary:
        'Jack wins 124.72–88.72, ending Karl’s five-game streak and leaving both at 5–2. Pollard’s 36.50 leads every starter in MAC 12; the first trade delivers an awkward opening week for our Friday favourite.',
      sections: [
        {
          title: 'The less famous back takes over',
          text: 'Pollard outscored McCaffrey and Henry combined, giving Jack the week’s biggest individual starter return. Jameson Williams added 26.10, and $2 tight-end pickup Fannin supplied 13.10. Jack even survived minus four from Carolina’s defence. The inaugural champion has now won three straight in a league with all twelve managers present; the trophy disclaimer is becoming less useful.',
        },
        {
          title: 'Karl’s purchase arrives quietly',
          text: 'Garrett Wilson scored 4.60 after arriving in the Irving deal. Irving scored 24.00 for Tommy, while Karl’s other acquisition, Jonah Coleman, returned 8.90 on the bench. One week cannot settle the trade, but it has given everyone a very convenient opening argument. McBride’s 27.10 kept Karl afloat; Young and Aaron Jones combined for just 9.02. Ten teams outscored him, which limits the available scheduling complaints.',
        },
        {
          title: 'The Friday call: Karl Moroney — wrong',
          text: 'We backed Wilson’s arrival and Karl’s core; Jack won by exactly 36.00. His third consecutive victory deserves a climb, although Monday’s 49ers update matters: McCaffrey has a mild hamstring strain. Shanahan is optimistic about the return after San Francisco’s bye, without guaranteeing it. Karl still owns five wins and plenty of talent. For once, the complaint needs to begin with his own score.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: final Week 7 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
        },
        {
          label:
            'Sleeper: Week 7 transactions, including Tuesday trades and Wednesday waivers',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
        },
        {
          label: 'Sleeper: latest Week 8 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label:
            '49ers, 26 October: McCaffrey has a mild hamstring strain; return after bye not guaranteed',
          url: 'https://www.49ers.com/news/after-further-review-shanahan-provides-mccaffrey-injury-update-breaks-down-week-7-game',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 5,
      homeProjection: 121.38,
      awayProjection: 121.67,
      headline: 'Karl completes a trade. The complaints department stays open.',
      summary:
        'Friday outlook: 5–1 Karl faces 4–2 Jack after the season’s first trade. Garrett Wilson and Jonah Coleman went to Karl for Bucky Irving; only 2.29 separates the adjusted best-lineup estimates.',
      sections: [
        {
          title: 'A deal with an actual acceptance button',
          text: 'Wednesday’s first completed trade sent Irving to Tommy and Wilson plus Coleman to Karl, with no picks or FAAB attached. Washington has confirmed McLaurin’s season-ending knee injury, so Wilson addresses a real receiving need. Coleman remains on IR in Friday’s feed. Karl also spent $7 on Noel, then dropped him that evening for Samuel, who missed Thursday practice. The recruitment budget now includes a day-pass rate.',
        },
        {
          title: 'Jack picks up the player Keenan let go',
          text: 'With Allen on bye, Purdy starts beside McCaffrey and Henry. Jack paid $2 for Andrews on Wednesday, then another $2 for Fannin on Friday and released Andrews. Keenan dropped Fannin for Ferguson; Jack gets the available tight end. Egbuka missed a second practice with concussion/foot issues, so the receiving selection needs watching. Karl has won five straight; Jack has beaten Burns and Keenan in consecutive weeks. The small-league champion is collecting full-size opponents.',
        },
        {
          title: 'The Friday call: Karl Moroney',
          text: 'Karl is 10/11, Jack 11/10. We take Wilson’s arrival alongside Bijan and McBride to keep Karl ahead, narrowly, with Egbuka’s availability an added concern for Jack. Neither has starter points banked from Thursday. Karl can reach 6–1; Jack can pull both to 5–2. Either outcome should produce a detailed explanation of why the schedule favoured someone else.',
        },
      ],
      sources: [
        ...sources,
        bucs,
        niners,
        {
          label: 'Commanders, Tuesday: McLaurin out for the season',
          url: 'https://www.commanders.com/news/terry-mclaurin-knee-injury-commanders',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 3,
    homeRosterId: 4,
    awayRosterId: 8,
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenReviewPublishedAt,
      headline: 'Hugo wins by 0.82. Tommy gets the full Shark Boy experience.',
      summary:
        'Hugo takes Match of the Week 126.02–125.20, ending five straight defeats and leaving Tommy alone at 1–6. Our 1/5 Friday favourite loses by less than a point; the performing-arts derby earns its billing.',
      sections: [
        {
          title: 'Higgins and Concepcion do the lifting',
          text: 'Higgins and Concepcion delivered 50.00 between them, dragging Hugo past the Thursday advantage we had already priced into Tommy’s favour. Caleb’s 22.12 helped offset minus one from San Francisco’s defence. Hugo finishes fourth in weekly scoring and finally gets a second win. Anyone preparing the Grafton Street set list has been asked to keep the guitar in its case for another week.',
        },
        {
          title: 'Irving delivers on debut',
          text: 'Irving scored 24.00 on debut for Tommy, Stevenson added 22.50, and Nacua played through Friday’s uncertainty to return 21.80. Tommy still lost by 0.82. The painful hindsight sits at defence: Sunday pickup Cincinnati scored ten on the bench against Houston’s three in the lineup. The seven-point difference changes the result on paper; it does not make the choice obvious before kickoff.',
        },
        {
          title: 'The Friday call: Tommy O’Brien — wrong',
          text: 'We backed Tommy after Thursday and got a 0.82-point rebuttal. Hugo reaches 2–5, then sends Bowers to housemate Alan on Tuesday for Javonte Williams and Kraft. The housemates wasted little time negotiating. Tommy has averaged 128.03 over the last three weeks and still owns one win. Shark Boy has finally found some production; the happy ending remains in development.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: final Week 7 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
        },
        {
          label:
            'Sleeper: Week 7 transactions, including Tuesday trades and Wednesday waivers',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
        },
        {
          label: 'Sleeper: latest Week 8 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label:
            'Rams, 25 October: final inactives; Nacua available against Las Vegas',
          url: 'https://www.therams.com/news/trent-mcduffie-among-rams-inactives-for-week-7-2026-at-raiders',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 4,
      homeProjection: 120.66,
      awayProjection: 108.42,
      headline: 'Tommy–Hugo: the loser starts checking the forfeit rules.',
      summary:
        'Friday Match of the Week: the bottom-of-the-table clash, with both managers 1–5 and Tommy leading 50.20–27.42 after Thursday. Tommy has traded for Irving; Hugo paid $19 for Douglas and got 5.30. A win buys breathing room. A defeat brings the group chat closer.',
      sections: [
        {
          title: 'The Shark Boy–busker derby',
          text: 'Tommy has done stand-up and Comic Con as Shark Boy. Hugo has busked on Grafton Street. Between them, these managers have enough forfeit experience to run a small performing-arts college. Both arrive at 1–5; Hugo has lost five straight. Barring a tie, the loser goes 1–6 while the winner gets to describe 2–5 as momentum. This deserves top billing. The league has spent years preparing the material.',
        },
        {
          title: 'One trade, one expensive Thursday',
          text: 'Tommy sent Wilson and Coleman to Karl for Irving, addressing his running-back shortage with Tuten on bye. Stevenson and Loveland supplied 42.40 on Thursday; Brown added 7.80. Hugo got 22.12 from Caleb and 5.30 from his $19 Douglas purchase. At least on Grafton Street the money used to come towards him. Knight replaces Pierce, Higgins returns from his bye and Bowers practised fully Thursday. Hugo needs that trio around Taylor to keep this from becoming another audition.',
        },
        {
          title: 'The Friday call: Tommy O’Brien',
          text: 'Tommy is 1/5 against Hugo’s 11/2, with the Thursday points included. We stick with Tommy’s lead and Stafford–Nacua upside, though Irving was limited by illness and Nacua by a calf issue on Thursday. Final designations are pending. Taylor and Bowers give Hugo a way back; the price reflects how much catching up is required. Tommy knows more football than almost anyone here. Beating the other 1–5 team would be a modest place to demonstrate it.',
        },
      ],
      sources: [...sources, bucs, rams],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 4,
    homeRosterId: 3,
    awayRosterId: 6,
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenReviewPublishedAt,
      headline: 'Alan escapes by 4.46. Keenan’s tight end did turn up.',
      summary:
        'Alan wins 138.08–133.62 to end two straight defeats, with both managers now 4–3. Keenan posts the third-highest score and loses anyway. Friday’s missing tight end was filled; the injury concerns have moved back to Barkley.',
      sections: [
        {
          title: 'The champion needs nearly all of it',
          text: 'Burrow’s 28.88 and Burden’s Thursday 23.70 gave Alan strong pillars, with Javonte Williams adding 21.50. Horgan needed that depth because Andrew finally brought a proper score after two disappointing weeks. Only Murphy outscored Alan. The champion can write his round-up without explaining a third consecutive defeat, though 4.46 barely permits a smug introduction.',
        },
        {
          title: 'The rotating vacancy gets a tenant',
          text: 'Keenan traded Pittsburgh’s defence to Niall for Higbee on Sunday and started him for 3.40. Flowers supplied 27.70, while Jacobs and Jeanty combined for 41.70. Barkley’s return brought another 15.10, but NFL.com’s Tuesday report says back tightness limited him to nine snaps. Andrew has solved the empty slot from Friday; dependable availability is still harder to buy.',
        },
        {
          title: 'The Friday call: Alan Horgan — correct',
          text: 'We chose Alan’s returning core and fuller lineup. Keenan made the latter argument much less comfortable, then lost a third straight despite beating nine teams on points. Alan celebrated by reshaping his roster Tuesday: Olave goes to Niall for Brown and Waddle, while Javonte and Kraft go to Hugo for Bowers. Living with the champion now includes access to the trade desk. Andrew has settled for another tight-end change, paying $4 for Okonkwo on Wednesday.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: final Week 7 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
        },
        {
          label:
            'Sleeper: Week 7 transactions, including Tuesday trades and Wednesday waivers',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
        },
        {
          label: 'Sleeper: latest Week 8 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label:
            'NFL, 27 October: Barkley reports back tightness after nine-snap return',
          url: 'https://amp.nfl.com/news/eagles-rb-saquon-barkley-says-hamstring-came-out-great-in-return-from-injury',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 6,
      homeProjection: 114.36,
      awayProjection: 133.06,
      headline: 'Keenan fills the quarterback slot and opens a new vacancy.',
      summary:
        'Friday outlook: Alan has 23.70 from Burden and Keenan has no tight end selected. Andrew paid $12 for Ferguson and released Fannin; Ferguson is now tagged IR. Both managers are trying to stop two straight defeats.',
      sections: [
        {
          title: 'The gap has moved down the lineup',
          text: 'Goff is back from his bye, but Keenan’s only rostered tight end is Ferguson, tagged IR with no projection at the Friday check. Fannin, dropped in the $12 claim, has been bought by Jack for $2. Andrew also paid $7 for Kirk, who practised fully Thursday but remains on IR in Sleeper. Practice participation alone does not establish activation. Last week’s quarterback cover has become this week’s tight-end search. The recruitment team is operating a rotating vacancy.',
        },
        {
          title: 'The champion gets his starters back',
          text: 'Burden’s 23.70 is already banked, and Burrow and Gibbs return from their bye to join Olave. Alan has dropped temporary quarterback Jones and added Flournoy and Tennessee’s defence for free. After losing to Joe and Burns, he gets a 4–2 opponent whose last two scores were 103.84 and 83.58. Alan’s own 3–3 record leaves little room to spend another week explaining how good the team looks.',
        },
        {
          title: 'The Friday call: Alan Horgan',
          text: 'Alan is 2/9 against Andrew’s 9/2. The price includes the empty tight-end slot and Burden’s Thursday return; a later pickup can help Keenan but cannot change the frozen odds. We take Alan’s fuller lineup and returning core. Andrew has a championship from 2021. Sleeper still insists on a tight end from 2026.',
        },
      ],
      sources: [...sources, niners],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 5,
    homeRosterId: 7,
    awayRosterId: 10,
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenReviewPublishedAt,
      headline: 'Joe stops at three. Shane keeps the top floor.',
      summary:
        'Shane beats Joe 124.62–117.28 to reach a league-best 6–1. JSN and Lamb supply 55.70, ending Ennis’s three-game recovery. The settled margin is 7.34; Sleeper now has Joe at 117.18, a 0.10 difference that leaves the winner unchanged.',
      sections: [
        {
          title: 'A useful pair of receivers',
          text: 'With Lamar ruled out again, Stroud covered the quarterback slot for 16.52. Smith-Njigba’s 31.30 and Lamb’s 24.40 supplied the separation, with Kittle adding 14.80. Shane now leads the league on wins and total points. His last three scores have all cleared 119. The man whose lineup habits once put Jack in a calendar is becoming annoyingly reliable.',
        },
        {
          title: 'One receiver choice hurts',
          text: 'Nix delivered 26.18 for Joe and St. Brown added 24.20, but Jefferson and LaPorta combined for 11.20. Nabers scored 18.10 on the bench against starting flex Golden’s 9.90. That 8.20-point hindsight swap would have covered the 7.34 margin. Joe’s 129.43 three-week average remains the league’s best; the fourth straight victory was close enough to spend an unhealthy amount of time reconsidering.',
        },
        {
          title: 'The Friday call: Shane Marmion — correct',
          text: 'Shane stays first, though Baltimore’s Monday update still leaves Lamar’s return dependent on further practice evidence. Joe falls to 3–4 and replaces Nix with Geno Smith on Wednesday, despite Nix’s productive start. Tuesday’s Giants news also puts Tracy on IR; Joe dropped him that evening and still has Skattebo. Nix can join Cousins and Brissett on the list of useful quarterbacks Joe has thanked and released.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: final Week 7 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
        },
        {
          label:
            'Sleeper: Week 7 transactions, including Tuesday trades and Wednesday waivers',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
        },
        {
          label: 'Sleeper: latest Week 8 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label: 'Ravens, 26 October: Jackson update awaits Wednesday practice',
          url: 'https://www.baltimoreravens.com/news/jesse-minter-discusses-ravens-leadership-lamar-jackson-status-to-be-updated-wednesday-for-week-8-buffalo-bills',
        },
        {
          label:
            'Giants, 27 October: Tracy placed on injured reserve with hamstring injury',
          url: 'https://www.giants.com/news/tyrone-tracy-jr-injured-reserve-gregory-desrosiers-dean-lowry-practice-squad-roster-moves-bye-week-joe-schoen',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 10,
      homeProjection: 121.05,
      awayProjection: 142.6,
      headline: 'Joe reaches fourth and immediately asks for more.',
      summary:
        'Friday outlook after Thursday: three straight wins have brought Joe to 3–3 and fourth in our rankings. His next opponent is 5–1 Shane, the league’s scoring leader, with Lamar back at limited practice and Stroud available as cover.',
      sections: [
        {
          title: 'Another winning quarterback gets released',
          text: 'Cousins helped Joe beat Murphy, then followed Brissett out of the building. Bo Nix is the new $4 appointment while Hurts remains on IR. Joe also added Tracy and kicker Trey Smack for free. Jefferson, St. Brown and LaPorta are back from their bye, giving the recovery a stronger receiving group. Three wins have taken Joe from 0–3 to fourth in our rankings. For once, fourth appears to be a staging post.',
        },
        {
          title: 'Shane gets encouraging news, with a condition',
          text: 'Lamar was limited again Thursday but joined the start of practice for the first time since the ankle injury. Baltimore has not confirmed Sunday availability; Stroud remains rostered as cover. JSN and Lamb support the league-leading 849.26 season points, while Wednesday’s $8 McLaughlin addition stays on the bench. Shane is checking his lineup and buying depth. Jack’s calendar may eventually qualify as a historical document.',
        },
        {
          title: 'The Friday call: Shane Marmion',
          text: 'Shane is 4/9 to Joe’s 9/4, with no Thursday starter points on either side. We prefer Shane’s scoring form and running-back options; Joe’s receivers make the underdog price interesting. Lamar is included in the projection, so his status matters even with Stroud as cover. Ennis needs a fourth straight win. The number is familiar; the direction would be new.',
        },
      ],
      sources: [
        ...sources,
        {
          label:
            'Ravens, Thursday: Jackson takes a step forward, remains limited',
          url: 'https://www.baltimoreravens.com/news/lamar-jackson-injury-report-ravens-practice-start-ankle-2026',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    sleeperMatchupId: 6,
    homeRosterId: 1,
    awayRosterId: 12,
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenReviewPublishedAt,
      headline: 'Murphy’s shopping arrives. Burns’ promotion is recalled.',
      summary:
        'Murphy wins 140.98–94.82 with the week’s highest score and biggest margin. His new Cooper–Hockenson pairing delivers 36.00, while Burns follows last week’s revival with a 46.16-point defeat. Our Friday call backed the wrong shopper.',
      sections: [
        {
          title: 'The purchases have names and points',
          text: 'The $18 Omar Cooper claim returned 22.50 and $7 Hockenson supplied 13.50. Add Judkins’ 23.40 and Prescott’s 23.28, and Murphy had enough to lead the league despite Cook’s bye and Adams’ absence. Aidan has interrupted the set-and-forget routine with a useful week of management. We may eventually need to update the biography, which is deeply inconvenient for the jokes.',
        },
        {
          title: 'Nineteen points was a start',
          text: 'Swift’s Thursday 19.00 looked helpful when we made the call. Kyren and Chase contributed, but Collins and Bernard combined for 8.30, leaving Burns well short of the weekly pace. Shough outscored bench option Mayfield, so changing quarterbacks would not have rescued this one. The commissioner promoted himself five ranking places last week. Murphy has supplied the appeal, supporting evidence and recommended correction.',
        },
        {
          title: 'The Friday call: Emmet Burns — wrong',
          text: 'We backed the early lead and available receivers; Murphy won every argument that mattered and moves to 3–4. His 47–30 all-play record is third-best, a stronger picture than the losing record suggests. Burns drops to 2–5 with the league’s tenth-best score this week. Wednesday brings Brissett, Bass and New England’s defence to his roster. The commissioner has refreshed three positions; the league table remains stubbornly outside the settings menu.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: final Week 7 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/7',
        },
        {
          label:
            'Sleeper: Week 7 transactions, including Tuesday trades and Wednesday waivers',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/7',
        },
        {
          label: 'Sleeper: latest Week 8 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 1,
      homeProjection: 128.29,
      awayProjection: 104.78,
      headline: 'Murphy spends $26. Burns discovers free delivery.',
      summary:
        'Friday outlook: Swift has put Burns 19.00 ahead in a meeting of 2–4 teams. Murphy has spent $26 on Cooper, Hockenson and Freiermuth; Burns added Mayfield for nothing after finally ending his losing run.',
      sections: [
        {
          title: 'The commissioner has found a second quarterback',
          text: 'Shough’s 26.96 helped Burns beat Alan last week, and he remains selected. Mayfield arrived on a $0 claim and practised fully Wednesday and Thursday after his thumb injury. That gives Burns another option as Chase returns from his bye to join Collins and Kyren. Swift has already supplied 19.00. Last week the commissioner promoted himself five ranking places. This week he has enough help to attempt a win without changing any page headings.',
        },
        {
          title: 'Set-and-forget has a purchasing department',
          text: 'Murphy paid $18 for Omar Cooper, $7 for Hockenson and $1 for Freiermuth. Cooper and Hockenson are selected; Freiermuth is available on the bench. With Adams on IR in Sleeper and Cook on bye, the spending addresses immediate gaps around London and Metcalf. The 114.22 against Joe was competitive, but a third straight defeat would leave Aidan 2–5. His perfect playoff attendance now requires more than an annual draft-day appearance.',
        },
        {
          title: 'The Friday call: Emmet Burns',
          text: 'Burns is 4/11 to Murphy’s 11/4. We back the Thursday start and his available receivers, with the best-lineup price allowing bench options such as Mayfield rather than requiring the current selection. Murphy needs his purchases to contribute immediately. The commissioner has won once since opening weekend; we are risking the confidence of a man who can edit his own biography.',
        },
      ],
      sources: [...sources, bucs],
    },
  },
];
