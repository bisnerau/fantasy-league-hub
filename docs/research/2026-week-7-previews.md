# Week 7 Friday edition — 23 October 2026

Requested by the commissioner on Friday. The six outlooks and winner calls are
explicitly after New England–Chicago (Chicago won 30–24), not pre-kickoff picks.
Sleeper research was retrieved at 10:26 UTC; the best-lineup odds snapshot was
built at 10:24 UTC. Thursday practice reports were the latest available; Friday
game designations were still pending. Older reports and Tuesday's ranking
edition remain unchanged.

## League evidence

`2026-week-7-sleeper.json` preserves all twelve lineups, starter points, original
PPR estimates, roster availability, recent completed transactions and Week 6
results. The seven transaction-week endpoints were checked: exactly one
completed trade, filed under Week 7, at 16:33:38 UTC on Wednesday 21 October:

- Tommy received Bucky Irving.
- Karl received Garrett Wilson and Jonah Coleman.
- No draft picks or FAAB moved.

At the commissioner's explicit request, Tommy–Hugo replaces Karl–Jack as the
Friday Match of the Week. Both are 1–5 at the bottom of the table; the forfeit
stakes take priority over Karl–Jack's closer price. The feature correction is
timestamped 11:10:37 UTC. All original winner calls and published prices remain
unchanged: Niall, Karl, Tommy, Alan, Shane and Burns. The fuller featured report
uses the managers' verified busking, stand-up and Shark Boy forfeit history.

Thursday starter totals, already included in prices: Sharpe 41.54, Tommy 50.20,
Hugo 27.42, Alan 23.70, Burns 19.00; everyone else zero. Bench points remain
excluded, including Odunze's 10.90 for Keenan and Henderson's 4.30 for Joe.
All twelve Week 6 scores match Tuesday's archived evidence.

Notable completed pickups: Hugo paid $19 for Douglas (5.30 Thursday); Sharpe
paid $15 for Emanuel Wilson after Burns dropped him; Murphy spent $26 across
Cooper, Hockenson and Freiermuth; Joe paid $4 for Nix; Niall paid $6 for Higbee
and added Rodgers for free. Keenan spent $12 on Ferguson, releasing Fannin;
Jack bought Fannin for $2 on Friday after his own $2 Andrews claim. Ferguson
is tagged IR in the Friday feed, with no projection, and Keenan has an empty TE
slot. This is a current roster observation, not an allegation that he forgot
to set a lineup or knew an injury outcome when bidding.

Niall has Jacksonville's bye-week defence selected and no alternative rostered.
The model leaves that slot empty. Keenan's TE also contributes nothing. Players
on IR remain excluded even if practising (Kirk, Coleman). A practice return
does not prove activation. Questionable players with projections remain in the
model under the established method, including Lamar, Nacua and Egbuka. These
risks are disclosed in the reports; later lineup changes do not reprice a week.

## Primary news checked

