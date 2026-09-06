import { draftRecapContent } from './draft-recap-content';
import { draftByeByPick } from './draft-byes';
import { scheduleSnapshot } from './schedule-snapshot';

export function headToHead(rosterId: number, opponentId: number) {
  const games = scheduleSnapshot.history.filter(
    (g) =>
      (g.home === rosterId && g.away === opponentId) ||
      (g.away === rosterId && g.home === opponentId),
  );
  let wins = 0;
  let losses = 0;
  let ties = 0;
  for (const game of games) {
    const own = game.home === rosterId ? game.homePoints : game.awayPoints;
    const other = game.home === rosterId ? game.awayPoints : game.homePoints;
    if (own > other) wins++;
    else if (own < other) losses++;
    else ties++;
  }
  return { wins, losses, ties, games: games.length };
}

export function getSchedulePreview(rosterId: number) {
  const entry = draftRecapContent.entries.find((e) => e.rosterId === rosterId);
  if (!entry) return null;
  const fixtures = scheduleSnapshot.fixtures
    .filter((g) => g.home === rosterId || g.away === rosterId)
    .sort((a, b) => a.week - b.week)
    .map((g) => {
      const opponentId = g.home === rosterId ? g.away : g.home;
      const opponent = draftRecapContent.entries.find(
        (e) => e.rosterId === opponentId,
      )!;
      return {
        week: g.week,
        opponent,
        history: headToHead(rosterId, opponentId),
        byes: entry.picks.filter((p) => draftByeByPick[p.overall] === g.week),
      };
    });
  if (fixtures.length !== 14) return null;
  const stretches = fixtures.slice(0, -2).map((_, i) => {
    const games = fixtures.slice(i, i + 3);
    return {
      games,
      average:
        games.reduce((sum, g) => sum + g.opponent.predictedFinish, 0) / 3,
    };
  });
  const toughest = stretches.sort(
    (a, b) => a.average - b.average || a.games[0].week - b.games[0].week,
  )[0];
  const byeWatch = [...fixtures].sort(
    (a, b) =>
      b.byes.filter((p) => p.round <= 7).length -
        a.byes.filter((p) => p.round <= 7).length ||
      b.byes.length - a.byes.length ||
      a.week - b.week,
  )[0];
  return {
    fixtures,
    toughest,
    byeWatch,
    average:
      fixtures.reduce((sum, f) => sum + f.opponent.predictedFinish, 0) /
      fixtures.length,
  };
}

export const scheduleStories: Record<
  number,
  { opponentId: number; title: string; story: string; verdict: string }
