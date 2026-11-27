# Thanksgiving weekend refresh — 27 November 2026

Commissioner-requested rewrite before sharing the site with the league. Six
Friday previews replace the Thursday outlooks, with their actual Friday
publication time. The complete Thursday reports are retained in
`2026-week-12-thursday-previews.json`; each refreshed report displays its earlier
and current winner call. The Tuesday rankings and earlier weeks are unchanged.

## Friday evidence

`2026-week-12-friday-sleeper.json` records fresh public Sleeper scores, selected
lineups, PPR estimates, availability tags and completed transactions. Completed
starter points sum exactly to every team total, including Loveland's -0.50.
All four early NFL games have finished. No new completed transaction was found
since Thursday's publication check. The selected-lineup PPR fields keep their
existing meaning; they are not live custom-scoring estimates.

| Matchup | Friday recorded points | Updated call | Earlier call |
| --- | --- | --- | --- |
| Sharpe–Murphy | 26.42–45.04 | Murphy | Murphy |
| Burns–Joe | 67.80–40.90 | Burns | Burns |
| Alan–Shane | 55.70–40.40 | Alan | Shane |
| Keenan–Tommy | 105.62–3.00 | Keenan | Keenan |
| Hugo–Jack | 62.00–17.54 | Hugo | Jack |
| Niall–Karl | 0.00–40.20 | Karl | Karl |

Burns–Joe stays Match of the Week for the direct 5–6 playoff-cut contest.
Gibbs' 48.20 and the 44.46-point Hugo lead explain the changed calls. Friday
injury tags are described as snapshot tags; final weekend designations were
not yet published. Purdy's second missed practice is supported by
[Sportsnet's 26 November report](https://www.sportsnet.ca/nfl/article/49ers-purdy-misses-practice-for-second-straight-day-sundays-status-in-question/).
The [NFL schedule](https://amp.nfl.com/news/nfl-week-12-injury-report-2026-season)
confirms Friday's Denver–Pittsburgh game at 20:00 Irish time. The
[Lions recap](https://www.detroitlions.com/news/recap-lions-vs-bears-gibbs-goff-moore)
and [Bills game centre](https://www.buffalobills.com/game-day/2026/reg-week12/chiefs-at-bills/)
confirm their Thanksgiving games have finished.

`2026-week-12-friday-audit.json` verifies all six live ballot identities, the
new editorial routing, Sunday 29 November 18:00 Irish lock, and all twelve
prices against Thursday's published receipt. No database writes, new prices,
member votes, Bankers, scores or accounts are part of this update.

## Design and animation research

- [Motion](https://github.com/motiondivision/motion), MIT, and its
  [SVG animation guidance](https://motion.dev/docs/react-svg-animation):
  transform-based mascot movement, staged entrances and user motion preference.
- [React Bits](https://github.com/DavidHDev/react-bits), MIT + Commons Clause:
  short interaction feedback. The existing credited ClickSpark is reused with
  eight leaf-shaped copper/cranberry particles. No new source is copied.
- [canvas-confetti](https://github.com/catdad/canvas-confetti), ISC: custom shapes
  and explicit reduced-motion support, considered but unnecessary for eight
  particles. No new dependency added.
- [Anime.js](https://github.com/juliangarnier/anime), MIT: timeline inspiration;
  not added alongside the existing animation stack.

The initial SVG turkey wore a MAC 12 jersey and carried a football. Its
entrance hop, feather fan and wing wave last under one second; a labelled
button replays them and emits a bounded leaf burst. Keyboard activation works.
All animation is suppressed by the existing reduced-motion preference checks
and CSS media queries. There is no perpetual background animation or sound.
The highlights board links into the relevant matchups, and “Serve the picks”
opens the ballot. Confirmed saves use the seasonal burst during the existing
holiday window. The callback still runs only after persistence confirmation.

The requested Griddy follow-up puts the football beside the turkey and splits
its feet and wings into independently animated parts. Alternating heel kicks,
wing swings, a body bounce and a brief goggles pose run for 2.88 seconds, with
tap and keyboard replay. The reduced-motion media gate still suppresses the
dance. [Justin Jefferson's NFL tutorial](https://www.youtube.com/watch?v=TrxR5HMtr-M)
was found as a dance reference; the SVG and CSS choreography are original.

The copper/cranberry presentation is scoped to this league's unsettled Week 12
homepage and Weekly Picks, expiring Tuesday 1 December at 11:00 UTC. Standings,
archives and other leagues keep their existing styling.

## Copy and validation

No suitable writing references were found in the returned writing-style search
results. The established reports supply the voice. The Humanizer pass retains
specific manager jokes, factual qualifications and the original calls, while
removing generic filler and unnecessary contrasts.

All 214 unit/integration tests pass, including refreshed fixture identities,
publication gates, prior-call retention, the two changed calls, banked score
sums and the unchanged frozen price snapshot. Lint and the production build
pass. Browser checks cover phone/desktop layout, the mascot, ballot links and
updated report sheets. The automated Playwright suite is unavailable because
its Chromium binary is not installed; no physical-device Safari claim is made.
