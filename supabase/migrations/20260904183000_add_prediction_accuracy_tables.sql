create view public.prediction_weekly_leaderboard
with (security_invoker = true)
as
select
  prediction_week.league_id,
  prediction_week.season,
  prediction_week.week,
  profile.id as voter_id,
  profile.display_name,
  count(matchup.id) filter (
    where matchup.winner_roster_id is not null
  )::integer as completed_picks,
  count(matchup.id) filter (
    where vote.selected_roster_id = matchup.winner_roster_id
  )::integer as correct_picks,
  coalesce(
    round(
      100.0 * count(matchup.id) filter (
        where vote.selected_roster_id = matchup.winner_roster_id
      ) / nullif(
        count(matchup.id) filter (
          where matchup.winner_roster_id is not null
        ),
        0
      ),
      1
    ),
    0
  ) as accuracy
from public.prediction_weeks prediction_week
cross join public.profiles profile
left join public.prediction_matchups matchup
  on matchup.prediction_week_id = prediction_week.id
left join public.prediction_votes vote
  on vote.matchup_id = matchup.id
  and vote.voter_id = profile.id
group by
  prediction_week.league_id,
  prediction_week.season,
  prediction_week.week,
  profile.id,
  profile.display_name;

create view public.prediction_season_leaderboard
with (security_invoker = true)
as
select
  prediction_season.league_id,
  prediction_season.season,
  profile.id as voter_id,
  profile.display_name,
  count(matchup.id) filter (
    where matchup.winner_roster_id is not null
  )::integer as completed_picks,
  count(matchup.id) filter (
    where vote.selected_roster_id = matchup.winner_roster_id
  )::integer as correct_picks,
  coalesce(
    round(
      100.0 * count(matchup.id) filter (
        where vote.selected_roster_id = matchup.winner_roster_id
      ) / nullif(
        count(matchup.id) filter (
          where matchup.winner_roster_id is not null
        ),
        0
      ),
      1
    ),
    0
  ) as accuracy
from (
  select distinct league_id, season
  from public.prediction_weeks
) prediction_season
cross join public.profiles profile
left join public.prediction_weeks prediction_week
  on prediction_week.league_id = prediction_season.league_id
  and prediction_week.season = prediction_season.season
left join public.prediction_matchups matchup
  on matchup.prediction_week_id = prediction_week.id
left join public.prediction_votes vote
  on vote.matchup_id = matchup.id
  and vote.voter_id = profile.id
group by
  prediction_season.league_id,
  prediction_season.season,
  profile.id,
  profile.display_name;

grant select on public.prediction_weekly_leaderboard to authenticated;
grant select on public.prediction_season_leaderboard to authenticated;
