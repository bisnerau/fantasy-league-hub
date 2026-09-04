# MAC 12 draft recap runbook

The user should only need to say that the Sleeper draft is complete.

## Draft-night workflow

1. Run `npm run draft:prepare`.
2. Confirm the generated report contains 12 teams and the expected number of
   picks. It is written outside the repository to
   `/private/tmp/mac12-draft-recap-2026.json`.
3. Read the current manager profiles in `lib/data/managers.ts` and the generated
   report.
4. Build a draft-night consensus from at least three current, reputable fantasy
   sources. Collect scoring-format-appropriate ADP, expert consensus rankings
   and season projections. Record the source URLs and the time checked.
5. Compare every selection with consensus ADP, positional ADP and the options
   available at that exact pick. Sleeper's ranking is a useful additional data
   point, but it must not be the only value benchmark.
6. Browse for the latest NFL injuries, official depth-chart changes,
   suspensions, transactions and role news. Prefer NFL and team sources for
   factual status, then use current fantasy experts for interpretation. Do not
   rely on information remembered from before draft night.
7. Make sure every ranking, projection and ADP source matches this league's
   scoring and roster settings. Do not mix redraft with dynasty or best-ball
   rankings, and do not silently mix standard, half-PPR and full-PPR data.
8. Where experts disagree, represent the range and use evidence rather than
   selecting whichever opinion supports a pre-written conclusion.
9. Check the current Leinster senior squad and relevant former Leinster
   favourites using current authoritative sources.
10. Grade every roster with the same 100-point rubric:

- Starting-lineup strength: 30
- Value relative to draft position: 25
- Roster construction: 20
- Depth and upside: 15
- Injury, bye-week and volatility risk: 10

11. Review the grades across all 12 teams as one cohort. Avoid grade inflation
    and make sure the prose supports the score.
12. Predict one complete final table from 1st through 12th with no ties. Base it
    on roster quality, the manager's history and habits, and any relevant league
    context. The draft grade remains roster-only. If the projected order differs
    materially from the grade order, explain why in that manager's outlook.
13. Write sharp, funny and fair copy for every entry in
    `lib/data/draft-recap-content.ts`. Manager history shapes the outlook and
    jokes, but the roster itself determines the grade.
14. Use a current or former Leinster player for each comparison and explain the
    connection. Prefer distinct comparisons across the 12 teams.
15. Add the research methodology, timestamp and source links to the published
    recap so the evidence behind the grades is transparent.
16. Treat the projected final table as a frozen pre-season record. Once it is
    published, do not revise a prediction except to correct a factual typo. At
    the end of the season, compare each projected place with the actual finish.
17. Confirm the manager forecast window is open and locks with the Week 1 Sunday
    picks. Managers submit their own private 1st-to-12th tables using the same
    accounts as the matchup predictor. After the lock, reveal the league
    consensus and every named ballot.
18. Set `published` to `true`, update the homepage/sidebar links, build, lint
    and deploy to Vercel.

## Required entry structure

Each manager receives:

- Letter grade and numerical score
- Predicted final position from 1st to 12th
- Headline and team summary
- Best pick
- Biggest concern
- Personalised season outlook based on manager history
- Leinster player comparison with explanation
- Complete draft-pick list

## Accuracy rules

- Grade the roster that was actually drafted, not the manager's reputation.
- Use consensus ADP rather than a single site's rankings.
- Use current expert rankings and projections to assess starter strength,
  upside and risk.
- Account for the league's scoring, required starters, bench size and draft
  position.
- Check news again immediately before publishing in case a player's status
  changes after the final pick.
- Treat jokes as commentary, never as evidence for moving a grade.
- Give every team a unique projected position and confirm the full table covers
  1st through 12th exactly once.
- Preserve the prediction and publication timestamp for the end-of-season
  accuracy review.
