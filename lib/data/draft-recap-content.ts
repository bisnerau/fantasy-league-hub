export type DraftRecapPick = {
  round: number;
  overall: number;
  player: string;
  position: string;
  nflTeam: string;
};

export type DraftRecapSpotlight = {
  player: string;
  detail: string;
};

export type DraftRecapEntry = {
  rosterId: number;
  managerName: string;
  teamName: string;
  avatar: string | null;
  draftSlot: number;
  grade: string;
  gradeScore: number;
  rubricScores: {
    startingLineup: number;
    value: number;
    construction: number;
    depth: number;
    risk: number;
  };
  predictedFinish: number;
  headline: string;
  summary: string;
  bestPick: DraftRecapSpotlight;
  biggestConcern: DraftRecapSpotlight;
  seasonOutlook: string;
  leinsterComparison: {
    player: string;
    detail: string;
  };
  picks: DraftRecapPick[];
};

export type DraftRecapContent = {
  published: boolean;
  season: number;
  generatedAt: string | null;
  overview: string;
  methodology: string;
  sources: Array<{
    label: string;
    url: string;
    category:
      | 'ADP'
      | 'Expert rankings'
      | 'NFL news'
      | 'Leinster'
      | 'Projections';
  }>;
  entries: DraftRecapEntry[];
};

