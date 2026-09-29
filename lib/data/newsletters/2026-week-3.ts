import type { MatchupNewsletter } from '../matchup-newsletters';

// Published 24 September before ATL–GB; prose revised at the commissioner’s request.
// Original publication time, estimates and winner calls remain frozen.
// Waiver evidence spans Sleeper rounds 2 and 3: docs/research/2026-week-3-waivers.json.
export const weekThreeReports: MatchupNewsletter[] = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 1,
    homeRosterId: 10,
    awayRosterId: 11,
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-29T14:46:33Z',
      headline: 'Sharpe’s unbeaten record fails its first background check',
      summary:
        'Shane 157.90, David 80.16. The Match of the Week ended with a 77.74-point gap and a serious question about the selection committee. Two unbeaten managers arrived. Only one appeared to have brought a football team.',
      sections: [
        {
          title: 'The references were, as suspected, terrible',
          text: 'Thursday’s preview pointed out that Sharpe had reached 2–0 without scoring 100. We wondered what would happen when somebody asked him to earn the win. Shane has now supplied the answer, in writing, with attachments. David’s third consecutive sub-100 score finally met an opponent who refused to participate in the arrangement. The free trial has expired.',
        },
        {
          title: 'Shane brings enough for two',
          text: 'Smith-Njigba, Lamb and Kittle combined for 81.76: more than David’s entire lineup. Marmion still had six other starters to count, which feels excessive. Michael Wilson supplied 25.9 for Sharpe, while Maye, Achane and Hampton managed 11.06 between them. Wilson was essentially trying to move a sofa with three lads who kept saying they had a bad back.',
        },
        {
          title: 'Match of the Week, technically',
          text: 'We picked Shane and got it right. We also promoted this as the week’s main event, so let’s not get carried away with the expertise. Marmion goes to 3–0; Sharpe slips to 2–1 with the same scoring problem his wins had concealed. Shane’s biggest test now is remaining interested long enough to use this team. Jack, for entirely historical reasons, would appreciate a weekly reminder on his phone.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-24T15:25:09Z',
      pickRosterId: 10,
      homeProjection: 133.96,
      awayProjection: 113.93,
      headline:
        'Sharpe brings a perfect record. Please do not ask for references.',
      summary:
        'Shane has scored 114.92 more points than David. Both are 2–0. Our Match of the Week is a job interview between a qualified candidate and a man whose uncle knows the owner.',
      sections: [
        {
          title: 'Two wins, no visible means of support',
          text: 'Marmion beat Alan and then the week’s second-highest scorer. Sharpe beat Murphy’s 57 and Burns’ 88.40. Shane’s JSN–Lamb pairing scored 77.8 last week; David’s entire opening team managed 78.02. The standings cannot distinguish between these achievements. This is why we also have a report.',
        },
        {
          title: 'David discovers the Add Player button',
          text: 'Sharpe claimed Jordan Love for zero FAAB and dropped Rachaad White on Wednesday. Love is benched behind Maye in our snapshot, so this is currently a free upgrade to the waiting room. Shane has no completed acquisition since Tuesday in the checked feeds. With Lamar, Lamb and JSN, doing nothing looks sensible. When David does it, we usually have to check whether his phone still works. Coker’s ankle limited him Wednesday; that flex spot needs attention.',
        },
        {
          title: 'The call: Shane Marmion',
          text: 'Shane, with roughly twenty points of projected breathing room. Achane and Hampton give David a proper route to an upset, but his third win may require the distressing experience of scoring well. If Sharpe reaches 3–0 without breaking 100, we should stop publishing power rankings and start publishing the names of whoever keeps approving his planning applications.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 lineups',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
        {
          label: 'Sleeper Week 2 results',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
        {
          label: 'Panthers Wednesday practice report',
          url: 'https://www.panthers.com/team/injury-report/',
        },
        {
          label: 'Wednesday waiver claims (Sleeper round 2 feed)',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/2',
        },
        {
          label: 'Week 3 free-agent moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 2,
    homeRosterId: 1,
    awayRosterId: 3,
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-29T14:46:33Z',
      headline: 'Burns builds entire website to confirm he lost by 0.36',
      summary:
        'There are easier ways to find out Keenan has beaten you than building him a personalised results service, but Burns has always been thorough. A 0.36-point defeat, delivered through his own website. Presumably the next update will include a cookie banner asking Andrew to fuck off.',
      sections: [
        {
          title: 'The recruitment department requests an apology',
          text: 'Thursday’s preview mocked Burns for spending 36 FAAB and briefly employing Bryce Young. Unfortunately for everyone enjoying that, Tyler Shough actually delivered: 23.8 points, comfortably outscoring Keenan’s cheaper Jared Goff. The recruitment department would like an apology. The results department would like another 0.37.',
        },
        {
          title: 'Even the passengers get three wins',
          text: 'Chase and Kyren did their jobs too. Keenan survived thanks to Fannin and Watson combining for 46.7, while his 49ers defence contributed one solitary point. Even the passengers on Andrew’s team get three wins on their CV. That sends Keenan to 3–0 after consecutive ninth-place finishes. Three weeks of competence following two years of evidence to the contrary. Expect the 2021 championship to start appearing in conversations again, with the number of teams involved quietly omitted.',
        },
        {
          title: 'Free hosting for Andrew’s happiness',
          text: 'We backed Keenan. Technically, excellent analysis. In practice, we missed being idiots by less than four rushing yards. Burns falls to 1–2 and must now publish this himself. Six straight playoff appearances, an all-time record to be proud of, and this week his main contribution to MAC 12 is providing free web hosting for Andrew’s happiness.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-24T15:25:09Z',
      pickRosterId: 3,
      homeProjection: 109.13,
      awayProjection: 117.27,
      headline:
        'Burns pays eight for a quarterback trial. Keenan pays five to watch.',
      summary:
        'The commissioner spent 36 FAAB across four Wednesday claims, then released one of them by lunchtime. Keenan spent five on Goff. One man is recruiting a quarterback; the other appears to be running an airport.',
      sections: [
        {
          title: 'Bryce Young: employee of the morning',
          text: 'Burns paid 15 for Shough, eight for Bryce Young, seven for Emanuel Wilson and six for Wicks. About four and a half hours later, Young was dropped for Adonai Mitchell. Eight FAAB for a morning on the roster: even Dublin parking offers a more generous daily rate. Dart’s season-ending surgery makes the quarterback search necessary. It does not explain why Young needed a visitor badge.',
        },
        {
          title: 'Keenan buys a slightly newer argument',
          text: 'Keenan paid five for Goff and dropped Bo Nix; Goff starts against the Jets. Burns starts Shough, Wicks and Mitchell, while Collins remains benched after Wednesday’s hamstring absence. Watson goes tonight for Keenan; Barkley and Smith face Burns’ Swift and Wicks on Monday. Sleeper’s Barkley flag remains a watch item, not a final Monday designation. The estimates put Keenan just over eight ahead, which Burns could afford if points were sold at auction.',
        },
        {
          title: 'The call: Andrew Keenan',
          text: 'Keenan. Chase gives Burns a serious escape route, but the replacement receivers need to produce more than transaction notifications. Andrew at 3–0 would be insufferable. Burns at 1–2 would have to maintain the website explaining why. There are no innocent parties here, only different ways for the group chat to win.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 lineups',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
        {
          label: 'Sleeper Week 2 results',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
        {
          label: 'Dart surgery and Winston starting: NFL update',
          url: 'https://amp.nfl.com/news/giants-qb-jaxson-dart-season-ending-knee-surgery',
        },
        {
          label: 'Texans Wednesday practice report',
          url: 'https://www.houstontexans.com/team/injury-report/',
        },
        {
          label: 'Wednesday waiver claims (Sleeper round 2 feed)',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/2',
        },
        {
          label: 'Week 3 free-agent moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 3,
    homeRosterId: 8,
    awayRosterId: 12,
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-29T14:46:33Z',
      headline:
        'Hugo pays ten for a defence. Murphy finds one in the reduced aisle.',
      summary:
        'Hugo spent ten FAAB on Cincinnati. Murphy paid one for Minnesota. The cheaper defence scored 17 to the expensive one’s three, and Aidan won 129.94–102.04. Somewhere, a man is explaining that you have to pay for quality. Hugo should stop listening to him.',
      sections: [
        {
          title: 'The receipt does not look promising',
          text: 'Thursday’s preview described Hugo’s defensive purchase as paying eleven strangers to restore his dignity. They returned three points. That is less a restoration than a man arriving at your house, looking at the damage and charging a call-out fee. Minnesota’s 17 did not account for the entire 27.90-point margin, but it did make the shopping comparison particularly unpleasant.',
        },
        {
          title: 'Murphy discovers that winning is available',
          text: 'London and Adams combined for 49.1, with James Cook adding 19.4. After two defeats, Aidan finally has a win to show for a roster that also scored well last week. Bowers gave Hugo 27.6 and Higgins added 21; enough to establish that some work was being done, nowhere near enough to get everyone else excused. Both managers leave 1–2. Only one has paid a premium for the experience.',
        },
        {
          title: 'Our expert recommendation is non-refundable',
          text: 'We picked Hugo. Wrong. Murphy made the better defensive purchase and won comfortably, which is awkward for a report that spent Thursday questioning whether he knew how to operate the app. Joe Ennis has his own problems this week, so Aidan is welcome to take full credit. Hugo can take the receipt home. After losing the household derby last week, he may prefer to hide it from Alan.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-24T15:25:09Z',
      pickRosterId: 8,
      homeProjection: 122.18,
      awayProjection: 112.45,
      headline: 'Hugo spends ten on defence. Alan remains in the house.',
      summary:
        'After losing the household derby, Hugo paid ten FAAB for Cincinnati’s defence. An understandable attempt to improve security, although it will do absolutely nothing about Alan walking into the kitchen.',
      sections: [
        {
          title: 'The busking proceeds have been reinvested',
          text: 'Hugo dropped Green Bay for Cincinnati on Wednesday and has Mahomes selected ahead of Caleb Williams. Bowers replaces Andrews, with Taylor still the main attraction after 29.2 last week. Taylor and Bowers were limited in the latest practice report; neither has a final Sunday verdict here. It is a stronger-looking response than the 93.42 against Alan. Ten on a defence is a fairly expensive way to ask eleven strangers to restore your dignity.',
        },
        {
          title: 'Murphy has completed the tutorial',
          text: 'Aidan paid one for Minnesota’s defence, replaced Mevis with Trey Smack for zero, then added Hunter Henry and dropped Tyjae Spears. All three arrivals are selected. Three moves after two defeats: apparently the app sends a notification when the autopilot hits a mountain. Pitts is benched, London plays tonight and Adams visits Denver. The roster that scored 130.46 last week has enough quality to recover without Joe having to log another support ticket.',
        },
        {
          title: 'The call: Hugo Walsh',
          text: 'Hugo, with about ten projected points in hand and Mahomes improving the outlook at quarterback. Murphy has a credible chance, especially if Adams goes enormous again. But somebody is paying for last week’s embarrassment, and we are backing the man who has already paid ten to outsource the job.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 lineups',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
        {
          label: 'Sleeper Week 2 results',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
        {
          label: 'NFL Week 3 practice report',
          url: 'https://amp.nfl.com/injuries/',
        },
        {
          label: 'Wednesday waiver claims (Sleeper round 2 feed)',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/2',
        },
        {
          label: 'Week 3 free-agent moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 4,
    homeRosterId: 5,
    awayRosterId: 7,
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-29T14:46:33Z',
      headline: 'Joe’s fourth-place ceiling is now a wildly optimistic target',
      summary:
        'Karl won 131.34–71.62. Thursday’s projected gap was 0.36; Tuesday’s actual gap was 59.72. Joe’s team looked excellent on paper. Unfortunately, the league continues to insist on playing the matches.',
      sections: [
        {
          title: 'Karl withdraws his complaint',
          text: 'Bijan supplied 35.3, almost half Joe’s entire total. McLaurin, McBride and Pickens gave Karl enough support to make this thoroughly uneventful. After opening against Niall’s 169, Moroney has been handed Tommy and Joe in succession. The schedule has now apologised twice. Any further correspondence should be marked resolved.',
        },
        {
          title: 'The names are still very impressive',
          text: 'Hurts, Jefferson, Amon-Ra and Nabers remain a lovely collection of names to read aloud. Jefferson’s 5.2 and Nabers’ 7.6 were less enjoyable to add up. Joe finished with the week’s lowest score and drops to 0–3. Three consecutive fourth-place finishes used to be the joke. At this point he would need a hot streak and a favourable reference just to get back to being mocked for those.',
        },
        {
          title: 'Bryce Young survives his probation elsewhere',
          text: 'We backed Karl and he moves to 2–1. There is an extra indignity for Burns: Bryce Young, whose brief stay on the commissioner’s roster featured heavily in Thursday’s report, started for Karl and supplied 13.64. Apparently he can hold down a job when someone lets him finish the induction. Joe, meanwhile, replaced his defence before this game. After 71.62, the investigation may need to extend beyond that department.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-24T15:25:09Z',
      pickRosterId: 5,
      homeProjection: 124.32,
      awayProjection: 124.68,
      headline: 'Karl and Joe open a joint practice in fantasy litigation',
      summary:
        'The projected gap is 0.36 points. Karl blames the schedule. Joe has the receivers. By Tuesday, one of them will have assembled a case so detailed that the league will consider settling just to stop the messages.',
      sections: [
        {
          title: 'The Tommy discount has expired',
          text: 'Karl has no completed acquisition since Tuesday in the checked feeds. After getting his first win against Tommy, he has apparently decided the equipment works perfectly when tested on suitable material. Mayfield starts for Daniels, who missed Wednesday practice. Bijan plays tonight; McBride and Bucky provide the foundation. Aaron Jones also missed practice and remains selected. That is one genuine concern. Karl will supply the supplementary bundle himself.',
        },
        {
          title: 'Ennis replaces the security staff',
          text: 'Joe claimed Carolina’s defence for zero FAAB and dropped Baltimore. When a team containing Hurts, Amon-Ra, Jefferson and Nabers starts 0–2, somebody has to lose their job. Apparently it was the defence. Henderson is back alongside Skattebo; Nabers was limited Wednesday with his shoulder and will have Winston starting at quarterback. Joe’s usual fourth-place ceiling is currently several floors above him. The lift has not been responding.',
        },
        {
          title: 'The call: Karl Moroney',
          text: 'Karl, narrowly, despite Joe’s fractional projected edge. Bijan and McBride get the vote over the more uncertain receiver situation. Ennis can overturn that easily enough, but we need a name on the form. Whichever way it goes, the loser should remember that screenshots of projections are not admissible evidence and shouting “on paper” does not add any points.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 lineups',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
        {
          label: 'Sleeper Week 2 results',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
        {
          label: 'NFL Week 3 practice report',
          url: 'https://amp.nfl.com/injuries/',
        },
        {
          label: 'Giants–Titans Wednesday practice report',
          url: 'https://www.giants.com/team/injury-report/',
        },
        {
          label: 'Dart surgery and Winston starting: NFL update',
          url: 'https://amp.nfl.com/news/giants-qb-jaxson-dart-season-ending-knee-surgery',
        },
        {
          label: 'Wednesday waiver claims (Sleeper round 2 feed)',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/2',
        },
        {
          label: 'Week 3 free-agent moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 5,
    homeRosterId: 2,
    awayRosterId: 6,
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-29T14:46:33Z',
      headline:
        'Alan’s title defence is making the old jokes harder to maintain',
      summary:
        'Alan beat Niall 147.68–105.88. Two former champions met; one looked interested in another title, the other got his second-highest score from a kicker. The weekly report would like to thank Jahmyr Gibbs for making the distinction straightforward.',
      sections: [
        {
          title: 'Gibbs takes the meeting himself',
          text: 'Gibbs scored 41.4. The winning margin was 41.80. That does not mean Alan fielded one player, but it does mean Niall could identify the principal problem without commissioning an inquiry. Burrow, Burden and Olave supplied plenty around him. The man once sent to Belfast for a Titanic tour now owns a championship and a 2–1 record. It is becoming increasingly inconvenient for everyone who enjoyed the first four seasons.',
        },
        {
          title: 'Fourteen FAAB buys six points',
          text: 'Murray’s new tight end Dalton Schultz returned six. That beat benched Goedert’s zero, so technically the upgrade worked; the invoice remains open to discussion. Shrader’s 17 and Walker’s 21.3 provided more substantial help. Niall has followed his 169-point opener with two defeats. The championship-to-forfeit range is still available, apparently selected afresh every Sunday.',
        },
        {
          title: 'The exit interview is cancelled',
          text: 'We backed Alan despite Niall’s narrow projected edge, and this one required considerably less sweating than the Keenan call. Thursday’s preview wondered whether dropping New England’s defence would embarrass the champion. Detroit contributed seven and Alan won comfortably, so the attempted joke has been withdrawn through lack of evidence. Niall falls to 1–2. Alan gets another week of being annoyingly good at the hobby we used to enjoy watching him fail at.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-24T15:25:09Z',
      pickRosterId: 6,
      homeProjection: 125.61,
      awayProjection: 122.93,
      headline: 'Niall buys a tight end. Alan sacks the employee of the week.',
      summary:
        'Niall paid fourteen FAAB for Dalton Schultz. Alan dropped the defence that had just scored 21. Between them, the last two champions are providing an excellent demonstration of why past performance comes with a disclaimer.',
      sections: [
        {
          title: 'Fourteen to stop reading Goedert’s score',
          text: 'Murray dropped Rashid Shaheed for Schultz, who starts ahead of Goedert. He also replaced Piñeiro with Spencer Shrader and Tampa Bay’s defence with Buffalo. After falling from 169 to 88.96, Niall has changed enough small parts to claim the warranty is void. Walker, Brown and Hall remain the engine. Waddle starts with Evans sidelined from Wednesday practice by his hip; Schultz’s own Wednesday absence was explicitly rest.',
        },
        {
          title: 'Thank you for your service. Clear your locker.',
          text: 'New England supplied 21 in Alan’s derby win. He has released them for Detroit. Football management can be cruel, but sacking your defence immediately after it outscored most of the roster suggests the champion’s annual reviews are quite demanding. Gibbs, Olave and the now-starting Diggs give him a strong core; Kraft plays tonight. At least Diggs knows he can score points and still be allowed back next week. Probably.',
        },
        {
          title: 'The call: Alan Horgan',
          text: 'Alan, despite Niall’s 2.68-point projected edge. Two solid scoring weeks and Gibbs–Olave earn the nod. Murray’s running backs can flip it, and Schultz could justify the spending immediately. If Alan loses because of the defence, however, New England are entitled to provide their exit interview entirely through laughing emojis.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 lineups',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
        {
          label: 'Sleeper Week 2 results',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
        {
          label: 'Shanahan’s Wednesday injury update',
          url: 'https://49ers.1rmg.com/transcripts/head-coach-kyle-shanahan-press-conference_9-23-26/',
        },
        {
          label: 'Texans Wednesday practice report',
          url: 'https://www.houstontexans.com/team/injury-report/',
        },
        {
          label: 'Wednesday waiver claims (Sleeper round 2 feed)',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/2',
        },
        {
          label: 'Week 3 free-agent moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
        },
      ],
    },
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 3,
    sleeperMatchupId: 6,
    homeRosterId: 4,
    awayRosterId: 9,
    review: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-29T14:46:33Z',
      headline:
        'Tommy’s rebuild is now accepting applications for its first win',
      summary:
        'Jack won 113.86–105.60. Tommy finally cleared 100 and still lost, which is the fantasy equivalent of passing your driving test and reversing into the examiner. Progress has been recorded. Nobody is celebrating.',
      sections: [
        {
          title: 'The prospectus contains some actual points',
          text: 'Garrett Wilson delivered 26.7, Stafford 20.9 and Tuten 17. For the first time this season, Tommy produced a total that did not require the reader to turn the screen brightness up and check for a missing digit. Sixteen-FAAB arrival Denzel Boston chipped in 8.1. Useful, though perhaps not enough to justify the inevitable director’s commentary on his long-term development.',
        },
        {
          title: 'Jack continues buying things that work',
          text: 'McCaffrey and Henry combined for 43.5. Jack’s newly added Matt Gay supplied 11, more than the final 8.26-point margin. That is not proof the kicker alone won it; it is merely irritating that Ringrose can spend the week shopping for a kicker while Tommy appears to be completing a postgraduate qualification in roster construction. The veteran backs did the heavy lifting. The lampshade from Thursday’s preview worked too.',
        },
        {
          title: 'A better defeat is still a defeat',
          text: 'We picked Jack and he goes to 2–1. Tommy is 0–3, although this was his most competitive effort yet. The youth project has shown signs of life; the league table has declined to award course credit. Five correct calls from six for our previews, with Murphy the sole objection. Tommy can take encouragement from the improvement. Jack will take the win, which remains the more popular option.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 results and recorded player points',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
      ],
    },
    preview: {
      version: 1,
      editorial: true,
      publishedAt: '2026-09-24T15:25:09Z',
      pickRosterId: 9,
      homeProjection: 102.74,
      awayProjection: 125.78,
      headline: 'Tommy pays sixteen for more potential. Jack buys a kicker.',
      summary:
        'Tommy’s 146.94 points across two weeks did not persuade him to abandon the youth project. He submitted the week’s highest winning bid for Denzel Boston instead. The rebuild has now secured additional funding.',
      sections: [
        {
          title: 'The scouting department approves its own budget',
          text: 'Sixteen FAAB brought Boston in; Kenyon Sadiq went out. Boston starts in the flex, Stafford replaces Herbert and Puka remains selected alongside him. Nacua missed Wednesday practice, as did starting back Jonah Coleman with an ankle issue. Neither absence is a final exclusion. Tommy needs a response quickly: the roster is beginning to resemble a university prospectus. Excellent facilities, exciting futures, nobody earning anything yet.',
        },
        {
          title: 'Jack orders from the grown-up menu',
          text: 'Ringrose claimed the Giants’ defence for zero, releasing the Chargers, then added Matt Gay and dropped Tyrone Tracy on Thursday. Allen, McCaffrey and Henry remain the expensive furniture; Jack is merely replacing a lampshade. McCaffrey had a Wednesday rest day. Pollard’s ankle kept him out of practice and needs watching; Reed is benched and ruled out tonight. There are options here without needing Tommy’s six-part lecture on the 2029 upside.',
        },
        {
          title: 'The call: Jack Ringrose',
          text: 'Jack, by the logic of a roughly twenty-three-point projected edge and players who have already demonstrated the concept of scoring. Tommy can spring an upset, but he has yet to reach 75 in either week. At sixteen FAAB, Boston does not need to become a star immediately. He does need to establish that this is a football team rather than a scholarship programme.',
        },
      ],
      sources: [
        {
          label: 'Sleeper Week 3 lineups',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/3',
        },
        {
          label: 'Sleeper Week 2 results',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/2',
        },
        {
          label: 'Rams–Broncos Wednesday practice report',
          url: 'https://www.therams.com/team/injury-report/',
        },
        {
          label: 'Giants–Titans Wednesday practice report',
          url: 'https://www.giants.com/team/injury-report/',
        },
        {
          label: 'Shanahan’s Wednesday injury update',
          url: 'https://49ers.1rmg.com/transcripts/head-coach-kyle-shanahan-press-conference_9-23-26/',
        },
        {
          label: 'NFL Week 3 practice report',
          url: 'https://amp.nfl.com/injuries/',
        },
        {
          label: 'Wednesday waiver claims (Sleeper round 2 feed)',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/2',
        },
        {
          label: 'Week 3 free-agent moves',
          url: 'https://api.sleeper.app/v1/league/1389706813993160704/transactions/3',
        },
      ],
    },
  },
];
