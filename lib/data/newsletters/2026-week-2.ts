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
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-22T10:57:39Z',
      headline: 'Sharpe is 2–0. The complaints desk is downstairs.',
      summary:
        'David has two wins and very little reason to change his methods. Burns has a website, a busy trade inbox and a defeat to a man who has now won twice without reaching 100. The commissioner has accidentally built Sharpe a publicity department.',
      sections: [
        {
          title: 'The minimum viable victory',
          text: 'Sharpe won by 5.02 points, the tightest margin of the round. Omarion Hampton supplied 17.5, with useful contributions spread around the lineup rather than one enormous rescue act. After last week’s 78.02-point escape, 93.42 almost counts as extravagance. David is improving at precisely the speed required to irritate everyone who spends longer thinking about this.',
        },
        {
          title: 'Chase cannot run the entire league as well',
          text: 'Ja’Marr Chase gave Burns 26.5, but Jaxson Dart returned 0.8 and the commissioner finished on 88.40. That is a sharp drop from his opening win. A good receiver can cover a lot; apparently he cannot also do the quarterback’s shift, answer the trade offers and maintain the standings page.',
        },
        {
          title: 'The call survives. Burns does not.',
          text: 'We backed Sharpe narrowly, and narrowly is how he delivered. David joins the unbeaten group while Burns drops to 1–1. Two modest winning totals are hardly proof of a championship machine, but the head-to-head table is not accepting essays about how hard anybody tried. Burns can propose an exchange of three bench players for a better mood. David should decline.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 2 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 11,
      homeProjection: 108.9,
      awayProjection: 115.66,
      headline: 'David discovers you can win twice without learning anything',
      summary:
        'Burns scored more than twice David’s total last week and got the same head-to-head win. Now Sharpe is projected to beat him. The commissioner has built an entire website just to have this information displayed in public.',
      sections: [
        {
          title: 'The bar was on the floor. Murphy brought a shovel.',
          text: 'David won with 78.02 points. That is less a statement of intent than a clerical loophole. Achane, Hampton, Tetairoa McMillan and Rashee Rice give him a credible chance of earning this one. He even added Chris Brooks on Wednesday. A waiver move from Sharpe: somewhere, a phone has been taken off battery saver.',
        },
        {
          title: 'Burns considers offering someone three bench players',
          text: 'Collins is benched for Carnell Tate in the recorded lineup. His hamstring limited him on Wednesday, and Thursday’s update leaves his availability in doubt. Swift was also limited on Thursday. Chase, Kyren Williams and Dart therefore carry much of the case, with Kyren and Dart facing each other on Monday. Burns has time to improve things, which means the rest of the league has time to receive a trade offer that mainly improves things for Burns.',
        },
        {
          title: 'The call: David Sharpe',
          text: 'David, narrowly. His selected lineup has fewer immediate availability concerns and roughly seven points of projected breathing room. Collins clearing could change Burns’ outlook, but the recorded team favours Sharpe. If David reaches 2–0 after that opener, the commissioner should introduce a minimum-effort requirement. Unfortunately, he would have to enforce it against a man beating him.',
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-22T10:57:39Z',
      headline: 'Marmion wins the shootout. Murphy finally has a complaint.',
      summary:
        'Aidan more than doubled his opening score and still lost. Shane produced the week’s highest total, leaving Murphy with a much better performance and exactly the same number of wins. Sometimes even checking the scoreboard feels like unnecessary effort.',
      sections: [
        {
          title: 'Two receivers, one very large invoice',
          text: 'Jaxon Smith-Njigba scored 42.5 and CeeDee Lamb added 35.3. Together they supplied 77.8 points, comfortably more than Tommy’s entire team. Shane needed the quality: his 138.70 beat the week’s second-highest scorer. This was a proper win, not a case of Marmion being rewarded for remembering which app to open.',
        },
        {
          title: 'The auto-renewal remains pending',
          text: 'Davante Adams answered with 39.5 and Dak Prescott with 29.76 for Murphy. His 130.46 would have beaten ten other teams; the only unsuitable opponent was the one provided. After losing with 57 in Week 1, this is a far more respectable route to misery. Karl may have to share the scheduling complaints desk.',
        },
        {
          title: 'Right winner, much harder assignment',
          text: 'Our Shane call held, by 8.24 points, but the preview’s jokes about Murphy’s recovery now look considerably less comfortable. Marmion is 2–0 after beating Alan and Aidan; Murphy is 0–2 despite a major response. The playoff standing order is not cancelled in September. It does, however, need a payment to clear soon.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 2 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 10,
      homeProjection: 121.1,
      awayProjection: 110.14,
      headline: 'Murphy’s auto-renewal has been declined',
      summary:
        'Shane beat the champion. Aidan scored 57. For years Murphy has treated the playoffs like a standing order; apparently the bank would now like him to provide proof of football knowledge.',
      sections: [
        {
          title: 'Marmion has remembered what the app is for',
          text: 'Lamar Jackson, CeeDee Lamb and Jaxon Smith-Njigba give Shane a serious lineup when he is paying attention. That last clause has historically done some heavy lifting. JSN does have a complication: Darnold is ruled out and Drew Lock starts in Arizona. Shane remains the favourite, but Seattle changing quarterbacks is worth more consideration than his traditional troubleshooting method of leaving it until Tuesday.',
        },
        {
          title: 'Aidan could try asking Joe again',
          text: 'Kittle starts for Shane ahead of last week’s standout Likely, despite being limited with his Achilles issue in Wednesday’s update. That needs watching. Murphy gets James Cook tonight, Prescott against Washington, and London and Pitts against Carolina. There is a recovery available here. Pitts returning another zero would be particularly unhelpful: Aidan already has a manager contributing nothing to the research department, so he cannot afford duplication at tight end.',
        },
        {
          title: 'The call: Shane Marmion',
          text: 'Shane to go 2–0. His roughly eleven-point projected advantage rests on enough quality to survive one ordinary performance. Aidan’s season is hardly finished after one defeat, but the usual plan of drafting once and reappearing in the playoffs needs immediate maintenance. Joe has picked a team for him before. At what point does that become an ongoing support contract?',
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-22T10:57:39Z',
      headline: 'Keenan’s comeback documentary gets a second episode',
      summary:
        'We picked Joe. Keenan won anyway, which is becoming an unhelpful habit for anyone trying to keep the 2021 stories under control. Ennis is 0–2, and his customary pursuit of fourth place has begun with a considerable detour.',
      sections: [
        {
          title: 'A different supporting cast',
          text: 'This was not a repeat of Jeanty and Watson producing matching monster scores. DeVonta Smith led Keenan with 27.7, while Brandon Aubrey supplied 16 from kicker. Saquon Barkley returned just three, yet the team still reached 110.92. Winning without everything working is encouraging. Keenan will presumably prefer the interpretation that his genius is finally being recognised.',
        },
        {
          title: 'Joe’s receivers do not vote as a bloc',
          text: 'Amon-Ra St. Brown delivered 35.2 for Ennis, but Justin Jefferson and Malik Nabers combined for 9.6. The receiver group we backed to decide the fixture instead produced one excellent argument and two unhelpful footnotes. Joe finished on 99.26, leaving an 11.66-point defeat. Unlike last week, this was not a strong score ambushed by one of the league’s best.',
        },
        {
          title: 'An apology for doubting the archive',
          text: 'Our call was wrong: Keenan goes to 2–0 and Joe is still waiting. Beating Tommy alone did not justify announcing a revival; adding Ennis gives the evidence a little more weight. There is plenty left to prove, but Keenan has earned another week of referring people to his trophy. Joe has earned the right to stop reading this report.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 2 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 7,
      homeProjection: 112.79,
      awayProjection: 119.49,
      headline: 'Joe demands a win. Keenan demands we remember 2021.',
      summary:
        'Ennis outscored Keenan last week and still has the worse record. Keenan beat Tommy, which counts as a win under the rules even if it feels a bit like finding money in a coat.',
      sections: [
        {
          title: 'The comeback documentary remains in development',
          text: 'Jeanty and Watson supplied 32.7 points each for Keenan. The repeat-performance plan is straightforward: ask two players to have another enormous week and describe it as management. Jeanty practiced fully on Wednesday despite an ankle listing. Barkley and DeVonta Smith both face Tennessee. There is real quality here, but one win over Tommy does not mean we need the extended edition of Keenan’s 2021 championship speech.',
        },
        {
          title: 'Fourth place will not pursue itself',
          text: 'Henderson practiced fully again on Thursday after missing Week 1, improving Joe’s outlook alongside Skattebo. Jefferson, Amon-Ra and Nabers give him a formidable receiver group. Amon-Ra and LaPorta play tonight, so he could establish an early lead while still composing the complaint about last week. Joe’s Hurts and Keenan’s Barkley–Smith pairing also make the Eagles game a shared interest. Both want Philadelphia touchdowns; each would prefer the other’s players to be fetching water.',
        },
        {
          title: 'The call: Joe Ennis',
          text: 'Joe, thanks to the receivers and Hurts. The projected gap is under seven points, so Keenan has every chance of ruining another perfectly reasonable Ennis performance. Still, this looks like Joe’s route to a first win. His long-term ambition of finishing fourth deserves a start, and someone has to stop Keenan using a win over Tommy as evidence that the glory years are back.',
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-22T10:57:39Z',
      headline: 'Alan wins the house. Hugo keeps the same address.',
      summary:
        'The champion has his first win and the household derby has its verdict. Alan beat Hugo by 35.06 points, a margin large enough to make avoiding the subject at home a fairly ambitious project. Our inaugural Match of the Week delivered a very clear owner of the bragging rights.',
      sections: [
        {
          title: 'The bench lesson has been completed',
          text: 'Stefon Diggs scored 21.7 in Alan’s starting lineup after becoming the unfortunate symbol of his Week 1 defeat from the bench. Jahmyr Gibbs added 23.3 and Chris Olave 22.6. New England’s defence, another change noted in the preview, supplied 21. Alan reached 128.48 through several useful decisions. The reigning champion would probably describe that as normal service. We have retained last week’s report.',
        },
        {
          title: 'Taylor cannot pay everybody’s rent',
          text: 'Jonathan Taylor gave Hugo 29.2, but Caleb Williams followed his huge opener with 7.72 and David Montgomery returned 4.4. Hugo’s 93.42 was never enough against this final total. One good running back can keep a team respectable; he cannot remove the other manager from the kitchen. After an encouraging opening win, Walsh has been given a much less enjoyable subject for household conversation.',
        },
        {
          title: 'The trophy is available for comment',
          text: 'We backed Alan with an estimated fourteen-point advantage; he won by more than twice that. Both housemates are now 1–1, so this settles the derby rather than the season. Hugo’s wider progress survives one defeat. Alan’s immediate problem was avoiding 0–2 while living with the man responsible, and he solved it emphatically. Expect the championship trophy to remain relevant to absolutely everything.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 2 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 6,
      homeProjection: 128.45,
      awayProjection: 114.43,
      headline: 'The household derby: loser still has to go home',
      summary:
        'Hugo and Alan live together, so muting the group chat will achieve absolutely nothing. Hugo has the form. Alan has the trophy. Whoever wins will be available for comment in every room.',
      sections: [
        {
          title: 'Alan discovers that bench points do not count',
          text: 'Diggs is in the flex and Addison is on the bench. A major tactical breakthrough from the reigning champion, who spent Week 1 providing evidence for his own match report. Gibbs plays tonight and has the biggest individual estimate in the fixture. Alan has also replaced Minnesota’s defence with New England. He is making changes. Whether this is a title defence or a man desperately trying to avoid being slagged in his own kitchen remains unclear.',
        },
        {
          title: 'The injury report may need its own key',
          text: 'Burrow’s back and Olave’s limited practice listing need watching; Burrow said Wednesday he expects to play. Hugo has McConkey in the flex after Wednesday’s rib-related absence. Bowers also missed practice with a knee issue, although Andrews is already starting. Caleb Williams, Taylor and Montgomery keep Hugo dangerous. He could send the champion to 0–2 without even paying for transport to the gloating.',
        },
        {
          title: 'The call: Alan Horgan',
          text: 'Alan, assuming Burrow and Olave are available. Gibbs and Javonte Williams help build a projected advantage of about fourteen points. Hugo can overturn it, but the champion gets the call. If Alan wins, expect the trophy to become relevant to conversations it has absolutely no business being in. If Hugo wins, Alan may discover why most match reporters do not share accommodation with their subject.',
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-22T10:57:39Z',
      headline: 'Karl gets a win. Tommy gets more research to do.',
      summary:
        'The fixture list finally supplied Karl with an opponent he could handle. Tommy scored even less than in his opener, which takes some doing when the opener was already central to the prosecution. The potential remains exciting. The table remains unimpressed.',
      sections: [
        {
          title: 'An apology accepted, with reservations',
          text: 'Karl’s 99.44 was enough for a 26.96-point win. Trey McBride led him with 18.1, and there was enough elsewhere to finish the job without a spectacular individual return. After drawing Niall’s 169 in Week 1, Moroney was entitled to enjoy a quieter assignment. He may still submit a complaint, but this time it will need a different subject.',
        },
        {
          title: 'The upside has not reached the scoreboard',
          text: 'Tommy finished on 72.48, the lowest total of the week. Puka Nacua’s recorded zero and Colston Loveland’s 1.3 left enormous holes around Garrett Wilson’s 16.7. Those numbers describe the damage, not why it happened. The result is the same for O’Brien: another week in which knowing what a player might become has proved less useful than owning what somebody else already is.',
        },
        {
          title: 'The obvious call stayed obvious',
          text: 'We backed Karl on the slate’s largest projected advantage, and the final margin was close to the forecast gap. He gets to 1–1; Tommy is 0–2 with consecutive scores below 75. September is early for forfeit talk, but a man with two previous appearances should recognise the warning signs. The next breakout would be particularly useful if it happened in his starting lineup.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 2 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 5,
      homeProjection: 105.35,
      awayProjection: 130.35,
      headline: 'Tommy and Karl present: Twelve Angry Excuses',
      summary:
        'One man knows exactly why his players should be better. The other knows exactly why his opponents should be worse. Somehow, despite this combined expertise, somebody is leaving 0–2.',
      sections: [
        {
          title: 'Karl receives a fixture he may struggle to complain about',
          text: 'Niall hit Karl with a league-leading 169 last week. Tommy arrives off 74.46. The schedule has offered Moroney an apology, flowers and a lift home. Bijan, Bucky Irving and flex starter Aaron Jones give him a substantial backfield advantage over Tuten, Stevenson and Monangai. Tommy can explain the upside of all three. Karl would probably settle for the points.',
        },
        {
          title: 'The breakout is running slightly behind schedule',
          text: 'Puka Nacua and Garrett Wilson give Tommy a real route to an upset. Loveland needs to help after his opening zero; a detailed understanding of his potential will only sustain morale for so long. A.J. Brown is on injured reserve and Wednesday pickup Antonio Williams is benched. Monangai was limited Thursday; Karl should watch McBride after a missed-practice listing. Neither is declared out. For once, both managers have something useful to monitor instead of rehearsing their closing arguments.',
        },
        {
          title: 'The call: Karl Moroney',
          text: 'Karl. His 25-point projected advantage is the largest on the slate, with the running backs doing much of the convincing. Tommy needs his receivers to blow it open. If he wins, we will all be expected to attend a lecture on why it was obvious. If Karl loses, nobody is getting out of the group chat without reading a full inquiry into the circumstances.',
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
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-22T10:57:39Z',
      headline: 'Jack declines our expert opinion',
      summary:
        'We deliberately picked Niall against the projections. Jack responded with a 37.66-point win, which is a fairly thorough peer review. Murray’s 169-point opener has been followed by 88.96: the championship setting appears to have an extremely sensitive switch.',
      sections: [
        {
          title: 'Allen makes the editorial department look silly',
          text: 'Josh Allen scored 40.82 and Dalton Kincaid added 22.5 for Jack. Christian McCaffrey supplied another 22.6, giving Ringrose the kind of support his opening defeat lacked. He finished on 126.62. The inaugural champion may have won his trophy in an eight-team league, but this was a perfectly convincing performance in the current one.',
        },
        {
          title: 'Three running backs need somebody to throw',
          text: 'Kenneth Walker gave Niall 23.8, so the running-back core behind our underdog call was not entirely imaginary. Trevor Lawrence’s 6.16 and Dallas Goedert’s 1.4 left too much for it to cover. Last week Murray led the entire league. This week nine managers outscored him. Consistency remains a development project, albeit one with a championship and a forfeit already on the CV.',
        },
        {
          title: 'The underdog pick owes Jack an apology',
          text: 'Our Niall call was wrong. The preview explicitly identified Allen as the man who could expose it, and his final return did exactly that. Both managers are now 1–1. Jack has a convincing response to his opener; Niall has a reminder that one enormous week does not establish a trend. Four correct calls from six leaves the report with a respectable record and two managers entitled to send it back.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 2 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt,
      pickRosterId: 2,
      homeProjection: 113.58,
      awayProjection: 119.6,
      headline: 'Niall tries counting points instead of doughnuts',
      summary:
        'Murray’s 169-point opener suggests the championship settings are back on. Jack brings the league’s inaugural trophy, won when there were eight managers and considerably fewer obstacles to feeling important.',
      sections: [
        {
          title: 'Jack orders three portions of Thursday night',
          text: 'Allen, Jameson Williams and Kincaid all play in Bills–Lions tonight. That could establish a serious lead or give Jack one concentrated evening of asking why they keep throwing to the wrong bloke. McCaffrey faces Miami on Sunday. Shanahan confirmed his Wednesday absence was rest, so there is no new injury scare to manufacture. Jack needs points, not a support group formed around the letters DNP.',
        },
        {
          title: 'The fifty challenge has been replaced by a useful number',
          text: 'Niall starts Chase Brown and Breece Hall, with Kenneth Walker in the flex after helping drive that 169-point opener. Evans and Parker Washington need to supply enough around them. Lawrence and Washington share the Denver trip, so Niall also has points travelling together. He added Piñeiro on Wednesday, only for Shanahan’s update to explain that the kicker was ill. Even Murray’s smallest recruitment decision has arrived with an absence note.',
        },
        {
          title: 'The call: Niall Murray',
          text: 'Niall, our deliberate underdog pick. Jack leads the estimates by six, but Murray’s three-running-back core and stronger opener persuade me to back him. Allen could make this look stupid before Friday breakfast. That is the risk. Niall went from champion to forfeit in a year; two good weeks would be a welcome sign that his next public achievement might involve sitting down and eating a normal number of doughnuts.',
        },
      ],
      sources: [sleeper, injuries, niners],
    },
  },
];
