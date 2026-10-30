# The halftime show

## Announced · 30 October 2026

The commissioner announced the report on Friday 30 October 2026.
`halftimePublication.isPublic` is true and `publishedAt` records the release
time. A final check of the Sleeper transactions found no trades beyond the four
already listed under "Since the halftime whistle". Releasing the page also
released Mackorcle's halftime episode in the Return of the Mac archive and the
second-half ballot, which locks on Sunday 1 November at 18:00 Irish time. The
hold notes below are kept as history.

## Announcement hold · 28 October 2026

The commissioner requested that the report be hidden until their Friday
announcement. `halftimePublication.isPublic` is false: the production route
shows only a sign-in gate, public promotions and navigation are hidden, and metadata is noindex.
The existing commissioner account can open a private navigation link after sign-in.
`/api/halftime-preview` verifies the bearer token with Supabase Auth and requires
the matching protected profile to have roster 1, login `emmet-burns` and admin
status. Only then is report data returned, with private/no-store caching. Other
managers receive 403, signed-out requests receive 401, and lookup failures deny
access. Session changes clear the client report and cancel stale requests.
The development server still supports `/halftime` for local review. There is
no automatic release time; restore the flag and deploy when asked to reveal it.
The launch record below describes the previously published release.

Private access validation covers missing/forged credentials, an ordinary member,
another administrator, failed profile reads, the commissioner response and its
private cache headers. Browser checks cover the sign-in gate, hidden public
links, the commissioner navigation link, team-report opening and sign-out in a
second tab clearing the already-open preview. No service-role key is used.

Published at `/halftime`, with a homepage feature, an Awards & Receipts link,
site navigation and a 1200 × 630 share image. Homepage promotion is restricted
to the 2026 league during Weeks 8–14; the report remains available as an archive.
For local work, run `npm run dev -- --host 127.0.0.1 --port 4320`.

The premium sports broadcast includes a prediction replay, twelve team dossiers,
actual/all-play tables, original AI receipts, authenticated manager comparisons,
transaction evidence and five halftime honours. Shane is team of the half;
Jared Goff has the highest verified pickup starter-point return; the Burns
forecast is the AI's largest position error. Every honour opens its team report.

The motion uses CSS transforms, staggered rank transitions, a drawn route diagram,
scroll reveals, report entrance/exit and a receipt stamp. Base UI handles modal
focus trapping, Escape and focus return. The replay briefly disables moving rows
to prevent a pointer click from opening a different manager. Motion has both an
OS preference fallback and an on-page pause switch.

## Evidence and boundaries

- `lib/data/halftime/snapshot.json` is a compact frozen copy of
  `docs/research/2026-week-8-power-rankings.json`, captured 28 October 2026 at
  11:02 UTC, restricted to the seven completed scoring weeks. It does not import
  post-Week 7 roster contents into first-half performance.
- Forecast positions, draft grades and exact season outlook quotes come from
  `lib/data/draft-recap-content.ts`, published 6 September. The report copy lives
  in `lib/data/halftime/report.ts` and received a manual Humanizer review.
- Joe's 117.18 correction is used in this checkpoint. The original settled
  117.28 matchup report and grading are untouched. A visible source note explains
  the difference.
- The authenticated browser reads manager ballots with the existing publishable
  client and RLS. It displays the number of complete, distinct submissions,
  consensus and the signed-in manager's ballot when available. Missing ballots
  receive no score. Session changes remove old member data and stale responses.
- No member ballots, identities or credentials are embedded in the snapshot.
- Transaction evidence is frozen from the public Sleeper ledger described below. Tuesday trades are explicitly after the halftime cutoff.

## Design references

The initial release used the existing site stack without an animation dependency.
The awards-stage update below adds Motion; the page components remain original.

- https://github.com/ibelick/motion-primitives — continuity between compact cards
  and focused reports.
- https://github.com/barvian/number-flow — restrained scoreboard number changes.
- https://github.com/nolly-studio/cult-ui — expandable editorial detail.
- https://github.com/Ibaliqbal/grid-layout-transition — reordering as storytelling.

## Checks

`tests/halftime.test.mjs` checks the frozen quote/forecast contract, seven-week
totals, all-play comparisons and table order. `tests/e2e/halftime.spec.ts` checks
the report at 320, 390 and 1440px, replay ordering, correct report opening,
Escape/focus return, receipt switching and reduced motion. Browser fixture tests
block nonlocal requests and never authenticate to the live league.

## Report interactions and transaction evidence

The opening now promotes three concrete first-half stories. The replay has a
settle/move/spotlight sequence, a skip action, and a followed team that stays
highlighted in the report cards and schedule table. A team-name search reduces
the report grid. Score charts live inside the dossiers.

Report opening and closing uses the browser's shared view transition when
supported: the selected card, portrait, name and record move into the modal and
back. Base UI still owns modal focus and Escape. Unsupported browsers keep the
normal dialog, and reduced motion bypasses the shared animation. The global
page-navigation wipe is suppressed only during a report transition.

