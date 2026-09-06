export function isCompleteForecast(
  rankings: unknown,
  rosterIds: number[],
): rankings is number[] {
  return (
    Array.isArray(rankings) &&
    rankings.length === rosterIds.length &&
    new Set(rankings).size === rosterIds.length &&
    rankings.every((id) => rosterIds.includes(id))
  );
}

export function calculateSeasonConsensus(
  ballots: Array<{ voter_id: string; rankings: number[] }>,
  rosterIds: number[],
) {
  const valid = [
    ...new Map(
      ballots
        .filter((b) => isCompleteForecast(b.rankings, rosterIds))
        .map((b) => [b.voter_id, b]),
    ).values(),
  ];
  if (!valid.length) return [];
  return rosterIds
    .map((rosterId) => {
      const positions = valid.map((b) => b.rankings.indexOf(rosterId) + 1);
      return {
        rosterId,
        averagePosition: positions.reduce((a, b) => a + b, 0) / valid.length,
        firstPlaceVotes: positions.filter((p) => p === 1).length,
        ballots: valid.length,
      };
    })
    .sort(
      (a, b) =>
        a.averagePosition - b.averagePosition ||
        b.firstPlaceVotes - a.firstPlaceVotes ||
        a.rosterId - b.rosterId,
    );
}
