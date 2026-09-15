import type {
  PredictionMatchup,
  PredictionPlayer,
  PredictionTeam,
} from '@/lib/data/predictions';
import type { SleeperMatchup } from '@/lib/sleeper/types';
import { matchupScore } from '@/lib/sleeper/scores';
import { scheduleSnapshot } from '@/lib/data/schedule-snapshot';
import { leagueMembers } from '@/lib/data/member-directory';

export type StorySection = { title: string; text: string };
export type MatchupStory = {
  version: 1;
  editorial?: boolean;
  headline: string;
  summary: string;
  sections: StorySection[];
};
export type MatchupPreview = MatchupStory & {
  publishedAt: string;
  pickRosterId: number;
  homeProjection: number;
  awayProjection: number;
};
export type StoryHistory = { week: number; rows: SleeperMatchup[] | null }[];
export type StoryContext = {
  leagueId: string;
  season: string;
  week: number;
  history: StoryHistory;
};
const points = (n: number) => n.toFixed(2);
const named = (p: PredictionPlayer) =>
  p.name !== p.id && !p.id.endsWith('-empty');
const short = (team: PredictionTeam) => team.ownerName.split(' ')[0];
const knownLeague = (context: StoryContext) =>
  context.leagueId === scheduleSnapshot.leagueId && context.season === '2026';

export function storyManagerName(
  rosterId: number,
  fallback: string,
  leagueId: string,
) {
  return leagueId === scheduleSnapshot.leagueId
    ? (leagueMembers.find((m) => m.rosterId === rosterId)?.displayName ??
        fallback)
    : fallback;
}

export function previewPublishTimeForLock(lockAt: string) {
  const date = new Date(lockAt);
  if (!Number.isFinite(date.getTime())) return date;
  date.setUTCDate(date.getUTCDate() - 3);
  const hour = new Intl.DateTimeFormat('en-IE', {
    timeZone: 'Europe/Dublin',
    hour: '2-digit',
    hourCycle: 'h23',
  });
  for (const utcHour of [10, 11]) {
    date.setUTCHours(utcHour, 0, 0, 0);
    if (hour.format(date) === '11') return date;
  }
  return new Date(NaN);
}

// Only publish during the Thursday morning edition. Never invent a preview
// after early games. Feed dates are game dates, not precise kickoff times.
export function canPublishPreview(
  lockAt: string,
  gameDates: string[],
  now = Date.now(),
) {
  const publication = previewPublishTimeForLock(lockAt).getTime();
  if (
    !Number.isFinite(publication) ||
    now < publication ||
    now >= publication + 2 * 60 * 60 * 1000
  )
    return false;
  const dates = gameDates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  return (
    dates.length > 0 &&
    dates[0] >= new Date(publication).toISOString().slice(0, 10)
  );
}

export function readPreview(value: unknown): MatchupPreview | null {
  if (!value || typeof value !== 'object') return null;
  const p = value as Partial<MatchupPreview>;
  return p.version === 1 &&
    typeof p.headline === 'string' &&
    typeof p.summary === 'string' &&
    typeof p.publishedAt === 'string' &&
    Number.isFinite(Date.parse(p.publishedAt)) &&
    Number.isInteger(p.pickRosterId) &&
    Number.isFinite(p.homeProjection) &&
    Number.isFinite(p.awayProjection) &&
    Array.isArray(p.sections) &&
    p.sections.every(
      (s) => s && typeof s.title === 'string' && typeof s.text === 'string',
    )
    ? (p as MatchupPreview)
    : null;
}

function seasonForm(team: PredictionTeam, context: StoryContext) {
  const weeks = context.history
    .filter((w) => w.week < context.week)
    .sort((a, b) => a.week - b.week);
  if (context.week === 1)
    return `${short(team)} starts at 0–0. Last season’s reputation has yet to put a point on this year’s board.`;
  if (weeks.length !== context.week - 1)
    return `${short(team)}’s complete pregame form is unavailable.`;
  let wins = 0,
    losses = 0,
    ties = 0;
  const scores: number[] = [];
  const outcomes: string[] = [];
  for (const week of weeks) {
    const row = week.rows?.find((r) => r.roster_id === team.rosterId);
    const opponents =
      row?.matchup_id == null
        ? []
        : (week.rows?.filter(
            (r) =>
              r.matchup_id === row.matchup_id && r.roster_id !== row.roster_id,
          ) ?? []);
    const own = row ? matchupScore(row) : null;
    const other = opponents.length === 1 ? matchupScore(opponents[0]) : null;
    if (own === null || other === null)
      return `${short(team)}’s complete pregame form is unavailable.`;
    scores.push(own);
    if (own > other) {
      wins++;
      outcomes.push('W');
    } else if (own < other) {
      losses++;
      outcomes.push('L');
    } else {
      ties++;
      outcomes.push('T');
    }
  }
  const recent = scores.slice(-3);
  return `${short(team)} arrives ${wins}–${losses}${ties ? `–${ties}` : ''}, with ${outcomes.slice(-3).join('–')} across the last ${recent.length === 1 ? 'game' : `${recent.length} games`} and ${points(recent.reduce((a, b) => a + b, 0) / recent.length)} points per game in that stretch.`;
}

