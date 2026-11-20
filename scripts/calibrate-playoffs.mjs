// Reproducible, chronological validation of frozen pregame projections.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { leaguePoints, normalCdf } from '../lib/playoffs/scoring.ts';
const get = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw Error(`Feed ${r.status}`);
  return r.json();
};
const leagueId = process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID;
const league = await get(`https://api.sleeper.app/v1/league/${leagueId}`);
const words = ['four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const observations = [],
  skipped = [],
  backtests = [];
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const fit = (rows) => {
  const pooled = rows.reduce((s, r) => s + r.error ** 2, 0) / rows.length;
  const positionVariance = Object.fromEntries(
    ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'].map((pos) => {
      const p = rows.filter((r) => r.position === pos);
      return [
        pos,
        (p.reduce((s, r) => s + r.error ** 2, 0) + 20 * pooled) /
          (p.length + 20),
      ];
    }),
  );
  const groups = Map.groupBy(rows, (r) => `${r.week}:${r.rosterId}`);
  let observed = 0,
    expected = 0;
  for (const group of groups.values()) {
    observed += group.reduce((s, r) => s + r.error, 0) ** 2;
    expected += group.reduce((s, r) => s + positionVariance[r.position], 0);
  }
  return { positionVariance, teamVarianceScale: observed / expected };
};
for (let index = 0; index < words.length; index++) {
  const week = index + 4;
  const snapshot = JSON.parse(
    readFileSync(`lib/data/experiments/odds-week-${words[index]}.json`, 'utf8'),
  );
  const stats = await get(
    `https://api.sleeper.app/stats/nfl/${league.season}/${week}?season_type=regular&position[]=QB&position[]=RB&position[]=WR&position[]=TE&position[]=K&position[]=DEF`,
  );
  const archivePath = `docs/research/2026-week-${week}-results.json`;
  const archive = existsSync(archivePath)
    ? JSON.parse(readFileSync(archivePath, 'utf8'))
    : null;
  const archived = new Map();
  for (const team of archive?.teams ?? archive?.rows ?? []) {
    const id = team.roster_id ?? team.rosterId;
    for (const [playerId, points] of Object.entries(team.players_points ?? {}))
      if (Number.isFinite(points)) archived.set(`${id}:${playerId}`, points);
    for (const player of [...(team.starters ?? []), ...(team.bench ?? [])])
      if (player?.id && Number.isFinite(player.points))
        archived.set(`${id}:${player.id}`, player.points);
  }
  const names = new Map();
  for (const row of stats) {
    const p = row.player;
    const name = normalize(`${p.first_name} ${p.last_name}`);
    if (!names.has(name)) names.set(name, []);
    names.get(name).push(row);
  }
  const rows = [];
  for (const matchup of snapshot.matchups)
    for (const team of matchup.teams)
      for (const p of team.lineup) {
        if (p.locked) continue;
        let matches = names.get(normalize(p.name)) ?? [];
        if (p.position === 'DEF')
          matches = stats.filter(
            (s) =>
              s.player.position === 'DEF' &&
              normalize(`${s.player.first_name} ${s.player.last_name}`) ===
                normalize(p.name),
          );
        if (matches.length !== 1) {
          skipped.push({
            week,
            name: p.name,
            reason: 'No unique archived stat row',
          });
          continue;
        }
        const stat = matches[0];
        if (
          new Date(`${stat.date}T00:00:00-04:00`) <= new Date(snapshot.snapshot)
        ) {
          skipped.push({
            week,
            name: p.name,
            reason: 'Pregame cutoff not verified',
          });
          continue;
        }
        const archivedScore = archived.get(`${team.id}:${stat.player_id}`);
        const actual =
          archivedScore ?? leaguePoints(stat.stats, league.scoring_settings);
        const actualAsOf =
          archivedScore === undefined
            ? new Date().toISOString()
            : archive.retrievedAt;
        rows.push({
          week,
          rosterId: team.id,
          playerId: stat.player_id,
          name: p.name,
          position: p.position,
          projected: p.points,
          actual,
          actualAsOf,
          actualSource:
            archivedScore === undefined
              ? `Sleeper stats retrieved ${actualAsOf}`
              : archivePath,
          error: actual - p.points,
          cutoff: snapshot.snapshot,
        });
      }
  const availableTraining = observations.filter(
    (row) => Date.parse(row.actualAsOf) < Date.parse(snapshot.snapshot),
  );
  if (availableTraining.length) {
    const params = fit(availableTraining);
    let brier = 0,
      games = 0,
      covered = 0;
    const groups = Map.groupBy(rows, (r) => r.rosterId);
    for (const matchup of snapshot.matchups) {
      const [a, b] = matchup.teams.map((t) => groups.get(t.id));
      if (!a || !b) continue;
      const mean = (x) => x.reduce((s, r) => s + r.projected, 0),
        actual = (x) => x.reduce((s, r) => s + r.actual, 0);
      const variance = (x) =>
        x.reduce((s, r) => s + params.positionVariance[r.position], 0) *
        params.teamVarianceScale;
      const p = normalCdf(
        (mean(a) - mean(b)) / Math.sqrt(variance(a) + variance(b)),
      );
      brier +=
        (p - (actual(a) > actual(b) ? 1 : actual(a) < actual(b) ? 0 : 0.5)) **
        2;
      games++;
    }
    for (const group of groups.values()) {
      const e = group.reduce((s, r) => s + r.error, 0),
        v =
          group.reduce((s, r) => s + params.positionVariance[r.position], 0) *
          params.teamVarianceScale;
      if (Math.abs(e) <= 1.645 * Math.sqrt(v)) covered++;
    }
    backtests.push({
      week,
      trainedThrough: Math.max(...availableTraining.map((r) => r.week)),
      trainingSamples: availableTraining.length,
      trainingWeeks: [...new Set(availableTraining.map((r) => r.week))],
      playerRMSE: Math.sqrt(
        rows.reduce((s, r) => s + r.error ** 2, 0) / rows.length,
      ),
      unbankedLineup90Coverage: covered / groups.size,
      unbankedLineupMatchupBrier: brier / games,
      games,
    });
  }
  observations.push(...rows);
}
if (observations.length < 300) throw Error('Insufficient matched archive');
const calibration = {
  version: '2026-weeks4-10-v1',
  throughWeek: 10,
  samples: observations.length,
  ...fit(observations),
  summary:
    'Pooled squared pregame errors from frozen Weeks 4–10 base projections; 20 pooled observations shrink each position estimate. Team variance is fitted to unbanked lineup errors. Six chronological holdouts are descriptive, not proof of season-end calibration.',
};
writeFileSync(
  'lib/data/playoffs/calibration.json',
  JSON.stringify(calibration, null, 2) + '\n',
);
writeFileSync(
  'docs/research/2026-playoff-calibration.json',
  JSON.stringify({ calibration, backtests, skipped, observations }, null, 2) +
    '\n',
);
console.log(
  JSON.stringify({ calibration, backtests, skipped: skipped.length }, null, 2),
);
