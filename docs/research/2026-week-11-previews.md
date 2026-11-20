# Week 11 Friday previews — 20 November 2026

Six Friday previews, winner calls, Jack–Shane as Match of the Week, homepage
points and Week 11 practice prices follow Indianapolis–Houston. The Tuesday
rankings, prior reports and recordings remain archived unchanged. No new
Mackdown recording was supplied.

## Evidence and timing

`2026-week-11-friday-sleeper.json` records a fresh 09:09:45 UTC check of NFL
state, current rosters, Week 11 lineups, Week 10 results, PPR projections and
completed transactions since 16 November across feeds 0–11. The best-lineup
price snapshot was taken at 09:08:56 UTC. Previews publish at 09:11:40 UTC.
The earlier Tuesday evidence files remain unchanged.

The [Texans schedule](https://www.houstontexans.com/schedule/) confirms the
Thursday game has finished, Houston 26–3 Indianapolis. Every preview and the
feature disclose that Thursday points are already known. The selected-lineup
PPR estimates remain their original projections; they are separate from the
custom-scoring price model, which replaces completed games with actual points.

| Fixture | Thursday points | Friday call | Home / away price |
| --- | --- | --- | --- |
| Joe–Sharpe | 0–3.20 | Joe | 1/3 / 3/1 |
| Alan–Murphy | 0–3.30 | Alan | 1/6 / 6/1 |
| Burns–Tommy | 14.80–19.00 | Burns | 4/11 / 11/4 |
| Jack–Shane (feature) | 0–20.46 | Jack | 4/6 / 6/4 |
| Niall–Keenan | 3.00–0 | Keenan | 4/6 / 6/4 |
| Karl–Hugo | 0–22.10 | Hugo | 11/10 / 10/11 |

All twelve price lineups have nine players. Locked starters keep their actual
points; locked bench players cannot enter, including Tommy's Dell. Bye players
and Out/IR/PUP/suspended players remain excluded. Questionable players with
projections remain eligible under the existing policy: Walker and Evans for
Niall, Bowers and Waddle for Alan, Kincaid and Gay for Jack, and McConkey for
Hugo are not guarantees of availability. The Niall–Keenan editorial call favours
Keenan because Walker missed both practices, despite the model's narrow Murray
advantage. No model weights or injury rules changed.

The public ballot audit verifies six Week 11 fixtures, all six unchanged Week
10 finals and the **Sunday 22 November, 18:00 Irish time** lock. Live league
settings retain `trade_deadline: 11`. Under [Sleeper's deadline rules](https://support.sleeper.com/en/articles/2435411-when-is-my-trade-deadline),
trading ends when the final game finishes. The [Week 11 schedule](https://www.nfl.com/schedules/2026/by-week/week-11)
ends Monday night, early Tuesday 24 November in Ireland. The picks and trade
deadlines are distinct.

## League moves used in the copy

- Monday: Tommy receives DJ Moore and $15 FAAB from Shane for Puka Nacua.
  Nacua remains on Shane's reserve list; Moore is now Tommy's selected starter.
- Wednesday: Murphy pays $26 for Hutchinson, dropping Marks, and later adds
  Hockenson. Hutchinson's 3.30 Thursday points are fixed.
- Burns pays $6 each for Nix and Lane, plus $2 for Chicago. Nix is selected.
- Alan adds Waller and Lutz for $0 and Pittsburgh's defence for $5.
- Keenan pays $2 for Bryant and adds the Chargers defence for $0.
- Hugo pays $6 for Andrews, then $1 for Bernard on Friday, dropping Douglas.
- Dave adds Ward and drops Maye just after midnight Friday UTC, then replaces
  Seattle with Dallas. Love is on bye. Stevens cost $2 on Wednesday.
- Shane adds San Francisco and Dike overnight; both are selected. Jack replaces
  Indianapolis with Carolina before Thursday kickoff.

## Primary injury checks

All reports below were read on Friday morning and contain Thursday practice
status. Final Friday game designations were not yet published at this check.

- [Chiefs](https://www.chiefs.com/news/week-11-injury-report-cardinals-vs-chiefs-2026):
  Walker DNP Wednesday and Thursday (groin); Kelce, Rice and Mahomes full Thursday.
- [Raiders](https://www.raiders.com/team/injury-report/): Bowers moves from DNP
  to limited (ankle/quadricep); Gay moves from limited to DNP (right hip).
- [Broncos](https://www.denverbroncos.com/team/injury-report/): Waddle full
  Wednesday and Thursday (concussion), with final status still unspecified.
- [Bills](https://www.buffalobills.com/team/injury-report/): Kincaid DNP both
  days (thumb/ankle). Fannin's bye leaves Jack without ready rostered TE cover.
- [Titans](https://www.tennesseetitans.com/news/week-11-injury-report-titans-at-cowboys):
  Tate limited both days (shoulder); Pollard's Thursday absence is rest.
- [Chargers–Jets](https://www.chargers.com/news/chargers-vs-jets-injury-report-ladd-mcconkey-daiyan-henley-week-10-2026):
  McConkey limited both days (back); Omar Cooper Jr. DNP both days (ankle/hip).

## Copy checks

Read the existing manager profiles and prior reports for league voice and
rivalry history. No suitable writing references were found in the returned
writing-style results. Humanizer used as a checker, with manual changes:
trimmed repeated explanatory phrasing in Karl–Hugo, shortened Niall's closing
injury metaphor, and removed a claim that a Joe win guarantees sixth (Niall
could still pass him on season points). Changed Jack's hoped-for outcome to
Shane going 7–4 rather than predicting a specific table position. Necessary
Friday and injury caveats, record dashes and manager-specific jokes remain.
Reports are 241–247 words including summaries and section titles.

## Verification

All 175 unit/integration tests, lint and the production build passed. New tests
check all source fixture identities and frozen PPR estimates, publication gates,
Friday timing, featured-story routing, homepage points, Sunday lock, all twelve
legal price lineups, exact Thursday starter points and locked bench exclusions.
All 55 isolated clubhouse and weekly-odds browser checks passed, including
320–1440px widths, both themes, report sheets, navigation and priced picks.
The first browser launch was blocked from binding the local fixture port; the
permitted rerun passed. These are Chromium emulations, not physical-device tests.

Twelve prices were published once and the public readback matches the saved
receipt. The audit also confirms all six Week 10 finals are unchanged and no
Week 11 final scores were written. No votes, Bankers or member accounts were
changed. Production verification follows the Vercel deployment.