function rivalry(
  matchup: PredictionMatchup,
  context: StoryContext,
): StorySection | null {
  if (!knownLeague(context)) return null;
  const { home, away } = matchup;
  if ([home.rosterId, away.rosterId].sort((a, b) => a - b).join(',') === '6,8')
    return {
      title: 'The household derby',
      text: 'Hugo and Alan live together, so this one comes with a home address for the bragging rights. The winner gets the result; the loser gets to hear about it without even opening the group chat.',
    };
  const games = scheduleSnapshot.history.filter(
    (g) =>
      (g.home === home.rosterId && g.away === away.rosterId) ||
      (g.home === away.rosterId && g.away === home.rosterId),
  );
  if (!games.length) return null;
  let wins = 0,
    losses = 0,
    ties = 0;
  for (const g of games) {
    const h = g.home === home.rosterId ? g.homePoints : g.awayPoints;
    const a = g.home === home.rosterId ? g.awayPoints : g.homePoints;
    if (h > a) wins++;
    else if (h < a) losses++;
    else ties++;
  }
  return {
    title: 'Previous meetings',
    text: `In the verified 2025 meetings, ${short(home)} went ${wins}–${losses}${ties ? `–${ties}` : ''} against ${short(away)}. ${wins === losses ? 'Neither has much room to talk. That is unlikely to stop either of them.' : `${wins > losses ? short(away) : short(home)} has an opportunity to make that history less useful in an argument.`}`,
  };
}

function keyPlayer(team: PredictionTeam) {
  const ranked = team.starters
    .filter((p) => named(p) && p.projectedPoints !== null)
    .sort((a, b) => b.projectedPoints! - a.projectedPoints!);
  return ranked[0] ?? null;
}

function positionEdge(home: PredictionTeam, away: PredictionTeam) {
  const slots = [
    ...new Set([...home.starters, ...away.starters].map((p) => p.slot)),
  ];
  return slots
    .flatMap((slot) => {
      const h = home.starters.filter((p) => p.slot === slot);
      const a = away.starters.filter((p) => p.slot === slot);
      if (
        !h.length ||
        h.length !== a.length ||
        [...h, ...a].some((p) => p.projectedPoints === null)
      )
        return [];
      const hp = h.reduce((sum, p) => sum + p.projectedPoints!, 0);
      const ap = a.reduce((sum, p) => sum + p.projectedPoints!, 0);
      return [{ slot, hp, ap, gap: Math.abs(hp - ap) }];
    })
    .sort((a, b) => b.gap - a.gap)[0];
}

export function createMatchupPreview(
  matchup: PredictionMatchup,
  context: StoryContext,
  now = Date.now(),
): MatchupPreview | null {
  const { home, away } = matchup;
  if (
    home.projectedScore === null ||
    away.projectedScore === null ||
    !Number.isFinite(home.projectedScore) ||
    !Number.isFinite(away.projectedScore) ||
    home.projectedScore <= 0 ||
    away.projectedScore <= 0
  )
    return null;
  const favourite = home.projectedScore >= away.projectedScore ? home : away;
  const underdog = favourite === home ? away : home;
  const margin = Math.abs(home.projectedScore - away.projectedScore);
  const h = keyPlayer(home),
    a = keyPlayer(away),
    edge = positionEdge(home, away);
  const household =
    knownLeague(context) &&
    [home.rosterId, away.rosterId].includes(6) &&
    [home.rosterId, away.rosterId].includes(8);
  const summary = `${household ? 'One roof, two lineups, no escape from the result. ' : ''}${short(favourite)} gets ${margin < 5 ? 'a very cautious nod' : margin < 15 ? 'the nod' : 'the favourites’ billing'}: ${points(favourite.projectedScore!)} to ${points(underdog.projectedScore!)} in the PPR estimates. ${margin < 5 ? 'This is close enough for one ordinary catch to make the preview look foolish.' : margin < 15 ? `${short(underdog)} is one big performance away from making that look presumptuous.` : `${short(underdog)} needs more than a respectable afternoon. The projected gap is ${points(margin)} points.`}`;
  const sections: StorySection[] = [
    {
      title: 'Coming into the week',
      text: `${seasonForm(home, context)} ${seasonForm(away, context)}`,
    },
  ];
  if (h && a)
    sections.push({
      title: 'The players carrying the argument',
      text: `${h.name} leads ${short(home)}’s starting-lineup estimates at ${points(h.projectedPoints!)}; ${a.name} heads ${short(away)}’s at ${points(a.projectedPoints!)}. Those are the two biggest projected contributions, so an ordinary day from one and a big day from the other can reshape the contest.`,
    });
  if (edge && edge.gap > 0)
    sections.push({
      title: 'Where the gap opens',
      text: `The largest projected lineup-slot difference is at ${edge.slot}: ${points(edge.hp)} for ${short(home)}, ${points(edge.ap)} for ${short(away)}. That ${points(edge.gap)}-point edge gives ${edge.hp > edge.ap ? short(home) : short(away)} a starting point, not a result to bank.`,
    });
  const history = rivalry(matchup, context);
  if (history) sections.push(history);
  sections.push({
    title: 'The call',
    text: `${favourite.ownerName} to win. ${margin === 0 ? 'The estimates are level; this is a coin-flip editorial call, with the first-listed team getting the nod.' : `The call follows the higher complete starting-lineup PPR estimate, a ${points(margin)}-point edge.`} This is a Thursday snapshot, not a win probability. Later lineup moves and injuries can change the outlook; this call stays on the record.`,
  });
  return {
    version: 1,
    headline: household
      ? 'Bragging rights come home'
      : margin < 5
        ? 'A thin edge and a loud argument'
        : `${short(favourite)} sets the target`,
    summary,
    sections,
    publishedAt: new Date(now).toISOString(),
    pickRosterId: favourite.rosterId,
    homeProjection: home.projectedScore,
    awayProjection: away.projectedScore,
  };
}

