import { formatScore } from '@/lib/sleeper/scores';
import type { PredictionTeam, PredictionWeekData } from './predictions';

export type WireItem = { label: string; text: string };

type Result = { winner: PredictionTeam; loser: PredictionTeam; margin: number };

const score = (team: PredictionTeam) => formatScore(team.actualScore, 2);

/**
 * Broadcast-style facts for the homepage ticker, derived only from a settled
 * week. Missing scores are skipped rather than counted as zero.
 */
export function getLeagueWire(data: PredictionWeekData): WireItem[] {
  if (!data.finalized) return [];
  const scored = data.matchups.filter(
    (m) => m.home.actualScore != null && m.away.actualScore != null,
  );
  if (!scored.length) return [];
  const teams = scored.flatMap((m) => [m.home, m.away]);
  const byScore = [...teams].sort((a, b) => b.actualScore! - a.actualScore!);
  const results: Result[] = scored
    .filter((m) => m.home.actualScore !== m.away.actualScore)
    .map((m) => {
      const homeWon = m.home.actualScore! > m.away.actualScore!;
      return {
        winner: homeWon ? m.home : m.away,
        loser: homeWon ? m.away : m.home,
        margin: Math.abs(m.home.actualScore! - m.away.actualScore!),
      };
    })
    .sort((a, b) => a.margin - b.margin);
  const starters = teams
    .flatMap((team) =>
      team.starters
        .filter((player) => player.actualPoints != null)
        .map((player) => ({ player, team })),
    )
    .sort((a, b) => b.player.actualPoints! - a.player.actualPoints!);
  const unbeaten = teams.filter((t) => t.wins > 0 && !t.losses && !t.ties);
  const winless = teams.filter((t) => t.losses > 0 && !t.wins && !t.ties);
  const names = (list: PredictionTeam[]) =>
    list.map((team) => team.teamName).join(', ');

  const items: WireItem[] = [
    {
      label: `Week ${data.week} high`,
      text: `${byScore[0].teamName} ${score(byScore[0])}`,
    },
    {
      label: `Week ${data.week} low`,
      text: `${byScore.at(-1)!.teamName} ${score(byScore.at(-1)!)}`,
    },
  ];
  if (results.length) {
    const closest = results[0];
    const biggest = results.at(-1)!;
    items.push({
      label: 'Closest call',
      text: `${closest.winner.teamName} by ${formatScore(closest.margin, 2)} over ${closest.loser.teamName}`,
    });
    if (biggest !== closest)
      items.push({
        label: 'Biggest win',
        text: `${biggest.winner.teamName} by ${formatScore(biggest.margin, 2)} over ${biggest.loser.teamName}`,
      });
  }
  if (starters.length) {
    const { player, team } = starters[0];
    items.push({
      label: 'Top starter',
      text: `${player.name} ${formatScore(player.actualPoints, 2)} for ${team.teamName}`,
    });
  }
  if (unbeaten.length) items.push({ label: 'Unbeaten', text: names(unbeaten) });
  if (winless.length)
    items.push({ label: 'Still winless', text: names(winless) });
  return items;
}
