import type { MatchupNewsletter } from '../matchup-newsletters';

// Thursday evening research, before DET–BUF at 00:15 UTC on 18 September.
// Exact Sleeper starters, PPR projections, Week 1 scores and completed Week 2
// transactions were retrieved on 17 September. See docs/research/2026-week-2.md.
// Keep these original projections and winner calls when adding the reviews.
const week = { leagueId: '1389706813993160704', season: '2026', week: 2 };
const publishedAt = '2026-09-17T21:19:46.125Z';
const sleeper = {
  label: 'Sleeper lineups',
  url: 'https://sleeper.com/leagues/1389706813993160704/matchup',
};
const injuries = {
  label: 'NFL injury report',
  url: 'https://amp.nfl.com/injuries/',
};
const thursday = {
  label: 'Thursday NFL updates',
  url: 'https://amp.nfl.com/news/nfl-news-roundup-latest-league-updates-from-thursday-sept-17',
};
const chargers = {
  label: 'Chargers–Raiders practice report',
  url: 'https://www.chargers.com/news/raiders-injury-report-ladd-mcconkey-fantasy',
};
const niners = {
  label: '49ers coach’s injury update',
  url: 'https://49ers.1rmg.com/transcripts/head-coach-kyle-shanahan-press-conference_9-16-26/',
};

