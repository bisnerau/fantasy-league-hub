import type { PredictionWeekData } from './predictions';
import { weekFourPublishedAt } from './newsletters/2026-week-4';
import { weekFivePublishedAt } from './newsletters/2026-week-5';
import { weekSixPublishedAt } from './newsletters/2026-week-6';
import { weekSevenPublishedAt } from './newsletters/2026-week-7';
import { weekEightPublishedAt } from './newsletters/2026-week-8';
import { weekNinePublishedAt } from './newsletters/2026-week-9';
import { weekTenPublishedAt } from './newsletters/2026-week-10';

// Preview-day homepage copy is separate from the frozen Tuesday ranking archive.
const editions = [
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 10,
    publishedAt: weekTenPublishedAt,
    points: [
      {
        title: 'Burns–Niall: the playoff chase gets personal.',
        text: 'Both are 4–5. Niall has just scored 140.18; Burns deliberately sat Bass to protect a 2.06-point lead. Our Thursday Match of the Week call is Murray at 2/5. The commissioner has put his kicker back in.',
        href: '/matchups?week=10#matchup-4',
      },
      {
        title: 'Tommy’s good week costs him $49.',
        text: 'The weekly high is followed by $26 on Dell and $23 on Estime, with Nacua tagged Out and Irving on bye. Joe is our call. Elsewhere, Keenan has paid $2 to bring Okonkwo back after dropping him last week.',
        href: '/matchups?week=10#matchup-2',
      },
      {
        title: 'Thursday edition. Prices frozen before kickoff.',
        text: 'All six previews and prices use Thursday 12 November checks before Washington–New York. Final weekend injury designations are pending. Picks lock at 18:00 Irish time on 15 November, after the early Patriots–Lions game. Later lineup changes will not alter the prices.',
        href: '/matchups?week=10',
      },
    ],
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 9,
    publishedAt: weekNinePublishedAt,
    points: [
      {
        title: 'Alan–Jack: the top two get a proper argument.',
        text: 'Our Friday Match of the Week pairs Alan’s 173.88-point win with Jack’s four-game streak. Henry has banked 5.58; McCaffrey returned to limited practice Thursday. We take Alan at 4/9 to pull them level at 6–3.',
        href: '/matchups?week=9#matchup-2',
      },
      {
        title: 'Keenan buys a running back and loses a tight end.',
        text: 'The $6 Henderson claim cost Okonkwo his place. Andrew’s tight-end slot is empty and Ferguson remains tagged IR, so the price includes only eight eligible starters. Shane is our call; a later pickup can improve Keenan’s team but cannot change the frozen odds.',
        href: '/matchups?week=9#matchup-6',
      },
      {
        title: 'Niall banks 38.68. The rest get until Sunday at six.',
        text: 'Six Friday previews follow Jacksonville–Baltimore. Niall has 38.68, Hugo 15.00 and Tommy 8.90 already scored. Egbuka practised fully; Nabers and Garrett Wilson missed Thursday. Final Friday designations are pending. Picks lock at 18:00 Irish time on 8 November, after the early Madrid game begins.',
        href: '/matchups?week=9',
      },
    ],
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 8,
    publishedAt: weekEightPublishedAt,
    points: [
      {
        title: 'The final rematch. Alan has brought reinforcements.',
        text: 'Karl–Alan is Match of the Week: 5–2 against 4–3, with just 1.06 between the adjusted totals. Bowers, Brown and Waddle are all selected for the champion. We take Alan at 11/10; Karl’s 10/11 price gives him very little room for a scheduling complaint.',
        href: '/matchups?week=8#matchup-3',
      },
      {
        title: 'Jack gets Jefferson. Joe has a receiver slot to fill.',
        text: 'Thursday’s deal sends Jefferson to Jack for Purdy and Egbuka. Joe’s selected WR slot is empty at Friday’s check; the price includes bench cover, with Egbuka still limited. Shane traded Likely for Goedert, while Niall’s $48 Black purchase waits through a bye.',
        href: '/matchups?week=8#matchup-4',
      },
      {
        title: 'Six Friday calls. Picks lock at 6pm Irish time on Sunday.',
        text: 'The 1 November deadline returns to 18:00 in Ireland after the US clock change. Keenan has 40.50 banked, Shane 34.50 and Hugo 28.30. Lamar has practised fully twice; Barkley and Smith remained non-participants. Friday’s final injury designations are pending.',
        href: '/matchups?week=8',
      },
    ],
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 7,
    publishedAt: weekSevenPublishedAt,
    points: [
      {
        title: 'First trade: Tommy gets Irving. Karl gets Wilson and Coleman.',
        text: 'Tommy takes the season’s first trade into our Match of the Week against Hugo: both 1–5, with Tommy 50.20–27.42 ahead after Thursday. Shark Boy meets the Grafton Street busker. Irving’s illness and Nacua’s calf still need monitoring.',
        href: '/matchups?week=7#matchup-3',
      },
      {
        title: 'Keenan pays $12, Jack pays $2, and Jack has the tight end.',
        text: 'Andrew dropped Fannin for Ferguson, who is now tagged IR. Jack bought Fannin on Friday; Keenan’s tight-end slot is empty. Alan already has 23.70 from Burden and is our call. Hugo’s $19 Douglas returned 5.30; Dave paid $15 for Emanuel Wilson.',
        href: '/matchups?week=7#matchup-4',
      },
      {
        title: 'Six Friday calls. Picks lock at 5pm Irish time on Sunday.',
        text: 'The clocks go back this weekend: the 25 October deadline is 17:00 in Ireland. New prices include Thursday’s points and stay frozen. Lamar remains limited, Egbuka missed practice and final Friday designations are pending. Niall still has Jacksonville’s bye-week defence selected.',
        href: '/matchups?week=7',
      },
    ],
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 6,
    publishedAt: weekSixPublishedAt,
    points: [
      {
        title: 'Evens each. Administrator privileges sold separately.',
        text: 'Burns–Alan is our Friday Match of the Week. Harvey has put the champion 9.40 ahead; Burns has spent $25 trying to stop four straight defeats. We narrowly back Alan. The commissioner may want to skip this week’s homepage.',
        href: '/matchups?week=6#matchup-5',
      },
      {
        title: 'Keenan’s quarterback is taking the weekend off.',
        text: 'Goff is still selected on Detroit’s bye and Andrew has no other quarterback rostered in Friday’s snapshot. His 5/2 price reflects that gap; a later pickup can improve the team but will not change the frozen price. Jack is our call.',
        href: '/matchups?week=6#matchup-3',
      },
      {
        title: 'Joe’s employee of the week has been released.',
        text: 'Brissett helped beat Alan, then got cut for Freiermuth. Cousins is the new $6 quarterback with Hurts ruled out. All six previews use Friday morning checks after SEA–DEN; Thursday practice reports are the latest, with final designations pending.',
        href: '/matchups?week=6#matchup-6',
      },
    ],
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 5,
    publishedAt: weekFivePublishedAt,
    points: [
      {
        title: 'Keenan’s perfect start meets Karl’s 59.50-point Thursday.',
        text: 'Irving and Pickens have already put Karl in charge of our Friday Match of the Week. Andrew is 4–0, has Barkley benched and paid $6 for Mitchell. The unbeaten record finally has a difficult appointment.',
        href: '/matchups?week=5#matchup-2',
      },
      {
        title: 'Niall’s $20 Shipley comes with competition.',
        text: 'Barkley missed Thursday practice, but the Eagles have also promoted Dameon Pierce. Shipley is still on Niall’s bench. Shane has only 2.90 from Lamb and Lamar missed another practice: our Friday upset call goes to Murray.',
        href: '/matchups?week=5#matchup-3',
      },
      {
        title: 'Friday morning check: practising does not mean cleared.',
        text: 'Chase remains in concussion protocol; Higgins and McConkey missed Thursday practice. Charbonnet is limited and still on PUP. All six outlooks use news checked 9 October, after TB–DAL; final Friday designations are still pending.',
        href: '/matchups?week=5',
      },
    ],
  },
  {
    leagueId: '1389706813993160704',
    season: '2026',
    week: 4,
    publishedAt: weekFourPublishedAt,
    points: [
      {
        title: 'Joe’s $31 purchase comes with free group-chat analysis.',
        text: 'Gordon is on the bench in Friday’s snapshot; the dodgy trade offers are still circulating. At 0–3, Joe faces Jack in our Friday Match of the Week. The projections are separated by less than half a point.',
        href: '/matchups?week=4#matchup-5',
      },
      {
        title: 'Dave’s $3 rescue comes from this week’s opponent.',
        text: 'Sharpe’s main waiver run added Tucker but no running back. Lloyd arrived Friday after Keenan dropped him. Andrew is 3–0 and already has 17.70 from Thursday; after-sales assistance seems unlikely.',
        href: '/matchups?week=4#matchup-1',
      },
      {
        title: 'Friday edition: Thursday’s points are already in the book.',
        text: 'All six outlooks and winner calls were written after the opening game. Warren, Metcalf and Boston have already contributed. Tommy has also paid $13 to reclaim Sadiq, who he dropped last week. Progress takes many forms.',
        href: '/matchups?week=4',
      },
    ],
  },
];

export function getPreviewTalkingPoints(
  data: Pick<PredictionWeekData, 'leagueId' | 'season' | 'week' | 'finalized'>,
  now = Date.now(),
) {
  if (data.finalized) return null;
  return (
    editions.find(
      (edition) =>
        edition.leagueId === data.leagueId &&
        edition.season === data.season &&
        edition.week === data.week &&
        Date.parse(edition.publishedAt) <= now,
    )?.points ?? null
  );
}