const fits = (player: PredictionPlayer, slot: string) => {
  const allowed: Record<string, string[]> = {
    FLEX: ['RB', 'WR', 'TE'],
    WRRB_FLEX: ['RB', 'WR'],
    REC_FLEX: ['WR', 'TE'],
    SUPER_FLEX: ['QB', 'RB', 'WR', 'TE'],
  };
  return (player.eligiblePositions ?? [player.position]).some((p) =>
    (allowed[slot] ?? [slot]).includes(p),
  );
};

// A single legal positional swap, not a sum of incompatible bench alternatives.
export function bestBenchSwap(team: PredictionTeam) {
  return (
    team.bench
      .flatMap((bench) =>
        team.starters.flatMap((starter) =>
          named(bench) &&
          named(starter) &&
          bench.actualPoints != null &&
          starter.actualPoints != null &&
          fits(bench, starter.slot) &&
          bench.actualPoints > starter.actualPoints
            ? [
                {
                  bench,
                  starter,
                  gain:
                    Math.round(
                      (bench.actualPoints - starter.actualPoints) * 100,
                    ) / 100,
                },
              ]
            : [],
        ),
      )
      .sort((a, b) => b.gain - a.gain)[0] ?? null
  );
}

function performance(team: PredictionTeam): StorySection {
  const starters = team.starters.filter((p) => !p.id.endsWith('-empty'));
  const complete =
    starters.length > 0 &&
    starters.every((p) => p.actualPoints != null && named(p));
  if (!complete)
    return {
      title: `${short(team)}’s lineup`,
      text: 'The final team score is confirmed. A complete named starter breakdown is unavailable, so we are holding the individual honours.',
    };
  const ranked = [...starters].sort(
    (a, b) => b.actualPoints! - a.actualPoints!,
  );
  const top = ranked[0],
    bottom = ranked.at(-1)!;
  return {
    title: `${short(team)}’s difference-makers`,
    text: `${top.name} supplied the biggest starting-lineup contribution at ${points(top.actualPoints!)} points${ranked[1] ? `${ranked[1].actualPoints === top.actualPoints ? ', alongside' : ', followed by'} ${ranked[1].name} with ${points(ranked[1].actualPoints!)}` : ''}. ${top.id !== bottom.id ? `${bottom.name} returned ${points(bottom.actualPoints!)} at ${bottom.slot}, the smallest contribution in this lineup.` : ''}`.trim(),
  };
}

