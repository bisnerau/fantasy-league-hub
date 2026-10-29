import type { HalftimeBallot } from '@/lib/season/halftime-ballot';

// Mackorcle's second-half ballot: the house entry, shown to a manager once
// they file and to everyone after the lock, never ranked against the
// managers. Authored, not generated. Roster ids; brackets follow
// lib/season/halftime-ballot.ts. His Mackjusted pet project on the ballot is
// Tommy.
export const houseBallot: HalftimeBallot & {
  lines: { table: string; champion: string; punishment: string };
} = {
  // Shane, Karl, Murphy, Jack, Keenan, Tommy | Joe, Burns, Murray, Hugo,
  // Sharpe, Alan (twelfth takes the punishment).
  rankings: [10, 5, 12, 9, 3, 4, 7, 1, 2, 8, 11, 6],
  // Jack beats Keenan, Tommy beats Murphy, Shane beats Jack, Tommy beats
  // Karl, Tommy beats Shane.
  championship: [9, 4, 10, 4, 4],
  // Losers go through: Murray, Hugo, Alan, Sharpe, then Alan is last one
  // standing.
  loserBowl: [2, 8, 6, 11, 6],
  lines: {
    table:
      'I’ve applied the standard adjustments. Tommy makes the playoffs. I don’t make the rules. I make the spreadsheet.',
    champion:
      'Tommy is one and six. His last three weeks are the second-best in the league. On a Mackjusted basis, Tommy is performing very well, and I’d like that on the record before he does it.',
    punishment:
      'Alan has the second-most points in the league. In my experience, points are a lagging indicator. Last place.',
  },
};
