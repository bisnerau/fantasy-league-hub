import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday morning outlooks AFTER TB–DAL, using Thursday's practice reports.
// Final Friday designations are not yet available. Never backdate these calls.
// Frozen lineups, PPR estimates, banked points and waivers: docs/research/2026-week-5-sleeper.json.
export const weekFivePublishedAt = '2026-10-09T08:00:00Z';

const sources = [
  {
    label: 'Sleeper: completed Week 4 scores and player points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/4',
  },
  {
    label: 'Sleeper: Friday Week 5 lineups and Thursday points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/5',
  },
  {
    label: 'Sleeper: Wednesday waiver run (filed under Week 4)',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/4',
  },
  {
    label: 'Sleeper: later Week 5 free-agent moves',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/5',
  },
];
const bengals = {
  label: 'Bengals, Thursday: Chase still in protocol; Higgins misses practice',
  url: 'https://www.bengals.com/news/quick-hits-bengals-work-through-injuries-jamarr-chase-tee-higgins-joe-burrow-peter-king',
};
const eagles = {
  label: 'Eagles, Thursday: Barkley and Smith absent; Goedert limited',
  url: 'https://www.philadelphiaeagles.com/news/eagles-at-jaguars-injury-report-2026-nfl-week-5-london-international-game-saquon-barkley-devonta-smith',
};
const ravens = {
  label: 'Ravens, Thursday: Jackson absent again; Flowers limited',
  url: 'https://www.baltimoreravens.com/news/lamar-jackson-injury-report-ravens-falcons-zay-flowers-ronnie-stanley-trey-hendrickson',
};
const seahawks = {
  label:
    'Seahawks, Thursday: Charbonnet limited and still on PUP; Evans absent',
  url: 'https://www.seahawks.com/news/week-5-injury-report-seahawks-vs-49ers',
};

