# Weekly matchup previews and reviews

Every matchup in Weekly Picks has Preview and Review tabs beneath the lineup
section. Each opens with a short summary and an expandable breakdown. Reviews
are selected for settled weeks; upcoming weeks select Preview.

## Voice and content

League newsletter analysis with friendly slagging, generated automatically from
structured Sleeper facts. No external AI service, API key or generation charge
is required. Copy is assembled from the facts; it does not claim to report live
NFL news, injuries, touchdowns or the sequence of scoring plays.

Previews cover pregame form, the biggest projected player contributions, the
largest lineup-slot projection gap, verified 2025 meetings and an explicit
winner call. The call uses the higher complete starting-lineup PPR estimate;
equal estimates get an explicitly labelled coin-flip choice of the first-listed
team. These estimates are not custom-league projections or win probabilities.
Hugo Walsh and Alan Horgan share a home; their matchup is the household derby.

Reviews explain the settled result, league-wide scoring context, each side’s
leading and lowest-scoring starters, one position-compatible bench alternative,
and whether the archived preview picked the winner. Bench alternatives are
hindsight, not claims that a move was available before kickoff. Authenticated
members also see how many recorded voters backed the winning team; this uses
the existing member-only vote reads, with no public vote data in story storage.

## Publication and preservation

- Previews publish Thursday at 11am Europe/Dublin via the existing daily cron.
  The 10:00/11:00 UTC schedules cover Irish summer and winter time. Vercel Hobby
  delivery may occur within the following hour. Publication is restricted to
  the two-hour morning window, before ordinary Thursday NFL games.
- A preview requires complete nonzero team estimates, dated projection data
  with no game date before Thursday, and zero points in every current matchup.
  An unusual Wednesday game or missing data can prevent that week’s edition;
  the site does not manufacture a pregame prediction afterwards.
- A nullable `prediction_matchups.preview_story` JSONB column stores the whole
  preview, publication timestamp, winner call and both estimates. The cron only
  writes when the column is null and the matchup is scheduled. Retries read
  back the saved row; concurrent runs cannot replace the original edition.
- Reviews appear on read once the existing Tuesday 11am Irish settlement gate
  has passed and all stored matchups are final. Page requests remain read-only.
  Final stored totals determine the result. Player breakdowns use Sleeper’s
  recorded historical lineup, which may reflect later stat corrections.
- Week 1 has reviews and an explicit notice that no pregame preview was saved.
  Week 2’s first edition is Thursday 17 September 2026 at 11am Irish time.

## Validation

`tests/matchup-stories.test.mjs` covers Irish publication boundaries, suppression
after earlier games, historical form without hindsight, missing projections,
household context, correct/incorrect/tied calls, missing player scores, legal
single bench swaps and all-play counts. Prediction integration tests cover
immutable archives, silent-write retries, no retrospective previews, and
read-only review generation. Existing vote and settlement tests still apply.

Deploy the additive Supabase migration before the app. The existing public-read
and service-role-write matchup policies apply to the new column; no member
permissions, ballots or vote rows are changed.