- [Patriots' Thursday game recap](https://www.patriots.com/news/game-observations-8-takeaways-from-the-patriots-loss-to-the-bears-on-thursday-night-football-in-week-7):
  Chicago won 30–24. Fantasy points come from the league's Sleeper scoring.
- [Commanders, 20 October](https://www.commanders.com/news/terry-mclaurin-knee-injury-commanders):
  McLaurin is out for the season with a torn patellar tendon.
- [Ravens, 22 October](https://www.baltimoreravens.com/news/lamar-jackson-injury-report-ravens-practice-start-ankle-2026):
  Jackson joined the start of practice but remained limited; no Sunday clearance.
- [Buccaneers practice report](https://www.buccaneers.com/team/injury-report/):
  Thursday Irving limited (illness), Egbuka absent (concussion/foot), Mayfield full.
- [Rams–Raiders practice report](https://www.therams.com/team/injury-report/):
  Nacua added as limited (calf); Bowers upgraded to full (hamstring/calf).
- [49ers practice report](https://www.49ers.com/team/injury-report/):
  Evans and Samuel absent, Kirk full; Friday status columns blank at the check.

## Prices and deadline

`lib/data/experiments/odds-week-seven.json` uses the existing MAC 12 scoring,
best legal lineup, actual locked Thursday starters and opponent adjustment.
The practice page now uses this edition too. Dry run verified the ballot's
six exact fixture pairs before publication.

| Fixture | Prices |
| --- | --- |
| Niall–Sharpe | 10/11 – 11/10 |
| Karl–Jack | 10/11 – 11/10 |
| Tommy–Hugo | 1/5 – 11/2 |
| Keenan–Alan | 9/2 – 2/9 |
| Joe–Shane | 9/4 – 4/9 |
| Burns–Murphy | 4/11 – 11/4 |

The stored Week 7 ballot locks 25 October at 17:00 UTC, which is 17:00 in
Ireland after the clock change. The homepage now calls this out explicitly.
Previous prices, saved votes, Bankers and results are preserved.

## Friday Mackdown script and prose check

The commissioner requested a recording script, not a written site episode.
`output/return-of-the-mac/2026-week-7-hugo-script.txt` is the recorded script,
replacing the unrecorded Tommy version at the commissioner's request.
The old file is explicitly marked superseded. Hugo's script acknowledges the
wrong Keenan call, Thursday's scoring and pending injury designations; its
comic Hugo pick differs from the preserved editorial Tommy pick.
Mackorcle's invented adjustments are labelled character comedy in the production
notes. The commissioner supplied the recording after revising the jokes,
adding bell cues and including Hugo's team name in the introduction.

The original `ElevenLabs_2026-10-23T11_32_50_MAC_gen_sp100_s50_sb75_v4.mp3`
is preserved byte for byte at `public/audio/return-of-the-mac/2026-week-7-hugo.mp3`.
SHA-256: `318d7fb029c965ad7c22e69c7f514354979d1f5b9d35c22c36b4edb782d76f72`.
Measured duration: 196.5975 seconds (display 3:16), 44.1 kHz mono MP3.
FFmpeg decoded the full file successfully. Local Whisper transcription confirms
the team-name introduction, Temple Bar and separate-discussion wording, both
replacement jokes, Thursday scoring, Sunday deadline and final line. It is used
for verification only; automatic spelling errors are not published as captions.
The episode title is **Hugo: a champion by postcode.**; its permanent slug is
`2026-week-7-hugo`. Older episodes and the approved v9 portrait are preserved.

Humanizer 3.1.0 was read and applied as a checker. Flags checked: repeated
section closers, empty contrasts, inflated trade language and unsupported
certainty about player availability. Hand edits kept concrete transaction
details and manager-specific jokes, removed an inaccurate trophy reference,
and retained necessary Friday timing and practice/activation distinctions.

## Verification

Edition tests check exact fixtures and PPR snapshots, publication gates,
homepage selection, talking-point expiry, post-trade pricing rosters, legal
available players, locked Thursday scores and the genuinely unfilled TE/DEF
slots. All 148 unit/integration tests, lint, the production build and five
targeted browser checks passed. The browser checks cover priced picks/Bankers,
the scoring explanation, the match programme, settled reports and the cut line.

Twelve Week 7 prices were published and read back successfully. The receipt is
`2026-week-7-prices.json`; `2026-week-7-friday-audit.json` records the public
ballot audit at 10:56 UTC, including unchanged Week 6 final results and frozen
prices. No private votes, Bankers or credentials were read for editorial use.

## Commissioner revision: tone and source check

The commissioner explicitly requested Tommy–Hugo as Match of the Week and Hugo
as Mackorcle's subject, overriding the earlier feature choice. The original
winner calls, projections, published odds and older weekly selections stay fixed.

Glen reference research: today's [23 October episode description](https://www.reddit.com/r/PardonMyTake/comments/1xd68mx/new_episode_discussion_102326_week_7_picks_and/)
confirms a new tape-watch website segment in the opening 31:05. An accessible
transcript of that episode could not be found. The newest accessible tape-watch
transcript located was [16 October, around 1:29–1:32](https://podcasts.happyscribe.com/pardon-my-take/nfl-week-6-picks-and-preview-mike-florio-talking-nfl-broncos-win-despite-bo-nix-brewers-to-the-world-series-plus-fyre-fest).
The draft uses broad comic devices: overconfident mock expertise, selective
evidence and increasingly absurd excuses. No Glen dialogue or catchphrases were
copied. Mackorcle's existing introduction, bell and sign-off are preserved.

Humanizer 3.1.0 checker flags and manual fixes:

- Removed the old draft's management jargon (efficiency gains, research projects)
  and abstract calculator joke; used Hugo's actual bid and household context.
- Varied setups and paragraph length; cut explanations after punchlines.
- Kept the deliberate mock-statistical language as the character's voice, while
  labelling invented adjustments in production notes.
- Rechecked concrete claims: 1–5 records, five straight Hugo defeats, 22.78-point
  deficit, $19/5.30 Douglas receipt, trade direction, forfeit history and the
  shared home with Alan. No private quotes or events were invented.
- Added the tie exception to the featured report's 1–6 outcome; injuries remain
  dated Thursday practice reports, not final game designations.
