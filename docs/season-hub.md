# Awards and receipts

`/season-hub` is the 2026 league companion feature page. The league ID is pinned
from the 2026 schedule snapshot so a future environment change cannot accidentally
compare a new league's rosters with the 2026 ballots. It appears in the navigation
and clubhouse directory.

All server reads use Sleeper public endpoints. Page visits never write to Supabase
or change teams, transactions, ballots or the published draft report. No migration,
new secret or cron change is required. Results are derived on visits using the
existing bounded, cached Sleeper fetcher. Transactions are fetched in batches of six.

## Weekly awards

Regular season Weeks 1–14, with at least 64 hours after the Sunday lock and the
NFL state advanced beyond the week. Require all 12 scored teams, six valid pairs.
Use commissioner-adjusted totals when present. Award tied qualifiers jointly.
Each manager receives at most one trophy per award type per week.

- Schedule Solicitor: highest-scoring loser, if their score beats at least six
  other teams.
- Get Away With It: lowest-scoring winner, if at least six other teams beat their
  score.
- Waiver Receipt: highest positive actual starter points from a completed waiver
  or free-agent acquisition in the transaction's scoring week. Missing transaction
  or relevant starter-score data holds this award without suppressing other awards.
- Against the Room: a correct pick receiving strictly less than half of at least
  six distinct managers' votes. One trophy per manager per week; show all qualifying
  calls. Query only stored final prediction matchups after the settlement boundary.
  An ungraded matchup stays pending until the existing predictions cron settles it.

## Forecast reviews

Compute the halfway table from Weeks 1–7 only: wins plus half a point for a tie,
then total fantasy points. A remaining exact tie holds the review rather than
inventing a tiebreak. Current standings must never substitute for Week 7.

Final review waits for league status complete and Week 17 settled, and requires
all championship/consolation placement games. Championship places 1–6 and
consolation places 7–12 form the final table; punishment selections are separate.

Forecast accuracy is the sum of absolute place differences across all 12 teams.
Lower wins, equal scores share ranks. Missing/invalid ballots have no score.
Editorial predictions remain frozen in the original draft content. Member ballots
and Against the Room evidence are fetched in the browser under existing auth/RLS;
never fetch them with the service key for a public server component. Votes are
fetched in groups of 40 matchups to avoid the row cap truncating season totals.

## Trade receipts

2026 completed trades only; deduplicate transaction IDs. Display received players,
draft picks and FAAB. A confirmed completion timestamp is required for analysis.

A scoring-week boundary is Tuesday 00:00 UTC. The first eligible week begins after
the transaction completed. Exclude the acquisition week and any departure week,
then stop counting a player once dropped/traded away, including later reacquisition.
This conservative rule avoids allocating points across partial ownership weeks.

The first review uses the first three consecutive full weeks; the final receipt
uses all eligible weeks through Week 17. Report actual started points and roster
points including bench, plus player/week evidence. Unknown points remain unknown;
a missing week stops the contiguous period. Picks and FAAB have no invented points
value. The receipt is not an assertion of overall trade quality or injury cause.

Run `npm run lint`, `npm test`, and `npm run build` when changing the logic.
Feature tests cover awards, ties, missing data, forecast validity and checkpoints,
trade ownership boundaries, delayed settlement and read-only page loading.
