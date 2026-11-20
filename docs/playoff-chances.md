# Playoff Chances

`/playoff-chances` replaces the homepage and navigation promotion for the Halftime Show. `/halftime` and its season-hub archive link remain intact.

The daily snapshot contains baseline standings, all remaining Sleeper fixtures, roster projections, locked starters, source cutoff, injury assumptions, fitted model parameters and 100,000 whole-league results. Baseline results must reconcile with Sleeper's completed-week record, PF and PA. Each snapshot is a single atomic row, unique per league/season/day; retries cannot overwrite that day's evidence. An authenticated daily Vercel job runs at 10:15 UTC. Public page/API reads use the publishable key and cannot insert, update or delete snapshots or picks.

On visits and every five visible minutes, `/api/playoff-chances` checks ESPN final status against the saved player/game IDs. Newly completed points are applied in memory with the original pregame means for unresolved players. Failed feeds retain a valid snapshot and show the age. A new starter outside the saved roster requires fresh daily inputs. No snapshot means unavailable, never example probabilities.

## Model

- Best projected legal lineup is chosen before score draws, including bench alternatives and RB/WR flex eligibility. Started actual starters occupy their original slots. Byes and undated Out/IR absences cannot fill unlocked slots; questionable players remain eligible.
- MAC 12 points come from Sleeper raw weekly stats/projections, including kicker/defence conversions. There is no extra form or opponent multiplier.
- Independent team normal score draws use summed position error variances and a fitted team variance scale. Banked points have zero variance. Scores are quantised to cents and determine record, PF and higher PA together. Identical standings receive a random tiebreak. Each trial also records every team’s finishing position; weighted 1st–12th distributions update with scenarios and are checked against playoff/last probabilities and position totals.
- Conditional scenarios draw the requested winner's margin from a truncated normal and the score conditional on that margin. Season-wide return-window draws are importance-weighted by all selected results' likelihoods. This preserves availability selection effects. Rounding ties are rejected for a chosen winner. The continuous outcome likelihood approximates the sub-cent rounding boundary.
- Hypothetical choices run in a Vite browser worker and stay in component state. Reset restores baseline. Effective sample size below 1,000 is labelled unstable. Fixture effects require 1,000 effective samples per outcome and gaps exceeding one percentage point and three estimated standard errors. These uncertainty checks measure simulation noise, not model error.
- Bubble cutoffs are outside top six / at least 10%, and inside top six / below 80%. The mathematical proof is a separate bounded schedule search, including ties. Unresolved scoring ties prevent elimination proof; a surviving route needs a concrete set of scores with a qualifying rank, preserving selected results and fixed points. Favourable PF/PA tiebreaks can establish survival; a failed scoring witness stays inconclusive. A search hitting its budget returns unknown. This conservative approach can omit a real must-win label; it cannot turn zero Monte Carlo successes into elimination.

## Archive validation

Run `node --env-file=.env.local --experimental-strip-types scripts/calibrate-playoffs.mjs` to rebuild the versioned fit and diagnostic evidence. The initial fit has **661** matched, non-banked pregame player observations from Weeks 4–10. Position mean-squared errors are shrunk with 20 pooled observations; the team scale comes from summed unbanked lineup errors. Each holdout fits only results whose archived retrieval timestamp predates its projection cutoff. Week 8 has no dated result archive here, so it is excluded from later historical training, while its errors can enter today's fit.

Six chronological holdouts (Weeks 5–10; 36 matchup comparisons) have player RMSE 6.45–8.75 points and nominal 90% unbanked lineup coverage 66.7–100%. Brier scores for those unbanked lineup comparisons range 0.120–0.231. These are model diagnostics on the frozen projected lineups, not actual-starting-lineup betting performance or season-end playoff calibration. There are 46 skipped observations without a unique stat match or safely verified pregame cutoff. Missing/DNP matches and small samples limit conclusions. Full evidence: `docs/research/2026-playoff-calibration.json`.

No sourced bounded return window is currently active. Dated primary reports for Nacua, Jacobs and Hurts are archived in snapshot assumptions. Undated Out/IR absences remain excluded. This may understate a team whose player returns unexpectedly; the UI makes that assumption visible.

## Release

Apply `supabase/migrations/20261120120000_playoff_snapshots.sql` to the linked production project, then publish the first snapshot with `scripts/publish-playoff-forecast.mjs --publish`. It uses the same input validation and simulation engine as cron. With no flag it is a read-only preview.

Run `npm test`, `npm run lint`, `npm run build`, then isolated `npm run test:e2e`. Push through the existing main-branch Vercel workflow. Verify the public table/API, a worker scenario and reset, stakes, homepage/menu replacement, preserved archive, cron authorization and public read-only permissions. Forecast results are independent of frozen Weekly Picks prices.
