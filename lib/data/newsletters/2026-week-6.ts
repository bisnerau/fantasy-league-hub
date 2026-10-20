import type { MatchupNewsletter } from '../matchup-newsletters';

// Friday outlooks after SEA–DEN. Thursday points are known; final Friday
// designations are pending. Preserve these calls when adding settled reviews.
export const weekSixPublishedAt = '2026-10-16T09:31:36Z';
export const weekSixReviewPublishedAt = '2026-10-20T15:40:35Z';
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSixReviewPublishedAt,
      headline: 'Karl wins the scheduling lottery he keeps reporting as stolen',
      summary:
        'Karl beats Sharpe 106.70–87.00 for a fifth straight win, with Boswell and Denver supplying 31. Dave’s two-week scoring improvement ends, and even the best bench complaint comes up 0.20 short.',
      sections: [
        {
          title: 'The complaints department changes sides',
          text: 'Seven teams outscored Karl this week. Fortunately, he was playing Dave, and Boswell’s 18 plus Denver’s 13 gave him enough help to survive a combined 14.20 from Bijan and Irving. The man who has built a public identity around unfair scheduling reaches 5–1 with the Get Away With It award. Someone should frame it beside last year’s runners-up medal.',
        },
        {
          title: 'Dave nearly has a hindsight defence',
          text: 'Sunday pickup Hunter Henry supplied 14.80, so Sharpe did make a useful move. His two starting backs managed 8.90 between them, though, and Tre Tucker’s 26.70 stayed on the bench. Replacing Michael Wilson’s 7.20 with Tucker would still have left Dave 0.20 behind. Even the imaginary rescue ends with Karl winning, which feels unnecessarily cruel.',
        },
        {
          title: 'The Friday call: Karl Moroney — correct',
          text: 'We backed Karl and got the winner, although McBride and the backs provided less separation than we expected. The win comes with fresh concerns: McLaurin left Monday’s game with a knee injury, and New England placed Doubs on injured reserve. Karl has earned five wins; his receiving depth now needs attention. Dave reaches 3–3 with four scores below 100. The third digit has left no forwarding address.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: settled Week 6 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
        },
        {
          label: 'Sleeper: Week 6 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
        },
        {
          label: 'Patriots, Monday: Doubs placed on injured reserve',
          url: 'https://www.patriots.com/news/patriots-place-wr-romeo-doubs-on-injured-reserve-sign-db-elliott-davison-to-the-53-man-roster-from-the-practice-squad-announce-additional-practice-squad-moves',
        },
        {
          label: 'Commanders, Monday recap: McLaurin and Evans injuries',
          url: 'https://www.commanders.com/news/instant-analysis-commanders-49ers-2026',
        },
      ],
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSixReviewPublishedAt,
      headline: 'Niall reaches .500; Hugo starts recognising the scenery',
      summary:
        'Niall wins 116.84–94.10 as Lawrence and Walker combine for 55.24. Hugo’s $11 Pierce contributes 15.00, but a fifth straight defeat leaves the former busker at 1–5.',
      sections: [
        {
          title: 'The useful kind of Sunday tinkering',
          text: 'Murray replaced Jaleel McLaughlin with Kendre Miller on Sunday morning and got nine points from the new starter. Lawrence and Walker did the heavy lifting, supplying nearly half his total. After edging Shane last week, Niall has consecutive wins and a 3–3 record. The 50 Challenge veteran is finally finding a less exhausting route back to respectability.',
        },
        {
          title: 'Eleven dollars cannot buy an entire team',
          text: 'Pierce’s 15.00 was a decent return for Hugo’s waiver bid, and Taylor added 21.10. The receiving slots were the problem: Concepcion, Lemon and McConkey combined for 15.50. Bowers could only add 11.00. That leaves Hugo below 100 for the third time in five straight defeats, with the season-opening 156.06 starting to look like a particularly misleading advert.',
        },
        {
          title: 'The Friday call: Niall Murray — correct',
          text: 'We preferred Niall’s scoring options and he won by 22.74. Hugo did get something from the Eagles backfield gamble; the rest of the lineup could not make it count. Murray has his own concern after Evans left Monday’s game with an Achilles injury, with no recovery timetable assumed here. For now, Niall can enjoy .500 while Hugo tries to stop his season turning into a Grafton Street booking enquiry.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: settled Week 6 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
        },
        {
          label: 'Sleeper: Week 6 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
        },
        {
          label: 'Commanders, Monday recap: McLaurin and Evans injuries',
          url: 'https://www.commanders.com/news/instant-analysis-commanders-49ers-2026',
        },
      ],
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSixReviewPublishedAt,
      headline: 'Keenan finds a quarterback. Jack finds an opponent.',
      summary:
        'Jack wins 120.50–83.58 as McCaffrey supplies 30.70, the week’s highest starter score. Keenan did replace bye-week Goff with Sunday pickup Winston, whose 6.48 could not prevent the league’s lowest total.',
      sections: [
        {
          title: 'Credit for filling the vacancy',
          text: 'Friday’s quarterback gap was fixed: Keenan signed Winston on Sunday morning and started him. The replacement returned 6.48. Smith’s 20.50 was the bright spot, but Fannin and Aubrey combined for 2.90, leaving Andrew at 83.58 and 4–2. The Friday Mackdown title was “undefeated against reasonable opponents”. Jack appears to have applied for unreasonable status.',
        },
        {
          title: 'The Wagyu has a proper main course',
          text: 'McCaffrey’s 30.70 carried Jack through a five-point Henry week. Egbuka added 17.80, and Ringrose used Kincaid for 10.80 after Friday’s snapshot had shown new signing Higbee in the slot. Two straight wins put Jack at 4–2. His historic trophy still came in an eight-team league, but beating Keenan in the present one is a pleasant way to avoid discussing the small print.',
        },
        {
          title: 'The Friday call: Jack Ringrose — correct',
          text: 'We backed Jack’s core and he won by 36.92, the biggest margin of the week. Keenan’s defeat should not be filed as a forgotten quarterback: the transaction and recorded lineup show he addressed it. The wider issue is declining output, from 121.68 to 103.84 to 83.58. A 4–2 start gives him room to recover. It also gives his next audio defence a rather demanding opening paragraph.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: settled Week 6 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
        },
        {
          label: 'Sleeper: Week 6 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
        },
      ],
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSixReviewPublishedAt,
      headline: 'Tommy’s winning streak survives exactly one week',
      summary:
        'Shane beats Tommy 133.88–101.78 and takes the weekly scoring crown. Stroud covers for Lamar with 22.98; Tuten and Loveland give Tommy promise to discuss at another losing press conference.',
      sections: [
        {
          title: 'Shane brought the right understudy',
          text: 'Stroud’s 22.98 helped Shane recover immediately from last week’s narrow loss to Niall. JSN supplied 25.40 and Kittle 17.90, with Hubbard adding 19.10. That was the best total in MAC 12 and took Marmion to 5–1. Likely scored another 23.90 on the bench, but this time there is no need to turn the tight-end decision into a public inquiry.',
        },
        {
          title: 'Potential makes another lengthy appearance',
          text: 'Tuten’s 24.70 and Loveland’s 18.50 gave Tommy two excellent reasons to explain why the team is better than its record. Stafford and Puka combined for 30.88, down from 65.02 in the breakthrough win over Murphy. Stevenson’s 3.60 left another hole. At 1–5, Tommy is sharing the bottom record with Hugo. The prospect collection remains interesting; the results remain suitable material for a second stand-up set.',
        },
        {
          title: 'The Friday call: Shane Marmion — correct',
          text: 'We backed Shane and the 32.10-point margin supports it. The lineup used his rostered quarterback cover, which mattered while Lamar was out. Baltimore’s Monday update says Jackson has improved but remains day-to-day, with practice and a Sunday return still uncertain. Shane’s season points lead and Stroud give him a strong position while he waits. Tommy has already demonstrated a winning ceiling. Repeating it would save everyone another presentation.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: settled Week 6 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
        },
        {
          label: 'Sleeper: Week 6 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
        },
        {
          label:
            'Ravens, Monday: Jackson improving; practice and return still uncertain',
          url: 'https://www.baltimoreravens.com/news/jesse-minter-lamar-jackson-ankle-still-day-day-monday-week-7-injuries-rashod-bateman-cam-jurgens-trey-hendrickson-tyler-loop-critical-misses',
        },
      ],
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSixReviewPublishedAt,
      headline: 'Burns fixes the results page by winning a match',
      summary:
        'Burns ends four straight defeats, beating Alan 122.06–110.26 in the Match of the Week. Shough and Swift combine for 49.96, and our Friday pick of the champion finishes 11.80 short.',
      sections: [
        {
          title: 'The commissioner has located the win button',
          text: 'Shough’s 26.96 and Swift’s 23.00 supplied the backbone of Burns’ first win since the opener. Tate added 19.00 with Chase on bye. The commissioner still managed to leave Bernard’s 25.70 on the bench, preserving a little continuity with the previous month, but this time his selected team was good enough. Six straight playoff appearances have a pulse again at 2–4. The website can retain its existing owner.',
        },
        {
          title: 'Alan’s cover kept him close',
          text: 'The champion had Burrow and Gibbs on bye. Daniel Jones supplied 13.76, while Burden’s 17.50 led a fairly even supporting cast. Nobody reached 20, leaving Alan with a second consecutive defeat and a 3–3 record. His Thursday advantage was real, but it could not carry the replacements all weekend. Hugo has company in the household post-mortem again, although Alan can at least bring a trophy to his defence.',
        },
        {
          title: 'The Friday call: Alan Horgan — wrong',
          text: 'We narrowly chose Alan at Evens after Thursday’s game, with his 9.40-point banked advantage already known. Burns had the slightly higher best-lineup estimate and turned that side of the argument into an 11.80-point win. The original call stays beside this review. Shough and Swift deserve the credit; the preview desk gets the correction. Beating the champion also gives Burns something to mention before anyone asks about those four defeats.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: settled Week 6 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
        },
        {
          label: 'Sleeper: Week 6 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
        },
      ],
    },
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: weekSixReviewPublishedAt,
      headline: 'Joe beats his former draft client and sacks the kicker',
      summary:
        'Joe wins the week’s closest game, 122.52–114.22, for a third straight victory. Nabers and Golden combine for 50.90; Bass contributes 15.00 and is released on Tuesday. Staff retention remains poor.',
      sections: [
        {
          title: 'The replacements have earned their wages',
          text: 'With Jefferson, St. Brown and LaPorta on bye, Joe got 28.50 from Nabers and 22.40 from Golden. New quarterback Cousins contributed 18.52, while Skattebo recorded zero. We cannot infer a forgotten lineup from that score. Bass’ 15.00 helped secure an 8.30-point win; Joe dropped him on Tuesday morning. Last week it was Brissett. Working for Ennis is becoming a series of successful probation periods followed by dismissal.',
        },
        {
          title: 'Murphy has a bigger problem than the result',
          text: 'Cook’s 24.30 and Metcalf’s 20.30 kept Aidan close, but Prescott and Adams combined for 17.92. Monday brought worse news: the Rams expect Adams to miss 6–10 weeks with a hamstring injury. Murphy is now 2–4 and needs receiving cover. Joe also faces an extended quarterback problem: Hurts is on injured reserve, and Philadelphia’s Monday statement confirms he cannot play contact football during treatment. His recovery takes priority.',
        },
        {
          title: 'The Friday call: Aidan Murphy — wrong',
          text: 'We preferred Murphy’s available receivers and underestimated Joe’s cover. Ennis reaches 3–3 with the second-highest score of the week and a third consecutive win. The manager who once picked Murphy’s draft team has now beaten the current version. Joe is climbing towards his favourite finishing position at a worrying speed. Aidan may want to find a different consultant before the waiver deadline.',
        },
      ],
      sources: [
        {
          label: 'Sleeper: settled Week 6 scores and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/6',
        },
        {
          label: 'Sleeper: Week 6 transactions',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/6',
        },
        {
          label: 'Rams, Monday: Adams expected to miss 6–10 weeks',
          url: 'https://www.therams.com/news/rams-injury-updates-cardinals-week-6-2026-blake-grupe-torn-acl-out-for-season-poona-ford-davante-adams-kobie-turner-trent-mcduffie-raiders',
        },
        {
          label: 'Eagles, Saturday: Hurts placed on injured reserve',
          url: 'https://www.philadelphiaeagles.com/news/eagles-place-jalen-hurts-on-injured-reserve-sign-jaydon-blue-to-the-active-roster-2026-nfl-week-6-panthers',
        },
        {
          label: 'Eagles, Monday: latest statement on Hurts and recovery',
          url: 'https://www.philadelphiaeagles.com/news/eagles-and-jalen-hurts-agent-nicole-lynn-provide-an-update-on-qb-jalen-hurts',
        },
      ],
    },
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