> = {
  1: {
    opponentId: 3,
    title: 'The old guard derby',
    story:
      'Keenan won the 2021 title; Burns answered in 2023. Their long-running argument over the league pecking order gets two more hearings, in Weeks 3 and 14. Neither man is likely to accept the result as legally binding.',
    verdict:
      'Joe opens the season and comes back in Week 12, while Keenan gets the final regular-season word. For a commissioner with six straight playoff appearances, this is a perfectly reasonable route to another one. Expect any defeat to be followed by an unsolicited trade offer explaining why it was actually good for the league.',
  },
  2: {
    opponentId: 6,
    title: 'The champions’ hangover club',
    story:
      'The 2024 champion meets the 2025 champion in Weeks 3 and 14. Niall has already demonstrated how quickly a crown can become a forfeit. Alan will be hoping this is a football game rather than a compulsory induction course.',
    verdict:
      'Karl, Jack and Alan make the opening three weeks a proper test of the comeback story. The same trio returns in Weeks 12–14, so there is no discreet exit through the gift shop. Niall needs the title-winning version of himself available at both ends of the season; the 50 Challenge version can stay at home.',
  },
  3: {
    opponentId: 1,
    title: 'Another round with the commissioner',
    story:
      'Keenan’s 2021 championship and Burns’s 2023 title give this fixture its history. Weeks 3 and 14 offer two chances to interrupt the commissioner’s permanent residency near the top. Winning the argument in the group chat remains an entirely separate competition.',
    verdict:
      'Tommy and Joe come before the first Burns meeting, and the same three opponents return to close the season. That gives Keenan a wonderfully clear before-and-after photograph of his campaign. Ideally the second picture will show progress, rather than a man pointing at his 2021 trophy with increasing urgency.',
  },
  4: {
    opponentId: 1,
    title: 'The 2023 final revisited',
    story:
      'Burns beat Tommy to the 2023 championship. Their Week 11 meeting is a chance to revisit the one that got away, ideally with fewer explanations about a player’s underlying opportunity. A revenge win would land considerably better than another excellent scouting report.',
    verdict:
      'The opener against Keenan is an early chance to turn knowledge into an actual result. Karl arrives immediately afterwards and again in Week 13, which is inconsiderate scheduling for a man trying to launch twelve breakout campaigns at once. Tommy needs points on the board before the commissioner rematch becomes another oral history of what might have been.',
  },
  5: {
    opponentId: 6,
    title: 'The 2025 final rematch',
    story:
      'Alan won the 2025 championship with Karl finishing runner-up. Week 8 puts the reigning champion opposite this report’s preseason favourite. Karl finally gets a named defendant for his scheduling complaints; Alan gets fresh material for the newsletter.',
    verdict:
      'The Alan rematch is the emotional centrepiece, but Joe appears in Weeks 3 and 14 and Burns follows the first Joe game. There is plenty here for a genuine contender and even more for a highly motivated complaints department. Karl has the report’s top-rated roster; the schedule is unlikely to accept responsibility if he leaves it unused.',
  },
  6: {
    opponentId: 5,
    title: 'Keep the receipt, Karl',
    story:
      'Week 8 brings a rematch of the 2025 championship final, with Alan defending the bragging rights against Karl. The trophy says Alan won the last big argument. Karl may still be preparing a supplementary document about points against.',
    verdict:
      'Shane opens the title defence and returns in Week 12; Niall bookends the run-in with another champions’ meeting in Week 14. The Karl fixture is the obvious headline, but Alan still has to negotiate Joe and Burns in consecutive weeks first. The newsletter can call this a triumphal tour once the actual wins have been collected.',
  },
  7: {
    opponentId: 12,
    title: 'The draft consultant derby',
    story:
      'League lore credits Joe with picking Aidan’s team one year. Their Week 6 meeting asks whether the consultant can beat the client, or whether he has once again delivered a better product to somebody else. Any invoice should probably be paid in playoff wins.',
    verdict:
      'Burns and Karl feature in both the opening three weeks and the final three. That is a serious test of a roster the report likes, with no gentle final-week glide into Joe’s beloved fourth place. Beat the repeat heavyweights and the ceiling might finally move; lose to Aidan and the consultancy business needs a very awkward performance review.',
  },
  8: {
    opponentId: 4,
    title: 'Forfeit survivors’ reunion',
    story:
      'Hugo’s 2023 busking debut followed Tommy’s consecutive Wall of Shame years in 2021 and 2022. Their Week 7 meeting brings together two men with unusually strong evidence that this league should never organise your social calendar. The aim is to keep the entertainment on the pitch this time.',
    verdict:
      'Jack, Alan and Aidan open the schedule and return in the final three weeks. Hugo’s recovery from a 2–12 debut has earned him the right to treat those as opportunities rather than public performances. Banking wins through the middle is advisable; a late audition for Grafton Street is not the sort of encore anyone requested.',
  },
  9: {
    opponentId: 10,
    title: 'The calendar grudge match',
    story:
      'The manager profiles trace this feud to Shane’s forgotten 2024 lineup and the Wall of Shame consequences for Jack. Week 11 gives Jack an actual fixture in which to settle it. Shane setting a complete team would at least ensure this instalment has two participants.',
    verdict:
      'Hugo, Niall and Tommy form a start Jack needs to use before Joe, Burns and Karl appear across Weeks 4–7. The Shane grudge match lands just before that opening trio returns to close the season. Jack would prefer a playoff calendar this year; everyone else has already seen what happens when he is asked to produce a different kind.',
  },
  10: {
    opponentId: 9,
    title: 'Set a reminder for Week 11',
    story:
      'Jack has not forgotten the 2024 lineup incident recorded in the league profiles. Their Week 11 meeting is the obvious grudge fixture, and Shane can improve on the original controversy simply by remembering it exists. A phone notification would be a bold tactical innovation.',
    verdict:
      'Alan, Aidan and David appear at both ends of the schedule, while the Jack game sits immediately before the final three weeks. The 2022 champion has enough in this draft to matter if he remains engaged. His first opponent is Alan; his most persistent opponent is the temptation to stop opening the app.',
  },
  11: {
    opponentId: 12,
    title: 'The set-and-forget derby',
    story:
      'The manager profiles describe David and Aidan as similarly hands-off, with very different results: Aidan’s five straight playoff appearances set the target. They meet in Weeks 1 and 12. This is David’s chance to demonstrate that the same operating system can finally produce the same outcome.',
    verdict:
      'Aidan, Burns and Shane make up both the opening and closing three weeks. This is a better draft than David’s usual historical results would suggest, but the repeat fixtures will expose whether the management has improved too. A waiver claim between those bookends would qualify as both tactical adjustment and a major franchise announcement.',
  },
  12: {
    opponentId: 7,
    title: 'Client versus consultant',
    story:
      'Joe once drafted Aidan’s team, according to the league profiles; Week 6 puts the pair on opposite sides. Aidan has the stronger habit of reaching the playoffs, while Joe would presumably like some credit for services rendered. Unfortunately there are no fantasy points for references.',
    verdict:
      'David, Shane and Hugo give Aidan the same opening and closing three games. The traditional plan is to keep the lineup ticking over and let everybody else overcomplicate their lives. Five consecutive playoff appearances make that difficult to mock convincingly, although losing to Joe would at least establish that the warranty has expired.',
  },
};
