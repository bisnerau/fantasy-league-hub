# Weekly clubhouse and power rankings

The commissioner approved a weekly homepage and weekly editorial power rankings.
During the season the homepage leads with the current Match of the Week, three
authored talking points, links to published previews and settled reviews, and a
top-three ranking summary. Weekly picks, the member prediction race, shortcuts
and historical content remain accessible. The draft report remains the preseason
lead and becomes an archive link during the season.

## Power rankings

`/power-rankings` shows the latest published edition for the configured league.
Season/week links select an exact edition; an unpublished week has a waiting
state, not a substituted list. Data lives in `lib/data/power-rankings/`, indexed
by `lib/data/power-rankings.ts`. Editions include all twelve roster IDs, frozen
head-to-head records and recent scoring, one pointed verdict per manager, source
links, three talking points and an actual publication timestamp.

Write alongside Thursday's previews when prompted. Assess current strength with
up to three completed weeks of scoring, results, roster quality, depth and
availability. Week 2 has only one completed week, so do not invent a longer trend.
The order is an editorial judgment, not a calculated probability or league table.
Keep each published edition unchanged when adding subsequent weeks. No cron
generates prose or modifies rankings.

The first edition explicitly compares movement with the frozen preseason
finishing forecast from 6 September. It is **not** a fabricated Week 1 power
ranking. Later editions compare against the preceding published weekly edition
in the same league and season. With no comparison, display “New”. Arrows have
text alternatives and do not depend solely on colour.

## Week 2 evidence

The compact `docs/research/2026-week-2-power-rankings.json` records the fresh
17 September Sleeper check of Week 1 scores, records and Week 2 starters/PPR
estimates. Results agree with the settled Week 1 reports. Starters changed since
the original preview snapshot: Burns selected Caleb Douglas and Marmion selected
Chuba Hubbard. The original previews and winner calls stay frozen.

Niall leads on 169 points and his running-back core. Shane's opening win and
receiver quality put him second. Karl stays third despite losing to the top
scorer, supported by his roster and the largest Week 2 lineup estimate. Burns'
strong opener is balanced against availability concerns. Alan and Joe retain
respect for competitive losing scores and their core players. Hugo climbs four
places from the preseason forecast, with McConkey/Bowers practice concerns
limiting the leap. Jack stays eighth; Keenan rises on a win and his Jeanty/Watson
contributions. Sharpe's low winning score, Tommy's poor opener and Murphy's 57
complete the order. These are editorial reasons, not formula weights.

Sources: [Week 1 results](https://api.sleeper.app/v1/league/1389706813993160704/matchups/1),
[Week 2 lineups](https://api.sleeper.app/v1/league/1389706813993160704/matchups/2),
[rosters](https://api.sleeper.app/v1/league/1389706813993160704/rosters),
[PPR projections](https://api.sleeper.app/projections/nfl/2026/2?season_type=regular&position[]=QB&position[]=RB&position[]=WR&position[]=TE&position[]=K&position[]=DEF),
and the [Chargers–Raiders practice report](https://www.chargers.com/news/raiders-injury-report-ladd-mcconkey-fantasy).
Broader availability context is retained in the existing Week 2 preview research.

## Homepage behaviour

The current featured preview leads before settlement; a published featured review
takes over after settlement. If no current story is published, the most recent
verified settled report can lead, explicitly labelled with its actual week.
Review files alone never establish settlement. Future editions and other leagues
are excluded. Old talking points disappear when the active week advances; the
latest ranking remains linked under its actual edition week until a new one is
written. The homepage never invents a fresh edition during a publishing gap.

Tests cover source records, the real preseason baseline, future/foreign editions,
subsequent weekly movement, report settlement and correct archived-week links.
