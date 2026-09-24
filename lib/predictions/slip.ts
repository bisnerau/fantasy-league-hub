import type { PredictionMatchup, PredictionTeam } from '@/lib/data/predictions';
import type { BankerRecord, VoteRecord } from '@/lib/predictions/votes';

export type Verdict = 'won' | 'lost' | 'void';

export type Selection = {
  matchupId: number;
  sleeperMatchupId: number;
  team: PredictionTeam;
  banker: boolean;
  /** Null until both final scores exist; missing is never a loss. */
  verdict: Verdict | null;
};

export type Slip = {
  selections: Selection[];
  total: number;
  banker: Selection | null;
  /** Picks plus one for a Banker: the most this slip can return. */
  maxReturn: number;
  /** The first matchup without a saved pick, in display order. */
  nextOpen: number | null;
};

export function verdictFor(
  matchup: Pick<PredictionMatchup, 'home' | 'away'>,
  rosterId: number,
): Verdict | null {
  const { home, away } = matchup;
  if (home.actualScore == null || away.actualScore == null) return null;
  if (home.actualScore === away.actualScore) return 'void';
  const winner =
    home.actualScore > away.actualScore ? home.rosterId : away.rosterId;
  return winner === rosterId ? 'won' : 'lost';
}

/** A member's saved picks for the week, read as a bet slip. */
export function getSlip(
  matchups: PredictionMatchup[],
  votes: VoteRecord[],
  bankers: BankerRecord[],
  voterId: string | undefined,
): Slip {
  const selections = matchups.flatMap((matchup): Selection[] => {
    const vote = votes.find(
      (candidate) =>
        candidate.voter_id === voterId &&
        candidate.matchup_id === matchup.databaseId,
    );
    if (!vote || matchup.databaseId == null) return [];
    const team =
      vote.selected_roster_id === matchup.home.rosterId
        ? matchup.home
        : vote.selected_roster_id === matchup.away.rosterId
          ? matchup.away
          : null;
    if (!team) return [];
    return [
      {
        matchupId: matchup.databaseId,
        sleeperMatchupId: matchup.sleeperMatchupId,
        team,
        banker: bankers.some(
          (banker) =>
            banker.voter_id === voterId &&
            banker.matchup_id === matchup.databaseId,
        ),
        verdict: verdictFor(matchup, team.rosterId),
      },
    ];
  });
  const banker = selections.find((selection) => selection.banker) ?? null;
  const picked = new Set(selections.map((s) => s.sleeperMatchupId));
  return {
    selections,
    total: matchups.length,
    banker,
    maxReturn: selections.length + (banker ? 1 : 0),
    nextOpen:
      matchups.find((matchup) => !picked.has(matchup.sleeperMatchupId))
        ?.sleeperMatchupId ?? null,
  };
}
