# Week 9 Friday previews — 6 November 2026

Six Friday outlooks and winner calls follow Jacksonville–Baltimore. Alan–Jack
is Match of the Week: the top two in Tuesday’s rankings, with Alan 5–3 and Jack
6–2 after four consecutive wins. Tuesday’s Week 9 rankings through Week 8,
the six settled Week 8 reviews, old features and published calls are unchanged.

## Evidence and timing

The public Sleeper snapshot was retrieved at 08:58:07 UTC. It contains all twelve
rosters, selected starters, bench, original selected-lineup PPR estimates,
previous scores and completed moves since 2 November across transaction weeks
1–9. The edition timestamp is 09:03:18 UTC. These are Friday calls with Thursday
points known. Final Friday injury designations were not available at research.

The separate `odds-week-nine.json` uses the existing best-legal-lineup model,
MAC 12 scoring, locked starters’ actual points and opponent adjustment. It is
not the same measure as the selected-lineup PPR estimates in the previews.
Questionable players with projections remain eligible under the existing policy.
Out/IR/PUP/suspended players are excluded. No projected score guarantees fitness.

`2026-week-9-friday-audit.json` checks public ballots 133 and 149. All six Week 9
fixtures match the research and authored IDs; the lock is **8 November, 18:00
Europe/Dublin**. The early Bengals–Falcons game begins before that lock under
the established all-six-picks rule. No private votes or member accounts were read.

Thursday starter totals: Tommy 8.90, Jack 5.58, Niall 38.68, Hugo 15.00,
Keenan 5.30; the other seven teams have zero. Rodriguez’s 11.20 remains on Alan’s
bench; Baltimore’s defence remains on Joe’s bench. The prices cannot move them
into a lineup after the game.

## League wire

No completed trades since Monday appear in the checked transaction feeds.
The actual waiver and free-agent activity provides the stories:

- Keenan paid $6 for Henderson, dropping Okonkwo. His TE slot is empty and
  Ferguson is tagged IR despite a surviving projection. The model has eight
  eligible starters, with no invented tight-end replacement.
- Shane paid $8 for Miller and $3 for Bates; Stroud replaces injured-reserve
  Jackson in the selected lineup.
- Alan paid $8 for Dobbins and $5 for the Giants defence, added Borregales free,
  then replaced Kyler Murray with Mayfield on Thursday.
- Jack bought San Francisco’s defence for $2, then dropped it for New Orleans
  about sixteen minutes later. Pollard and Pittsburgh are on bye.
- Burns paid $4 for Mitchell and $2 for Chicago. Brissett and Darnold have been
  released; Willis is rostered and Shough remains selected.
- Niall briefly claimed Brissett before replacing him with Demarcus Robinson.
- Joe released Ayomanor, added and released Richardson, and brought in Detroit,
  Flournoy and Baltimore. Detroit is the selected defence.
- Sharpe replaced Roschon Johnson with Vidal; Tommy added Fairbairn for $0.
- Tommy still has A.J. Brown selected without a projection; the best-lineup
  model uses Stevenson as flex cover. This is not priced as a permanent zero.

## Primary news checked

- [Jaguars game report](https://www.jaguars.com/news/game-report-2026-week-9-jaguars-33-ravens-10):
  Thursday’s 33–10 result, Lawrence–Washington touchdown and Little’s four field goals.
- [49ers practice report](https://www.49ers.com/team/injury-report/): McCaffrey
  moved from DNP to limited Thursday; the team lists hamstring, while Sleeper
  lists calf. Copy avoids asserting an injury location from the conflicting tags.
- [Eagles–Giants report](https://www.philadelphiaeagles.com/news/giants-vs-eagles-injury-report-saquon-barkley-devonta-smith-cam-skattebo-2026-nfl-week-9):
  Barkley limited Thursday, Smith DNP; Nabers DNP Thursday and Skattebo both days.
- [Buccaneers report](https://www.buccaneers.com/team/injury-report/): Egbuka
  returned to full practice; Irving’s Thursday absence is rest.
- [Packers–Patriots report](https://www.packers.com/team/injury-report/): Watson
  limited with a rib issue; Brown and Henderson missed both practices.
- [Lions–Dolphins report](https://www.detroitlions.com/team/injury-report/):
  St. Brown limited, Willis full Thursday.
- [Jets–Chiefs report](https://www.newyorkjets.com/team/injury-report/): Wilson
  missed both practices with a concussion; Hall, Rice and Kelce were full Thursday.
- [Cowboys report](https://www.dallascowboys.com/team/injury-report/): Pickens
  limited both days with a hamstring issue.
- [NFL Jackson report](https://amp.nfl.com/news/ravens-qb-lamar-jackson-suffers-right-thumb-injury-bills):
  thumb surgery and injured reserve, corroborated by the current Sleeper tag.
- [NFL Week 9 schedule](https://www.nfl.com/schedules/2026/by-week/week-9):
  Thursday completed; Sunday’s early Madrid game and Pittsburgh/Tennessee byes.

Generic NFL injury search results had inconsistent game pairings and were not
used. Current team reports take precedence over generic search snippets. Friday
morning Sleeper tags are identified as such and are not final NFL designations.

## Calls and prices

| Fixture | Friday call | Prices, home / away |
| --- | --- | --- |
| Tommy–Sharpe | Tommy | 1/2 / 2/1 |
| Alan–Jack (feature) | Alan | 4/9 / 9/4 |
| Niall–Joe | Joe | 2/1 / 1/2 |
| Karl–Murphy | Karl | 4/6 / 6/4 |
| Burns–Hugo | Hugo | 13/8 / 8/13 |
| Keenan–Shane | Shane | 5/1 / 1/5 |

The homepage has three fresh talking points; the practice picks page uses the
Week 9 snapshot. No new Friday Mackdown recording was supplied or published.

## Copy check

Used the repository-requested Humanizer skill as a checker. Flags considered:
repeated numeric summaries, stock dramatic closers, forced contrasts and
unsupported injury certainty. The final copy keeps numbers tied to a specific
lineup decision, preserves Friday timing and the established section format,
and qualifies fitness against the actual Thursday reports. Manager-specific
jokes use the existing bios and verified moves. No quotes or private events
were invented. The published prose keeps score/record dashes and the league voice.

## Verification

- 169 unit/integration tests passed, including new fixture, publication and
  lineup-eligibility checks against the Week 9 snapshot.
- `npm run lint` and `npm run build` passed.
- 55 isolated Playwright clubhouse and weekly-odds tests passed, covering mobile
  widths, both themes, report sheets, navigation and the priced-picks flow.
  The initially missing Chromium test binary was installed in temporary storage.
- All twelve Week 8 Sleeper totals still match their frozen public final scores.
- All twelve Week 9 prices were published and read back against the receipt in
  `2026-week-9-prices.json`. The refreshed public audit includes both weeks.