// Frozen preseason report. Correct factual errors without rewriting the forecast.
export const draftRecapContent: DraftRecapContent = {
  published: true,
  season: 2026,
  generatedAt: '2026-09-06T11:52:37.217480+00:00',
  overview:
    '180 picks. Twelve competing theories. Karl gets the narrow nod, the commissioner gets work to do, and several managers get a reminder that draft night is only the beginning.',
  methodology:
    'Checked 6 September 2026 against the completed Sleeper draft: 12 teams, 15 rounds, 180 picks. Full-PPR redraft; one QB, two RBs, two WRs, one TE, one RB/WR flex, kicker, team defence and six bench places; four points per passing TD. Each roster receives the same editorial rubric: starters 30, value 25, construction 20, depth/upside 15, risk 10. Higher risk scores mean fewer concerns. Grades are roster-only; the projected final season finish also considers the published MAC 12 manager histories. This is a judgement, not a simulated probability or an expert endorsement. Value review uses FantasyPros’ multi-host consensus ADP order, positional order and the players actually available at each pick, alongside FantasyPros ECR, RotoBaller and CBS full-PPR boards. The public ADP display did not expose decimal averages for the whole pool, so the review uses ordered consensus positions and does not claim exact average-pick savings. Expert disagreement is retained. Public season projections were available for ten players per offensive position; missing projections were not invented or treated as zero. Those projections supplement the complete rankings rather than form a complete team-points model. Bye weeks and Sleeper availability flags were reviewed; confirmed NFL/team reports take precedence, and a preseason questionable flag is not a confirmed absence. Kicker/defence prices receive less weight because they are replaceable weekly. Leinster analogies are editorial comparisons of playing style, not current fitness assessments. The final table and publication timestamp are frozen for the end-of-season comparison.',
  sources: [
    {
      label:
        'FantasyPros PPR consensus ADP (five hosts; order from draft-board data)',
      url: 'https://www.fantasypros.com/nfl/adp/ppr-overall.php',
      category: 'ADP',
    },
    {
      label: 'FantasyPros full-PPR expert consensus',
      url: 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php',
      category: 'Expert rankings',
    },
    {
      label: 'RotoBaller PPR board — 4 September',
      url: 'https://www.rotoballer.com/top-400-fantasy-football-ppr-draft-rankings-september-update-2026/1923132',
      category: 'Expert rankings',
    },
    {
      label: 'CBS PPR consensus — 5 September',
      url: 'https://www.cbssports.com/fantasy/football/rankings/ppr/top200/',
      category: 'Expert rankings',
    },
    {
      label: 'FantasyPros public QB season projections',
      url: 'https://www.fantasypros.com/nfl/projections/qb.php?week=draft&scoring=PPR',
      category: 'Projections',
    },
    {
      label: 'FantasyPros public RB season projections',
      url: 'https://www.fantasypros.com/nfl/projections/rb.php?week=draft&scoring=PPR',
      category: 'Projections',
    },
    {
      label: 'FantasyPros public WR season projections',
      url: 'https://www.fantasypros.com/nfl/projections/wr.php?week=draft&scoring=PPR',
      category: 'Projections',
    },
    {
      label: 'FantasyPros public TE season projections',
      url: 'https://www.fantasypros.com/nfl/projections/te.php?week=draft&scoring=PPR',
      category: 'Projections',
    },
    {
      label: 'NFL: Jacobs remains on exempt list — 1 September',
      url: 'https://amp.nfl.com/news/packers-express-hope-rb-josh-jacobs-currently-on-exempt-list-can-play-sometime-this-season',
      category: 'NFL news',
    },
    {
      label: 'NFL: Lloyd’s opening opportunity — 3 September',
      url: 'https://amp.nfl.com/news/packers-rb-marshawn-lloyd-i-m-ready-to-play-as-much-as-they-want-me-to-play',
      category: 'NFL news',
    },
    {
      label: 'Saints: Tyson on IR, designated to return — 30 August',
      url: 'https://www.neworleanssaints.com/news/new-orleans-saints-53-man-roster-cut-transactions-august-30-2026-nfl-season',
      category: 'NFL news',
    },
    {
      label: 'Seahawks: opening roster and Charbonnet reserve/PUP — 30 August',
      url: 'https://www.seahawks.com/news/seahawks-make-roster-moves-including-trade-to-establish-initial-53-man-roster',
      category: 'NFL news',
    },
    {
      label: 'NFL: current Week 1 report',
      url: 'https://www.nfl.com/injuries/',
      category: 'NFL news',
    },
    {
      label: 'Leinster senior squad directory',
      url: 'https://www.leinsterrugby.ie/teams/mens-senior/',
      category: 'Leinster',
    },
    {
      label: 'IRFU: verified Leinster 2026 team',
      url: 'https://www.irishrugby.ie/2026/05/22/obrien-included-in-unchanged-leinster-team-to-face-bordeaux/amp/',
      category: 'Leinster',
    },
    {
      label: 'Leinster: Sexton captaincy',
      url: 'https://www.leinsterrugby.ie/2018/08/07/johnny-sexton-named-leinster-rugby-captain/',
      category: 'Leinster',
    },
    {
      label: 'Leinster: Nacewa farewell',
      url: 'https://www.leinsterrugby.ie/2018/05/29/isa-nacewa-this-is-it-this-is-goodbye/',
      category: 'Leinster',
    },
  ],
  entries: [
    {
      rosterId: 1,
      managerName: 'Emmet Burns',
      grade: 'B',
      predictedFinish: 2,
      headline: 'The commissioner has left himself some work to do.',
      summary:
        'Chase and Collins give Burns a proper PPR foundation. Waiting for Dart and Kelce let him keep buying running backs and receivers, but Kyren at 27 was a price the expert boards did not unanimously endorse. Price, Tate and Stribling make the bench exciting rather than dependable. This is a competitive draft with room for the commissioner’s usual unsolicited trade offers. Somewhere, Burns is already drafting a message that begins ‘hear me out’ and ends with your best running back joining Burns XI. Taking Kelce late gives him a veteran sounding board for the only person in MAC 12 who reads the rules recreationally. If the rookies hit, it was meticulous scouting; if they miss, expect a discreet proposal to expand the benches.',
      bestPick: {
        player: 'Nico Collins',
        detail:
          'Pick 22 secured a receiver inside the top 21 on all three expert boards. A strong partner for Chase without spending the next turn on a quarterback.',
      },
      biggestConcern: {
        player: 'Jaxson Dart',
        detail:
          'Dart is the only drafted quarterback, with no elite positional advantage to offset the uncertainty behind the starting receivers. Kyren and Price also share a Week 11 bye; four drafted running backs leave little slack.',
      },
      seasonOutlook:
        'Second is a forecast of the whole Burns operation, not a claim that this was the second-best draft. Six straight playoff appearances and persistent waiver activity earn him a sizeable lift over the roster’s fifth-best grade. The raw material is here. So, inevitably, is a trade offer involving three of his bench players for your best starter.',
      leinsterComparison: {
        player: 'Johnny Sexton',
        detail:
          'The organiser who expects every detail to run through him. Chase and Collins supply the attacking shape; the commissioner will spend the season telling everyone else where they should have been standing.',
      },
      gradeScore: 83,
      rubricScores: {
        startingLineup: 25,
        value: 20,
        construction: 17,
        depth: 13,
        risk: 8,
      },
      teamName: 'Burns XI',
      avatar: 'https://sleepercdn.com/uploads/2a61160ab8327137facb55509f0e0b80',
      draftSlot: 3,
      picks: [
        {
          round: 1,
          overall: 3,
          player: "Ja'Marr Chase",
          position: 'WR',
          nflTeam: 'CIN',
        },
        {
          round: 2,
          overall: 22,
          player: 'Nico Collins',
          position: 'WR',
          nflTeam: 'HOU',
        },
        {
          round: 3,
          overall: 27,
          player: 'Kyren Williams',
          position: 'RB',
          nflTeam: 'LAR',
        },
        {
          round: 4,
          overall: 46,
          player: "D'Andre Swift",
          position: 'RB',
          nflTeam: 'CHI',
        },
        {
          round: 5,
          overall: 51,
          player: 'Jadarian Price',
          position: 'RB',
          nflTeam: 'SEA',
        },
        {
          round: 6,
          overall: 70,
          player: 'Carnell Tate',
          position: 'WR',
          nflTeam: 'TEN',
        },
        {
          round: 7,
          overall: 75,
          player: 'Marvin Harrison',
          position: 'WR',
          nflTeam: 'ARI',
        },
        {
          round: 8,
          overall: 94,
          player: "De'Zhaun Stribling",
          position: 'WR',
          nflTeam: 'SF',
        },
        {
          round: 9,
          overall: 99,
          player: 'Jaxson Dart',
          position: 'QB',
          nflTeam: 'NYG',
        },
        {
          round: 10,
          overall: 118,
          player: 'Travis Kelce',
          position: 'TE',
          nflTeam: 'KC',
        },
        {
          round: 11,
          overall: 123,
          player: 'Mike Washington',
          position: 'RB',
          nflTeam: 'LV',
        },
        {
          round: 12,
          overall: 142,
          player: 'Chris Bell',
          position: 'WR',
          nflTeam: 'MIA',
        },
        {
          round: 13,
          overall: 147,
          player: 'Juwan Johnson',
          position: 'TE',
          nflTeam: 'NO',
        },
        {
          round: 14,
          overall: 166,
          player: 'Pittsburgh Steelers',
          position: 'DEF',
          nflTeam: 'PIT',
        },
        {
          round: 15,
          overall: 171,
          player: 'Evan McPherson',
          position: 'K',
          nflTeam: 'CIN',
        },
      ],
    },
    {
      rosterId: 2,
      managerName: 'Niall Murray',
      grade: 'B-',
      predictedFinish: 5,
      headline: 'The hangover cure starts with three running backs.',
      summary:
        "Brown, Walker and Hall fill both running-back spots and the flex without requiring a rookie breakthrough. Waddle, Evans and Washington offer different routes to receiving production, although Waddle at 35 was earlier than the ADP order suggested. Lawrence and Goedert were sensible late solutions. There is more practical depth here than glamour. Three early running backs is a perfectly reasonable response to discovering that a championship defence can end in competitive doughnut consumption. The team name still advertises Mahomes while Trevor Lawrence actually does the job, which is the fantasy equivalent of leaving the previous owner's sign above the pub. Niall has drafted enough sensible cover to suggest he would very much like his next pint to be optional.",
      bestPick: {
        player: 'Josh Downs',
        detail:
          'At 107, Downs came after both FantasyPros and RotoBaller placed him inside their top 90. A useful PPR bench receiver for a team that invested heavily in running backs early.',
      },
      biggestConcern: {
        player: 'Mike Evans',
        detail:
          'The receiver group lacks an undisputed top-tier anchor. Evans and Waddle need to justify prominent roles, while a Lawrence–Washington pairing concentrates some weekly outcomes in Jacksonville.',
      },
      seasonOutlook:
        'Fifth feels like a recovery that still leaves something to prove. Murray’s engagement and 2024 title justify backing him to improve the roster during the year; the 2025 wooden spoon prevents a coronation. The 50 Challenge is excellent motivation to keep checking the waiver wire.',
      leinsterComparison: {
        player: 'Jack Conan',
        detail:
          'A direct, powerful carrying game: Brown, Walker and Hall do the hard metres before anyone asks for a highlight reel. The comparison is about this roster’s sturdy centre, not last year’s finishing position.',
      },
      gradeScore: 82,
      rubricScores: {
        startingLineup: 25,
        value: 19,
        construction: 18,
        depth: 12,
        risk: 8,
      },
      teamName: 'Mahomes-lander n The Boys',
      avatar:
        'https://sleepercdn.com/uploads/27af3364785ff591ddfc7a540d02d6f0.jpg',
      draftSlot: 11,
      picks: [
        {
          round: 1,
          overall: 11,
          player: 'Chase Brown',
          position: 'RB',
          nflTeam: 'CIN',
        },
        {
          round: 2,
          overall: 14,
          player: 'Kenneth Walker',
          position: 'RB',
          nflTeam: 'KC',
        },
        {
          round: 3,
          overall: 35,
          player: 'Jaylen Waddle',
          position: 'WR',
          nflTeam: 'DEN',
        },
        {
          round: 4,
          overall: 38,
          player: 'Breece Hall',
          position: 'RB',
          nflTeam: 'NYJ',
        },
        {
          round: 5,
          overall: 59,
          player: 'Mike Evans',
          position: 'WR',
          nflTeam: 'SF',
        },
        {
          round: 6,
          overall: 62,
          player: 'Parker Washington',
          position: 'WR',
          nflTeam: 'JAX',
        },
        {
          round: 7,
          overall: 83,
          player: 'Rico Dowdle',
          position: 'RB',
          nflTeam: 'PIT',
        },
        {
          round: 8,
          overall: 86,
          player: 'Trevor Lawrence',
          position: 'QB',
          nflTeam: 'JAX',
        },
        {
          round: 9,
          overall: 107,
          player: 'Josh Downs',
          position: 'WR',
          nflTeam: 'IND',
        },
        {
          round: 10,
          overall: 110,
          player: 'Dallas Goedert',
          position: 'TE',
          nflTeam: 'PHI',
        },
        {
          round: 11,
          overall: 131,
          player: 'Rashid Shaheed',
          position: 'WR',
          nflTeam: 'SEA',
        },
        {
          round: 12,
          overall: 134,
          player: 'Keaton Mitchell',
          position: 'RB',
          nflTeam: 'LAC',
        },
        {
          round: 13,
          overall: 155,
          player: 'Jacksonville Jaguars',
          position: 'DEF',
          nflTeam: 'JAX',
        },
        {
          round: 14,
          overall: 158,
          player: 'Tyler Loop',
          position: 'K',
          nflTeam: 'BAL',
        },
        {
          round: 15,
          overall: 179,
          player: "Tre' Harris",
          position: 'WR',
          nflTeam: 'LAC',
        },
      ],
    },
    {
      rosterId: 3,
      managerName: 'Andrew Keenan',
      grade: 'C',
      predictedFinish: 12,
      headline: 'A Green Bay insurance policy with several exclusions.',
      summary:
        'Smith and Flowers were good recoveries after Barkley and Jeanty cost more than the three-board consensus supported. Fannin at 106 helps, but Lloyd and Jacobs are not two independent sources of backfield security. Spending on a second quarterback while finishing without a defence creates an immediate roster decision. The starters can compete; the construction is the weakest part of the draft. Keenan has diversified his investments across Green Bay, more Green Bay, and the hope that Green Bay sorts itself out. There is no drafted defence, presumably because the 2021 championship is still being asked to defend his reputation. Fannin was a genuinely tidy bit of business, but even he cannot catch the league up on the years since that trophy.',
      bestPick: {
        player: 'Harold Fannin',
        detail:
          'Pick 106 bought a tight end ranked fifth at the position by FantasyPros, with a roughly 198-point PPR projection. RotoBaller was much cooler, so this is useful value with genuine disagreement, not an automatic steal.',
      },
      biggestConcern: {
        player: 'Josh Jacobs',
        detail:
          'Jacobs is on the Commissioner’s Exempt List, with no confirmed return date in the checked NFL reporting. Pick 87 cannot be treated as a discounted healthy starter. Lloyd offers an alternative route to Green Bay touches, but does not make that investment risk-free.',
      },
      seasonOutlook:
        'Twelfth is a close-call forecast, not a prediction of weekly humiliation. Consecutive ninth-place finishes remove the benefit of the doubt, and the early price premiums plus an uncertain bench leave less room for error. A defence pickup is the first repair. The 2021 trophy is welcome in the room; it cannot fill a lineup slot.',
      leinsterComparison: {
        player: 'James Ryan',
        detail:
          'Built around the engine room rather than fireworks. The Barkley–Jeanty investment needs to establish control up front; if that platform fails, the rest of the plan has a lot of clearing out to do.',
      },
      gradeScore: 74,
      rubricScores: {
        startingLineup: 23,
        value: 16,
        construction: 14,
        depth: 13,
        risk: 8,
      },
      teamName: 'Cooper Kupp Mah Balls',
      avatar:
        'https://sleepercdn.com/uploads/b168db964d7f082373f47fcef8756604.jpg',
      draftSlot: 10,
      picks: [
        {
          round: 1,
          overall: 10,
          player: 'Saquon Barkley',
          position: 'RB',
          nflTeam: 'PHI',
        },
        {
          round: 2,
          overall: 15,
          player: 'Ashton Jeanty',
          position: 'RB',
          nflTeam: 'LV',
        },
        {
          round: 3,
          overall: 34,
          player: 'DeVonta Smith',
          position: 'WR',
          nflTeam: 'PHI',
        },
        {
          round: 4,
          overall: 39,
          player: 'Zay Flowers',
          position: 'WR',
          nflTeam: 'BAL',
        },
        {
          round: 5,
          overall: 58,
          player: 'Christian Watson',
          position: 'WR',
          nflTeam: 'GB',
        },
        {
          round: 6,
          overall: 63,
          player: 'Rome Odunze',
          position: 'WR',
          nflTeam: 'CHI',
        },
        {
          round: 7,
          overall: 82,
          player: 'MarShawn Lloyd',
          position: 'RB',
          nflTeam: 'GB',
        },
        {
          round: 8,
          overall: 87,
          player: 'Josh Jacobs',
          position: 'RB',
          nflTeam: 'GB',
        },
        {
          round: 9,
          overall: 106,
          player: 'Harold Fannin',
          position: 'TE',
          nflTeam: 'CLE',
        },
        {
          round: 10,
          overall: 111,
          player: 'Bo Nix',
          position: 'QB',
          nflTeam: 'DEN',
        },
        {
          round: 11,
          overall: 130,
          player: 'Brandon Aubrey',
          position: 'K',
          nflTeam: 'DAL',
        },
        {
          round: 12,
          overall: 135,
          player: "Ja'Kobi Lane",
          position: 'WR',
          nflTeam: 'BAL',
        },
        {
          round: 13,
          overall: 154,
          player: 'Kaelon Black',
          position: 'RB',
          nflTeam: 'SF',
        },
        {
          round: 14,
          overall: 159,
          player: 'Emmett Johnson',
          position: 'RB',
          nflTeam: 'KC',
        },
        {
          round: 15,
          overall: 178,
          player: 'Jared Goff',
          position: 'QB',
          nflTeam: 'DET',
        },
      ],
    },
    {
      rosterId: 4,
      managerName: 'Tommy O’Brien',
      grade: 'C+',
      predictedFinish: 10,
      headline: 'The receivers are ready. The running backs are a thesis.',
      summary:
        'Nacua, Brown and Wilson are a compelling PPR trio, with Loveland adding an ambitious tight-end investment. The bill arrives at running back: Tuten and Stevenson start ahead of a collection of contingent bets. Loveland at 31 matched CBS but was earlier than the other boards. Plenty of ceiling, with a familiar amount of work required to reach it. Tommy has once again assembled a roster that would absolutely dominate a league scored on the phrase ‘if you look at the underlying numbers’. The receiver room is a luxury penthouse; the running backs are still waiting for planning permission. By October, either the vision will be vindicated or the group chat will receive a 900-word explanation of why the process was correct.',
      bestPick: {
        player: 'Puka Nacua',
        detail:
          'Nacua at seven was outside the top four on none of the three expert boards. That is a strong opening discount, even after allowing for the need to monitor his current availability.',
      },
      biggestConcern: {
        player: 'Bhayshul Tuten / Rhamondre Stevenson',
        detail:
          'The first running back arrived at 55. Both starters sit outside FantasyPros’ top 20 at the position, and Monangai and Coleman are speculative cover. Tyson is on Saints injured reserve with a return designation, so the bench also contains a confirmed waiting investment.',
      },
      seasonOutlook:
        'Tenth reflects the thin running-back margin and Tommy’s longstanding appetite for potential. His 2023 final shows the ceiling is real, but this roster needs timely waiver decisions rather than another beautifully explained near-breakout. Shark Boy should remain a costume, not a contingency plan.',
      leinsterComparison: {
        player: 'Tommy O’Brien',
        detail:
          'The name match was irresistible, but the real link is attacking ambition. This team wants to win in the wide channels; its season depends on whether the less glamorous work inside gives those weapons enough ball.',
      },
      gradeScore: 78,
      rubricScores: {
        startingLineup: 25,
        value: 18,
        construction: 15,
        depth: 12,
        risk: 8,
      },
      teamName: 'Prime Time',
      avatar:
        'https://sleepercdn.com/uploads/c789bb11559ae3a829e9a7cf7a5b86a2.jpg',
      draftSlot: 7,
      picks: [
        {
          round: 1,
          overall: 7,
          player: 'Puka Nacua',
          position: 'WR',
          nflTeam: 'LAR',
        },
        {
          round: 2,
          overall: 18,
          player: 'A.J. Brown',
          position: 'WR',
          nflTeam: 'NE',
        },
        {
          round: 3,
          overall: 31,
          player: 'Colston Loveland',
          position: 'TE',
          nflTeam: 'CHI',
        },
        {
          round: 4,
          overall: 42,
          player: 'Garrett Wilson',
          position: 'WR',
          nflTeam: 'NYJ',
        },
        {
          round: 5,
          overall: 55,
          player: 'Bhayshul Tuten',
          position: 'RB',
          nflTeam: 'JAX',
        },
        {
          round: 6,
          overall: 66,
          player: 'Rhamondre Stevenson',
          position: 'RB',
          nflTeam: 'NE',
        },
        {
          round: 7,
          overall: 79,
          player: 'Justin Herbert',
          position: 'QB',
          nflTeam: 'LAC',
        },
        {
          round: 8,
          overall: 90,
          player: 'Alec Pierce',
          position: 'WR',
          nflTeam: 'IND',
        },
        {
          round: 9,
          overall: 103,
          player: 'Kyle Monangai',
          position: 'RB',
          nflTeam: 'CHI',
        },
        {
          round: 10,
          overall: 114,
          player: 'Jordyn Tyson',
          position: 'WR',
          nflTeam: 'NO',
        },
        {
          round: 11,
          overall: 127,
          player: 'Jonah Coleman',
          position: 'RB',
          nflTeam: 'DEN',
        },
        {
          round: 12,
          overall: 138,
          player: 'Houston Texans',
          position: 'DEF',
          nflTeam: 'HOU',
        },
        {
          round: 13,
          overall: 151,
          player: 'Cyrus Allen',
          position: 'WR',
          nflTeam: 'KC',
        },
        {
          round: 14,
          overall: 162,
          player: 'Matthew Stafford',
          position: 'QB',
          nflTeam: 'LAR',
        },
        {
          round: 15,
          overall: 175,
          player: 'Harrison Butker',
          position: 'K',
          nflTeam: 'KC',
        },
      ],
    },
    {
      rosterId: 5,
      managerName: 'Karl Moroney',
      grade: 'A-',
      predictedFinish: 1,
      headline: 'At last, a roster that leaves the schedule no defence.',
      summary:
        'Bijan, McBride and Pickens establish strength at three positions, with McLaurin and Irving completing a credible weekly core. Daniels at 74 adds quarterback upside without consuming an early pick. The bench contains usable receiver alternatives and running-back contingencies. It is the most complete balance of starters, price and construction in this cohort. This is deeply inconvenient for a man whose post-match analysis traditionally begins with the fixture list. Even the bench looks sufficiently thought through that the usual appeal to the Court of Points Against may be dismissed without a hearing. If Karl does not win with this lot, the group chat is entitled to request a new excuse in writing, with no mention of scheduling.',
      bestPick: {
        player: 'Jayden Daniels',
        detail:
          'Pick 74 came after his consensus ADP order and all three expert boards. That is a useful price for FantasyPros’ QB6, particularly with four-point passing touchdowns keeping rushing production valuable.',
      },
      biggestConcern: {
        player: 'Brian Thomas',
        detail:
          'Thomas at 71 was an upside bet ahead of the ADP order, not a guaranteed bargain. Week 7 also removes Daniels, McLaurin, Thomas and Johnston together. Mayfield covers quarterback, but receiver planning will matter.',
      },
      seasonOutlook:
        'First. The 10–4 season and 2025 final already weakened Karl’s argument that the universe has singled him out. This draft removes another excuse. Active management plus the best-rounded roster makes him the pick to finish the job; any complaint about the schedule must now be submitted with supporting documentation.',
      leinsterComparison: {
        player: 'Caelan Doris',
        detail:
          'A balanced captain’s performance: front-line power, useful work everywhere and few obvious holes. Bijan supplies the carrying, McBride the reliable outlet and Daniels the ability to turn structure into a decisive break.',
      },
      gradeScore: 90,
      rubricScores: {
        startingLineup: 28,
        value: 22,
        construction: 19,
        depth: 13,
        risk: 8,
      },
      teamName: 'Pronouns Who Dey',
      avatar: 'https://sleepercdn.com/uploads/b37180e7f457183ec98225e5404ba686',
      draftSlot: 2,
      picks: [
        {
          round: 1,
          overall: 2,
          player: 'Bijan Robinson',
          position: 'RB',
          nflTeam: 'ATL',
        },
        {
          round: 2,
          overall: 23,
          player: 'Trey McBride',
          position: 'TE',
          nflTeam: 'ARI',
        },
        {
          round: 3,
          overall: 26,
          player: 'George Pickens',
          position: 'WR',
          nflTeam: 'DAL',
        },
        {
          round: 4,
          overall: 47,
          player: 'Terry McLaurin',
          position: 'WR',
          nflTeam: 'WAS',
        },
        {
          round: 5,
          overall: 50,
          player: 'Bucky Irving',
          position: 'RB',
          nflTeam: 'TB',
        },
        {
          round: 6,
          overall: 71,
          player: 'Brian Thomas',
          position: 'WR',
          nflTeam: 'JAX',
        },
        {
          round: 7,
          overall: 74,
          player: 'Jayden Daniels',
          position: 'QB',
          nflTeam: 'WAS',
        },
        {
          round: 8,
          overall: 95,
          player: 'Blake Corum',
          position: 'RB',
          nflTeam: 'LAR',
        },
        {
          round: 9,
          overall: 98,
          player: 'Quentin Johnston',
          position: 'WR',
          nflTeam: 'LAC',
        },
        {
          round: 10,
          overall: 119,
          player: 'Aaron Jones',
          position: 'RB',
          nflTeam: 'MIN',
        },
        {
          round: 11,
          overall: 122,
          player: 'Romeo Doubs',
          position: 'WR',
          nflTeam: 'NE',
        },
        {
          round: 12,
          overall: 143,
          player: 'Seattle Seahawks',
          position: 'DEF',
          nflTeam: 'SEA',
        },
        {
          round: 13,
          overall: 146,
          player: 'Jake Bates',
          position: 'K',
          nflTeam: 'DET',
        },
        {
          round: 14,
          overall: 167,
          player: 'Ray Davis',
          position: 'RB',
          nflTeam: 'BUF',
        },
        {
          round: 15,
          overall: 170,
          player: 'Baker Mayfield',
          position: 'QB',
          nflTeam: 'TB',
        },
      ],
    },
    {
      rosterId: 6,
      managerName: 'Alan Horgan',
      grade: 'B-',
      predictedFinish: 4,
      headline: 'The champion has upgraded from CMC faith to Gibbs faith.',
      summary:
        'Gibbs and Olave give the title defence a strong base. Javonte at 25 is the debate: RotoBaller endorsed that price, while CBS and FantasyPros were less enthusiastic. Burrow, Burden and Kraft provide a coherent starting group, but Harvey at 73 was another purchase ahead of all three expert boards. Two quarterbacks and two tight ends reduce the room for new flex options. Alan has gone from the Titanic tour to defending a title, and is now building another expensive vessel around one exceptional running back. Gibbs is an excellent choice of captain; the two quarterbacks sharing a bye is more of a deckchair arrangement. Expect the newsletter to describe every win as inevitable and every loss as a fascinating statistical anomaly requiring three additional paragraphs.',
      bestPick: {
        player: 'Chris Olave',
        detail:
          'At 24, Olave came after all three expert boards and supplied the clear first receiver this roster needed. It is a stronger value argument than simply pointing to Gibbs at number one.',
      },
      biggestConcern: {
        player: 'Joe Burrow / Kyler Murray',
        detail:
          'Both drafted quarterbacks have a Week 6 bye. Carrying Murray therefore does not solve the obvious cover problem, and Gibbs and Addison are also off that week. This is repairable, but it costs roster flexibility.',
      },
      seasonOutlook:
        'Fourth backs the manager’s recent run more than the draft-grade order. Consecutive finals, the reigning title and active trading give Alan a credible path to improving this B-minus roster. The newsletter can call it a dynasty when there is a second trophy; until then, the Titanic tour remains in the archive.',
      leinsterComparison: {
        player: 'Dan Sheehan',
        detail:
          'Gibbs gives a team built around a traditionally workmanlike position the chance to produce spectacular attacking returns. There is proper firepower here, although the supporting structure still has to do its job.',
      },
      gradeScore: 81,
      rubricScores: {
        startingLineup: 26,
        value: 18,
        construction: 16,
        depth: 13,
        risk: 8,
      },
      teamName: "Tampa B'AH",
      avatar:
        'https://sleepercdn.com/uploads/ac4bdbeb10e4c8dbc9f2ddb1805f9b06.jpg',
      draftSlot: 1,
      picks: [
        {
          round: 1,
          overall: 1,
          player: 'Jahmyr Gibbs',
          position: 'RB',
          nflTeam: 'DET',
        },
        {
          round: 2,
          overall: 24,
          player: 'Chris Olave',
          position: 'WR',
          nflTeam: 'NO',
        },
        {
          round: 3,
          overall: 25,
          player: 'Javonte Williams',
          position: 'RB',
          nflTeam: 'DAL',
        },
        {
          round: 4,
          overall: 48,
          player: 'Luther Burden',
          position: 'WR',
          nflTeam: 'CHI',
        },
        {
          round: 5,
          overall: 49,
          player: 'Joe Burrow',
          position: 'QB',
          nflTeam: 'CIN',
        },
        {
          round: 6,
          overall: 72,
          player: 'Tucker Kraft',
          position: 'TE',
          nflTeam: 'GB',
        },
        {
          round: 7,
          overall: 73,
          player: 'RJ Harvey',
          position: 'RB',
          nflTeam: 'DEN',
        },
        {
          round: 8,
          overall: 96,
          player: 'Jordan Addison',
          position: 'WR',
          nflTeam: 'MIN',
        },
        {
          round: 9,
          overall: 97,
          player: 'Stefon Diggs',
          position: 'WR',
          nflTeam: 'WAS',
        },
        {
          round: 10,
          overall: 120,
          player: 'Jake Ferguson',
          position: 'TE',
          nflTeam: 'DAL',
        },
        {
          round: 11,
          overall: 121,
          player: 'Chris Rodriguez',
          position: 'RB',
          nflTeam: 'JAX',
        },
        {
          round: 12,
          overall: 144,
          player: 'Kyler Murray',
          position: 'QB',
          nflTeam: 'MIN',
        },
        {
          round: 13,
          overall: 145,
          player: "Ka'imi Fairbairn",
          position: 'K',
          nflTeam: 'HOU',
        },
        {
          round: 14,
          overall: 168,
          player: 'Nicholas Singleton',
          position: 'RB',
          nflTeam: 'TEN',
        },
        {
          round: 15,
          overall: 169,
          player: 'Minnesota Vikings',
          position: 'DEF',
          nflTeam: 'MIN',
        },
      ],
    },
    {
      rosterId: 7,
      managerName: 'Joe Ennis',
      grade: 'B+',
      predictedFinish: 3,
      headline: 'Fourth place has been served an eviction notice.',
      summary:
        'St. Brown, Jefferson and Nabers are an excellent answer to full PPR scoring and an RB/WR flex. Hurts and LaPorta round out a high-ceiling lineup. The trade-off is visible at running back, where Skattebo and Henderson cost more than the expert boards generally preferred. Dobbins offers support, but Charbonnet is a recovery stash rather than immediate cover. Joe spent three years treating fourth place like a rent-controlled apartment, then briefly moved to eleventh to appreciate what he had. This receiver room is good enough to put a deposit on somewhere nicer. The only administrative concern is whether he has accidentally drafted his best team for Aidan again and will discover the paperwork error in December.',
      bestPick: {
        player: 'Justin Jefferson',
        detail:
          'Pick 17 secured a receiver ranked between ninth and 15th across the three boards, after his ADP order of 11. Pairing him with St. Brown made the third-round receiver pick a strength rather than a rescue mission.',
      },
      biggestConcern: {
        player: 'Cam Skattebo / TreVeyon Henderson',
        detail:
          'Neither starting running back is a top-19 option in FantasyPros’ positional rankings. Charbonnet’s PUP status limits early depth. Week 6 also takes away St. Brown, Jefferson and LaPorta together, so the bench must earn its keep.',
      },
      seasonOutlook:
        'Third is the prediction that finally gets Joe onto a podium. The receiver core offers a better reason than habit to trust the strategist after an eleventh-place collapse. He still needs to manage running-back risk, but this time the spreadsheet has produced something worth celebrating.',
      leinsterComparison: {
        player: 'Hugo Keenan',
        detail:
          'An emphasis on positioning and dependable returns. Three early receivers aim to make the routine ball safe before Hurts provides the counterattack. A carefully organised side with a much less comfortable job in the tight exchanges.',
      },
      gradeScore: 87,
      rubricScores: {
        startingLineup: 28,
        value: 22,
        construction: 16,
        depth: 13,
        risk: 8,
      },
      teamName: "D'onta FourMore!",
      avatar: 'https://sleepercdn.com/uploads/b6ae8ce310e0cc163223c929045a56d5',
      draftSlot: 8,
      picks: [
        {
          round: 1,
          overall: 8,
          player: 'Amon-Ra St. Brown',
          position: 'WR',
          nflTeam: 'DET',
        },
        {
          round: 2,
          overall: 17,
          player: 'Justin Jefferson',
          position: 'WR',
          nflTeam: 'MIN',
        },
        {
          round: 3,
          overall: 32,
          player: 'Malik Nabers',
          position: 'WR',
          nflTeam: 'NYG',
        },
        {
          round: 4,
          overall: 41,
          player: 'Cam Skattebo',
          position: 'RB',
          nflTeam: 'NYG',
        },
        {
          round: 5,
          overall: 56,
          player: 'TreVeyon Henderson',
          position: 'RB',
          nflTeam: 'NE',
        },
        {
          round: 6,
          overall: 65,
          player: 'Jalen Hurts',
          position: 'QB',
          nflTeam: 'PHI',
        },
        {
          round: 7,
          overall: 80,
          player: 'Sam LaPorta',
          position: 'TE',
          nflTeam: 'DET',
        },
        {
          round: 8,
          overall: 89,
          player: 'J.K. Dobbins',
          position: 'RB',
          nflTeam: 'DEN',
        },
        {
          round: 9,
          overall: 104,
          player: 'Michael Pittman',
          position: 'WR',
          nflTeam: 'PIT',
        },
        {
          round: 10,
          overall: 113,
          player: 'Matthew Golden',
          position: 'WR',
          nflTeam: 'GB',
        },
        {
          round: 11,
          overall: 128,
          player: 'Zach Charbonnet',
          position: 'RB',
          nflTeam: 'SEA',
        },
        {
          round: 12,
          overall: 137,
          player: 'Deebo Samuel',
          position: 'WR',
          nflTeam: 'SF',
        },
        {
          round: 13,
          overall: 152,
          player: 'Tank Bigsby',
          position: 'RB',
          nflTeam: 'PHI',
        },
        {
          round: 14,
          overall: 161,
          player: 'Baltimore Ravens',
          position: 'DEF',
          nflTeam: 'BAL',
        },
        {
          round: 15,
          overall: 176,
          player: 'Chris Boswell',
          position: 'K',
          nflTeam: 'PIT',
        },
      ],
    },
    {
      rosterId: 8,
      managerName: 'Hugo Walsh',
      grade: 'C',
      predictedFinish: 11,
      headline: 'A fine starting six, followed by an expensive prospectus.',
      summary:
        "Taylor, Bowers, McConkey and Higgins make a credible foundation, and Montgomery gives the team a second running back. The draft becomes harder to defend after that: Lemon at 77 was well ahead of every checked expert board, and Malik Washington at 125 was another substantial premium. Mahomes at 173 restores some value, but a cheap second quarterback does not fill the flex gap. Hugo's opening rounds looked like a man determined never to perform on Grafton Street again; the later ones looked like he was keeping his options open. Lemon and Washington have been bought at prices that suggest their agents were allowed into the draft room. If both break out, call it vision; if neither does, at least ‘Wonderwall’ remains widely recognisable.",
      bestPick: {
        player: 'Tee Higgins',
        detail:
          'Higgins at 44 came after all three expert boards, which placed him between 29th and 37th. He gives McConkey a strong running mate without needing one of the rookie receivers to become an instant starter.',
      },
      biggestConcern: {
        player: 'Makai Lemon',
        detail:
          'Lemon at 77 was well ahead of all three expert boards, with Godwin and Dowdle still available as more highly ranked flex options. The premium leaves this bench dependent on development, particularly alongside another early bet on Malik Washington.',
      },
      seasonOutlook:
        'Eleventh interrupts an encouraging climb rather than erasing it. Back-to-back playoff appearances earn Hugo respect, but the rookie premiums leave this roster short of bankable flex depth against a closely matched field. The guitar can stay in its case if he treats September waivers as seriously as draft night.',
      leinsterComparison: {
        player: 'Harry Byrne',
        detail:
          'An organised opening followed by a bet on attacking development. Taylor and Bowers give the side a platform, but the less established pieces must turn promise into repeatable execution before the plan looks complete.',
      },
      gradeScore: 76,
      rubricScores: {
        startingLineup: 24,
        value: 16,
        construction: 16,
        depth: 12,
        risk: 8,
      },
      teamName: 'Hawk Tuas Binatsos',
      avatar:
        'https://sleepercdn.com/uploads/14bf254526a4df014abf129678144d12.jpg',
      draftSlot: 5,
      picks: [
        {
          round: 1,
          overall: 5,
          player: 'Jonathan Taylor',
          position: 'RB',
          nflTeam: 'IND',
        },
        {
          round: 2,
          overall: 20,
          player: 'Brock Bowers',
          position: 'TE',
          nflTeam: 'LV',
        },
        {
          round: 3,
          overall: 29,
          player: 'Ladd McConkey',
          position: 'WR',
          nflTeam: 'LAC',
        },
        {
          round: 4,
          overall: 44,
          player: 'Tee Higgins',
          position: 'WR',
          nflTeam: 'CIN',
        },
        {
          round: 5,
          overall: 53,
          player: 'David Montgomery',
          position: 'RB',
          nflTeam: 'HOU',
        },
        {
          round: 6,
          overall: 68,
          player: 'Caleb Williams',
          position: 'QB',
          nflTeam: 'CHI',
        },
        {
          round: 7,
          overall: 77,
          player: 'Makai Lemon',
          position: 'WR',
          nflTeam: 'PHI',
        },
        {
          round: 8,
          overall: 92,
          player: 'Jonathon Brooks',
          position: 'RB',
          nflTeam: 'CAR',
        },
        {
          round: 9,
          overall: 101,
          player: 'KC Concepcion',
          position: 'WR',
          nflTeam: 'CLE',
        },
        {
          round: 10,
          overall: 116,
          player: 'Tyler Allgeier',
          position: 'RB',
          nflTeam: 'ARI',
        },
        {
          round: 11,
          overall: 125,
          player: 'Malik Washington',
          position: 'WR',
          nflTeam: 'MIA',
        },
        {
          round: 12,
          overall: 140,
          player: 'Cam Little',
          position: 'K',
          nflTeam: 'JAX',
        },
        {
          round: 13,
          overall: 149,
          player: 'Detroit Lions',
          position: 'DEF',
          nflTeam: 'DET',
        },
        {
          round: 14,
          overall: 164,
          player: 'Kayshon Boutte',
          position: 'WR',
          nflTeam: 'HOU',
        },
        {
          round: 15,
          overall: 173,
          player: 'Patrick Mahomes',
          position: 'QB',
          nflTeam: 'KC',
        },
      ],
    },
    {
      rosterId: 9,
      managerName: 'Jack Ringrose',
      grade: 'B-',
      predictedFinish: 8,
      headline: 'Prime cuts, mature stock, and a very expensive quarterback.',
      summary:
        'McCaffrey, Henry and Allen can carry a weekly score, but buying all three before a receiver imposes a clear PPR trade-off. Egbuka and Jameson Williams have to be more than supporting acts. Pollard, Sutton and Reed provide alternatives, while Kincaid adds an Allen connection. This is a viable win-now build with a narrower safety margin than the famous names suggest. Jack has ordered the tasting menu of established fantasy names and left the receiver room to survive on sides. There is enough quality here to revive the Wagyu brand, although the running-back department could reasonably request its own recovery lounge. A proper twelve-team title would finally give him a trophy the group chat cannot dismiss by asking who else was actually there.',
      bestPick: {
        player: 'Derrick Henry',
        detail:
          'At 21, Henry arrived after his ADP order of 16 and the CBS and RotoBaller ranks of 18 and 16. FantasyPros had him 34th, reflecting the PPR trade-off. That range makes this a defensible value pick, not unanimous expert approval.',
      },
      biggestConcern: {
        player: 'Christian McCaffrey / Derrick Henry',
        detail:
          'A large share of the roster’s strength sits in two veteran running backs. If either misses time, Pollard and Tracy must cover the gap. Taking Allen early also left the receiver room without a top-20 consensus anchor.',
      },
      seasonOutlook:
        'Eighth allows for the 2025 revival without assuming it continues automatically. The weekly ceiling is higher than this finish, but age concentration and the receiver trade-off create a wider range of outcomes. At least a second title would come without anyone counting how many teams were invited.',
      leinsterComparison: {
        player: 'Isa Nacewa',
        detail:
          'The appeal is proven class and multiple ways to influence a game. This is the veteran-favourite comparison: excellent decisions and high-end moments can still beat a younger team, provided the supporting cast holds together.',
      },
      gradeScore: 80,
      rubricScores: {
        startingLineup: 26,
        value: 19,
        construction: 16,
        depth: 12,
        risk: 7,
      },
      teamName: 'The Finest Wagyu',
      avatar: '96373266565b3d0902c13a295a3c2a1f',
      draftSlot: 4,
      picks: [
        {
          round: 1,
          overall: 4,
          player: 'Christian McCaffrey',
          position: 'RB',
          nflTeam: 'SF',
        },
        {
          round: 2,
          overall: 21,
          player: 'Derrick Henry',
          position: 'RB',
          nflTeam: 'BAL',
        },
        {
          round: 3,
          overall: 28,
          player: 'Josh Allen',
          position: 'QB',
          nflTeam: 'BUF',
        },
        {
          round: 4,
          overall: 45,
          player: 'Emeka Egbuka',
          position: 'WR',
          nflTeam: 'TB',
        },
        {
          round: 5,
          overall: 52,
          player: 'Jameson Williams',
          position: 'WR',
          nflTeam: 'DET',
        },
        {
          round: 6,
          overall: 69,
          player: 'Tony Pollard',
          position: 'RB',
          nflTeam: 'TEN',
        },
        {
          round: 7,
          overall: 76,
          player: 'Courtland Sutton',
          position: 'WR',
          nflTeam: 'DEN',
        },
        {
          round: 8,
          overall: 93,
          player: 'Jayden Reed',
          position: 'WR',
          nflTeam: 'GB',
        },
        {
          round: 9,
          overall: 100,
          player: 'Dalton Kincaid',
          position: 'TE',
          nflTeam: 'BUF',
        },
        {
          round: 10,
          overall: 117,
          player: 'Xavier Worthy',
          position: 'WR',
          nflTeam: 'KC',
        },
        {
          round: 11,
          overall: 124,
          player: 'Khalil Shakir',
          position: 'WR',
          nflTeam: 'BUF',
        },
        {
          round: 12,
          overall: 141,
          player: 'Cameron Dicker',
          position: 'K',
          nflTeam: 'LAC',
        },
        {
          round: 13,
          overall: 148,
          player: 'Tyrone Tracy',
          position: 'RB',
          nflTeam: 'NYG',
        },
        {
          round: 14,
          overall: 165,
          player: 'Brock Purdy',
          position: 'QB',
          nflTeam: 'SF',
        },
        {
          round: 15,
          overall: 172,
          player: 'Los Angeles Chargers',
          position: 'DEF',
          nflTeam: 'LAC',
        },
      ],
    },
    {
      rosterId: 10,
      managerName: 'Shane Marmion',
      grade: 'B+',
      predictedFinish: 6,
      headline: 'An excellent team. Please remember to select it.',
      summary:
        'Smith-Njigba and Lamb were both available later than every checked expert board placed them. Love, Lamar and Moore then built a dangerous starting unit without leaving the flex empty. Warren and Hubbard make the running-back group serviceable, while Likely offers a second tight-end route behind Kittle. One of the strongest drafts, with fewer obvious construction mistakes than most. The hardest remaining pick is which day of the week Shane will remember that he owns these players. On paper this is a contender; on a Sunday with three unanswered WhatsApps it becomes a community safeguarding project for whoever is near the bottom. Jack Ringrose is entitled to request proof of lineup submission before accepting that everything is under control.',
      bestPick: {
        player: 'CeeDee Lamb',
        detail:
          'Lamb at 16 followed expert ranks of eight, nine and 11, and an ADP order of ten. That is a clean value case on a player who immediately fits the starting lineup alongside Smith-Njigba.',
      },
      biggestConcern: {
        player: 'George Kittle',
        detail:
          'Kittle carries an availability flag in the draft snapshot and the expert boards vary on his price. Likely at 153 gives useful cover, but neither should be assumed available without checking the weekly report. The running-back depth is also much less imposing than the receivers.',
      },
      seasonOutlook:
        'Sixth is materially below the second-best draft grade because the forecast includes Shane’s engagement history. The 2022 champion can win this league when he stays involved; two playoff appearances in six seasons make sustained attention the question. The roster deserves a contender’s season. The phone needs charging.',
      leinsterComparison: {
        player: 'Jamison Gibson-Park',
        detail:
          'The roster’s strength is tempo: two premium receivers and Lamar can turn a normal week into a scoring burst. The analogy ends at match preparation, which this fantasy manager still needs to demonstrate.',
      },
      gradeScore: 88,
      rubricScores: {
        startingLineup: 28,
        value: 22,
        construction: 17,
        depth: 13,
        risk: 8,
      },
      teamName: 'Whos Throwing Diggs',
      avatar:
        'https://sleepercdn.com/uploads/a12f9d76487e42320bf2ad3eee657d26.jpg',
      draftSlot: 9,
      picks: [
        {
          round: 1,
          overall: 9,
          player: 'Jaxon Smith-Njigba',
          position: 'WR',
          nflTeam: 'SEA',
        },
        {
          round: 2,
          overall: 16,
          player: 'CeeDee Lamb',
          position: 'WR',
          nflTeam: 'DAL',
        },
        {
          round: 3,
          overall: 33,
          player: 'Jeremiyah Love',
          position: 'RB',
          nflTeam: 'ARI',
        },
        {
          round: 4,
          overall: 40,
          player: 'Lamar Jackson',
          position: 'QB',
          nflTeam: 'BAL',
        },
        {
          round: 5,
          overall: 57,
          player: 'DJ Moore',
          position: 'WR',
          nflTeam: 'BUF',
        },
        {
          round: 6,
          overall: 64,
          player: 'Jaylen Warren',
          position: 'RB',
          nflTeam: 'PIT',
        },
        {
          round: 7,
          overall: 81,
          player: 'Chuba Hubbard',
          position: 'RB',
          nflTeam: 'CAR',
        },
        {
          round: 8,
          overall: 88,
          player: 'George Kittle',
          position: 'TE',
          nflTeam: 'SF',
        },
        {
          round: 9,
          overall: 105,
          player: 'Jacory Croskey-Merritt',
          position: 'RB',
          nflTeam: 'WAS',
        },
        {
          round: 10,
          overall: 112,
          player: "Wan'Dale Robinson",
          position: 'WR',
          nflTeam: 'TEN',
        },
        {
          round: 11,
          overall: 129,
          player: 'Los Angeles Rams',
          position: 'DEF',
          nflTeam: 'LAR',
        },
        {
          round: 12,
          overall: 136,
          player: 'Jalen Coker',
          position: 'WR',
          nflTeam: 'CAR',
        },
        {
          round: 13,
          overall: 153,
          player: 'Isaiah Likely',
          position: 'TE',
          nflTeam: 'NYG',
        },
        {
          round: 14,
          overall: 160,
          player: 'Dylan Sampson',
          position: 'RB',
          nflTeam: 'CLE',
        },
        {
          round: 15,
          overall: 177,
          player: 'Will Reichard',
          position: 'K',
          nflTeam: 'MIN',
        },
      ],
    },
    {
      rosterId: 11,
      managerName: 'David Sharpe',
      grade: 'B',
      predictedFinish: 7,
      headline: 'Burkeys Teur has drafted a reason to stay logged in.',
      summary:
        'Achane and Hampton establish a strong running-back pair, Rice and McMillan fill receiver, and Maye and Warren give the lineup upside at the remaining offensive positions. Godwin at 84 adds a credible flex option. The late rounds are less convincing, especially Hunter in a league without individual-defender slots, but the opening eight picks form a genuinely competitive team. For once, ‘I just picked the names I recognised’ would undersell what is a very respectable opening to a draft. Taking a player labelled DB in a league without an IDP slot does suggest the research department clocked off before the end, but the main work was already done. The challenge now is persuading David that Sleeper remains available to download updates after September.',
      bestPick: {
        player: 'Rashee Rice',
        detail:
          'At 36, Rice followed CBS’s rank of 23 and FantasyPros’ 27, with RotoBaller close to the actual price at 37. He filled a real receiver need after the two-running-back start.',
      },
      biggestConcern: {
        player: 'Travis Hunter',
        detail:
          'Sleeper’s draft metadata labels Hunter DB; this league has no IDP starter. Even if receiver eligibility permits offensive use, defensive production offers no individual-player scoring route here. Treat him as a speculative offensive bench pick, not a second defence or a secure flex.',
      },
      seasonOutlook:
        'Seventh is deliberately lower than the fourth-best draft grade. One playoff appearance in five seasons and a limited waiver habit temper the outlook, even with a much better starting platform. Sharpe can beat this forecast by managing the team after draft night. The roster has done its part; the login screen awaits.',
      leinsterComparison: {
        player: 'Garry Ringrose',
        detail:
          'A balanced centre partnership translated into fantasy: strong running backs inside, capable receivers outside and a useful decision-maker at quarterback. The appeal is how neatly the first-choice pieces fit, rather than one extravagant selection.',
      },
      gradeScore: 86,
      rubricScores: {
        startingLineup: 27,
        value: 21,
        construction: 17,
        depth: 13,
        risk: 8,
      },
      teamName: 'Burkeys Teur',
      avatar: '8f7ccd0c2049b60f76a78ae0af004ac2',
      draftSlot: 12,
      picks: [
        {
          round: 1,
          overall: 12,
          player: "De'Von Achane",
          position: 'RB',
          nflTeam: 'MIA',
        },
        {
          round: 2,
          overall: 13,
          player: 'Omarion Hampton',
          position: 'RB',
          nflTeam: 'LAC',
        },
        {
          round: 3,
          overall: 36,
          player: 'Rashee Rice',
          position: 'WR',
          nflTeam: 'KC',
        },
        {
          round: 4,
          overall: 37,
          player: 'Tetairoa McMillan',
          position: 'WR',
          nflTeam: 'CAR',
        },
        {
          round: 5,
          overall: 60,
          player: 'Drake Maye',
          position: 'QB',
          nflTeam: 'NE',
        },
        {
          round: 6,
          overall: 61,
          player: 'Tyler Warren',
          position: 'TE',
          nflTeam: 'IND',
        },
        {
          round: 7,
          overall: 84,
          player: 'Chris Godwin',
          position: 'WR',
          nflTeam: 'TB',
        },
        {
          round: 8,
          overall: 85,
          player: 'Michael Wilson',
          position: 'WR',
          nflTeam: 'ARI',
        },
        {
          round: 9,
          overall: 108,
          player: 'Jordan Mason',
          position: 'RB',
          nflTeam: 'MIN',
        },
        {
          round: 10,
          overall: 109,
          player: 'Rachaad White',
          position: 'RB',
          nflTeam: 'WAS',
        },
        {
          round: 11,
          overall: 132,
          player: 'Jason Myers',
          position: 'K',
          nflTeam: 'SEA',
        },
        {
          round: 12,
          overall: 133,
          player: 'Brian Robinson',
          position: 'RB',
          nflTeam: 'ATL',
        },
        {
          round: 13,
          overall: 156,
          player: 'Travis Hunter',
          position: 'DB',
          nflTeam: 'JAX',
        },
        {
          round: 14,
          overall: 157,
          player: 'Philadelphia Eagles',
          position: 'DEF',
          nflTeam: 'PHI',
        },
        {
          round: 15,
          overall: 180,
          player: 'Jerry Jeudy',
          position: 'WR',
          nflTeam: 'CLE',
        },
      ],
    },
    {
      rosterId: 12,
      managerName: 'Aidan Murphy',
      grade: 'C+',
      predictedFinish: 9,
      headline: 'Set and forget has a Week 11 appointment.',
      summary:
        'Cook, London and Etienne give the roster a clear structure, with Adams and Judkins providing enough options to avoid an immediate flex scramble. The prices were less exciting: Cook at six and Metcalf at 67 were ahead of all three expert boards. Prescott was sensible, and Pitts at 91 divides opinion. There are usable reserves, but fewer obvious positional advantages than the leading teams possess. Aidan has again built a team that could keep quietly winning while everyone else explains why it should not. Week 11 is the catch: several key players are taking the same week off, which is an ambitious scheduling decision for a manager whose preferred intervention is none. Joe should clarify now whether complimentary technical support includes tight-end cover or only the initial installation.',
      bestPick: {
        player: 'Drake London',
        detail:
          'London at 19 came after expert ranks of 11, 15 and 16. He is the strongest case for a reliable PPR anchor in a draft that otherwise paid close to, or ahead of, market order.',
      },
      biggestConcern: {
        player: 'Kyle Pitts',
        detail:
          'Pitts, London, Adams and Judkins all have Week 11 off. With only one drafted tight end, that week requires active planning. FantasyPros and CBS liked Pitts more than RotoBaller did, so his falling to 91 should not be mistaken for universal agreement.',
      },
      seasonOutlook:
        'Ninth is the uncomfortable call against a perfect five-for-five playoff record. That history keeps Murphy above the bottom group, but this roster’s modest edges and awkward bye concentration need more adaptation than the established set-and-forget approach. Joe cannot be assumed to provide complimentary after-sales support.',
      leinsterComparison: {
        player: 'Josh van der Flier',
        detail:
          'A roster built to accumulate useful work rather than live on a single highlight. The comparison is the balanced job description across the starting spots; matching the work rate during the season would considerably improve the forecast.',
      },
      gradeScore: 79,
      rubricScores: {
        startingLineup: 24,
        value: 18,
        construction: 18,
        depth: 12,
        risk: 7,
      },
      teamName: 'BurrowMeDickinYoAss',
      avatar: 'b56f726e782d46df668d11e45de5e42e',
      draftSlot: 6,
      picks: [
        {
          round: 1,
          overall: 6,
          player: 'James Cook',
          position: 'RB',
          nflTeam: 'BUF',
        },
        {
          round: 2,
          overall: 19,
          player: 'Drake London',
          position: 'WR',
          nflTeam: 'ATL',
        },
        {
          round: 3,
          overall: 30,
          player: 'Travis Etienne',
          position: 'RB',
          nflTeam: 'NO',
        },
        {
          round: 4,
          overall: 43,
          player: 'Davante Adams',
          position: 'WR',
          nflTeam: 'LAR',
        },
        {
          round: 5,
          overall: 54,
          player: 'Quinshon Judkins',
          position: 'RB',
          nflTeam: 'CLE',
        },
        {
          round: 6,
          overall: 67,
          player: 'DK Metcalf',
          position: 'WR',
          nflTeam: 'PIT',
        },
        {
          round: 7,
          overall: 78,
          player: 'Dak Prescott',
          position: 'QB',
          nflTeam: 'DAL',
        },
        {
          round: 8,
          overall: 91,
          player: 'Kyle Pitts',
          position: 'TE',
          nflTeam: 'ATL',
        },
        {
          round: 9,
          overall: 102,
          player: 'Kenny Gainwell',
          position: 'RB',
          nflTeam: 'TB',
        },
        {
          round: 10,
          overall: 115,
          player: 'Jakobi Meyers',
          position: 'WR',
          nflTeam: 'JAX',
        },
        {
          round: 11,
          overall: 126,
          player: 'Woody Marks',
          position: 'RB',
          nflTeam: 'HOU',
        },
        {
          round: 12,
          overall: 139,
          player: 'Tyjae Spears',
          position: 'RB',
          nflTeam: 'TEN',
        },
        {
          round: 13,
          overall: 150,
          player: 'Denver Broncos',
          position: 'DEF',
          nflTeam: 'DEN',
        },
        {
          round: 14,
          overall: 163,
          player: 'Harrison Mevis',
          position: 'K',
          nflTeam: 'LAR',
        },
        {
          round: 15,
          overall: 174,
          player: 'Alvin Kamara',
          position: 'RB',
          nflTeam: 'NO',
        },
      ],
    },
  ],
};
