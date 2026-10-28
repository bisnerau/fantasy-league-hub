# The halftime show

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
Evidence opens the matching dossier and restores focus on close. There is no
spoken audio. Changing either the OS motion preference or the on-page switch
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
