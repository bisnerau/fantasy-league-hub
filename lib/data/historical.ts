export type HistoricalStanding = {
  franchiseId: string;
  teamName: string;
  finish: number;
  wins: number;
  losses: number;
  ties: number;
};

export type HistoricalSeason = {
  year: number;
  source: 'manual' | 'sleeper';
  leagueId?: string;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  standings: HistoricalStanding[];
};

const row = (
  franchiseId: string,
  teamName: string,
  finish: number,
  wins: number,
  losses: number,
): HistoricalStanding => ({ franchiseId, teamName, finish, wins, losses, ties: 0 });

export const historicalSeasons: HistoricalSeason[] = [
  {
    year: 2020,
    source: 'manual',
    champion: 'The Finest Waygu',
    runnerUp: 'New York Giant Eggs',
    thirdPlace: 'Burns XI',
    standings: [
      row('purple', 'The Finest Waygu', 1, 11, 3),
      row('lavender', 'New York Giant Eggs', 2, 8, 6),
      row('burns', 'Burns XI', 3, 9, 5),
      row('red', 'Hide and Zeke', 4, 7, 7),
      row('salmon', "who's throwing Diggs", 5, 6, 8),
      row('mint', 'The Wet Bandits', 6, 6, 8),
      row('magenta', 'Tampa B-AH', 7, 4, 10),
      row('navy', "Alistair Donaldson's XV", 8, 5, 9),
    ],
  },
  {
    year: 2021,
    source: 'manual',
    champion: 'Cooper Kupp Mah Balls',
    runnerUp: 'You scratched my CeeDee',
    thirdPlace: "who's throwing Diggs",
    standings: [
      row('purple', 'Cooper Kupp Mah Balls', 1, 11, 3),
      row('mint', 'You scratched my CeeDee', 2, 10, 4),
      row('salmon', "who's throwing Diggs", 3, 7, 7),
      row('burns', 'Burns XI', 4, 7, 7),
      row('lavender', 'The Finest Waygu', 5, 7, 7),
      row('yellow', 'BurrowMeDickinYoAss', 6, 8, 6),
      row('red', 'All I do is Winston', 7, 4, 10),
      row('cyan', 'Burkeys Teur', 8, 5, 9),
      row('magenta', 'Tampa B-AH', 9, 5, 9),
      row('navy', 'gimme my DAG Prescott', 10, 6, 8),
    ],
  },
  {
    year: 2022,
    source: 'manual',
    champion: "who's throwing Diggs",
    runnerUp: 'BurrowMeDickinYoAss',
    thirdPlace: 'Burns XI',
    standings: [
      row('salmon', "who's throwing Diggs", 1, 10, 4),
      row('yellow', 'BurrowMeDickinYoAss', 2, 9, 5),
      row('burns', 'Burns XI', 3, 7, 7),
      row('navy', 'Sauce Pjardner', 4, 8, 6),
      row('lavender', 'The Finest Waygu', 5, 8, 6),
      row('purple', 'Cooper Kupp Mah Balls', 6, 7, 7),
      row('red', 'Show me the Mooney', 7, 3, 11),
      row('magenta', 'Tampa B-AH', 8, 5, 9),
      row('mint', 'You scratched my CeeDee', 9, 7, 7),
      row('cyan', 'Burkeys Teur', 10, 6, 8),
    ],
  },
  {
    year: 2023,
    source: 'manual',
    champion: 'Burns XI',
    runnerUp: 'Prime Time',
    thirdPlace: 'Cooper Kupp Mah Balls',
    standings: [
      row('burns', 'Burns XI', 1, 11, 3),
      row('red', 'Prime Time', 2, 9, 5),
      row('purple', 'Cooper Kupp Mah Balls', 3, 10, 4),
      row('cyan', 'Burkeys Teur', 4, 8, 6),
      row('navy', 'Sauce Pjardner', 5, 8, 6),
      row('yellow', 'BurrowMeDickinYoAss', 6, 8, 6),
      row('lime', 'Pronouns Who Dey', 7, 5, 9),
      row('salmon', "who's throwing Diggs", 8, 6, 8),
      row('lavender', 'The Finest Waygu', 9, 6, 8),
      row('mint', 'You scratched my CeeDee', 10, 8, 6),
      row('bright-yellow', 'McGintys Dementors', 11, 2, 12),
      row('magenta', 'Tampa B-AH', 12, 3, 11),
    ],
  },
  {
    year: 2024,
    source: 'manual',
    champion: 'Mahomes-lander and The Boys',
    runnerUp: 'Tampa B-AH',
    thirdPlace: 'BurrowMeDickinYoAss',
    standings: [
      row('mint', 'Mahomes-lander and The Boys', 1, 8, 6),
      row('magenta', 'Tampa B-AH', 2, 8, 6),
      row('yellow', 'BurrowMeDickinYoAss', 3, 9, 5),
      row('navy', 'Sauce Pjardner', 4, 10, 4),
      row('bright-yellow', 'Hawk Tuas Binatsos', 5, 7, 7),
      row('burns', 'Burns XI', 6, 8, 6),
      row('lavender', 'The Finest Waygu', 7, 5, 9),
      row('red', 'Prime Time', 8, 7, 7),
      row('purple', 'Cooper Kupp Mah Balls', 9, 6, 8),
      row('lime', 'Pronouns Who Dey', 10, 5, 9),
      row('cyan', 'Burkeys Teur', 11, 5, 9),
      row('salmon', "who's throwing Diggs", 12, 6, 8),
    ],
  },
];

export type FranchiseRecord = {
  franchiseId: string;
  currentName: string;
  aliases: string[];
  wins: number;
  losses: number;
  ties: number;
  championships: number;
  podiums: number;
  seasons: number;
};

export function getFranchiseRecords(
  seasons: HistoricalSeason[] = historicalSeasons,
): FranchiseRecord[] {
  const records = new Map<string, FranchiseRecord>();
  for (const season of seasons) {
    for (const standing of season.standings) {
      const current = records.get(standing.franchiseId) ?? {
        franchiseId: standing.franchiseId,
        currentName: standing.teamName,
        aliases: [],
        wins: 0,
        losses: 0,
        ties: 0,
        championships: 0,
        podiums: 0,
        seasons: 0,
      };
      current.currentName = standing.teamName;
      if (!current.aliases.includes(standing.teamName)) current.aliases.push(standing.teamName);
      current.wins += standing.wins;
      current.losses += standing.losses;
      current.ties += standing.ties;
      current.seasons += 1;
      if (standing.finish === 1) current.championships += 1;
      if (standing.finish <= 3) current.podiums += 1;
      records.set(standing.franchiseId, current);
    }
  }
  return [...records.values()].sort(
    (a, b) =>
      b.championships - a.championships ||
      b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses) ||
      b.wins - a.wins,
  );
}

export const franchiseColors: Record<string, string> = {
  burns: '#26a653',
  purple: '#7656c8',
  lavender: '#a691dd',
  salmon: '#ff7f6f',
  magenta: '#d74c9b',
  navy: '#4b4f9a',
  cyan: '#65c9d6',
  yellow: '#f2d43d',
  red: '#f23d55',
  mint: '#b8dfc3',
  lime: '#9cd85d',
  'bright-yellow': '#d8ed25',
};
