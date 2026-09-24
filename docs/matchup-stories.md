# MAC 12 matchup reports

## Agreed workflow

The commissioner prompts Codex for **reviews on Tuesdays** and **previews on
Thursdays**. These are individually researched and written matchup reports.
There is no scheduled AI author and no automatic template publication. The daily
cron still prepares ballots and settles results after Tuesday 11am Irish time.

Every matchup in Weekly Picks has a Programme button that opens a bottom sheet:
Report (Preview and Review tabs, a short summary and an expandable full story),
History (the rivalry strip), Lineups, and “Why this one” for the Match of the
Week. The card itself shows only the first two lines of the Match of the Week
reason. A missing edition says it has not been published.
Final games default to Review. Published previews remain available afterwards.

## Flag on the play

Optionally, Tuesday's reviews can throw one referee's flag at the week's
biggest blunder. Add a single entry to `lib/data/flags-on-the-play.ts` for the
settled week: the manager, a referee's call (“Delay of game”), one or two
sentences built on a verified Sleeper stat, and a comic penalty. It appears on
the homepage only after that week settles and its `publishedAt` has passed. Keep
it friendly slagging, not a pile-on; skip the flag when nothing earns it.

## Match of the Week

Choose one fixture editorially alongside Thursday's previews, before the first
NFL kickoff. Store the exact fixture and selection time in
`lib/data/match-of-the-week.ts`. The commissioner approved Alan Horgan vs Hugo
Walsh (Week 2, fixture 4) as the inaugural selection.

- Consider the story (rivalry, revenge, rematch), stakes (records, playoffs,
  losing streaks, forfeit battle) and contest (quality and closeness).
- Early in the season, give rivalries and personalities more weight. Later,
  favour playoff and forfeit implications. Rotate attention when choices are
  otherwise close; do not impose a quota or simply pick the highest projection.
- Explain the choice briefly under “Why this one?” and add a little more
  build-up and manager-specific slagging than the other fixtures receive.
- The selected fixture gets a badge and first position in Weekly Picks. Keep
  the original fixture and database IDs so votes remain tied to the same teams.
- Selection is fixed once published and remains visible in archived weeks.
  Do not use member votes, later results or automated ranking to change it.
- Tuesday's authored review gets a fuller verdict that revisits the original
  winner call, including mistakes. The review tab repeats the saved pregame
  call once a settled review is published. Do not write a verdict before results
  settle or promise automatically generated prose.

Weeks without a published selection keep their normal order and have no badge.

## Writing brief

- Informed league writing with friendly slagging: story first, numbers in
  support. The commissioner wants funnier, more pointed manager-specific jokes
  throughout the headlines, summaries and verdicts, grounded in league history. The commissioner rejected the initial stats-heavy reports.
- Give each game its own headline, a short enticing summary and roughly three
  short sections. Aim for about 180–250 words overall, without padding.
- Use a few telling stats, not a catalogue of every starter and their score.
  The matchup card already displays the result. Explain why a number matters.
- Use established manager personalities, genuine league history and fair jokes.
  Read `lib/data/managers.ts`. Hugo Walsh and Alan Horgan live together; their
  Week 2 matchup is the household derby. Never invent quotes or private events.
- Do not claim a scoring sequence, injury explanation, player usage or NFL news
  without verifying it. A zero is not proof that somebody forgot their lineup.
- Previews make an editorial winner call. It can favour the underdog when the
  reasoning supports it; it need not follow the largest projection.
- Reviews own the original call, including mistakes. For Week 1, there was no
  pregame edition. Do not invent or repeatedly apologise for a missing call.
- Member voting details stay in the authenticated receipt section, never copied
  into public report prose. It is fine to describe public awards.

## Research and publish an edition

1. Read current Sleeper fixtures, recorded lineups and projections for previews;
   use settled stored scores plus historical player points for reviews. Verify
   every number and matchup identity. Inspect previous editions, manager
   history, last week's form and relevant waiver moves. Research any additional
   NFL claims from current primary sources.
2. Write the edition in `lib/data/newsletters/<season>-week-<week>.ts`, with one
   `MatchupNewsletter` record per game. Match league ID, season, week, Sleeper
   matchup ID and both roster IDs exactly. Add it to the index in
   `lib/data/matchup-newsletters.ts`.
3. Use “matchup report”, “preview”, “match report” or “round-up” in visible
   copy; the commissioner retired the word “newsletter”. Keep existing internal
   module names stable. Link current primary NFL sources for news claims.
   Set `editorial: true` on stories. Each review has `version`, `publishedAt`,
   `headline`, `summary` and `sections`. Each preview additionally preserves
   `pickRosterId`, `homeProjection` and `awayProjection` from its original
   source snapshot. PPR estimates may differ from custom-league projections.
4. Publish previews before the first NFL game of the week. Check the actual
   schedule, including unusual Wednesday games, rather than relying on the
   Sunday pick deadline. If the request arrives too late, say so; never backdate
   a prediction. Keep published previews unchanged when adding the review.
5. Reviews must wait for finalized prediction results. The page enforces this
   even if a review file exists. Future-dated editions remain hidden.
6. Run the relevant tests, lint and production build. Deploy through the existing
   Vercel Git workflow, then verify all six live stories and the active week.

The authoring helpers in `lib/predictions/stories.ts` can assemble a factual
outline (including position-compatible bench alternatives), but they are not
connected to automatic publication. A hindsight bench alternative does not
establish that a change was available before the players locked.

## Storage and privacy

Authored editions are saved in source control. The existing nullable
`prediction_matchups.preview_story` column is retained for older archived
previews; the cron neither generates nor overwrites it. Public page requests
are read-only. Authored previews take precedence over a legacy stored template;
new editions must preserve any genuine prior published winner call.

Scores, awards and pick grading remain automatic. Match report prose requires the
commissioner's prompt. There is no external model API key or recurring model
charge configured.

## Initial edition and checks

`lib/data/newsletters/2026-week-1.ts` contains six individually written reviews,
checked against the settled Week 1 results on 15 September 2026. There are no
Week 1 previews. `lib/data/newsletters/2026-week-2.ts` contains six Week 2
previews, researched on Thursday 17 September before the opening NFL game.
The research receipt is in `docs/research/2026-week-2.md`.

Tests cover exact edition-to-fixture matching, hidden future editions, authored
underdog calls, read-only pages, settlement gating and a Thursday cron that
cannot generate or overwrite editorial text. The existing score, vote, timezone
and factual analysis tests remain in place.

## Week 2 settlement and reviews

All six Week 2 reviews were published on 22 September after the stored results
settled. `docs/research/2026-week-2-results.json` preserves the public final rows
and the matching Sleeper totals and recorded starter points. The six Thursday
previews and their winner calls remain unchanged: Sharpe, Marmion, Horgan and
Moroney were correct; Ennis and Murray were not. Week 3 ballots were already
prepared by the cron. Week 3 previews and rankings retain their Thursday workflow.
