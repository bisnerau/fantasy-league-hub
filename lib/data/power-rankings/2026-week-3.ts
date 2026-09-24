import type { PowerRankingEdition } from '../power-rankings';

// Two completed weeks; Week 2 provides the movement baseline.
export const weekThreePowerRankings: PowerRankingEdition = {
  leagueId: '1389706813993160704',
  season: '2026',
  week: 3,
  throughWeek: 2,
  publishedAt: '2026-09-24T15:25:09Z',
  headline: 'Shane goes top. Sharpe requests a different scoring system.',
  introduction:
    'Two completed weeks: current strength, both results and the latest selected rosters. Shane takes first, Alan and Jack climb, and David discovers that unbeaten does not mean unroastable. Movement compares with Week 2; the points shown are each team’s Week 2 score.',
  entries: [
    {
      rosterId: 10,
      manager: 'Shane Marmion',
      record: '2–0',
      recentPoints: 138.7,
      verdict:
        'Two wins, the most points and Lamar–Lamb–JSN: first place has actual supporting documents. Shane’s main opponent remains the temptation to stop checking once things are going well.',
    },
    {
      rosterId: 6,
      manager: 'Alan Horgan',
      record: '1–1',
      recentPoints: 128.48,
      verdict:
        'Two scores above 128 and a decisive household win move the champion to second. Diggs is starting, Gibbs is dangerous, and Hugo has lost the right to offer breakfast analysis.',
    },
    {
      rosterId: 9,
      manager: 'Jack Ringrose',
      record: '1–1',
      recentPoints: 126.62,
      verdict:
        'Allen, McCaffrey and Henry support the climb after 126.62 dispatched Niall. Pollard needs watching, but Jack has alternatives; third place is even respectable in leagues with more than eight people.',
    },
    {
      rosterId: 2,
      manager: 'Niall Murray',
      record: '1–1',
      recentPoints: 88.96,
      verdict:
        'The running backs keep him fourth, the drop from 169 to 88.96 removes him from first. Evans’ hip limits the depth: the title-to-forfeit specialist remains available in several wildly different settings.',
    },
    {
      rosterId: 3,
      manager: 'Andrew Keenan',
      record: '2–0',
      recentPoints: 110.92,
      verdict:
        'Two wins earn a proper rise, with Barkley, Jeanty and Smith giving the revival substance. The scores are solid rather than dominant; no, Andrew, we are not restoring the 2021 commemorative banner yet.',
    },
    {
      rosterId: 5,
      manager: 'Karl Moroney',
      record: '1–1',
      recentPoints: 99.44,
      verdict:
        'Bijan and McBride sustain the case, but 99.44 against Tommy was a recovery, not a declaration of war. Daniels and Jones missing practice add uncertainty. Sixth should generate a concise, seven-page appeal.',
    },
    {
      rosterId: 8,
      manager: 'Hugo Walsh',
      record: '1–1',
      recentPoints: 93.42,
      verdict:
        'Mahomes is selected and Taylor remains formidable; Bowers’ limited practice leaves a condition attached. Seventh holds after the derby defeat. Progress is real, but apparently so is having to listen to Alan.',
    },
    {
      rosterId: 7,
      manager: 'Joe Ennis',
      record: '0–2',
      recentPoints: 99.26,
      verdict:
        'The receivers and Hurts keep Joe above the record alone, but 0–2 and Nabers’ shoulder concern demand a discount. Eighth is twice his favourite number, which is probably the nicest available interpretation.',
    },
    {
      rosterId: 1,
      manager: 'Emmet Burns',
      record: '1–1',
      recentPoints: 88.4,
      verdict:
        'Dart’s season-ending surgery and Collins’ missed practice expose the depth despite Chase and Kyren. Shough is selected, the receivers are patched together, and the next trade offer may arrive marked urgent.',
    },
    {
      rosterId: 12,
      manager: 'Aidan Murphy',
      record: '0–2',
      recentPoints: 130.46,
      verdict:
        'A 130.46-point response deserves a climb even in defeat; Cook, Adams and Prescott provide a route out. Hunter Henry has been added. We are treating evidence of midseason management as a promising development.',
    },
    {
      rosterId: 11,
      manager: 'David Sharpe',
      record: '2–0',
      recentPoints: 93.42,
      verdict:
        'Two wins, but only Tommy has fewer total points. Achane and Hampton give him more to offer; eleventh reflects the evidence so far. David is welcome to lodge an appeal containing a three-digit score.',
    },
    {
      rosterId: 4,
      manager: 'Tommy O’Brien',
      record: '0–2',
      recentPoints: 72.48,
      verdict:
        'Two scores below 75, with Puka and Coleman missing Wednesday practice, leave the floor alarmingly close. Stafford changes the quarterback; the scouting department is still waiting for permission to count potential as points.',
    },
  ],
  talkingPoints: [
    {
      title: 'Identical records. A 114.92-point difference.',
      text: 'Shane and Sharpe put their unbeaten starts on the line in our Match of the Week. One has been beating good scores; the other has been beating the system.',
      href: '/matchups?week=3#matchup-1',
    },
    {
      title: 'The commissioner needs a replacement part',
      text: 'Dart’s season-ending surgery puts Shough in Burns’ selected lineup. Keenan arrives 2–0 and unlikely to offer a sympathetic trade.',
      href: '/matchups?week=3#matchup-2',
    },
    {
      title: 'The complaints desk cannot take both calls',
      text: 'Karl and Joe are separated by 0.36 projected points. Ennis needs his first win; Moroney needs somebody else to blame. We have narrowly backed Karl.',
      href: '/matchups?week=3#matchup-4',
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
      label: 'Dart surgery and Winston starting: NFL update',
      url: 'https://amp.nfl.com/news/giants-qb-jaxson-dart-season-ending-knee-surgery',
    },
    {
      label: 'Texans Wednesday practice report',
      url: 'https://www.houstontexans.com/team/injury-report/',
    },
    {
      label: 'Giants–Titans Wednesday practice report',
      url: 'https://www.giants.com/team/injury-report/',
    },
    {
      label: 'Rams–Broncos Wednesday practice report',
      url: 'https://www.therams.com/team/injury-report/',
    },
    {
      label: 'Shanahan’s Wednesday injury update',
      url: 'https://49ers.1rmg.com/transcripts/head-coach-kyle-shanahan-press-conference_9-23-26/',
    },
  ],
};