export const weekTwoReports: MatchupNewsletter[] = [
  {
    ...week,
    sleeperMatchupId: 1,
    homeRosterId: 1,
    awayRosterId: 11,
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 11,
      homeProjection: 108.9,
      awayProjection: 115.66,
      headline: 'Sharpe’s next escape route runs through the commissioner',
      summary:
        'Burns scored more than twice David’s total last week. Both got one win. Now the Thursday estimates favour Sharpe, which feels like an administrative error the commissioner ought to have prevented.',
      sections: [
        {
          title: 'The receipt has an awkward small print',
          text: 'David’s 78.02-point opener was enough to beat Murphy and almost nobody else. This assignment is rather less forgiving. Achane, Hampton and Tetairoa McMillan give him a credible route to a proper score, while Rashee Rice remains in the starting side. Sharpe also added Chris Brooks on Wednesday. The set-and-forget department has, at least briefly, opened for business.',
        },
        {
          title: 'Burns has some moving parts',
          text: 'Nico Collins is on the bench in the recorded lineup, with Carnell Tate starting. Collins was limited by a hamstring issue in Wednesday’s official report; Thursday’s NFL update says his availability is in doubt. Swift was also limited on Thursday. That leaves Chase, Kyren Williams and Jaxson Dart carrying much of the commissioner’s argument, with the latter two playing each other on Monday night. There is still plenty of time for Burns to make this everyone else’s business.',
        },
        {
          title: 'The call: David Sharpe',
          text: 'David, narrowly. The current PPR estimate gives him roughly seven points of breathing room, and his selected lineup has fewer immediate availability concerns. Burns has enough bench quality to change the picture, especially if Collins clears. On the team actually recorded tonight, however, Sharpe gets the nod. Two wins would be an outrageous return on last week’s investment.',
        },
      ],
      sources: [
        sleeper,
        thursday,
        {
          label: 'Bengals–Texans practice report',
          url: 'https://www.bengals.com/news/texans-bengals-injury-report-week-2-2026',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 2,
    homeRosterId: 10,
    awayRosterId: 12,
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 10,
      homeProjection: 121.1,
      awayProjection: 110.14,
      headline: 'Murphy could do with turning it off and on again',
      summary:
        'Shane opened by beating the champion. Aidan opened with 57 points. The league’s most dependable passenger now needs a response against a manager who is considerably more dangerous when he remembers to participate.',
      sections: [
        {
          title: 'The champion collection continues',
          text: 'Marmion has Lamar Jackson, CeeDee Lamb and Jaxon Smith-Njigba in the same starting side. That is a persuasive answer to most matchup questions. There is a complication for JSN: Seattle have ruled out Sam Darnold, with Drew Lock starting in Arizona. The projection still likes Shane, but treating every receiver estimate as business as usual would be generous.',
        },
        {
          title: 'A different tight-end decision',
          text: 'George Kittle is starting for Shane, while last week’s standout Isaiah Likely is on the bench. Kittle was limited with his Achilles issue in the 49ers’ Wednesday update, so that choice still needs watching. Murphy’s first chance to repair the mood comes through James Cook in tonight’s Bills–Lions game. Dak Prescott then faces Washington, while Drake London and Kyle Pitts offer a chance for Atlanta to improve Aidan’s Sunday considerably. Another Pitts zero would be testing the draft-day faith rather severely.',
        },
        {
          title: 'The call: Shane Marmion',
          text: 'Shane to make it two wins. His roughly eleven-point projected advantage has enough support across the lineup to survive a merely ordinary performance from one star. Murphy can absolutely recover from one ugly opener; the problem is that his opponent has rather more ways to win this particular game. Autopilot may need a destination change.',
        },
      ],
      sources: [
        sleeper,
        niners,
        {
          label: 'Seattle confirms Drew Lock will start',
          url: 'https://amp.nfl.com/news/seahawks-sam-darnold-out-week-2-drew-lock-cardinals',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 3,
    homeRosterId: 3,
    awayRosterId: 7,
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 7,
      homeProjection: 112.79,
      awayProjection: 119.49,
      headline: 'Joe requests a result to go with the performance',
      summary:
        'Ennis outscored Keenan last week and has the worse record. A direct meeting offers a convenient appeals process. Keenan would prefer the league to recognise that winning is a skill, particularly when Tommy is available.',
      sections: [
        {
          title: 'One win does not settle the comeback',
          text: 'Keenan got 32.7 points apiece from Ashton Jeanty and Christian Watson in the opener. Asking both to repeat that is a fairly demanding weekly business plan. Jeanty was a full participant on the Raiders’ Wednesday report despite an ankle listing, which is encouraging. Saquon Barkley and DeVonta Smith join him in the selected lineup, both facing Tennessee. There is enough here to make Joe earn his first win.',
        },
        {
          title: 'Ennis gets a useful update',
          text: 'TreVeyon Henderson practiced fully again on Thursday after missing Week 1. That gives Joe a more encouraging picture at running back alongside Cam Skattebo. The glamour remains at receiver: Jefferson and Amon-Ra, with Malik Nabers in the flex. Amon-Ra and Sam LaPorta play tonight, so this contest could acquire a substantial first impression before either manager has finished preparing his excuses. Keenan’s Barkley–Smith pairing and Joe’s Jalen Hurts also make the Eagles game a shared source of celebration and irritation.',
        },
        {
          title: 'The call: Joe Ennis',
          text: 'Joe, with his receiver depth and Hurts giving him the slightly stronger overall case. The estimates separate them by under seven points, so this is no procession. Keenan can absolutely spoil the appeal; Ennis simply gets the better argument this time. It would be nice if the points department could finally forward it to the results department.',
        },
      ],
      sources: [sleeper, chargers, thursday],
    },
  },
  {
    ...week,
    sleeperMatchupId: 4,
    homeRosterId: 6,
    awayRosterId: 8,
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 6,
      homeProjection: 128.45,
      awayProjection: 114.43,
      headline: 'One roof. Two lineups. An unbearable winner.',
      summary:
        'Hugo and Alan live together. Hugo is unbeaten, Alan is the defending champion, and only one of them has spent the week looking at Stefon Diggs’ bench points. The household derby arrives with its own editorial material.',
      sections: [
        {
          title: 'Alan has located the Diggs button',
          text: 'Diggs is now in Alan’s flex, with Jordan Addison on the bench. That will not recover last week’s defeat, but it does remove the most obvious opening line from Tuesday’s report. Jahmyr Gibbs plays tonight and supplies the largest individual estimate in this matchup. Alan has also swapped Minnesota’s defence for New England. There is evidence of actual management, which is an inconvenient development for anyone hoping to recycle the same joke.',
        },
        {
          title: 'The practice reports get a room too',
          text: 'Burrow’s back and Olave’s limited practice listing need watching for Alan; Burrow said on Wednesday that he expects to play. Hugo has his own concern: McConkey missed Wednesday with a rib injury and remains in the recorded flex. Brock Bowers also missed that practice with a knee issue, although Mark Andrews is already Hugo’s selected tight end. Caleb Williams, Jonathan Taylor and David Montgomery still give the challenger a very respectable way to make home life difficult.',
        },
        {
          title: 'The call: Alan Horgan',
          text: 'Alan to level their records. Gibbs and Javonte Williams give him a strong starting point, and the current estimate favours him by about fourteen. That call assumes Burrow and Olave are available; neither practice concern has been wished away. Hugo has the form, but Alan gets the narrow ownership rights to the kitchen conversation.',
        },
      ],
      sources: [
        sleeper,
        chargers,
        injuries,
        {
          label: 'Burrow’s Wednesday update',
          url: 'https://www.bengals.com/news/quick-hits-big-game-joe-burrow-says-he-ll-be-ready-for-this-one-vs-afc-south-power-texans',
        },
      ],
    },
  },
  {
    ...week,
    sleeperMatchupId: 5,
    homeRosterId: 4,
    awayRosterId: 5,
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 5,
      homeProjection: 105.35,
      awayProjection: 130.35,
      headline: 'Potential meets the complaints department',
      summary:
        'Tommy and Karl both need a first win. Between them, the explanation for any defeat should be immaculate. Karl brings the stronger Thursday lineup; Tommy brings Puka Nacua and the continuing possibility that this is finally the week.',
      sections: [
        {
          title: 'A kinder appointment for Karl',
          text: 'Moroney drew Niall’s league-leading 169 points in the opener. Tommy’s 74.46 presents a rather different recent reference point, although last week’s scores cannot play this week’s fixture. Bijan Robinson and Bucky Irving lead Karl’s backfield, with Aaron Jones in the flex. That is a substantial problem for an opponent starting Bhayshul Tuten, Rhamondre Stevenson and Kyle Monangai. Karl’s scheduling grievance may have to take the weekend off.',
        },
        {
          title: 'There is a route for Tommy',
          text: 'Nacua and Garrett Wilson give O’Brien the sort of receiver pairing that can overturn a sensible preview. He needs Colston Loveland to contribute after the opening zero, too. The current roster has A.J. Brown on injured reserve, and Wednesday’s Antonio Williams pickup is on the bench. Monangai was limited on Thursday; Karl should also watch Trey McBride after a missed-practice listing in the latest NFL report. Those are checks to make, not declarations that either will miss Sunday.',
        },
        {
          title: 'The call: Karl Moroney',
          text: 'Karl. The 25-point gap in the recorded PPR estimates is the widest of the six fixtures, and his running-back depth gives the forecast a convincing explanation. Tommy needs his receivers to make it a very bad week for explanations. It can happen, but this is the strongest call on the board. Moroney may finally have to discuss a win without mentioning the schedule.',
        },
      ],
      sources: [sleeper, injuries, thursday],
    },
  },
  {
    ...week,
    sleeperMatchupId: 6,
    homeRosterId: 2,
    awayRosterId: 9,
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 2,
      homeProjection: 113.58,
      awayProjection: 119.6,
      headline: 'Niall’s revival gets the premium-cut inspection',
      summary:
        'Murray opened with the league’s biggest score. Ringrose opened by discovering that Josh Allen and Derrick Henry cannot cover every shift. The estimates lean Jack; this report is backing Niall to make that awkward.',
      sections: [
        {
          title: 'The early shift belongs to Jack',
          text: 'Allen, Jameson Williams and Dalton Kincaid all feature in tonight’s Bills–Lions game. That gives Jack three immediate opportunities to set the mood, although sharing one game also ties a sizeable piece of his lineup to the same evening. Christian McCaffrey faces Miami on Sunday. His Wednesday absence was a rest day, according to Kyle Shanahan, so there is no basis for inventing a new injury scare from that listing.',
        },
        {
          title: 'Murray has a different shape',
          text: 'Chase Brown and Breece Hall occupy Niall’s running-back slots, with Kenneth Walker in the flex after helping drive that 169-point opener. The worry is whether Mike Evans and Parker Washington supply enough alongside them. Trevor Lawrence and Washington share the trip to Denver, so Murray has some concentration of his own. He also picked up Eddy Piñeiro on Wednesday; Shanahan said the kicker was ill and would miss practice. A useful reminder that even a new kicker comes with homework.',
        },
        {
          title: 'The call: Niall Murray',
          text: 'Niall, in the week’s deliberate underdog pick. Jack’s estimate is six points higher, but Murray’s three-running-back core and stronger opening performance persuade me to take the other side of a close one. Allen could make that look foolish before Friday breakfast. After last season’s forfeit, though, Niall has earned one preview that backs the comeback. The receipt stays here either way.',
        },
      ],
      sources: [sleeper, injuries, niners],
    },
  },
];
