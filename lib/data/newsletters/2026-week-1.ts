import type { MatchupNewsletter } from '../matchup-newsletters';

// Written 15 September after checking the six settled Sleeper results and
// recorded player points. League colour comes from the manager profiles and
// the commissioner's note that Hugo and Alan live together. No pregame calls
// existed for Week 1; none are reconstructed here.
const week = { leagueId: '1389706813993160704', season: '2026', week: 1 };
const publishedAt = '2026-09-15T12:56:10.000Z';

export const weekOneNewsletters: MatchupNewsletter[] = [
  {
    ...week,
    sleeperMatchupId: 1,
    homeRosterId: 11,
    awayRosterId: 12,
    review: {
      version: 1,
      editorial: true,
      publishedAt,
      headline: 'Sharpe takes the win. Please destroy the footage.',
      summary:
        'The league’s two set-and-forget specialists met, and David finally got the better version of the arrangement. Aidan managed to make a deeply ordinary winning performance look almost comfortable. Neither should be asking for this one to lead the match report.',
      sections: [
        {
          title: 'A fine advertisement for checking your team',
          text: 'David’s long-established plan of drafting a team and trusting the universe received a ringing endorsement from exactly one opponent. He won with 78.02 points. Nine other managers would have beaten him, but none of those nine had the good manners to be scheduled against him. A win is a win, and David should get that sentence printed before anyone asks a follow-up question.',
        },
        {
          title: 'Murphy’s usual escape route was closed',
          text: 'Aidan has made a very respectable MAC 12 career out of apparently needing to do less than everyone else. This week, the scoreboard declined to participate. Travis Etienne and Dak Prescott offered some resistance; Kyle Pitts contributed a zero. Across the divide, De’Von Achane and Michael Wilson shared David’s scoring honours with 10.6 apiece. It was the sort of game where being slightly less disappointing qualified as a tactical masterclass.',
        },
        {
          title: 'The verdict',
          text: 'David gets the Get Away With It award and an opening win. Aidan gets the uncomfortable distinction of losing to the lowest-scoring winner. There is plenty of season left, but if both insist on leaving the car on cruise control, somebody should at least check that it is pointing towards the playoffs.',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 2,
    homeRosterId: 1,
    awayRosterId: 7,
    review: {
      version: 1,
      editorial: true,
      publishedAt,
      headline: 'Joe submits a complaint. Burns keeps the points.',
      summary:
        'Joe finally has a scheduling grievance that survives contact with the evidence. Unfortunately, the man who beat him also runs the league. Burns opens with a strong win; Ennis opens with a very well-supported objection.',
      sections: [
        {
          title: 'A proper game, an inconvenient opponent',
          text: 'This was a perfectly decent opening performance from Joe. Justin Jefferson and Amon-Ra St. Brown supplied the sort of double act you draft them for, and 139.02 points would have beaten seven other teams. Instead, he drew Burns. The Schedule Solicitor award is some consolation, although it is unlikely to be mistaken for the win he actually wanted.',
        },
        {
          title: 'The commissioner found help elsewhere',
          text: 'The encouraging part for Burns is that this did not require Ja’Marr Chase to carry the whole enterprise. Chase had a quiet week, while D’Andre Swift piled up 32.4 and Jaxson Dart gave the lineup another serious contribution. That is a useful opening statement from a roster whose owner will presumably still spend the week trying to trade half of it.',
        },
        {
          title: 'The verdict',
          text: 'Joe’s best single bench alternative would not have closed the gap, so this was more bad matchmaking than an obvious selection disaster. Burns was simply better on the week. For Ennis, the sensible response is to take encouragement from the score. The more traditional MAC 12 response is to demand an investigation into the fixture list. Both remain available.',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 3,
    homeRosterId: 6,
    awayRosterId: 10,
    review: {
      version: 1,
      editorial: true,
      publishedAt,
      headline: 'The champion has a Diggs-shaped problem',
      summary:
        'Alan’s title defence begins with Shane taking the win and Stefon Diggs providing some deeply unhelpful reading from the bench. For the man who normally writes the weekly round-up, becoming its easiest material is an unfortunate opening-week development.',
      sections: [
        {
          title: 'Marmion, inconveniently switched on',
          text: 'Shane’s league history contains enough evidence that an engaged Marmion is a problem. Here was another entry. Isaiah Likely and Jaxon Smith-Njigba did the heavy lifting, helping him past a champion who had plenty going right himself. After Shane’s infamous contribution to the 2024 forfeit race, there is a certain poetry in finding him on the happy side of somebody else’s bench story.',
        },
        {
          title: 'The bit Alan would probably edit out',
          text: 'Jahmyr Gibbs and Chris Olave gave Alan a platform worth winning from. The problem is what followed: Jordan Addison returned zero in the flex, while Diggs scored 15.5 on the bench. In hindsight, that one eligible swap would have overturned the 11.5-point defeat. It is not proof the decision was obvious beforehand. It is, however, a fairly merciless screenshot afterwards.',
        },
        {
          title: 'No peace at home, either',
          text: 'One loss does not dismantle a championship team, and Alan scored well enough to beat more than half the league. Shane gets a deserved opening win; Alan gets a selection receipt to live with. Next comes Hugo, who actually does live with him. The defending champion may want to win that one before the post-match analysis becomes a household activity.',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 4,
    homeRosterId: 3,
    awayRosterId: 4,
    review: {
      version: 1,
      editorial: true,
      publishedAt,
      headline: 'Keenan wins. Tommy’s potential remains enormous.',
      summary:
        'Keenan gets his season moving with a comfortable win, while Tommy adds another chapter to the league’s longest-running study of unrealised upside. There is probably an excellent explanation for this result. Unfortunately, explanations still score no points.',
      sections: [
        {
          title: 'Two players brought the heavy machinery',
          text: 'Ashton Jeanty and Christian Watson each supplied 32.7 points for Keenan. Together, they got remarkably close to Tommy’s entire team total. That is quite a double act, and a welcome opening for a manager whose championship credentials have lately required people to look further back in the history books than he would prefer.',
        },
        {
          title: 'The breakout has been rescheduled',
          text: 'Tommy could point to useful work from Rhamondre Stevenson and Garrett Wilson, but there was too little around them. Colston Loveland gave him nothing, and Houston’s defence managed to take points away. The bench contained a better tight-end return, but even that change would have left a substantial defeat. This one needed considerably more than a clever explanation of target share.',
        },
        {
          title: 'A win, with a small-print section',
          text: 'Keenan should enjoy the result without commissioning the comeback documentary just yet: eight other teams would have beaten his score. Still, after consecutive ninth-place finishes, an uncomplicated win is a decent place to start. Tommy gets Karl next. Between the scouting reports and the scheduling complaints, the build-up should be exceptionally well documented.',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 5,
    homeRosterId: 8,
    awayRosterId: 9,
    review: {
      version: 1,
      editorial: true,
      publishedAt,
      headline: 'Hugo turns up the volume',
      summary:
        'The man once sent busking on Grafton Street now has considerably better material. Hugo opens with a convincing win over Jack, whose two biggest names did their jobs and were entitled to wonder where the rest of the help had gone.',
      sections: [
        {
          title: 'A much better opening act',
          text: 'Caleb Williams was the headline attraction, delivering 37.26 points, with David Montgomery providing another big contribution. Hugo also picked up the Waiver Receipt award through Mark Andrews. There were points arriving from several directions, which is a much healthier look than the old hope-that-one-player-saves-us routine. His progress since that miserable debut season continues to look convincing.',
        },
        {
          title: 'Two stars cannot do every shift',
          text: 'Jack got more than 70 points from Josh Allen and Derrick Henry together. Usually, that gives you a very agreeable foundation for a weekend. Here, Hugo still won by 25.5. The supporting cast did not give Jack enough, and his best single bench swap would have barely dented the deficit. This was a defeat that needs a broader response than finding one unfortunate selection to blame.',
        },
        {
          title: 'The household derby is nicely set up',
          text: 'Jack can file this under a disappointing opener rather than a return to the calendar-forfeit years. Hugo, meanwhile, heads into Week 2 unbeaten and facing his housemate, reigning champion Alan. One comes in off a convincing win; the other comes in with a bench regret. There should be absolutely no shortage of balanced, sensitive conversation at home.',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 6,
    homeRosterId: 2,
    awayRosterId: 5,
    review: {
      version: 1,
      editorial: true,
      publishedAt,
      headline: 'Niall remembers the championship setting',
      summary:
        'After going from champion to the Wall of Shame in a year, Niall has opened this season in a rather more agreeable mood. Karl, the preseason favourite, was the first to discover it. His complaints department will be taking calls as normal.',
      sections: [
        {
          title: 'A very different kind of fifty challenge',
          text: 'Niall’s 169 points were the highest total in the league. Kenneth Walker led the way, Trevor Lawrence added plenty, and the overall performance looked much more like the version of Murray that wins things than the one left counting miles, pints and doughnuts. It is only an opener, but after last season this is exactly the sort of evidence he wanted.',
        },
        {
          title: 'Karl can complain, with some justification',
          text: 'Drawing the week’s highest scorer is a fairly reliable way to lose an argument with the fixture list. Bijan Robinson and Trey McBride did their best to keep Karl in it, but a quiet supporting cast left him well short. The defeat ran to more than 42 points; the available bench alternatives were nowhere near a rescue. Niall made this a much bigger assignment than Karl’s lineup could handle.',
        },
        {
          title: 'One week into the comeback',
          text: 'Niall gets the strongest opening statement of the round. Karl gets an immediate test of how much faith to place in the preseason billing. Neither verdict needs to become a season-long prophecy yet. Murray has already demonstrated that the distance between a trophy and a forfeit can be alarmingly short; for now, at least, he is travelling in the right direction.',
        },
      ],
    },
  },
];