export function createMatchupReview(
  matchup: PredictionMatchup,
  context: StoryContext,
  weekScores: number[],
): MatchupStory | null {
  const { home, away } = matchup;
  if (
    home.actualScore === null ||
    away.actualScore === null ||
    !Number.isFinite(home.actualScore) ||
    !Number.isFinite(away.actualScore)
  )
    return null;
  const tied = home.actualScore === away.actualScore;
  const winner = home.actualScore >= away.actualScore ? home : away;
  const loser = winner === home ? away : home;
  const margin =
    Math.round(Math.abs(home.actualScore - away.actualScore) * 100) / 100;
  const beaten = weekScores.filter((s) => s < loser.actualScore!).length;
  const aboveWinner = weekScores.filter((s) => s > winner.actualScore!).length;
  const leagueContext = weekScores.length > 2;
  const unlucky =
    leagueContext && beaten >= Math.ceil((weekScores.length - 1) / 2);
  const escape =
    leagueContext && aboveWinner >= Math.ceil((weekScores.length - 1) / 2);
  const summary = tied
    ? `${short(home)} and ${short(away)} finish level at ${points(home.actualScore)}. Neither gets the win, and neither gets exclusive rights to the excuse.`
    : `${short(winner)} beats ${short(loser)} ${points(winner.actualScore!)}–${points(loser.actualScore!)}, winning by ${points(margin)} points. ${unlucky ? `${short(loser)} outscored ${beaten} of the other ${weekScores.length - 1} teams and still lost. For once, the schedule complaint comes with evidence.` : escape ? `${aboveWinner} of the other ${weekScores.length - 1} teams would have beaten ${short(winner)}. Take the win and leave before anyone checks the receipt.` : margin < 5 ? 'A tiny margin, a full win, and enough material for a week of second-guessing.' : margin >= 30 ? 'The scoreboard did the talking. There was rather a lot of talking.' : 'A clear enough result to settle the fixture, if not the group chat.'}`;
  const sections: StorySection[] = [performance(winner), performance(loser)];
  const swing = positionEdge(
    {
      ...winner,
      starters: winner.starters.map((p) => ({
        ...p,
        projectedPoints: p.actualPoints,
      })),
    },
    {
      ...loser,
      starters: loser.starters.map((p) => ({
        ...p,
        projectedPoints: p.actualPoints,
      })),
    },
  );
  if (!tied && swing && swing.hp > swing.ap) {
    sections.unshift({
      title: 'Where the difference opened',
      text: `The ${swing.slot} slots produced ${points(swing.hp)} points for ${short(winner)} against ${points(swing.ap)} for ${short(loser)}. That is a ${points(swing.gap)}-point advantage in one part of the lineup${swing.gap > margin ? `, larger than the final ${points(margin)}-point winning margin` : `, against a final winning margin of ${points(margin)} points`}.`,
    });
  }
  const swap = bestBenchSwap(loser);
  if (swap)
    sections.push({
      title: 'The bench receipt',
      text: `${short(loser)} had ${swap.bench.name} on the bench with ${points(swap.bench.actualPoints!)}. A position-compatible swap for ${swap.starter.name} (${points(swap.starter.actualPoints!)} at ${swap.starter.slot}) adds ${points(swap.gain)} points${!tied && swap.gain > margin ? ' — enough to reverse this result' : !tied && Math.abs(swap.gain - margin) < 0.005 ? ' — enough to tie this result' : !tied ? `, leaving ${points(margin - swap.gain)} points still to find` : ''}. A hindsight comparison using the recorded roster; availability before each player’s kickoff is not verified.`,
    });
  else
    sections.push({
      title: 'The bench receipt',
      text: `${short(loser)} has no confirmed single position-compatible bench swap that improves the recorded lineup in the available data. Missing individual scores are not treated as zero.`,
    });
  const preview = matchup.preview;
  sections.push({
    title: 'How our call aged',
    text: !preview
      ? 'No preview was saved before this game. There is no claimed prediction and no retrospective victory lap.'
      : tied
        ? `We picked ${preview.pickRosterId === home.rosterId ? home.ownerName : away.ownerName}. The tie means that winner call did not land.`
        : preview.pickRosterId === winner.rosterId
          ? `We picked ${winner.ownerName}, and the call landed. The saved Thursday estimates were ${points(preview.homeProjection)}–${points(preview.awayProjection)}; the final score was ${points(home.actualScore)}–${points(away.actualScore)}. We will accept the correct call without pretending we predicted every detail.`
          : `We picked ${loser.ownerName}. ${short(winner)} made that look unwise. The saved Thursday estimates were ${points(preview.homeProjection)}–${points(preview.awayProjection)}, against a final ${points(home.actualScore)}–${points(away.actualScore)}. That is a miss, and it stays on the record.`,
  });
  if (
    knownLeague(context) &&
    [home.rosterId, away.rosterId].includes(6) &&
    [home.rosterId, away.rosterId].includes(8)
  )
    sections.push({
      title: 'Back at the house',
      text: tied
        ? 'Hugo and Alan can return home with equally incomplete bragging rights.'
        : `${short(winner)} takes this one home. Unfortunately for ${short(loser)}, they share that home. The rematch cannot come quickly enough.`,
    });
  return {
    version: 1,
    headline: tied
      ? 'Honours shared, arguments pending'
      : unlucky
        ? `${short(loser)} has a case`
        : escape
          ? `${short(winner)} gets away with it`
          : margin < 5
            ? `${short(winner)}, by the finest of margins`
            : `${short(winner)} takes the points`,
    summary,
    sections,
  };
}
