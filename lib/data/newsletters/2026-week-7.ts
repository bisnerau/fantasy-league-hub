import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks after NE–CHI. Thursday points are already known; the
// latest practice reports are Thursday's, with final designations pending.
export const weekSevenPublishedAt = '2026-10-23T10:31:00Z';
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
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 5,
      homeProjection: 121.38,
      awayProjection: 121.67,
      headline: 'Karl completes a trade. The complaints department stays open.',
      summary:
        'Friday Match of the Week: 5–1 Karl faces 4–2 Jack after the season’s first trade. Garrett Wilson and Jonah Coleman went to Karl for Bucky Irving; only 2.29 separates the adjusted best-lineup estimates.',
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
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekSevenPublishedAt,
      pickRosterId: 4,
      homeProjection: 120.66,
      awayProjection: 108.42,
      headline: 'Tommy trades for the present. Hugo gets the receipt.',
      summary:
        'Friday outlook: both are 1–5, and Tommy leads 50.20–27.42 after Thursday. Irving arrives through the first trade; Hugo’s $19 Douglas pickup has already returned 5.30. Someone is leaving this meeting at 1–6.',
      sections: [
        {
          title: 'Tommy has bought a player for this season',
          text: 'The league’s most committed investor in future breakouts has sent Wilson and Coleman to Karl for Irving. Tommy needs a running back now, with Tuten on bye and Monangai unavailable. Stevenson’s 22.50 and Loveland’s 19.90 have already done much of Thursday’s work; Brown added 7.80. For a 1–5 manager, being able to discuss points that actually exist must be a refreshing change of subject.',
        },
        {
          title: 'Hugo’s emergency purchase gets an early review',
          text: 'Douglas cost $19 and supplied 5.30, alongside Caleb Williams’ 22.12. Knight has since replaced Pierce, while Higgins returns from his bye to help Taylor. Bowers improved to full practice Thursday. Across the matchup, Irving was limited by illness and Nacua appeared on the Rams report with a calf issue. Final designations are pending, so Tommy’s new arrival and favourite receiver still need checking. The forfeit race has enough uncertainty without medical guesswork.',
        },
        {
          title: 'The Friday call: Tommy O’Brien',
          text: 'Tommy is 1/5 against Hugo’s 11/2 after the Thursday scoring. His lead and the Stafford–Nacua upside earn our call, subject to the remaining injury news. Hugo needs Taylor and Bowers to give him a way back and end five straight defeats. Tommy has finally traded potential for immediate help. A second win would make a compelling case for trying it again.',
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
