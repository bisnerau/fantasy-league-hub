import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday morning outlooks AFTER TB–DAL, using Thursday's practice reports.
// Final Friday designations are not yet available. Never backdate these calls.
// Frozen lineups, PPR estimates, banked points and waivers: docs/research/2026-week-5-sleeper.json.
export const weekFivePublishedAt = '2026-10-09T08:00:00Z';
export const weekFiveReviewPublishedAt = '2026-10-13T14:50:00Z';

const reviewSources = [
  {
    label: 'Sleeper: settled Week 5 scores and recorded player points',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/5',
  },
  {
    label: 'Sleeper: completed Week 5 transactions',
    url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/5',
  },
];

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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFiveReviewPublishedAt,
      headline:
        'Sharpe discovers the start button. Hugo discovers fourth straight defeats.',
      summary:
        'Hugo 84.82–135.34 Sharpe. Dave actually started Drake Maye this time, and the league’s best individual score followed. Our Hugo call has been escorted off the premises.',
      sections: [
        {
          title: 'The memo reached its destination',
          text: 'Last week Dave left Maye’s 26.16 on the bench and lost by 3.60. This week he selected him and collected 39.46, the highest starter score in MAC 12. A revolutionary new approach: put the good player in the team. Tyler Warren supplied 21.40, while Myers and the Jets defence added 35 between them. After three weeks below 100, Sharpe has now cleared it twice and moved to 3–2. The set-and-forget reputation may need a small amendment.',
        },
        {
          title: 'Cousins cannot repair the entire building',
          text: 'Hugo’s $4 quarterback returned a serviceable 13.72. The trouble was elsewhere: Montgomery, Higgins and Concepcion combined for 6.80, leaving Bowers’ 23.00 carrying far too much of the operation. This was the week’s lowest total and Hugo’s fourth straight defeat. Taylor and Bowers were the foundation of our Friday optimism; between them they could not bridge a 50.52-point gap. Back in the shared house, Alan also lost, so at least the round-up can be conducted in mutual silence.',
        },
        {
          title: 'The Friday call: Hugo Walsh — wrong',
          text: 'We backed the stronger-looking core and underestimated Dave’s supporting cast. Sharpe won comfortably; Hugo is 1–4 alongside Burns and Tommy. There is no clever bench swap to rescue this result. The guitar jokes are becoming easier to write, which is precisely the situation Hugo needed to avoid.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFiveReviewPublishedAt,
      headline:
        'Karl ends Keenan’s unbeaten run and closes the complaints department',
      summary:
        'Keenan 103.84–171.46 Karl. The Match of the Week became the biggest margin of the week. Karl’s fourth straight win leaves both managers 4–1, with very different explanations.',
      sections: [
        {
          title: 'The billing lasted longer than the contest',
          text: 'Friday’s selection was made after Irving and Pickens had already banked 59.50. We disclosed that advantage and backed Karl; the rest of his lineup then made the decision look positively cautious. Daniels supplied 32.26 and McBride another 21.60. The final 171.46 was the highest team score of the season so far, beating Niall’s opening 169.00. The king of bad scheduling has become the scheduling problem.',
        },
        {
          title: 'Two men and a missing support act',
          text: 'Watson’s 32.30 and Goff’s 28.94 accounted for 61.24 of Andrew’s 103.84. The other seven starters managed 42.60 together. Keenan had won his first four without reaching 122; against this opponent, even his best previous score would have left him nearly fifty short. The 67.62-point defeat was not one difficult lineup decision. It was an inspection of the whole operation. The 2021 trophy remains valid, although it cannot be submitted as a tenth starter.',
        },
        {
          title: 'The Friday call: Karl Moroney — correct',
          text: 'We called for both teams to finish 4–1, and they did. Karl has increased his score in each of his last three games and now takes our No.1 ranking. Andrew still owns four useful wins, but the unbeaten protection has gone. A marquee fixture, a correct call and almost no suspense: two out of three will have to do.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFiveReviewPublishedAt,
      headline:
        'Niall takes Shane’s unbeaten badge. Shrader handles the paperwork.',
      summary:
        'Niall 122.24–119.34 Shane. The upset call landed by 2.90, the closest finish of Week 5. Murray finally won again; Marmion’s perfect record followed Keenan’s out the door.',
      sections: [
        {
          title: 'The rescue came from a different department',
          text: 'Friday’s case for Niall leaned on Brown and Lawrence. Lawrence delivered 21.74, but Brown managed seven; Parker Washington’s 30.40 and Evans’ 26.30 did the heavy lifting instead. Then there was Shrader, contributing twenty from the kicking slot. Murray’s first win since the opener was neither tidy nor comfortable, but the standings do not offer a presentation mark. The 169-point Week 1 can finally stop serving as his entire character reference.',
        },
        {
          title: 'The bench has entered the evidence bundle',
          text: 'Warren’s 36.80 and JSN’s 22.80 kept Shane competitive despite Lamb’s 2.90. Stroud supplied 20.94, so blaming the replacement quarterback would miss the point. Likely’s 32.40 sat behind Kittle’s 7.40 on the bench: a 25-point hindsight difference in a 2.90-point game. That is not proof Shane should have foreseen it, but it is enough for the league’s referee to throw a very petty flag. Nobody is claiming this was another forgotten lineup.',
        },
        {
          title: 'The Friday call: Niall Murray — correct',
          text: 'We took the upset with Thursday’s points already known, and Niall just delivered. He is 2–3; Shane is 4–1 and still leads the season in points. Six other teams would have beaten Niall this week, so the victory comes with the Get Away With It award. Murray should collect both quickly before anyone requests a recount.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFiveReviewPublishedAt,
      headline: 'Jack serves the commissioner a fourth consecutive defeat',
      summary:
        'Burns 109.92–125.40 Jack. Ringrose stopped his scoring slide; Burns stopped finding opponents he could beat. The Friday Jack call survives another visit to the appeals office.',
      sections: [
        {
          title: 'The Wagyu is reheated successfully',
          text: 'Four progressively smaller scores had ended with Jack’s league-low 93.42 in Week 4. Allen’s 30.50 made this recovery rather more convincing, with Henry, McCaffrey and Jameson Williams supplying useful support. Egbuka’s 17.20 was already banked when we made Friday’s call, and the rest of the team preserved the advantage. Jack is back above .500 at 3–2. The inaugural champion has a current result to discuss, saving everyone another argument about how many teams entered in 2020.',
        },
        {
          title: 'The flag was addressed. The losing was not.',
          text: 'Burns did put Emanuel Wilson into the final lineup, collecting 13.20, while Swift remained selected and added 17.30. Chase, whose availability had worried us on Friday, returned 19.70. The commissioner cannot pin this one on that uncertainty: Nix’s 7.92 and a fairly ordinary supporting return left him 15.48 short. Unlike last week, there was no enormous position-compatible bench haul waiting to reverse the verdict. Sometimes the selected team simply loses.',
        },
        {
          title: 'The Friday call: Jack Ringrose — correct',
          text: 'The winner was right, although the Chase concern was not what decided it. Burns falls to 1–4 after four consecutive defeats; Jack breaks a two-game losing run. Six seasons of perfect playoff attendance is a lovely historical fact. It is also beginning to look like something the commissioner will have to work to preserve.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFiveReviewPublishedAt,
      headline: 'Tommy’s upside finally appears in the points column',
      summary:
        'Tommy 157.12–120.44 Murphy. The last winless manager is off the mark, with the week’s second-highest score. We backed Murphy; Tommy has submitted a 36.68-point correction.',
      sections: [
        {
          title: 'The lecture finally has supporting evidence',
          text: 'Stafford and Puka combined for 65.02, with Nacua’s 37.70 sharing the week’s best non-quarterback starter score with Gibbs. Garrett Wilson added 23.40 and Stevenson 17.50. After four weeks of explaining why the ingredients were good, Tommy produced a meal. His previous best was 105.60; this beat it by 51.52. The Shark Boy costume can remain in storage for another week, although a 1–4 record does not yet justify throwing away the receipt.',
        },
        {
          title: 'A respectable total chooses the wrong opponent',
          text: 'Murphy’s 120.44 was his lowest since the opener, but this was not a collapse. Cook and Adams supplied 44.90 between them, while London and Reichard helped. Friday pickup Andrews scored 4.80 with Strange’s 13.80 on the bench; even that hindsight improvement would not have changed the winner. Aidan had scored at least 129.94 in each of the previous three weeks. Tommy picked an inconvenient moment to stop being everybody’s recovery fixture.',
        },
        {
          title: 'The Friday call: Aidan Murphy — wrong',
          text: 'We identified Stafford–Puka as Tommy’s escape route and still favoured Murphy’s steadier recent form. The escape route became a motorway. Murphy drops to 2–3; Tommy joins Burns and Hugo at 1–4, and nobody in MAC 12 remains winless. One explosive week does not erase four defeats, but it does make the next lecture considerably harder to interrupt.',
        },
      ],
      sources: reviewSources,
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekFiveReviewPublishedAt,
      headline: 'Joe brings a free Brissett to the champion’s table',
      summary:
        'Alan 123.30–148.58 Joe. Ennis followed his first win by beating the reigning champion, helped by a late quarterback pickup. Our Alan call gets filed beside last week’s Jack prediction.',
      sections: [
        {
          title: 'The Sunday signing earns his place',
          text: 'Joe replaced Darnold with free-agent Jacoby Brissett on Sunday and started him for 25.28. That is more than a cosmetic waiver transaction. Nabers supplied 29.10, LaPorta 19.80 and Jefferson 18.80, giving Joe his highest total of the season. The expensive Gordon remained on the bench with 14.80, so the free quarterback will be difficult for the recruitment department to leave out of its presentation. Two straight wins have turned 0–3 into 2–3.',
        },
        {
          title: 'Gibbs cannot carry the entire title defence',
          text: 'Gibbs’ 37.70 and Burrow’s 24.60 gave Alan a substantial base. The rest did not keep up: Harvey and the Dallas defence combined for 1.70. Alan’s final score was his lowest of the season, but would still have beaten six other managers, earning the Schedule Solicitor award. The champion has borrowed Karl’s traditional complaint just as Karl has stopped needing it. There is probably a licensing fee.',
        },
        {
          title: 'The Friday call: Alan Horgan — wrong',
          text: 'We preferred Alan’s reliable floor and acknowledged Joe’s receivers as the danger. They delivered, and the quarterback changed after our snapshot. That is a reason to explain the miss, not rewrite the preview. Alan falls to 3–2; Joe’s second consecutive win makes his familiar fourth-place ambition feel less theoretical. Our six Friday calls finish 3–3. The editorial department has been asked to show its working.',
        },
      ],
      sources: reviewSources,
    },
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
