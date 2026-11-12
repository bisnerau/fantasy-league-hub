# Week 10 Thursday previews — 12 November 2026

The commissioner requested the weekend update today because he is unavailable
Friday. Six previews, winner calls, Burns–Niall as Match of the Week and three
homepage talking points use Thursday morning evidence before the opening game.
Week 10 rankings through Week 9, historical previews, reviews, selections and
recordings remain unchanged. No new Mackdown recording was supplied.

## Evidence and early publication

`2026-week-10-sleeper.json` was retrieved at 10:50:02 UTC. It contains current
starters, bench, PPR estimates, records, Week 9 totals and completed transactions
since 9 November from feeds 0–10. Wednesday waivers are filed under leg 9;
free-agent moves appear under leg 10. No completed trade appears in this period.
The preview publication timestamp is 10:52:41 UTC on 12 November.

Washington–New York opens at 01:15 UTC on Friday 13 November (Thursday evening
in the US). The Sunday all-six-picks lock remains **15 November, 18:00 Irish
time**, after the early Patriots–Lions game. Schedule checked against the
[NFL Week 10 schedule](https://www.nfl.com/schedules/2026/by-week/week-10) and
[official season schedule](https://media.nfl.com/content/dam/communications/football-communications/2026/news/05%2014%2026%20-%202026%20NFL%20Schedule%20-%20By%20Week.pdf).

This is an explicitly early price publication for the commissioner's request.
`odds-week-ten.json` uses the existing best-legal-lineup model and MAC 12 scoring,
with opponent adjustments, before any Week 10 points have been scored. All
twelve teams have nine eligible players; no player is locked and no points are
banked. Out/IR/PUP/suspended players and missing projections are excluded under
the existing policy. Questionable players with projections remain eligible.
The frozen selected-lineup PPR estimates in the reports are a different measure.

The homepage and feature disclose the early prices. Every preview says Thursday
before Washington–New York and acknowledges pending final weekend designations.
Later injuries, roster moves and Thursday results cannot change these prices.
No Friday refresh is promised or required for publication.

## Stories and calls

| Fixture | Thursday call | Home / away price |
| --- | --- | --- |
| Alan–Sharpe | Alan | Evens / Evens |
| Tommy–Joe | Joe | 5/1 / 1/5 |
| Jack–Murphy | Jack | 2/9 / 9/2 |
| Burns–Niall (feature) | Niall | 5/2 / 2/5 |
| Karl–Shane | Shane | 4/1 / 1/4 |
| Keenan–Hugo | Hugo | 9/4 / 4/9 |

Burns and Niall are both 4–5 outside the playoff places; this direct meeting
gets the feature ahead of Karl–Shane. Niall's stronger available backs and
recent scoring support the call. Burns' deliberate Bass benching is described
accurately as protecting the lead, never as an error.

Tommy spent $26 on Dell and $23 on Estime. Nacua is tagged Out; the preview makes
no claim that an IR transaction occurred. Irving and Loveland are on bye.
Keenan bought Okonkwo back for $2 and Kaleb Johnson for $5; Jacobs is tagged Out
and Barkley is on bye. His record is four losses in five since 4–0, checked
against the archived reports (he won Week 8). Karl added Aiyuk for $7 and Buffalo
for $5; Aiyuk has no projection and does not enter the model. Joe paid $1 for
Out-tagged Henderson and added Zvada; Jack added Indianapolis, now selected.
Burns' Hill, Virgil and Cincinnati claims cost $0. Niall added Mumpfield.

## Primary injury sources

- [Giants final report](https://www.giants.com/news/giants-vs-commanders-week-10-injury-report-qb-j-j-mccarthy-rb-cam-skattebo-limited):
  Skattebo and Nabers finished full and have no final game designation.
- [Patriots–Lions, 11 November](https://www.patriots.com/news/week-10-injury-report-patriots-at-lions):
  Maye full; A.J. Brown, Goff and St. Brown limited. These are Wednesday
  practice statuses, not final Sunday decisions.
- [Jets, 11 November](https://www.newyorkjets.com/news/garrett-wilson-omar-cooper-jr-limited-jets-practice-wednesday-bills-week-11-11-2026):
  Wilson limited in a walkthrough and still in concussion protocol.
- [Cowboys report](https://www.dallascowboys.com/team/injury-report/):
  Pickens limited Wednesday with a hamstring issue.
- [Packers, 9 November](https://www.packers.com/news/packers-rb-josh-jacobs-to-miss-time-due-to-surgery-on-broken-finger-nov-9-2026):
  Jacobs requires finger surgery and will miss time; no recovery date asserted.

Other availability descriptions are explicitly Thursday Sleeper tags. A
surviving projection does not make Etienne eligible while tagged IR. McConkey
remains questionable; the price including him does not guarantee availability.

## Copy and data checks

Used the Humanizer skill as the repository-requested checker and edited manually.
Flags: the unnecessary Henderson contrast, a clumsy compound phrase for Pollard,
and repeated generic closing language. Simplified the first two and retained
specific manager jokes rather than adding dramatic summaries. Fact review
corrected an inferred Keenan streak, distinguished Jack's dropped defence from
his previously selected defence, and avoided asserting Jacobs' surgery already
happened. All six reports are 223–243 words including summaries.

New tests verify all six source fixture identities, frozen estimates, correct
pre-kickoff timestamps, selection and homepage publication gates, and all twelve
nine-player price lineups. They check no banked points, no unavailable players,
bye exclusions and bench cover. The public audit verifies all six Week 9 finals
unchanged, the six Week 10 fixtures and the Sunday lock without private votes,
Bankers or member sessions.

## Release verification

The 169 existing unit/integration tests and both new Week 10 tests passed.
Lint and the final production build passed. All 55 isolated clubhouse and
weekly-odds Playwright checks passed, including mobile widths, both themes,
report sheets, navigation and priced picks. Archived report, ranking, recording,
odds and feature data were compared with the prior commit and are unchanged.
Twelve Week 10 prices were published once; the public readback matches every
field in `2026-week-10-prices.json`. The refreshed Thursday audit retains the
unchanged Week 9 finals. No member votes, Bankers or accounts were changed.
