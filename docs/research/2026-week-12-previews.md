# Week 12 Thanksgiving edition — 26 November 2026

Six Thanksgiving outlooks, winner calls, Burns–Joe as Match of the Week,
three homepage talking points and twelve frozen prices follow the completed
Green Bay–Los Angeles opener. The current Week 12 rankings and all earlier
reports remain unchanged. No recording was supplied or generated.

## Evidence and timing

`2026-week-12-thanksgiving-sleeper.json` retains the 10:38:03 UTC public
Sleeper check of state, fixtures, starters, selected-lineup PPR projections,
bench alternatives, records and completed moves across the Week 11/12 feeds.
Defence display names were expanded from the same public player metadata.
The previews use their actual Thursday publication timestamp and explicitly
acknowledge the opener. They do not reconstruct pre-kickoff predictions.

| Fixture | Opening points | Thanksgiving call | Home / away price |
| --- | --- | --- | --- |
| Sharpe–Murphy | 19.52–0 | Murphy | 3/1 / 1/3 |
| Burns–Joe, Match of the Week | 16.50–4.90 | Burns | 10/11 / 11/10 |
| Alan–Shane | 0–11 | Shane | 11/10 / 10/11 |
| Keenan–Tommy | 16.50–0 | Keenan | 8/13 / 13/8 |
| Hugo–Jack | 3.40–0 | Jack | 11/8 / 8/11 |
| Niall–Karl | 0–28.50 | Karl | 10/3 / 2/7 |

Burns–Joe gets the feature for the direct playoff-cut contest: both are 5–6,
Joe leads by 21.14 season points, and the model separates their adjusted
best-lineup totals by 2.06. Alan–Shane is also close, with the bye race covered
in its own report. The featured selection and all calls disclose the known
opening points.

Prices use the existing custom-scoring, opponent-adjusted best-lineup model.
All twelve teams have nine legal players. Completed starters retain actual
points, including Christian Watson despite his subsequent Out tag. Completed
bench players cannot enter; Stafford and Joe's Green Bay defence remain out.
Walker, Jacobs and IR players are excluded. Questionable players with valid
projections remain eligible under the existing policy; this does not promise
availability. The selected-lineup PPR estimates in the previews remain separate
from the price model. No model parameters changed.

## Current primary sources

- [NFL Week 12 schedule and game designations](https://fantasy-www.nfl.com/news/nfl-week-12-injury-report-2026-season):
  Bears–Lions at 18:00 Thursday, Eagles–Cowboys at 21:30 Thursday,
  Chiefs–Bills at 01:20 Friday and Broncos–Steelers at 20:00 Friday, Irish time.
  Walker is out; Kincaid is questionable. Weekend final designations remain pending.
- [Packers inactives](https://www.packers.com/news/packers-rams-week-12-inactives-nov-25-2026):
  Jacobs did not play. His absence is distinct from Watson's recorded points.
- [NFL's 25 November Purdy update](https://fantasy-www.nfl.com/news/brock-purdy-sits-out-practice-ankle-sprain-49ers-seahawks):
  Purdy missed Wednesday with an ankle sprain and could miss Sunday. Evans
  also missed Wednesday practice. Other availability wording refers explicitly
  to the morning Sleeper tags, not a final game designation.

## Thanksgiving presentation

Home and Weekly Picks share a warm amber holiday card with the four early
kickoffs, a reminder to set Sleeper lineups before individual games, and the
unchanged Sunday 29 November 18:00 Irish picks/Banker deadline. It appears only
for this league's unsettled 2026 Week 12, from 26 November until Tuesday
1 December at 11:00 UTC. Other weeks, other leagues, the standings view and
settled Week 12 do not display it. It expires by date even if NFL state lags.
The card is static, with readable contrast in both site themes.

## Copy and data audit

Humanizer used as a checker: removed the generic sentence about Karl having
several ways to win, replaced Jack's vague strength claim with the three
players supporting it, and shortened his cover deadline to Buffalo's kickoff.
Kept the jokes, factual timing caveats and record dashes. No suitable writing
references were found in the returned writing-style results; the established
site brief and manager profiles supply the voice.

`2026-week-12-thanksgiving-audit.json` verifies the Sunday lock, six current
fixtures and unchanged Week 11 finals. The twelve published prices match the
public readback and `2026-week-12-prices.json`. All matchup rows remain unchanged
after pricing. No votes, Bankers, accounts, scoring rules or results were written.

## Validation

All 207 unit/integration tests passed, including fixture/projection identity,
publication gates, current editorial routing, locked starter points, legal
price lineups, unavailable-player exclusions and holiday expiry. Lint and the
production Vercel build passed. Browser verification covers the shared banner,
current feature, preview sheet and phone layout. The automated Playwright suite
was not run because its Chromium binary is unavailable; these checks do not
represent physical-device Safari testing. Production verification follows the
existing GitHub-to-Vercel deployment.
