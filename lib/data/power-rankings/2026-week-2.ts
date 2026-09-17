import type { PowerRankingEdition } from '../power-rankings';

// Editorial assessment entering Week 2; one settled scoring week is available.
// Fresh Sleeper results, rosters, starters and PPR estimates checked 17 September.
// The baseline is the published 6 September final-season forecast, not an
// invented Week 1 power-ranking edition. Preserve this list when adding Week 3.
export const weekTwoPowerRankings: PowerRankingEdition = {
  leagueId: '1389706813993160704',
  season: '2026',
  week: 2,
  throughWeek: 1,
  publishedAt: '2026-09-17T22:03:19.000Z',
  headline: 'Niall goes top. The complaints window is open.',
  introduction:
    'One week of evidence, twelve opinions nobody requested. Murray gets the top spot, Marmion gets credit for switching on, and a win over Murphy does not qualify Sharpe for diplomatic immunity.',
  preseasonBaseline: [
    { rosterId: 5, rank: 1 },
    { rosterId: 1, rank: 2 },
    { rosterId: 7, rank: 3 },
    { rosterId: 6, rank: 4 },
    { rosterId: 2, rank: 5 },
    { rosterId: 10, rank: 6 },
    { rosterId: 11, rank: 7 },
    { rosterId: 9, rank: 8 },
    { rosterId: 12, rank: 9 },
    { rosterId: 4, rank: 10 },
    { rosterId: 8, rank: 11 },
    { rosterId: 3, rank: 12 },
  ],
  entries: [
    {
      rosterId: 2,
      manager: 'Niall Murray',
      record: '1–0',
      recentPoints: 169,
      verdict:
        'Walker, Hall and Brown give the week’s top scorer a proper foundation; after last year’s fifty challenge, Niall has finally found something sensible to count.',
    },
    {
      rosterId: 10,
      manager: 'Shane Marmion',
      record: '1–0',
      recentPoints: 147.66,
      verdict:
        'Beating the champion with Lamar, Lamb and JSN in the side earns second place; maintaining it will involve the historically difficult step of opening the app again.',
    },
    {
      rosterId: 5,
      manager: 'Karl Moroney',
      record: '0–1',
      recentPoints: 126.66,
      verdict:
        'Bijan, Bucky and McBride keep Karl near the top despite drawing 169 points against; for once his scheduling complaint has survived independent inspection.',
    },
    {
      rosterId: 1,
      manager: 'Emmet Burns',
      record: '1–0',
      recentPoints: 158.1,
      verdict:
        'A strong opener keeps Burns in contention, but availability concerns weaken the selected Week 2 side; expect a trade offer explaining why this is actually your problem.',
    },
    {
      rosterId: 6,
      manager: 'Alan Horgan',
      record: '0–1',
      recentPoints: 136.16,
      verdict:
        'Gibbs and Javonte keep the champion dangerous, and Diggs has reached the starting lineup; apparently the title did not come with instructions for operating the bench.',
    },
    {
      rosterId: 7,
      manager: 'Joe Ennis',
      record: '0–1',
      recentPoints: 139.02,
      verdict:
        'Jefferson, Amon-Ra and Nabers deserve respect, but the running backs still have work to do; sixth leaves Joe two places below his preferred parking space.',
    },
    {
      rosterId: 8,
      manager: 'Hugo Walsh',
      record: '1–0',
      recentPoints: 156.06,
      verdict:
        'A convincing win earns a big climb, tempered by McConkey and Bowers’ practice concerns; Hugo’s rise from Grafton Street now comes with a medical appendix.',
    },
    {
      rosterId: 9,
      manager: 'Jack Ringrose',
      record: '0–1',
      recentPoints: 130.56,
      verdict:
        'Allen, McCaffrey and Henry keep the ceiling high while the supporting cast catches up; Jack remains eighth, which used to be the entire league.',
    },
    {
      rosterId: 3,
      manager: 'Andrew Keenan',
      record: '1–0',
      recentPoints: 120.24,
      verdict:
        'Jeanty and Watson buy Keenan three places of breathing room, but one win over Tommy does not authorise a commemorative reissue of the 2021 trophy.',
    },
    {
      rosterId: 11,
      manager: 'David Sharpe',
      record: '1–0',
      recentPoints: 78.02,
      verdict:
        'Achane and Hampton offer a recovery route, but 78 points earns tenth here; the standings may accept payment in Murphy fixtures, this list requires a little more.',
    },
    {
      rosterId: 4,
      manager: 'Tommy O’Brien',
      record: '0–1',
      recentPoints: 74.46,
      verdict:
        'Puka and Garrett Wilson keep hope alive, while the backfield and an opening 74.46 keep it under supervision; Tommy’s potential remains comfortably ahead of his points.',
    },
    {
      rosterId: 12,
      manager: 'Aidan Murphy',
      record: '0–1',
      recentPoints: 57,
      verdict:
        'Cook and London give Murphy a way back, but 57 points and defeat to Sharpe leave him bottom; the draft-once subscription appears to have expired.',
    },
  ],
  talkingPoints: [
    {
      title: 'The comeback has a number: 169',
      text: 'Niall tops the first power rankings. Four places up from the preseason forecast, and temporarily unavailable for doughnut-related questions.',
      href: '/power-rankings?season=2026&week=2',
    },
    {
      title: 'Joe’s complaint comes with evidence',
      text: '139.02 points bought Ennis an opening defeat. The Week 1 reports explain exactly who got away with what.',
      href: '/matchups?week=1#matchup-2',
    },
    {
      title: 'Someone’s explanation is going 0–2',
      text: 'Tommy meets Karl. Between the scouting reports and the scheduling grievances, the loser’s statement should be ready well before kickoff.',
      href: '/matchups?week=2#matchup-5',
    },
  ],
  sources: [
    {
      label: 'Week 1 Sleeper results',
      url: 'https://api.sleeper.app/v1/league/1389706813993160704/matchups/1',
    },
    {
      label: 'Current league rosters',
      url: 'https://sleeper.com/leagues/1389706813993160704/matchup',
    },
    {
      label: 'Chargers–Raiders practice report',
      url: 'https://www.chargers.com/news/raiders-injury-report-ladd-mcconkey-fantasy',
    },
  ],
};