The transaction desk uses `docs/research/2026-halftime-ledger.json`, fetched from
public Sleeper endpoints on 28 October. It includes 180 draft picks, completed
transactions from legs 0–7, and the previously frozen seven-week lineups. The
cutoff is 27 October 00:00 UTC. `lib/season/halftime-ledger.ts` derives the compact
`lib/data/halftime/activity.json` used in the client. No ongoing feed changes the
first-half edition. Every team's four scoring buckets reconcile to its total.

Pickup receipts reuse the existing ownership-spell rules. Successful waiver
bids count once per transaction, free additions cost zero, and unknown returns
stay pending. Keenan's Joe Mixon receipt lacks complete ownership evidence;
his total pickup-return figure stays pending, while confirmed player/week
contributions are retained in the scoring breakdown. The two pre-cutoff trades
both occurred in Week 7. Trade review begins in Week 8, so acquisition-week
points stay in the move-week/unassigned bucket. No acquisition-week trade
points are claimed as a full-week return.

Manager receipts use authenticated browser reads of profiles and valid ballots:
participation, tied widest disagreements, strongest support for the team most
above consensus, optimistic self-predictions and an expandable accuracy table.
The AI appears alongside submitted ballots; missing ballots have no score.
Named ballot evidence is never embedded in the public snapshot.

Each dossier can save a 1080 × 1350 PNG card locally. It contains public team
statistics, the original AI rank and an authored headline; it does not upload anything.

A new second-half ballot and a broader end-of-season awards collection remain
future features. No Week 8 previews are included in this release.

## Launch verification · 28 October 2026

- Production build and lint pass; all 156 unit tests pass.
- The full Chromium suite ran 77 checks: 75 passed initially. The new launch
  check exposed a missing report link during a live-data outage; the link now
  remains available. That check and an unrelated MP3 playback timeout both
  passed on targeted rerun.
- All eight halftime checks pass in WebKit, including mobile replay, reduced
  motion, member fixtures, focus return and PNG export. Transaction dates use
  the shared deterministic Irish formatter to avoid Safari hydration mismatches.
- The existing production member session confirms six submitted manager
  forecasts. The live report is checked again after deployment.

## Awards stage and rugby review · 28 October 2026

The announcement hold remains in place. The commissioner preview now includes
Mackorcle’s five-envelope ceremony: Pickup of the half, Schedule Solicitor,
Get Away With It, AI Apology Award, and Team of the half. Editorial shortlists
use the frozen checkpoint and verified pickup receipts, not manager votes.
Each presentation has a nominee sequence, envelope opening and winner reveal,
with skip, replay, direct award selection and an immediate all-results view.
Evidence opens the matching dossier and restores focus on close. The stage itself has no
spoken audio; Mackorcle's halftime episode plays from its own player beneath
the ceremony (see below). Changing either the OS motion preference or the on-page switch
finishes an active presentation immediately.

The implementation uses the MIT-licensed Motion package:
https://github.com/motiondivision/motion. Its official skill and self-contained
React, CSS-or-Motion and animation best-practice guidance were read from
https://github.com/motiondivision/ai-kit/tree/main/plugins/motion/skills/motion.
The stage is original HTML/CSS/React; no paid Motion+ examples were copied.
Mackorcle’s transparent presenter artwork is derived from the existing v9
Return of the Mac portrait, saved as `public/images/halftime/mackorcle-awards.png`.

“Then in blue. Now in green.” sits after each first-half review and before the
second-half question. The blue card preserves the original Leinster comparison
verbatim; the green reveal contains the agreed Ireland player/era, supporting
Week 7 statistics, an affectionate roast and historical source where applicable.
Tommy’s revised reference is Jacob Stockdale in 2019. Retained comparisons are
labelled honestly rather than inventing a particular international campaign.
The main-page manager selector defaults to the signed-in profile independently
of whether that manager submitted a preseason ballot. Rugby editorial is assembled
server-side with the report and follows the existing commissioner preview gate.

`tests/e2e/halftime-stage.spec.ts` covers full presentation, interruption, skip,
replay, evidence/focus return, all five winners, rugby reveal/replay, an OS
preference change, the in-page motion switch, and 320/390/1440px layouts.

Verification: production build and lint pass; all 156 existing unit tests pass.
Eight Chromium checks pass, covering the ceremony, three viewport sizes and the
commissioner-only access boundary. The custom motion preference subscription
handles OS changes made after page load. The direct rugby entry focuses and
scrolls the comparison; the dossier close control remains sticky while reading.

All five WebKit interaction checks also pass after restricting the shared card
transition to actual team cards. Award evidence buttons use the normal dialog
transition. Award shortlists, like rugby copy, are included in the authenticated
report response rather than embedded in the client component.

## Tidy-up, Mackorcle and the second-half ballot · 29 October 2026

**Tidy-up.** Unused rules from earlier designs were removed: the clock, route
diagram, honours grid, week track and replay callout. So were declarations
that a later identical selector already overrode. Before-and-after screenshots
at 390 and 1440px were pixel-identical. The "second edition" layer deliberately
follows the earlier media queries and overrides them; folding it upward changes
the phone layout, so keep that order. All motion checks use
`useHalftimeReducedMotion`. The on-page switch is a fixed "Pause motion"
toggle. The receipt stamp shows each team's own verdict.

