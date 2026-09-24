# Weekly clubhouse and power rankings

The commissioner approved a weekly homepage and weekly editorial power rankings.
Most managers use the homepage on their phone, so it is laid out as a football
field you scroll down: chalk yard lines between sections and a painted MAC 12
end zone as the footer. One signature effect per section; only the ticker loops.

1. **Picks hero**: “Week N”, a stadium-board countdown to the Sunday lock, a
   drive tracker (each saved pick moves the ball; the Banker is the two-point
   try) and one button. The final two hours show a two-minute warning. After
   lock, signed-in members see the league's Match of the Week split unscramble.
2. **League wire**: facts from the latest settled week only (high/low score,
   closest and biggest result, top starter, unbeaten/winless), with a pause.
3. **Match of the Week ticket**: this week's selection, torn open to reveal the
   chalkboard play (arrow on our preview call, else the projected favourite).
4. **Scoreboard**: the latest settled week as flip cards (tap for the round-up);
   before any settlement, this week's projected fixtures.
5. **Flag on the play**: optional, authored in `lib/data/flags-on-the-play.ts`.
6. **Lead report** (headline and a two-line teaser) and talking points.
7. **Power rankings deck**: all twelve, swipe or buttons/arrow keys.
8. **Bragging rights**: champion trading card and the wooden-spoon sticker.
9. **Prediction race** (members), then one Explore strip of destinations.

The draft report and draft countdown lead before the draft. Sections without
verified data hide themselves; nothing is invented to fill a gap.

## Power rankings

`/power-rankings` shows the latest published edition for the configured league.
Season/week links select an exact edition; an unpublished week has a waiting
state, not a substituted list. Data lives in `lib/data/power-rankings/`, indexed
by `lib/data/power-rankings.ts`. Editions include all twelve roster IDs, frozen
head-to-head records and recent scoring, one pointed verdict per manager, source
links, three talking points and an actual publication timestamp.

Write alongside Thursday's previews when prompted. Assess current strength with
up to three completed weeks of scoring, results, roster quality, depth and
availability. Week 2 has only one completed week, so do not invent a longer trend.
The order is an editorial judgment, not a calculated probability or league table.
Keep each published edition unchanged when adding subsequent weeks. No cron
generates prose or modifies rankings.

The first edition explicitly compares movement with the frozen preseason
finishing forecast from 6 September. It is **not** a fabricated Week 1 power
ranking. Later editions compare against the preceding published weekly edition
in the same league and season. With no comparison, display “New”. Arrows have
text alternatives and do not depend solely on colour.

## Week 2 evidence

The compact `docs/research/2026-week-2-power-rankings.json` records the fresh
17 September Sleeper check of Week 1 scores, records and Week 2 starters/PPR
estimates. Results agree with the settled Week 1 reports. Starters changed since
the original preview snapshot: Burns selected Caleb Douglas and Marmion selected
Chuba Hubbard. The original previews and winner calls stay frozen.

Niall leads on 169 points and his running-back core. Shane's opening win and
receiver quality put him second. Karl stays third despite losing to the top
scorer, supported by his roster and the largest Week 2 lineup estimate. Burns'
strong opener is balanced against availability concerns. Alan and Joe retain
respect for competitive losing scores and their core players. Hugo climbs four
places from the preseason forecast, with McConkey/Bowers practice concerns
limiting the leap. Jack stays eighth; Keenan rises on a win and his Jeanty/Watson
contributions. Sharpe's low winning score, Tommy's poor opener and Murphy's 57
complete the order. These are editorial reasons, not formula weights.

Sources: [Week 1 results](https://api.sleeper.app/v1/league/1389706813993160704/matchups/1),
[Week 2 lineups](https://api.sleeper.app/v1/league/1389706813993160704/matchups/2),
[rosters](https://api.sleeper.app/v1/league/1389706813993160704/rosters),
[PPR projections](https://api.sleeper.app/projections/nfl/2026/2?season_type=regular&position[]=QB&position[]=RB&position[]=WR&position[]=TE&position[]=K&position[]=DEF),
and the [Chargers–Raiders practice report](https://www.chargers.com/news/raiders-injury-report-ladd-mcconkey-fantasy).
Broader availability context is retained in the existing Week 2 preview research.

## Homepage behaviour

The current featured preview leads before settlement; a published featured review
takes over after settlement. If no current story is published, the most recent
verified settled report can lead, explicitly labelled with its actual week.
Review files alone never establish settlement. Future editions and other leagues
are excluded. Old talking points disappear when the active week advances; the
latest ranking remains linked under its actual edition week until a new one is
written. The homepage never invents a fresh edition during a publishing gap.

Tests cover source records, the real preseason baseline, future/foreign editions,
subsequent weekly movement, report settlement and correct archived-week links.

## Weekly Picks behaviour

`/matchups` is a phone-first bet slip. The points are bragging points, not
money; the betting look is styling only.

- The hero reuses the homepage stadium board, drive tracker, two-minute warning
  and Sunday lock reveal. Its h1 is `Week N` and shares a view-transition name
  with the homepage title, so the two morph where cross-document view
  transitions are supported. Browsers without them navigate as before.
- A season timeline of week chips replaces the stepper. Past weeks show a tick
  and points only when the signed-in member has settled points for them.
- Each matchup is a tug-of-war card. The whole half is the pick target, but the
  button inside keeps the `Pick {team}` / `Pick {team}, saved` name. The picked
  side grows, and stamps mark the pick: Banker ×2 before lock, Locked after, and
  Called it, Missed or Void (tie) once settled. Cards show three key players,
  never full lineups; everything else is in the Programme sheet.
- The line is a spread from the two Sleeper PPR estimates, rounded to half a
  point (`lib/predictions/line.ts`). It follows the latest projections rather
  than freezing an opening line and is hidden when either projection is
  missing. Settled weeks tag Covered, Didn’t cover, Push or Upset.
- After lock the league’s split is a rope whose knot slides towards the
  majority; voter chips stay on each side.
- The bet slip tray (`lib/predictions/slip.ts`) counts selections, names the
  Banker and shows the most the slip can return (picks plus one for a Banker).
  “Next pick” jumps to the next unpicked matchup. On settled weeks it prints a
  bookie docket: won, lost or void per selection, and the return and rank from
  the weekly leaderboard. It never prints score figures.
- The Rapid-fire slip deck shows unpicked matchups one at a time: swipe towards
  a team, tap a button or use the arrow keys. A card only leaves once its pick
  is verified as saved.
- The spark after a pick fires only after `lib/predictions/votes.ts` confirms
  the saved row (gold for a Banker). The prediction tables are a podium plus
  compact rows, with equal points sharing a rank.

## Week 3 edition

Published 24 September using fresh lineups, both completed results and current
practice reports. Shane–Sharpe is Match of the Week: the only fixture between
unbeaten teams, with a 114.92-point scoring gap. Shane leads the rankings,
followed by Alan and Jack. Movement compares with the frozen Week 2 edition.
See `research/2026-week-3.md` and its Sleeper snapshot for evidence and calls.
