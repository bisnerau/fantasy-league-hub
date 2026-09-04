# MAC 12 draft recap runbook

The user should only need to say that the Sleeper draft is complete.

## Draft-night workflow

1. Run `npm run draft:prepare`.
2. Confirm the generated report contains 12 teams and the expected number of
   picks. It is written outside the repository to
   `/private/tmp/mac12-draft-recap-2026.json`.
3. Read the current manager profiles in `lib/data/managers.ts` and the generated
   report.
4. Browse for the latest NFL injuries, depth-chart changes, suspensions and
   role news. Use primary or authoritative current sources. Do not rely on
   information remembered from before draft night.
5. Check the current Leinster senior squad and relevant former Leinster
   favourites using current authoritative sources.
6. Grade every roster with the same 100-point rubric:
   - Starting-lineup strength: 30
   - Value relative to draft position: 25
   - Roster construction: 20
   - Depth and upside: 15
   - Injury, bye-week and volatility risk: 10
7. Review the grades across all 12 teams as one cohort. Avoid grade inflation
   and make sure the prose supports the score.
8. Write sharp, funny and fair copy for every entry in
   `lib/data/draft-recap-content.ts`. Manager history shapes the outlook and
   jokes, but the roster itself determines the grade.
9. Use a current or former Leinster player for each comparison and explain the
   connection. Prefer distinct comparisons across the 12 teams.
10. Set `published` to `true`, update the homepage/sidebar links, build, lint
    and deploy to Vercel.

## Required entry structure

Each manager receives:

- Letter grade and numerical score
- Headline and team summary
- Best pick
- Biggest concern
- Personalised season outlook based on manager history
- Leinster player comparison with explanation
- Complete draft-pick list
