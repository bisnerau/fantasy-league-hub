# Week 8 Friday previews — 30 October 2026

Requested by the commissioner before he makes the Halftime Show public. The
six previews and calls are Friday outlooks after Carolina–Green Bay, explicitly
including Thursday points. Halftime publication remains false, including its
homepage promotion, navigation and recording. The Wednesday rankings, Week 7
reviews and all earlier previews/calls are retained.

## Evidence and timing

Public Sleeper research was retrieved at 09:43:45 UTC. The price snapshot was
built at 09:40:17 UTC; original selected-lineup PPR estimates in the reports come
from the later research snapshot. These are separate measures: the prices use
MAC 12 scoring, the best legal rostered lineup, locked starters' actual points
and the existing opponent adjustment. Reports were authored at 09:48 UTC.
Friday NFL game designations were not yet available.

`2026-week-8-sleeper.json` records all twelve teams, current starters and bench,
previous scores, and completed trades across all eight transaction endpoints.
Recent waivers/free agents include every completed move since 26 October. No
private votes, member ballots or authentication sessions were read.

## Trades and wire

- Thursday: Jack receives Jefferson; Joe receives Purdy and Egbuka.
- Thursday: Shane receives Goedert; Niall receives Likely.
- Tuesday: Alan receives Bowers for Javonte Williams and Kraft; Alan also receives
  Brown and Waddle for Olave. Current ownership is used throughout the previews.
- Friday: Niall claims Freiermuth for $0; Jack claims Pittsburgh for $8. Jack also
  claimed Deebo for $10 Thursday and added Spears for free.
- Niall's $48 Black claim and free Harrison addition join Olave and Likely on bye.
- Keenan paid $4 for Okonkwo; Alan $10 for Coleman; Sharpe $5 each for Roschon and
  Seattle. Joe replaced Nix with Geno; Burns replaced Mayfield with Brissett.

Joe's selected WR slot is genuinely empty in the snapshot. The best-lineup model
includes Egbuka from the bench and does not price the empty selected slot as a
permanent zero. Egbuka's injury risk is disclosed. Keenan's price uses Smith at
flex despite his missed practice, under the established policy of retaining
Questionable players with projections. Odunze offers cover. Out/IR/PUP/suspended
players are excluded; a surviving projection does not establish availability.

Locked Thursday starter totals: Sharpe 11.80, Joe 20.90, Hugo 28.30, Keenan 40.50,
Shane 34.50; everyone else zero. Love's bench points do not enter Sharpe's price.
Watson's recorded points remain despite his current injury tag.

## Primary news checked

- [Packers game centre](https://www.packers.com/game-day/2026/reg-week8/packers-vs-panthers/):
  confirms the Thursday game finished. League fantasy scores come from Sleeper.
- [NFL Week 8 schedule](https://www.nfl.com/schedules/2026/by-week/week-8):
  Houston, New Orleans, the Giants and San Francisco are on bye.
- [Ravens, 29 October](https://www.baltimoreravens.com/news/ravens-injury-report-vega-ioane-kyle-hamilton-roquan-smith-ravens-practice-return-2026):
  Lamar completed a second full practice. No final Friday clearance is assumed.
- [Eagles, 29 October](https://www.philadelphiaeagles.com/news/eagles-at-commanders-injury-report-2026-nfl-week-8-sunday-night-football-saquon-barkley-devonta-smith):
  Barkley and Smith were estimated DNP Wednesday and absent Thursday; Goedert
  practised fully. The copy distinguishes the Wednesday walkthrough estimate.
- [Jets, 29 October](https://www.newyorkjets.com/news/jets-injury-report-week-8-vs-raiders-thursday-10-29-2026):
  Hall remained limited with a quad issue.
- [Raiders practice report](https://www.raiders.com/team/injury-report/):
  Bowers upgraded from limited Wednesday to full Thursday. The Jets' page had
  not populated the opponent's Thursday column, so the Raiders' own report wins.
- [Buccaneers practice report](https://www.buccaneers.com/team/injury-report/):
  Egbuka limited both days; Irving's Thursday DNP is rest, not last week's illness.
- [Rams–Chargers practice report](https://www.therams.com/team/injury-report/):
  Nacua is not listed; McConkey is full both days, with final status pending.

Generic NFL injury pages returned inconsistent historical week labels and were
not used for player-specific claims. Other injury tags are explicitly attributed
to Friday morning's Sleeper snapshot.

## Feature, calls and prices

Karl–Alan is Match of the Week: the 2025 finalists, playoff position at stake,
and only 1.06 between adjusted totals. It is a Friday selection with no starter
points banked by either side. The editorial Alan call differs from the model's
slight Karl preference. Niall–Tommy is closer numerically, but the final rematch
and Alan's changed roster earn the feature; Tommy was featured last week.

| Fixture | Prices | Friday call |
| --- | --- | --- |
| Jack–Sharpe | 4/6 – 6/4 | Jack |
| Niall–Tommy | Evens – Evens | Tommy |
| Karl–Alan | 10/11 – 11/10 | Alan |
| Joe–Hugo | 6/4 – 4/6 | Hugo |
| Keenan–Murphy | 1/2 – 2/1 | Keenan |
| Burns–Shane | 5/2 – 2/5 | Shane |

Week 8 ballot 133 locks Sunday 1 November at 18:00 UTC / Irish time after the US
clock change. Three preview talking points replace the rankings' homepage copy
until settlement; the ranking edition stays frozen. The odds playground now
uses the Week 8 snapshot. Later lineup changes do not reprice published odds.

## Humanizer check

Read Humanizer 3.1.0 at
`/Users/emmet/.claude/plugins/cache/humanizer/humanizer/3.1.0/SKILL.md` as the
repository requires. Applied it as a checker, with manual fixes:

- Replaced the generic “dangerous underdog” line with Murphy's Cook/London route.
- Kept the required Friday timing, price/lineup distinction and final-designation
  caveats, which change how a reader should assess a pick.
- Retained manager-specific jokes grounded in the biographies: disputed small
  league titles, Karl's scheduling complaints, Tommy/Hugo's forfeits and Burns'
  playoff record. No invented quotes or private events.
- Checked every named player's current ownership and NFL team. Removed an
  incorrect Baltimore reference for Likely; he is now a Giant on bye.
- Avoided automatic prose rewrites, invented game sequences and changes to any
  archived preview. Each new report is 222–232 words including its summary.

## Verification

All 167 unit/integration tests, lint and the production build passed. New checks
cover exact fixtures and estimates, publication gates, homepage selection and
expiry, current trade ownership, legal price lineups and locked starter scoring.
Five targeted browser checks passed for prices/Bankers and halftime access.
The usual ports were occupied by an existing server; unchanged test scenarios
ran from temporary copies on isolated ports 4418/4419 instead.

All twelve prices were published and independently read back. The public audit
verified the six stored fixtures, Sunday 18:00 UTC deadline and unchanged Week
5–7 matchup/results rows and prices. Receipts are `2026-week-8-prices.json` and
`2026-week-8-friday-audit.json`. No votes, Bankers, grading or halftime visibility
were changed. Existing unrelated output/video work and older untracked price
receipts are excluded from this release.
