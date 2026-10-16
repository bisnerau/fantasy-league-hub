# Week 6 Friday previews and prices — 16 October 2026

Six outlooks and winner calls authored Friday after SEA–DEN. The Sleeper check
completed at 08:51 UTC; the corrected odds snapshot has its own retrieval time.
Publication timestamp is 09:31 UTC. Final Friday NFL game designations were not
available at the morning check. These are not pre-kickoff predictions.

## Evidence

- `2026-week-6-sleeper.json`: all twelve selected lineups, bench alternatives,
  records, Thursday actual points, full selected-lineup PPR estimates and completed
  transactions since Tuesday. Wednesday waivers appear under Sleeper Week 5;
  subsequent transactions, including Friday's Allgeier and Cousins acquisitions,
  appear under Week 6. No private votes or Bankers were read.
- `../../lib/data/experiments/odds-week-six.json`: MAC 12 scoring, best legal
  rostered lineups, Thursday starters fixed to actual scores, opponent adjustment
  and retrieval timestamp. This differs from the selected-lineup PPR estimates
  frozen with each report. Never add banked points to the full PPR estimates.
- [Eagles, Thursday report](https://www.philadelphiaeagles.com/news/panthers-vs-eagles-injury-report-2026-nfl-week-6-saquon-barkley-devonta-smith):
  Hurts ruled out; McKee to start. Barkley and Shipley absent again; Smith limited.
- [Ravens, Thursday report](https://www.baltimoreravens.com/news/lamar-jackson-injury-report-ankle-ravens-browns-rashod-bateman-matt-hibner):
  Jackson absent with ankle injury, day-to-day; Flowers added as limited with toe.
- [Chargers–Chiefs report, updated Thursday](https://www.chargers.com/news/chiefs-injury-report-ladd-mcconkey-week-6):
  McConkey limited; Rice absent Wednesday and Thursday. The page's initial
  publication date is Wednesday, but its text and table include Thursday.
- [Broncos Thursday recap](https://www.denverbroncos.com/news/cover-4-broncos-knock-off-defending-champs-with-17-14-prime-time-win-over-seahawks):
  verifies SEA–DEN finished. League points come from Sleeper, not NFL score totals.

Other availability references are explicitly Sleeper snapshot flags. No claim
that a questionable tag establishes a final designation. A selected bye player
is a current lineup gap, not proof the manager will leave the slot unfilled.

## Calls and prices

| Fixture | Friday call | Home price | Away price |
| --- | --- | --- | --- |
| Karl–Sharpe | Karl | 4/7 | 7/4 |
| Niall–Hugo | Niall | 4/9 | 9/4 |
| Keenan–Jack | Jack | 5/2 | 2/5 |
| Tommy–Shane | Shane | 11/4 | 4/11 |
| Burns–Alan | Alan | Evens | Evens |
| Joe–Murphy | Murphy | 11/10 | 10/11 |

Burns–Alan is the disclosed Friday Match of the Week: commissioner versus reigning
champion, four straight Burns losses, only 0.39 separating best-lineup estimates.
Alan's Thursday advantage is 9.40. The editorial call favours Alan despite Burns'
slight model edge. Three preview talking points refresh the homepage without
changing Tuesday's Week 6 power rankings or any published archive.

Keenan has Goff on bye and no rostered replacement. His price includes that
missing slot; it does not invent a future waiver signing. Shane's price includes
Lamar's available projection despite uncertain availability, with Stroud as
rostered cover. Both caveats are in the stories. Prices freeze once, and later
news or roster changes do not reprice existing picks.

## Availability correction

The snapshot builder's best-lineup path previously accepted Out/IR/PUP/suspended
players when a projection survived. It now uses the same availability filter as
the as-set path. Tommy's IR-tagged A.J. Brown had a projection and would have
entered the flex; he is excluded from the corrected Week 6 snapshot. Thursday
starters retain actual points even if an injury flag subsequently changes.
No older snapshots or published prices were altered.

## Humanizer check

Read the installed Humanizer 3.1.0 skill and checked the draft manually.
Flags: repeated office/receipt metaphors, repeated managerial sentence openings,
and two contrasts. Removed an unnecessary currency gag from Hugo's headline and
kept the distinct real waiver anecdotes. Keenan's timing caveat and the distinction
between Thursday projections and actual points correct likely misunderstandings;
retain them. Jack's trophy comparison is an intentional league joke. Keep record
and score dashes, Friday labels and the manager-specific closing jokes.

## Verification

145 unit/integration tests pass, including six fixture identities, projection
snapshots, publication gating, feature/homepage selection, available pricing
lineups, Thursday actuals and Keenan's missing QB. Lint and production build pass.
The full browser run stalled in Chromium on the first two layout checks; 67
checks did not run. The commissioner explicitly requested immediate publication
after the passing unit checks, lint and build. No further browser rerun is required
for this release. Production verification follows publication.
