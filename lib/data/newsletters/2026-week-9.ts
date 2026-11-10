import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks after JAX–BAL. Thursday points are known; final Friday
// injury designations remain pending. Selected-lineup PPR estimates are frozen.
export const weekNinePublishedAt = '2026-11-06T09:03:18Z';
export const weekNineReviewPublishedAt = '2026-11-10T11:59:51Z';

const leagueSources = [
  {
    label: 'Sleeper · Friday Week 9 lineups and Thursday points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
  },
  {
    label: 'Sleeper · Week 8 results',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/8',
  },
  {
    label: 'Sleeper · current rosters and records',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/rosters',
  },
  {
    label: 'Sleeper · completed Week 9 moves',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/9',
  },
  {
    label: 'Sleeper · moves filed under Week 8',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
  },
];

export const weekNineReports: MatchupNewsletter[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    sleeperMatchupId: 1,
    homeRosterId: 4,
    awayRosterId: 11,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekNinePublishedAt,
      pickRosterId: 4,
      homeProjection: 112.15,
      awayProjection: 112.45,
      headline: 'Tommy has found some form. Dave has found the waiver button.',
      summary:
        'Friday outlook after Jacksonville–Baltimore: Tommy takes two straight 125-point weeks into a meeting with 4–4 Sharpe. Tuten has banked 8.90, but Prime Time still has a receiver problem to solve.',
      sections: [
        {
          title: 'Shark Boy has supporting evidence',
          text: 'Tommy’s last two scores were 125.20 and 130.38. That earned one win, because even his improvement comes with a grievance. Tuten’s Thursday return is already fixed; Irving and Nacua now carry much of the recovery effort. Tampa Bay listed Irving’s Thursday absence as rest. Tommy also collected Fairbairn for nothing and swapped Herbert for McCarthy on the bench. A third win would make the rebrand look considerably less optimistic.',
        },
        {
          title: 'One flex spot needs attention',
          text: 'A.J. Brown remains selected with no Sleeper projection after missing both practices. Stevenson offers rostered cover, and the best-lineup price includes him. Dave replaced Roschon Johnson with Vidal on Wednesday, giving a thin backfield another option. Rice returned to full practice Thursday; Michael Wilson still carries a Sleeper ribs tag after last week’s 26.80. Sharpe’s receivers have a fair chance of making this uncomfortable.',
        },
        {
          title: 'The Friday call: Tommy O’Brien',
          text: 'Tommy is 1/2 to Dave’s 2/1. We take the recent scoring and the Irving–Nacua core, with the Brown slot requiring a check before kickoff. Dave can reach 5–4 while remaining last in the power rankings, a combination that would produce an impressively specific complaint.',
        },
      ],
      sources: [
        ...leagueSources,
        {
          label: 'Packers–Patriots · Thursday practice report',
          url: 'https://www.packers.com/team/injury-report/',
        },
        {
          label: 'Buccaneers · Irving’s rest day',
          url: 'https://www.buccaneers.com/team/injury-report/',
        },
        {
          label: 'Jets–Chiefs · Rice returns to full practice',
          url: 'https://www.newyorkjets.com/team/injury-report/',
        },
      ],
    },
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekNineReviewPublishedAt,
      headline:
        'Shark Boy finally has an audience. The injury report has other plans.',
      summary:
        'Tommy beat Sharpe 151.62–91.36 with the highest score of Week 9. Three straight weeks above 125 have given the league’s resident football lecturer some evidence; Monday’s news on Puka Nacua threatens to interrupt the presentation.',
      sections: [
        {
          title: 'The lineup change paid',
          text: 'Friday’s unresolved A.J. Brown spot became Denzel Boston, who supplied 15.80, while Stevenson added 14.80 at flex. Irving and Nacua did the heavy lifting with 63.50 between them. Tommy has won two straight and is finally putting distance between himself and Hugo. Fairbairn, collected for nothing, contributed another 16. Tommy can put the waiver receipt beside his two straight winning scores.',
        },
        {
          title: 'Dave could have picked Love and still lost',
          text: 'Jordan Love’s 36.18 sat behind Maye’s 18.26. That 17.92-point hindsight improvement would still leave Sharpe 42.34 short. His starting backs combined for 12.20, and nobody in the lineup reached 20. There is only so much a quarterback debate can do for a team losing by sixty.',
        },
        {
          title: 'The Friday call: Tommy O’Brien — correct',
          text: 'The recent form deserved backing, and Tommy delivered his second 150-point week of the season. Keeping it going gets harder: McVay said Monday that Nacua is likely headed to injured reserve with knee sprains and turf toe. Stevenson also left Sunday with a knee injury. At 3–6, Tommy needs the replacements before he needs another rebrand.',
        },
      ],
      sources: [
        {
          label: 'Sleeper · Wednesday acquisitions filed under Week 8',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label: 'Sleeper · settled Week 9 lineups and player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
        },
        {
          label: 'Rams, 9 November · Nacua likely headed to injured reserve',
          url: 'https://www.therams.com/news/rams-injury-updates-puka-nacua-likely-going-on-injured-reserve-after-sustaining-mcl-pcl-sprain-and-turf-toe-against-commanders-latest-on-steve-avila-and-trent-mcduffie',
        },
        {
          label:
            'NFL · Week 9 injuries, including McConkey’s pregame back spasms',
          url: 'https://amp.nfl.com/news/notable-injuries-news-sunday-week-9-games-2026',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    sleeperMatchupId: 2,
    homeRosterId: 6,
    awayRosterId: 9,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekNinePublishedAt,
      pickRosterId: 6,
      homeProjection: 134.83,
      awayProjection: 125.64,
      headline: 'Alan has the crown. Jack would like the receipt.',
      summary:
        'Friday Match of the Week after Jacksonville–Baltimore: the top two in our rankings meet at 5–3 and 6–2. Alan just scored 173.88; Jack has won four straight. Henry’s 5.58 is already in Jack’s total.',
      sections: [
        {
          title: 'The champion keeps adding names',
          text: 'Alan followed his trades with the week’s highest score and first place in the power rankings. Burrow, Gibbs and Bowers give him a serious argument for staying there. Wednesday brought Dobbins for $8 and the Giants defence for $5; Thursday brought Mayfield for free. Horgan now has enough quarterbacks to write a round-up about the ones he leaves out. Burrow and Brown play in Sunday’s early Madrid game, before the MAC 12 picks deadline.',
        },
        {
          title: 'Jack’s expensive bit has to deliver',
          text: 'Ringrose put up 164.36 without McCaffrey last week. Now McCaffrey is back in the selected lineup, though San Francisco listed him as limited Thursday after a Wednesday absence. Henry’s modest Thursday score leaves Allen and Jefferson with work to do on Monday. Pollard and Pittsburgh are on bye. Jack paid $2 for San Francisco’s defence, then dropped it for New Orleans sixteen minutes later. That is a short tenancy even by this league’s standards.',
        },
        {
          title: 'The Friday call: Alan Horgan',
          text: 'Alan is 4/9 and Jack 9/4, with Thursday’s points already known. We take the champion’s healthier-looking core to end the streak and pull them level at 6–3, barring a tie. McCaffrey’s final status still matters. Jack can make a persuasive counterargument with Allen and Jefferson; the eight-team championship defence can wait until Tuesday.',
        },
      ],
      sources: [
        ...leagueSources,
        {
          label: '49ers · Thursday McCaffrey and receiver practice report',
          url: 'https://www.49ers.com/team/injury-report/',
        },
        {
          label: 'NFL · Week 9 schedule, early game and byes',
          url: 'https://www.nfl.com/schedules/2026/by-week/week-9',
        },
      ],
    },
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekNineReviewPublishedAt,
      headline: 'Alan sends the Wagyu back with the receipt',
      summary:
        'The Match of the Week went to the champion, 123.74–89.94. Alan made it three straight wins, ended Jack’s four-game run and kept first place in the power rankings. The two are level at 6–3; this argument was settled rather less evenly.',
      sections: [
        {
          title: 'Burrow and Bowers cover the bill',
          text: 'Alan got 51.84 from his quarterback and tight end, with Burden adding 20.70. That was enough to absorb modest returns elsewhere and keep the league scoring lead, now just 3.06 ahead of Shane. The Giants defence, a five-dollar Wednesday purchase, returned 13. Alan’s shopping has produced another win and another reason for the rest of the league to stop asking how he became champion.',
        },
        {
          title: 'Monday offered no rescue',
          text: 'McCaffrey returned with 22.70, comfortably Jack’s best contribution. Allen and Jefferson managed 21.66 together as Buffalo beat Minnesota 23–6 on Monday. Ringrose had bought an expensive new receiver and watched the pair finish below his running back. Sutton’s 15.50 on the bench would improve the view, but one receiver swap could not bridge 33.80.',
        },
        {
          title: 'The Friday call: Alan Horgan — correct',
          text: 'We backed Alan to end the streak with Thursday’s Henry score already known. Jack’s core still earns respect across the last three weeks, including that 164.36, but this was his lowest total of the season. Alan also has fresh concerns after Waddle and Burden suffered concussions. The champion keeps the top ranking; the medical reports need watching.',
        },
      ],
      sources: [
        {
          label: 'Sleeper · Wednesday acquisitions filed under Week 8',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/8',
        },
        {
          label: 'Sleeper · settled Week 9 lineups and player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
        },
        {
          label: 'Bills · Monday’s 23–6 win over Minnesota',
          url: 'https://www.buffalobills.com/news/bills-23-vikings-6-final-score-recap-highlights',
        },
        {
          label:
            'NFL · Week 9 injuries, including McConkey’s pregame back spasms',
          url: 'https://amp.nfl.com/news/notable-injuries-news-sunday-week-9-games-2026',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    sleeperMatchupId: 3,
    homeRosterId: 2,
    awayRosterId: 7,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekNinePublishedAt,
      pickRosterId: 7,
      homeProjection: 118.8,
      awayProjection: 126.13,
      headline: 'Niall gets a Thursday head start. Joe checks the sick notes.',
      summary:
        'Friday outlook after Jacksonville–Baltimore: Lawrence, Washington and the Jaguars defence have put 38.68 on Niall’s board. Joe is 4–4 and still has his whole selected lineup to come, with two receivers needing close attention.',
      sections: [
        {
          title: 'The Jaguars do their bit',
          text: 'Niall got a Lawrence-to-Washington touchdown and eleven points from Jacksonville’s defence. At 3–5 after two defeats, he needed a useful start. Olave and Likely are available in the selected lineup after their bye, and Hall progressed to full practice Thursday. Murray also claimed Brissett for nothing, then released him for Demarcus Robinson the same evening. The quarterback had scarcely enough time to learn the team name.',
        },
        {
          title: 'Joe’s return on the Jefferson deal',
          text: 'Purdy gets his first MAC 12 start for Ennis, with Egbuka on the bench after returning to full practice Thursday. That cover matters: St. Brown was limited with a rib issue, while Nabers missed Thursday with a knee problem. Skattebo also missed both practices. Joe released last week’s narrow-win contributor Ayomanor, briefly hired Richardson and eventually added Baltimore’s defence. Detroit remains selected; the Ravens’ Thursday score stays on his bench.',
        },
        {
          title: 'The Friday call: Joe Ennis',
          text: 'Joe is 1/2 to Niall’s 2/1. We back Purdy and the receiving options to catch the Thursday lead, subject to the final injury reports. Niall has enough banked to punish a bad lineup decision. Ennis has climbed back to .500 and fourth in the rankings, where league history suggests he should feel immediately at home.',
        },
      ],
      sources: [
        ...leagueSources,
        {
          label: 'Jaguars · Thursday’s 33–10 win',
          url: 'https://www.jaguars.com/news/game-report-2026-week-9-jaguars-33-ravens-10',
        },
        {
          label: 'Buccaneers · Egbuka full Thursday',
          url: 'https://www.buccaneers.com/team/injury-report/',
        },
        {
          label: 'Lions · St. Brown limited Thursday',
          url: 'https://www.detroitlions.com/team/injury-report/',
        },
        {
          label: 'Eagles–Giants · Nabers and Skattebo practice updates',
          url: 'https://www.philadelphiaeagles.com/news/giants-vs-eagles-injury-report-saquon-barkley-devonta-smith-cam-skattebo-2026-nfl-week-9',
        },
        {
          label: 'Jets · Hall full Thursday',
          url: 'https://www.newyorkjets.com/team/injury-report/',
        },
      ],
    },
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekNineReviewPublishedAt,
      headline: 'Niall finds a Walker. Joe finds the complaints form.',
      summary:
        'Niall’s 140.18 beat Joe’s 121.08 and ended a two-game slide. Ennis would have beaten seven other teams, which earns him the Schedule Solicitor award and puts both managers at 4–5. Karl may wish to defend his title.',
      sections: [
        {
          title: 'The Thursday lead gets proper support',
          text: 'Lawrence, Washington and Jacksonville had supplied 38.68 before Friday’s preview. Walker then gave Niall 36.30, the highest starter score in MAC 12 this week. Olave and Likely combined for 33.10 after their bye. The recent trades finally had a full lineup in which to make their case, and Murray produced his best score since the opening week’s 169.',
        },
        {
          title: 'Joe’s new quarterback does his job',
          text: 'Purdy returned 25.28 in his first start for Ennis, while Golden’s 32.40 did even more to keep the game respectable. Joe has scored between 117 and 123 in four consecutive weeks and lost three of them. His starting running backs totalled 14.30 here. Joe’s backfield is giving his receivers very little room for an ordinary week.',
        },
        {
          title: 'The Friday call: Joe Ennis — wrong',
          text: 'We trusted Joe to catch the Thursday head start. Niall instead added 101.50 after it, leaving Ennis 19.10 short despite the fifth-best score of the week. Both are in the four-team 4–5 group contesting the last playoff place, with Ennis ahead on points. Joe remains fourth in our rankings, a position he has spent years preparing to occupy.',
        },
      ],
      sources: [
        {
          label: 'Sleeper · settled Week 9 lineups and player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    sleeperMatchupId: 4,
    homeRosterId: 5,
    awayRosterId: 12,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekNinePublishedAt,
      pickRosterId: 5,
      homeProjection: 127.37,
      awayProjection: 115.44,
      headline: 'Karl’s schedule gets kinder. His injury report does not.',
      summary:
        'Friday outlook after Jacksonville–Baltimore: Karl follows defeats to Jack and Alan with 3–5 Murphy. Neither has starter points banked. Moroney’s two selected star receivers still carry injury concerns.',
      sections: [
        {
          title: 'The complaint department reopens',
          text: 'Karl has gone from five straight wins to two straight defeats, the latest against Alan’s 173.88. A meeting with last week’s lowest scorer looks more manageable. Bijan, Coleman and McBride give him a useful base, but Garrett Wilson missed Wednesday and Thursday with a concussion. Pickens was limited both days with a hamstring issue. The schedule has finally offered Moroney some help and the medical department has submitted a competing proposal.',
        },
        {
          title: 'Murphy needs the receivers to show up',
          text: 'Aidan followed 140.98 with 71.80. London, Cooper and Metcalf combined for 3.20 in that defeat; Metcalf is now on bye and Marks is selected at flex. Cook and Hockenson return to the lineup alongside Prescott. Murphy has made no completed move since Monday in our check. A rebound would keep his perfect historical playoff attendance in the conversation, although relying on last week’s starters to apologise in points is a familiar strategy.',
        },
        {
          title: 'The Friday call: Karl Moroney',
          text: 'Karl is 4/6 and Murphy 6/4. We narrowly take Moroney’s running backs and McBride, with Wilson’s Friday report the biggest qualification. The price still includes questionable players with projections, so it assumes more availability than the practice report guarantees. A third straight defeat would leave Karl with an unusually well-researched excuse.',
        },
      ],
      sources: [
        ...leagueSources,
        {
          label: 'Jets · Wilson misses both practices',
          url: 'https://www.newyorkjets.com/team/injury-report/',
        },
        {
          label: 'Cowboys · Pickens limited Thursday',
          url: 'https://www.dallascowboys.com/team/injury-report/',
        },
      ],
    },
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekNineReviewPublishedAt,
      headline:
        'Karl gets a manageable opponent and briefly runs out of excuses',
      summary:
        'Karl beat Murphy 116.86–97.00 without starting either Pickens or Garrett Wilson. His two-game slide is over and he joins Alan and Jack at 6–3. Murphy is 3–6, with his perfect playoff attendance becoming an increasingly awkward historical footnote.',
      sections: [
        {
          title: 'The replacement receivers do enough',
          text: 'Keenan Allen and Saturday signing Malachi Fields supplied 13.60 between them. Neither threatened to steal the story from Bijan and Coleman, whose combined 45.50 gave Karl room to manage the absences. Corum’s 11.80 at flex helped too. After drawing Jack and Alan in successive weeks, Moroney finally got a fixture that did not require a formal objection to the schedule.',
        },
        {
          title: 'Murphy improves, with a low starting point',
          text: 'The previous week’s 71.80 became 97.00. Cooper and London combined for 25.60, a much healthier contribution from the receiver slots, but nobody reached 20. Cook led the backs with 16.70 while Judkins and Marks together managed 13.90. Murphy has followed the weekly high in Week 7 with two losses; the draft-and-wait approach is running short of weeks.',
        },
        {
          title: 'The Friday call: Karl Moroney — correct',
          text: 'We took the backs and McBride despite the receiver injuries, and that foundation held. Murphy’s best simple bench swaps would not close the 19.86 gap. Karl stays fifth in the rankings because the last three scores average 103.39 and those receiver absences still matter. He has won six games, though, which makes the complaint substantially easier to deliver.',
        },
      ],
      sources: [
        {
          label: 'Sleeper · settled Week 9 lineups and player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
        },
        {
          label: 'Sleeper · completed Week 9 moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/9',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    sleeperMatchupId: 5,
    homeRosterId: 1,
    awayRosterId: 8,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekNinePublishedAt,
      pickRosterId: 8,
      homeProjection: 124.95,
      awayProjection: 121.18,
      headline: 'Hugo has fifteen. Burns has another new quarterback.',
      summary:
        'Friday outlook after Jacksonville–Baltimore: Cam Little has already given Hugo 15 points against the 3–5 commissioner. Walsh needs a third win; Burns is trying to follow the upset of Shane with something resembling a run.',
      sections: [
        {
          title: 'Little gives Hugo a proper start',
          text: 'Hugo lost by 5.02 last week despite Higgins scoring 37.50. His kicker has supplied a more useful margin before Sunday this time. Taylor and Javonte face each other, with Kraft and McConkey also selected. Caleb Williams still starts ahead of Mahomes in Friday’s snapshot. Last week that choice cost 11.46 points; this week is a fresh decision, though eleven amateur quarterback coaches will certainly have an opinion.',
        },
        {
          title: 'The commissioner keeps recruiting',
          text: 'Swift and Chase helped Burns beat Shane, but the quarterback desk has changed again. Brissett was released Tuesday, Darnold went Wednesday and Willis arrived. Shough remains selected; Willis practised fully Thursday. Burns also paid $4 for Mitchell and $2 for Chicago’s defence. Kelce returned to full practice, which gives the commissioner one fewer report to refresh while deciding which quarterback will be blamed on Tuesday.',
        },
        {
          title: 'The Friday call: Hugo Walsh',
          text: 'Hugo is 8/13 to Burns’ 13/8. We take the fifteen already banked and the depth around Taylor and Higgins. The best-lineup price allows for Mahomes and Burns’ bench alternatives; it does not assume either manager leaves Friday’s lineup untouched. A Walsh win would put both at 3–6, bringing the commissioner much closer to the forfeit discussions he usually just administers.',
        },
      ],
      sources: [
        ...leagueSources,
        {
          label: 'Jaguars · Little’s four-field-goal Thursday',
          url: 'https://www.jaguars.com/news/game-report-2026-week-9-jaguars-33-ravens-10',
        },
        {
          label: 'Lions–Dolphins · Willis full Thursday',
          url: 'https://www.detroitlions.com/team/injury-report/',
        },
        {
          label: 'Jets–Chiefs · Kelce full Thursday',
          url: 'https://www.newyorkjets.com/team/injury-report/',
        },
      ],
    },
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekNineReviewPublishedAt,
      headline: 'Burns wins without a kicker. Hugo would like a recount.',
      summary:
        'The commissioner escaped 99.82–97.76 with an empty kicker slot and 13 points from Tyler Bass on the bench. Hugo lost the closest game for the second week running. The website will publish the result and the evidence against its owner.',
      sections: [
        {
          title: 'Chase keeps the office open',
          text: 'Chase’s 31.50 and Kelce’s 17.30 rescued Burns from 3.82 at quarterback and 12.20 across his starting backs. Chicago supplied 14 more. Shough, Friday’s selected quarterback, scored 19.70 on the bench after Willis got the start. Miami’s coach deferred a fresh medical assessment of Willis’s groin until later in the week. Burns has two consecutive wins and very little basis for offering lineup advice.',
        },
        {
          title: 'Hugo loses another one at quarterback',
          text: 'Mahomes scored 16.48 behind Caleb Williams’s 12.76. That 3.72-point hindsight swap clears the 2.06 margin, though Mahomes also left the game briefly with an elbow injury. McConkey’s zero was a separate blow: pregame back spasms kept him out. It is not evidence that Hugo knowingly picked an inactive player. Javonte and Higgins combined for 42.60, but Kraft added only 1.90.',
        },
        {
          title: 'The Friday call: Hugo Walsh — wrong',
          text: 'We backed Little’s fifteen banked points and Hugo’s depth. Burns won with eight starters anyway. Walsh is now alone at 2–7 after losses by 5.02 and 2.06; the commissioner reaches 4–5. The weekly flag goes to Burns for the vacant kicker slot. Winning does not make that box less empty.',
        },
      ],
      sources: [
        {
          label: 'Sleeper · settled Week 9 lineups and player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
        },
        {
          label: 'Dolphins, 9 November · Willis update awaits medical review',
          url: 'https://www.miamidolphins.com/news/transcript-hc-jeff-hafley-press-conference-november-9',
        },
        {
          label:
            'NFL · Week 9 injuries, including McConkey’s pregame back spasms',
          url: 'https://amp.nfl.com/news/notable-injuries-news-sunday-week-9-games-2026',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    sleeperMatchupId: 6,
    homeRosterId: 3,
    awayRosterId: 10,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekNinePublishedAt,
      pickRosterId: 10,
      homeProjection: 107.81,
      awayProjection: 131.44,
      headline: 'Keenan has five wins and eight starters.',
      summary:
        'Friday outlook after Jacksonville–Baltimore: 5–3 Keenan faces 6–2 Shane with 5.30 from Flowers and an empty tight-end slot. Marmion is without Lamar, but he at least has somebody selected at every position.',
      sections: [
        {
          title: 'The waiver receipt explains the vacancy',
          text: 'Andrew paid $6 for Henderson and dropped Okonkwo on Wednesday. His remaining rostered tight end, Terrance Ferguson, is tagged IR despite still having a Sleeper projection. The price excludes him. Henderson then missed both practices with illness, while Watson was limited with a rib issue. Keenan won last week with 87.44. Repeating the score while voluntarily reducing the workforce would be quite an experiment.',
        },
        {
          title: 'Shane has his own absences',
          text: 'Jackson is on injured reserve after the thumb injury, leaving Stroud selected. Warren is on bye, but Shane added Miller for $8 and Bates for $3. Smith-Njigba, Lamb and Kittle give him a strong receiving spine. For Andrew, Barkley improved to limited practice Thursday while DeVonta Smith remained absent. Allgeier offers running-back cover after last week’s 36.10 on the bench. There are options, just none at the empty position.',
        },
        {
          title: 'The Friday call: Shane Marmion',
          text: 'Shane is 1/5 to Keenan’s 5/1. We back the fuller lineup and stronger receiver group to get Marmion moving again after Burns stopped him. A later tight-end pickup can improve Andrew’s side, but the published price stays frozen. Keenan has squeezed five wins from this season already. Asking him to locate a ninth starter seems a reasonable condition for number six.',
        },
      ],
      sources: [
        ...leagueSources,
        {
          label: 'Packers–Patriots · Watson and Henderson practice report',
          url: 'https://www.packers.com/team/injury-report/',
        },
        {
          label: 'Eagles · Barkley limited, Smith absent Thursday',
          url: 'https://www.philadelphiaeagles.com/news/giants-vs-eagles-injury-report-saquon-barkley-devonta-smith-cam-skattebo-2026-nfl-week-9',
        },
        {
          label: 'NFL · Jackson thumb surgery and injured reserve',
          url: 'https://amp.nfl.com/news/ravens-qb-lamar-jackson-suffers-right-thumb-injury-bills',
        },
      ],
    },
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekNineReviewPublishedAt,
      headline: 'Keenan fills the vacancy. Shane fills the scoreboard.',
      summary:
        'Shane beat Keenan 143.76–79.80 and took sole possession of the best record at 7–2. Andrew did find a tight end before kickoff. Unfortunately, the other eight positions had already used up most of the available optimism.',
      sections: [
        {
          title: 'Stroud makes the backup plan look excellent',
          text: 'With Lamar on injured reserve, Stroud delivered 35.36. Lamb added 33.50, leaving the pair only 10.94 short of Keenan’s entire team. Shane bounced straight back from losing to Burns and is now just 3.06 behind Alan in season scoring. The man whose abandoned lineup once decided Jack’s forfeit is making a rather better impression while paying attention.',
        },
        {
          title: 'A filled slot and another injured back',
          text: 'Keenan dropped Henderson for Dulcich on Sunday morning; the new tight end scored 3.40. Friday’s empty position had been fixed. Watson supplied 30.10, but Goff returned 5.30 and Jacobs lasted only long enough for 0.50. Green Bay confirmed Monday that Jacobs needs surgery on a fractured finger, with the length of his absence still uncertain. That is a problem for next week as well as this result.',
        },
        {
          title: 'The Friday call: Shane Marmion — correct',
          text: 'We favoured Shane’s stronger receiving group, and the final margin was 63.96, the biggest of the week. Keenan’s last two scores are 87.44 and 79.80; the first somehow bought him a win. At 5–4 he sits fifth, one win above the four-team group fighting over the final playoff place.',
        },
      ],
      sources: [
        {
          label: 'Sleeper · settled Week 9 lineups and player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/9',
        },
        {
          label: 'Sleeper · completed Week 9 moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/9',
        },
        {
          label: 'Packers, 9 November · Jacobs needs finger surgery',
          url: 'https://www.packers.com/news/packers-rb-josh-jacobs-to-miss-time-due-to-surgery-on-broken-finger-nov-9-2026',
        },
      ],
    },
  },
];