export const weekFiveReports: MatchupNewsletter[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 1,
    homeRosterId: 8,
    awayRosterId: 11,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFivePublishedAt,
      pickRosterId: 8,
      homeProjection: 113.78,
      awayProjection: 100.36,
      headline:
        'Hugo hires Cousins. Dave finally promotes the right quarterback.',
      summary:
        'Friday outlook, after Thursday’s game: Godwin has banked seven for Dave. Hugo has bought Kirk Cousins for $4 and is waiting on two injured receivers. Between them, they have lost five straight. Something has to give.',
      sections: [
        {
          title: 'The recruitment budget stretches to Kirk',
          text: 'Hugo’s Mahomes is on bye and Caleb Williams carries Sleeper’s out tag, so Cousins arrives from Wednesday’s waivers and goes straight into the lineup. Four dollars to keep the lights on. Taylor and Bowers give the new employee proper help, but the receiving department is another matter: Higgins missed Thursday with groin/neck issues, while McConkey missed practice with his foot injury and is benched here. Friday’s final designations are still pending.',
        },
        {
          title: 'The bench has made its point',
          text: 'Dave has restored Maye after leaving 26.16 on the bench in last week’s 3.60-point defeat. Good meeting, everyone. McMillan’s 45.20 cannot save him this week with Carolina on bye, and Rice is also on Kansas City’s bye. Hollins and Godwin fill the receiver slots; Lloyd and Hampton hold a backfield still missing Achane. The free Jets defence arrived late Thursday. It is a patchwork team, but at least the quarterback memo was read.',
        },
        {
          title: 'The Friday call: Hugo Walsh',
          text: 'Taylor and Bowers tilt this towards Hugo, provided he reacts to the Higgins news before kickoff. Dave’s seven points are already scored, separate from the frozen full-lineup estimates. We take Hugo to stop his three-game slide. Back at home, Alan may finally have to let somebody else discuss a win.',
        },
      ],
      sources: [
        ...sources,
        bengals,
        {
          label: 'Chargers, Thursday: McConkey misses a second practice',
          url: 'https://www.chargers.com/news/injury-report-mcconkey-johnston-alt-week-5-broncos',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 2,
    homeRosterId: 3,
    awayRosterId: 5,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFivePublishedAt,
      pickRosterId: 5,
      homeProjection: 117.14,
      awayProjection: 130.19,
      headline: 'Keenan’s unbeaten run meets a very rude Thursday evening',
      summary:
        'Friday Match of the Week outlook: Karl has 59.50 from Irving and Pickens; Keenan has four from Aubrey. Andrew is 4–0, Karl is chasing a fourth straight win, and the league’s quietest unbeaten start has suddenly become quite loud.',
      sections: [
        {
          title: 'The fixture committee finally gets involved',
          text: 'Andrew has won four games without scoring 122, conceding fewer points than anyone. Karl has apparently decided to raise the entrance fee: Irving’s 31.50 and Pickens’ 28.00 are already in the book. This selection and winner call are made on Friday, with that start known. We are not claiming to have spotted it beforehand. Third against fourth in our rankings, with the unbeaten record at stake, earns the billing.',
        },
        {
          title: 'Six dollars buys a difficult assignment',
          text: 'Keenan paid $6 for Keaton Mitchell and has him selected beside Jeanty. Barkley and DeVonta Smith both missed Thursday practice with hamstring injuries and sit on Andrew’s bench; Flowers was limited with a foot issue. Those are practice updates, not final Sunday rulings. Karl spent $5 on Denver’s defence and has Daniels back in his selected lineup, with Bijan and McBride still to come. The scheduling complaints may remain in drafts.',
        },
        {
          title: 'The Friday call: Karl Moroney',
          text: 'Goff and a productive Flowers could keep Andrew alive, but Karl’s start and remaining core are too strong to oppose. The 130.19–117.14 PPR estimates include Thursday players: do not add those banked points again. We take Karl to make both teams 4–1. Keenan’s 2021 ring remains available for changing the subject.',
        },
      ],
      sources: [...sources, eagles, ravens],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 3,
    homeRosterId: 2,
    awayRosterId: 10,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFivePublishedAt,
      pickRosterId: 2,
      homeProjection: 110.95,
      awayProjection: 122.24,
      headline: 'Niall buys Shipley. Shane discovers the floor has a basement.',
      summary:
        'Friday outlook, after Thursday’s game: Lamb has given Shane just 2.90, a week after 41.30. Niall’s $20 Shipley is still benched. The unbeaten league leader has left the door open; Murray now needs to remember how winning works.',
      sections: [
        {
          title: 'The invoice comes with small print',
          text: 'Shipley was the biggest successful bid in Wednesday’s checked run. Barkley missed Thursday practice, but Philadelphia has also promoted Dameon Pierce after placing Bigsby on IR. Twenty dollars bought an opportunity, not exclusive rights to the backfield. Niall also paid $6 for Jacksonville’s defence and replaced Schultz with a free Hockenson. Shipley remains behind Brown and Dowdle in this snapshot. Evans is selected despite missing Thursday with his ribs; that needs watching too.',
        },
        {
          title: 'The machine makes an unfamiliar noise',
          text: 'Shane has scored at least 138.70 in every completed week. Lamb’s 2.90 makes repeating that harder, while Lamar missed a second practice with his ankle injury. Stroud is selected and Lamar benched. JSN and Kittle still offer a formidable reply, but this is the first Friday when the league leader looks remotely approachable. Niall has spent three weeks near or below 105; being handed a chance is not the same as taking it.',
        },
        {
          title: 'The Friday call: Niall Murray',
          text: 'Our upset call goes against the full-lineup PPR estimates, which still include Lamb’s unfulfilled forecast. His actual return and Lamar’s uncertainty narrow the contest enough to back Niall’s Brown–Lawrence core. Murray must monitor Evans and the London backfield news. If he wastes this opening, the 169-point first week officially becomes a family heirloom.',
        },
      ],
      sources: [
        ...sources,
        eagles,
        ravens,
        seahawks,
        {
          label: 'Eagles: Dameon Pierce promoted after Bigsby goes to IR',
          url: 'https://www.philadelphiaeagles.com/news/eagles-sign-dameon-pierce-to-the-active-roster-erik-ezukanma-to-the-practice-squad',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 4,
    homeRosterId: 1,
    awayRosterId: 9,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFivePublishedAt,
      pickRosterId: 9,
      homeProjection: 124.34,
      awayProjection: 115.6,
      headline: 'Burns promotes the evidence. Jack would like a fresh review.',
      summary:
        'Friday outlook, after Thursday’s game: Egbuka has banked 17.20 for Jack. Burns has moved Emanuel Wilson into the lineup after last week’s bench embarrassment, but Chase remains in concussion protocol. The commissioner’s appeals department is busy.',
      sections: [
        {
          title: 'The flag has produced a response',
          text: 'Wilson is selected after scoring 27.00 on Burns’ bench in Week 4. Nix is in at quarterback, Johnson covers Kelce’s Kansas City bye, and a free Cleveland defence replaces the Chiefs. Three straight defeats have at least inspired some admin. Wilson’s opportunity still needs monitoring: Seattle listed Charbonnet as limited Thursday and still on PUP. A practice return is not an activation, and Joe already owns him in MAC 12.',
        },
        {
          title: 'Chase is practising. That is only half the sentence.',
          text: 'The Bengals confirmed Chase was limited Thursday but remained in concussion protocol. Higgins also missed practice, so Burns cannot treat a promising headline as clearance for Sunday. Chase is still selected; Tate and Wicks carry Sleeper questionable tags on the bench. Jack has fewer decisions after Egbuka’s useful start, with Allen, McCaffrey and Henry waiting. Last week we backed that core and Joe beat it. Jack is welcome to stop making us look foolish.',
        },
        {
          title: 'The Friday call: Jack Ringrose',
          text: 'Burns leads the frozen PPR estimates, but the Chase uncertainty and Egbuka’s banked contribution push our call to Jack. A cleared Chase would make this considerably tighter. Ringrose needs to reverse four progressively smaller weekly scores; Burns needs to prevent 1–4. Neither can repair the standings by citing an old trophy, although both have the documentation ready.',
        },
      ],
      sources: [...sources, bengals, seahawks],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 5,
    homeRosterId: 4,
    awayRosterId: 12,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFivePublishedAt,
      pickRosterId: 12,
      homeProjection: 114.18,
      awayProjection: 120.27,
      headline:
        'Tommy adds another prospect. Murphy adds another reason to worry.',
      summary:
        'Friday outlook, after Thursday’s game: Murphy has 12.64 from Dak. Tommy is 0–4, has spent another $9 on Keon Coleman, and would very much like his knowledge of football to start appearing in the league table.',
      sections: [
        {
          title: 'The scouting department remains undefeated',
          text: 'Coleman arrived for $9, replacing Bateman, and sits on Tommy’s bench. Zvada arrived for free to cover Butker’s bye. Loveland now starts ahead of Sadiq, last week’s $13 return purchase who scored nothing. Stafford, Puka and Garrett Wilson give this lineup enough quality to end the streak, but Monangai carries a Sleeper questionable tag. Four defeats is a lot of pressure to put on the phrase “upside”.',
        },
        {
          title: 'Murphy has quietly found the controls',
          text: 'Aidan’s last three totals are 130.46, 129.94 and 137.00. He has won the last two, and his free-agent Reichard–Strange combination keeps its place after supplying 33.50 last week. Judkins moves into the selected backfield alongside Cook, with Kamara carrying a Sleeper questionable flag on the bench. Dak’s Thursday return is useful rather than decisive; London, Adams and Metcalf still have the largest part of the job. Set-and-forget has become set-and-quite-reasonably-expect.',
        },
        {
          title: 'The Friday call: Aidan Murphy',
          text: 'Only about six points separate the full-lineup estimates, so this is no procession. Tommy’s Stafford–Puka pairing offers a coherent escape route. Murphy gets the nod on three weeks of stronger scoring and a deeper supporting cast. An 0–5 start would leave Tommy explaining why the process is sound to people who remember the Shark Boy costume.',
        },
      ],
      sources,
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    sleeperMatchupId: 6,
    homeRosterId: 6,
    awayRosterId: 7,
    preview: {
      version: 1,
      editorial: true,
      publishedAt: weekFivePublishedAt,
      pickRosterId: 6,
      homeProjection: 131.38,
      awayProjection: 122.13,
      headline:
        'Joe’s recovery meets the champion. Alan’s new defence contributes one.',
      summary:
        'Friday outlook, after Thursday’s game: Alan has 15.20 from Javonte and Dallas’s defence. Joe is finally off the mark, but the $31 Gordon is back on the bench in this snapshot. The recovery tour has drawn a difficult second venue.',
      sections: [
        {
          title: 'A title defence, with one small refund request',
          text: 'Alan followed four straight scores above 128 by swapping Green Bay’s defence for Dallas. Dallas contributed one point. Javonte supplied 14.20, so the champion still has a start, just not the sort last week’s top scorer had advertised. Burrow and Gibbs lead what remains. Chase’s continuing concussion protocol and Higgins’ missed practices matter to Burrow’s weapons, too; Alan does not get to escape the Bengals news merely by owning the quarterback.',
        },
        {
          title: 'The purchase is still appreciating on the bench',
          text: 'Joe keeps Darnold over Hurts and currently selects Skattebo and Braelon Allen ahead of Gordon. St. Brown, Jefferson and Nabers make the receiving group properly threatening, although Jefferson, Nabers and Skattebo all carry Sleeper questionable flags this morning. Charbonnet, another Joe stash, remained on Seattle’s PUP list despite limited practice Thursday. He is neither a confirmed Sunday option nor an available MAC 12 waiver target. Alan’s $8 Meyers is benched alongside Gesicki.',
        },
        {
          title: 'The Friday call: Alan Horgan',
          text: 'Joe’s first win deserves credit and his receivers can swing this. Alan gets the nod for the more reliable scoring base, with Gibbs still to play and a nine-point edge in the full-lineup estimates. Those include Thursday players, not extra points to pile onto 15.20. Joe’s march towards fourth place may require a diversion.',
        },
      ],
      sources: [...sources, bengals, seahawks],
    },
  },
];