**Dates and trades.** Visible dates read 30 October, the announcement day; the
source note keeps the 28 October Week 7 capture. Set `publishedAt` when
`isPublic` is restored. The deals completed since the 27 October cutoff live in
`afterWhistle` in `lib/data/halftime/report.ts`, checked against Sleeper on 29
October. Re-check the transactions before the reveal.

**Phone.**
- The chapter bar keeps the active chapter in view. The active chapter is the
  latest section inside the reading band, so a section that changes height
  cannot leave a stale chapter selected.
- On the awards stage, Mackorcle stands above the screen, with the controls
  directly beneath it.
- Team reports keep "Save card" in the top bar and end on the second-half
  question.

**Mackorcle on stage.** Each honour has a `mackorcle` line in
`lib/data/halftime/publication.ts`, and the intro line is in `awards.ts`. The
winner screen shows his line; the editorial verdicts appear under "Show all
results". The lines follow the Return of the Mac persona: American, deadpan,
few numbers.

**Second-half ballot (chapter 07).**
- **What you predict:** the final regular-season table (1–12), then both
  six-team brackets seeded from it.
- **Championship:** winners advance. Week 15 is 4 v 5 and 3 v 6, and seeds 1
  and 2 meet the winners in Week 16.
- **Loser bowl:** losers advance. Week 15 is 8 v 9 and 7 v 10, seeds 12 and 11
  have the byes, and the final pick is last one standing. Every bracket pick
  is the team that goes through.
- **Punishment:** the league's punishment (the wooden spoon) goes to last
  place in the regular season, as Niall took it in 2025, not to the loser
  bowl. A ballot's punishment pick is the twelfth team in its table.
- **Layout:** both brackets are drawn as a bracket, with Week 15, Week 16 and
  the final side by side and joining lines that light up as games are
  decided. On phones the bracket scrolls sideways in its own lane and moves on
  once a round is complete.
- **Source check:** the structure was verified against the 2025 Sleeper
  winners/losers brackets and Week 15–17 scores.
- **Shared rules:** `lib/season/halftime-ballot.ts`. The migration's
  `halftime_bracket_valid()` mirrors them.
- **Lock:** `sundayKickoffForWeek(2026, 8)`, which is 1 November, 18:00
  Irish/UTC.
- **Privacy:** before the lock a member reads only their own ballot plus the
  participation count from `halftime_forecast_submission_status`. Everything is
  revealed at the lock: the room's champion and punishment votes, the consensus
  table, Mackorcle's house ballot, each manager's brackets and their biggest
  change of heart against their September ballot.
- **Mackorcle's house ballot:** authored in
  `lib/data/halftime/house-ballot.ts`, shown with the managers' ballots and
  never ranked against them. A manager sees it as soon as they file their
  own ballot; everyone else's stays sealed until the lock. His Mackjusted
  pick on the ballot is Tommy.
- **Scoring (after the season):** tables score total places out against Week
  14. Each correct bracket pick earns a point.

Applied to production on 29 October 2026 through the SQL editor and recorded
in `supabase_migrations.schema_migrations`. For new environments, apply
`supabase/migrations/20261030090000_add_halftime_forecasts.sql` with the linked
Supabase CLI. Separate tables leave the
frozen preseason `season_forecasts` untouched.

**Personal opener.** Signed-in managers see a "Your half" strip in the hero:
- their team's position against the AI's call
- their September ballot's places out and rank, or "No ballot filed"
- their second-half ballot status, with a link to the ballot
- the strip itself opens their report

"Follow a team" defaults to the manager's own team until they choose another.

**Checks.**
- `tests/halftime-ballot.test.mjs`: bracket pairings, losers advancing, pick
  invalidation, completeness, vote counts, the lock and the house ballot.
- `node tests/halftime-ballot-db.mjs`: isolated Postgres, using the container
  in `docs/bankers-and-rivalries.md`. It covers validation, member-only
  writes, private-before-lock, reveal-after-lock, the trigger-enforced lock and
  anonymous denial.
- `tests/e2e/halftime-ballot.spec.ts`: build, file, reload, edit, reseeding,
  the locked reveal, the opener, and 320/390px layouts.
- Phone screenshots and a recording: set `SHOT_DIR=/path` when running the
  ballot spec. Those runs use a running clock, because Playwright's fixed
  clock freezes Motion's animations.

**Mackorcle's halftime episode.** "The Mackjusted halftime table" (2:34,
recorded 29 October 2026, script in
`output/return-of-the-mac/2026-halftime-special-script.txt`) counts down all
twelve teams. It plays beneath the awards ceremony using the shared Return of
the Mac player, never autoplays, and is the only media on the page. In
`lib/data/return-of-the-mac.ts` it is `held` while `halftimePublication.isPublic`
is false, so the homepage, archive and episode URL stay hidden until the
announcement; restoring the flag releases it, and it then leads the archive.

