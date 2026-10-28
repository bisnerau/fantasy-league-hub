import {
  calculateSeasonConsensus,
  isCompleteForecast,
} from '@/lib/predictions/season-consensus';

export type ForecastProfile = {
  id: string;
  display_name: string;
  roster_id: number | null;
};
export type ForecastBallot = { voter_id: string; rankings: number[] };
type Team = { id: number; name: string; rank: number; ai: number };

export function halftimeForecastInsights(
  ballots: ForecastBallot[],
  profiles: ForecastProfile[],
  teams: Team[],
) {
  const ids = teams.map((t) => t.id);
  const valid = [
    ...new Map(
      ballots
        .filter((b) => isCompleteForecast(b.rankings, ids))
        .map((b) => [b.voter_id, b]),
    ).values(),
  ];
  if (!valid.length) return null;
  const name = (id: string) =>
    profiles.find((p) => p.id === id)?.display_name ?? 'Submitted manager';
  const consensus = calculateSeasonConsensus(valid, ids);
  const splits = teams
    .map((t) => {
      const positions = valid.map((b) => b.rankings.indexOf(t.id) + 1);
      const high = Math.min(...positions),
        low = Math.max(...positions);
      return {
        rosterId: t.id,
        name: t.name,
        high,
        low,
        spread: low - high,
        believers: valid
          .filter((b) => b.rankings.indexOf(t.id) + 1 === high)
          .map((b) => name(b.voter_id)),
        doubters: valid
          .filter((b) => b.rankings.indexOf(t.id) + 1 === low)
          .map((b) => name(b.voter_id)),
      };
    })
    .sort((a, b) => b.spread - a.spread || a.rosterId - b.rosterId);
  const own = valid
    .flatMap((b) => {
      const profile = profiles.find((p) => p.id === b.voter_id);
      const team = teams.find((t) => t.id === profile?.roster_id);
      if (!team) return [];
      const predicted = b.rankings.indexOf(team.id) + 1;
      return [
        {
          name: name(b.voter_id),
          rosterId: team.id,
          predicted,
          actual: team.rank,
          gap: team.rank - predicted,
        },
      ];
    })
    .sort((a, b) => b.gap - a.gap || a.rosterId - b.rosterId);
  const scores = [
    ...valid.map((b) => ({
      id: b.voter_id,
      name: name(b.voter_id),
      rankings: b.rankings,
      ai: false,
    })),
    {
      id: 'ai',
      name: 'The AI',
      rankings: [...teams].sort((a, b) => a.ai - b.ai).map((t) => t.id),
      ai: true,
    },
  ]
    .map((b) => {
      const rows = teams.map((t) => ({
        name: t.name,
        predicted: b.rankings.indexOf(t.id) + 1,
        actual: t.rank,
        gap: Math.abs(b.rankings.indexOf(t.id) + 1 - t.rank),
      }));
      return {
        ...b,
        error: rows.reduce((n, r) => n + r.gap, 0),
        exact: rows.filter((r) => r.gap === 0).length,
        rows,
      };
    })
    .sort((a, b) => a.error - b.error || a.name.localeCompare(b.name));
  const surprise = [...teams].sort(
    (a, b) =>
      consensus.findIndex((r) => r.rosterId === b.id) +
      1 -
      b.rank -
      (consensus.findIndex((r) => r.rosterId === a.id) + 1 - a.rank),
  )[0];
  const surpriseConsensus =
    consensus.findIndex((r) => r.rosterId === surprise.id) + 1;
  return {
    count: valid.length,
    splits: splits.filter((s) => s.spread === splits[0].spread),
    optimism: own.filter((o) => o.gap > 0 && o.gap === own[0]?.gap),
    surprise:
      surpriseConsensus > surprise.rank
        ? {
            ...splits.find((s) => s.rosterId === surprise.id)!,
            actual: surprise.rank,
            consensus: surpriseConsensus,
          }
        : null,
    scores: scores.map((s) => ({
      ...s,
      position: scores.findIndex((other) => other.error === s.error) + 1,
    })),
  };
}
