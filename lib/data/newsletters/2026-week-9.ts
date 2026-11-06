import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks after JAX–BAL. Thursday points are known; final Friday
// injury designations remain pending. Selected-lineup PPR estimates are frozen.
export const weekNinePublishedAt = '2026-11-06T09:03:18Z';

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
  },
];
