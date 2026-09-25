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

## Power rankings behaviour

`/power-rankings` is a phone-first exchange board ("market movers"). One
signature effect: each rank split-flaps from its previous edition's place to
this one the first time its row scrolls into view. The server renders the real
rank, so no-JS, reduced motion, new entries and unchanged places stay still.

1. **Header**: the edition headline, introduction and publication time.
2. **Market board**: No.1, then Stock up (biggest riser) and Stock down
   (heaviest faller) against the edition's comparison. Ties go to the better
   current rank; a line hides when nobody moved that way.
3. **Edition chips**: the archive, unchanged in behaviour.
4. **Pecking order**: Sleeper team name leads, the edition's frozen manager name
   underneath (the frozen name also stands in when Sleeper is unavailable).
   The verdict teases in one line; tap anywhere on the row or press Enter to
   open it. Signed-in members get a read-only "Your team" chip that jumps to
   and highlights their row.
5. **Market report**: Biggest riser, Heaviest faller, "Unbeaten, unconvinced"
   (lowest-ranked unbeaten, only when a team with a loss ranks above it) and
   "Winless, respected" (highest-ranked winless, only when a team with a win
   ranks below it). Derived from the edition alone; cards hide when untrue.
6. **Rank history**: a bump chart from the preseason forecast (when the first
   edition used it) through every published edition. One team in primary, the
   rest grey; buttons pick the team. Unpublished weeks between editions show as
   labelled gaps. A screen-reader table carries the same data.
7. **Talking points**, then the method and sources in a disclosure.

Browser fixtures use another league, so they cover the honest waiting states;
the populated page is checked read-only against the real league.

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

## Page transitions

Every page-to-page link on the site is a full navigation. Where cross-document
view transitions exist, the arriving page sweeps in behind a chalk yard line
with the drive-tracker football riding its edge.

- The sweep follows the navigation order in `lib/config/navigation.ts`. Moving
  further along it sweeps left to right, and returning towards Home sweeps
  right to left, so the Back button reverses it. Nested pages count as their
  section; unknown pages sweep forward. `lib/navigation/transition.ts` decides
  this, and the head script in `app/layout.tsx` inlines it and marks
  `<html data-vt="forward|back">` for the transition.
- The header, tab bar and desktop sidebar keep their own transition names and
  swap at once, like a native tab bar, so only the pitch between them is
  wiped. The `Week N` title still morphs between the homepage and Weekly Picks.
- The chalk and ball (`components/effects/yard-line.tsx`) are shown and named
  only while a transition runs, so they never appear on a settled page.
- The snap (`components/effects/snap-tracker.tsx`): when an ordinary link is
  clicked and the next page takes more than 150ms, a ball runs along a thin
  drive track under the header. It never reaches the end zone; the page's
  arrival is the finish. In-page, new-tab, modified and cross-site links are
  ignored, and the ball clears on a back/forward cache restore or after 12
  seconds.
- Reduced motion keeps navigation instant with no wipe, and the snap ball
  waits still at midfield. Forced colours drop the chalk and ball and draw the
  track in system colours. Browsers without cross-document view transitions
  navigate as before.
- Playwright's headless WebKit does not paint named view-transition elements
  in screenshots (even a plain test box), so check the chalk and ball on a
  real iPhone.

## Weekly Picks behaviour

`/matchups` is a phone-first bet slip. The points are bragging points, not
money; the betting look is styling only.

- The hero reuses the homepage stadium board, drive tracker, two-minute warning
  and Sunday lock reveal. Its h1 is `Week N` and shares a view-transition name
  with the homepage title, so the two morph where cross-document view
  transitions are supported (see "Page transitions").
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
- The bet slip bar (`lib/predictions/slip.ts`) stays plain: “n/6 picks saved”,
  the Banker, and one View slip button. The opened slip lists every matchup
  with your pick or “No pick yet”, the Banker and the maximum return (picks
  plus one for a Banker); each line jumps to its card. After lock it lists the
  locked selections. On settled weeks See your docket prints a bookie docket:
  won, lost or void per selection, and the return and rank from the weekly
  leaderboard. It never prints score figures.
- The Rapid-fire slip deck shows unpicked matchups one at a time: swipe towards
  a team, tap a button or use the arrow keys. A card only leaves once its pick
  is verified as saved.
- The spark after a pick fires only after `lib/predictions/votes.ts` confirms
  the saved row (gold for a Banker). The prediction tables are a podium plus
  compact rows, with equal points sharing a rank.

## Standings behaviour

`/standings` is a phone-first league table, built from `lib/data/standings.ts`:

- **The cut line.** A stadium board shows the last playoff seed against the first team out, with the gap in wins, or in points when level. It hides until games are played. The playoff places come from Sleeper's `playoff_teams` setting, falling back to the league's six-team bracket.
- **The table.** Compact rows show seed, movement, owner, team, record and one stat that follows the sort chip (Table, Points, All-play, Median). A dashed Bye line sits after seed 2 in a six-team bracket, and the Playoff line after the last seed. Both show only in table order.
- **Tale of the tape.** Tapping a row, or pressing Enter on it, discloses PA, median record, all-play record, streak, plain-letter form and the manager link. One row is open at a time.
- **Movement and replay.** Movement is recalculated from the weekly matchups. It shows only when replaying every week reproduces Sleeper's current order and records exactly, and it's hidden before two completed weeks. The first time the table scrolls into view, the rows jump to last week's order and glide to this week's order (a FLIP reorder in `components/effects/reorder-list.tsx`). "Replay Week N" repeats it. Reduced motion skips the replay, and sort changes reorder instantly.
- **Below the table.** A superlatives rail (top scorer, toughest schedule, luckiest against all-play) and a points race whose bars grow once into view. A missing score is shown as "—", never zero, and each card hides without its inputs.

The e2e fixture's opt-in `standings: 'played'` flag serves two completed weeks with matching roster records.

## Week 3 edition

Published 24 September using fresh lineups, both completed results and current
practice reports. Shane–Sharpe is Match of the Week: the only fixture between
unbeaten teams, with a 114.92-point scoring gap. Shane leads the rankings,
followed by Alan and Jack. Movement compares with the frozen Week 2 edition.
See `research/2026-week-3.md` and its Sleeper snapshot for evidence and calls.
