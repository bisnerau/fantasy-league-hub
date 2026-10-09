-- Fractional-odds scoring for Weekly Picks, from 2026 Week 5.
-- One price per team per matchup, published by the commissioner after the
-- Thursday game and frozen: rows cannot be changed or removed, and nothing
-- can be priced once the week has locked. A correct pick returns its payout
-- (1 + the fraction, so 3/1 returns 4); a correct Banker returns double.
-- Wrong or tied picks return zero. Weeks without published prices keep the
-- original rules: 1 point per winner, 2 for a correct Banker.

create table public.prediction_prices (
  matchup_id bigint not null references public.prediction_matchups(id) on delete cascade,
  roster_id smallint not null,
  numerator smallint not null check (numerator > 0),
  denominator smallint not null check (denominator > 0),
  payout numeric(6, 2) generated always as (
    round(1 + numerator::numeric / denominator, 2)
  ) stored,
  published_at timestamptz not null default now(),
  primary key (matchup_id, roster_id)
);

alter table public.prediction_prices enable row level security;

create policy "Prediction prices are public"
on public.prediction_prices for select
to anon, authenticated
using (true);

grant select on public.prediction_prices to anon, authenticated;

create function public.validate_prediction_price()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  matchup record;
begin
  if tg_op <> 'INSERT' then
    raise exception 'Published prices are frozen';
  end if;
  select m.home_roster_id, m.away_roster_id, w.locks_at
  into matchup
  from public.prediction_matchups m
  join public.prediction_weeks w on w.id = m.prediction_week_id
  where m.id = new.matchup_id;
  if not found then
    raise exception 'Unknown matchup';
  end if;
  if new.roster_id not in (matchup.home_roster_id, matchup.away_roster_id) then
    raise exception 'Price must belong to a team in this matchup';
  end if;
  if clock_timestamp() >= matchup.locks_at then
    raise exception 'Prices cannot be published after picks lock';
  end if;
  return new;
end;
$$;

create trigger validate_prediction_price
before insert or update or delete on public.prediction_prices
for each row execute function public.validate_prediction_price();

-- Points change from whole numbers to two-decimal returns, so the views are
-- recreated rather than replaced.
drop view public.prediction_weekly_leaderboard;
drop view public.prediction_season_leaderboard;

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
  ) as accuracy,
  round(
    coalesce(
      sum(
        coalesce(price.payout, 1)
          * case when banker.matchup_id is not null then 2 else 1 end
      ) filter (where vote.selected_roster_id = matchup.winner_roster_id),
      0
    ),
    2
  ) as points,
  count(matchup.id) filter (where banker.matchup_id is not null
    and matchup.winner_roster_id is not null)::integer as completed_bankers,
  count(matchup.id) filter (where banker.matchup_id is not null
    and vote.selected_roster_id = matchup.winner_roster_id)::integer as correct_bankers
from public.prediction_weeks prediction_week
cross join public.profiles profile
left join public.prediction_matchups matchup
  on matchup.prediction_week_id = prediction_week.id
left join public.prediction_votes vote
  on vote.matchup_id = matchup.id
  and vote.voter_id = profile.id
left join public.prediction_bankers banker
  on banker.matchup_id = matchup.id and banker.voter_id = profile.id
left join public.prediction_prices price
  on price.matchup_id = matchup.id
  and price.roster_id = vote.selected_roster_id
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
  ) as accuracy,
  round(
    coalesce(
      sum(
        coalesce(price.payout, 1)
          * case when banker.matchup_id is not null then 2 else 1 end
      ) filter (where vote.selected_roster_id = matchup.winner_roster_id),
      0
    ),
    2
  ) as points,
  count(matchup.id) filter (where banker.matchup_id is not null
    and matchup.winner_roster_id is not null)::integer as completed_bankers,
  count(matchup.id) filter (where banker.matchup_id is not null
    and vote.selected_roster_id = matchup.winner_roster_id)::integer as correct_bankers
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
left join public.prediction_bankers banker
  on banker.matchup_id = matchup.id and banker.voter_id = profile.id
left join public.prediction_prices price
  on price.matchup_id = matchup.id
  and price.roster_id = vote.selected_roster_id
group by
  prediction_season.league_id,
  prediction_season.season,
  profile.id,
  profile.display_name;

grant select on public.prediction_weekly_leaderboard to authenticated;
grant select on public.prediction_season_leaderboard to authenticated;
