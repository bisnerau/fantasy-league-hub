import {
  calculateSeasonConsensus,
  isCompleteForecast,
} from '@/lib/predictions/season-consensus';

// The second-half ballot: a predicted final regular-season table, then the
// two six-team brackets seeded from it. Structure verified against the 2025
// Sleeper winners/losers brackets and Week 15–17 scores.
//
// Championship: winners advance. Loser bowl: losers advance, and whoever
// loses the final is last one standing. Each bracket is five picks in game
// order; every pick is the team that goes through. The league's punishment
// (the wooden spoon) is last place in the regular-season table, not the
// loser bowl: Niall took it that way in 2025.
export type BracketKind = 'championship' | 'loserBowl';
export type BracketGame = {
  index: number;
  round: 1 | 2 | 3;
  week: 15 | 16 | 17;
  teams: [number | null, number | null];
  pick: number | null;
};
export type HalftimeBallot = {
  rankings: number[];
  championship: number[];
  loserBowl: number[];
};

// Seed positions (1-based) for the first two rounds; byes enter in round 2.
const layout = {
  championship: {
    first: [
      [4, 5],
      [3, 6],
    ],
    byes: [1, 2],
  },
  loserBowl: {
    first: [
      [8, 9],
      [7, 10],
    ],
    byes: [12, 11],
  },
} as const;

/** The five games of a bracket, given the table and the picks made so far. */
export function bracketGames(
  rankings: number[],
  picks: (number | null)[],
  kind: BracketKind,
): BracketGame[] {
  const seed = (n: number) => rankings[n - 1] ?? null;
  const { first, byes } = layout[kind];
  const valid = (
    teams: [number | null, number | null],
    pick?: number | null,
  ) => (pick != null && teams.includes(pick) ? pick : null);
  const games: BracketGame[] = [];
  first.forEach(([a, b], i) => {
    const teams: [number | null, number | null] = [seed(a), seed(b)];
    games.push({
      index: i,
      round: 1,
      week: 15,
      teams,
      pick: valid(teams, picks[i]),
    });
  });
  byes.forEach((bye, i) => {
    const teams: [number | null, number | null] = [seed(bye), games[i].pick];
    games.push({
      index: i + 2,
      round: 2,
      week: 16,
      teams,
      pick: valid(teams, picks[i + 2]),
    });
  });
  const finalTeams: [number | null, number | null] = [
    games[2].pick,
    games[3].pick,
  ];
  games.push({
    index: 4,
    round: 3,
    week: 17,
    teams: finalTeams,
    pick: valid(finalTeams, picks[4]),
  });
  return games;
}

/** Keeps only the picks that still fit the table; later picks fall away. */
export function validPicks(
  rankings: number[],
  picks: (number | null)[],
  kind: BracketKind,
) {
  return bracketGames(rankings, picks, kind).map((g) => g.pick);
}

export function isCompleteBracket(
  rankings: number[],
  picks: unknown,
  kind: BracketKind,
): picks is number[] {
  return (
    Array.isArray(picks) &&
    picks.length === 5 &&
    bracketGames(rankings, picks, kind).every((g) => g.pick === picks[g.index])
  );
}

export function isCompleteHalftimeBallot(
  ballot: { rankings: unknown; championship: unknown; loserBowl: unknown },
  rosterIds: number[],
): ballot is HalftimeBallot {
  return (
    isCompleteForecast(ballot.rankings, rosterIds) &&
    isCompleteBracket(ballot.rankings, ballot.championship, 'championship') &&
    isCompleteBracket(ballot.rankings, ballot.loserBowl, 'loserBowl')
  );
}

export const championOf = (b: HalftimeBallot) => b.championship[4];
/** Twelfth in the predicted table takes the punishment. */
export const spoonOf = (b: HalftimeBallot) => b.rankings[b.rankings.length - 1];
/** Last one standing in the loser bowl. */
export const lastStandingOf = (b: HalftimeBallot) => b.loserBowl[4];

type VoterBallot = HalftimeBallot & { voter_id: string };

function votes(ballots: VoterBallot[], pick: (b: VoterBallot) => number) {
  const counts = new Map<number, string[]>();
  for (const b of ballots)
    counts.set(pick(b), [...(counts.get(pick(b)) ?? []), b.voter_id]);
  return [...counts]
    .map(([rosterId, voters]) => ({ rosterId, voters }))
    .sort(
      (a, b) => b.voters.length - a.voters.length || a.rosterId - b.rosterId,
    );
}

/** Revealed-ballot summaries: consensus table, champion and punishment votes. */
export function halftimeBallotSummary(
  ballots: VoterBallot[],
  rosterIds: number[],
) {
  const valid = [
    ...new Map(
      ballots
        .filter((b) => isCompleteHalftimeBallot(b, rosterIds))
        .map((b) => [b.voter_id, b]),
    ).values(),
  ];
  return {
    count: valid.length,
    consensus: calculateSeasonConsensus(valid, rosterIds),
    champions: votes(valid, championOf),
    spoons: votes(valid, spoonOf),
  };
}

/** The biggest single-team move between a manager's two ballots. */
export function changeOfHeart(preseason: number[], halftime: number[]) {
  if (preseason.length !== halftime.length || !preseason.length) return null;
  return (
    halftime
      .map((rosterId, i) => ({
        rosterId,
        from: preseason.indexOf(rosterId) + 1,
        to: i + 1,
      }))
      .filter((m) => m.from > 0 && m.from !== m.to)
      .sort(
        (a, b) =>
          Math.abs(b.from - b.to) - Math.abs(a.from - a.to) || a.to - b.to,
      )[0] ?? null
  );
}
