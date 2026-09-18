-- One nomination references an existing saved pick; changing that pick changes its Banker.
alter table public.prediction_matchups
  add constraint prediction_matchups_id_week_unique unique (id, prediction_week_id);

create table public.prediction_bankers (
  prediction_week_id bigint not null references public.prediction_weeks(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  matchup_id bigint not null,
  updated_at timestamptz not null default now(),
  primary key (prediction_week_id, voter_id),
  foreign key (matchup_id, prediction_week_id)
    references public.prediction_matchups(id, prediction_week_id) on delete cascade,
  foreign key (matchup_id, voter_id)
    references public.prediction_votes(matchup_id, voter_id) on delete cascade
);

create function public.validate_prediction_banker()
returns trigger language plpgsql set search_path = '' as $$
declare
  deadline timestamptz;
begin
  if tg_op = 'UPDATE' and (old.prediction_week_id <> new.prediction_week_id or old.voter_id <> new.voter_id) then
    raise exception 'A Banker cannot move between weeks or members';
  end if;
  select locks_at into deadline from public.prediction_weeks where id = new.prediction_week_id;
  if deadline is null or clock_timestamp() >= deadline then
    raise exception 'Predictions are locked for this week';
  end if;
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

create trigger prediction_bankers_validate before insert or update on public.prediction_bankers
for each row execute function public.validate_prediction_banker();

alter table public.prediction_bankers enable row level security;
create policy "Bankers stay private until the weekly deadline"
on public.prediction_bankers for select to authenticated
using (voter_id = auth.uid() or exists (
  select 1 from public.prediction_weeks w where w.id = prediction_week_id and now() >= w.locks_at
));
create policy "Members nominate their own Banker before lock"
on public.prediction_bankers for insert to authenticated
with check (voter_id = auth.uid() and exists (
  select 1 from public.prediction_weeks w where w.id = prediction_week_id and now() < w.locks_at
));
create policy "Members replace their own Banker before lock"
on public.prediction_bankers for update to authenticated
using (voter_id = auth.uid() and exists (
  select 1 from public.prediction_weeks w where w.id = prediction_week_id and now() < w.locks_at
))
with check (voter_id = auth.uid() and exists (
  select 1 from public.prediction_weeks w where w.id = prediction_week_id and now() < w.locks_at
));
-- No delete grant: a nomination can be replaced before lock, never erased after it.
grant select, insert, update on public.prediction_bankers to authenticated;

create function public.set_prediction_banker(target_matchup_id bigint)
returns setof public.prediction_bankers
language plpgsql security invoker set search_path = '' as $$
declare
  week_id bigint;
begin
  if auth.uid() is null then raise exception 'Sign in to choose a Banker'; end if;
  select prediction_week_id into week_id from public.prediction_matchups where id = target_matchup_id;
  if week_id is null then raise exception 'Prediction matchup does not exist'; end if;
  return query insert into public.prediction_bankers(prediction_week_id, voter_id, matchup_id)
    values (week_id, auth.uid(), target_matchup_id)
    on conflict (prediction_week_id, voter_id) do update set matchup_id = excluded.matchup_id
    returning *;
end;
$$;
revoke all on function public.set_prediction_banker(bigint) from public, anon;
grant execute on function public.set_prediction_banker(bigint) to authenticated;

create or replace view public.prediction_weekly_leaderboard
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
  (count(matchup.id) filter (where vote.selected_roster_id = matchup.winner_roster_id)
    + count(matchup.id) filter (where banker.matchup_id is not null
      and vote.selected_roster_id = matchup.winner_roster_id))::integer as points,
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
group by
  prediction_week.league_id,
  prediction_week.season,
  prediction_week.week,
  profile.id,
  profile.display_name;

create or replace view public.prediction_season_leaderboard
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
  (count(matchup.id) filter (where vote.selected_roster_id = matchup.winner_roster_id)
    + count(matchup.id) filter (where banker.matchup_id is not null
      and vote.selected_roster_id = matchup.winner_roster_id))::integer as points,
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
group by
  prediction_season.league_id,
  prediction_season.season,
  profile.id,
  profile.display_name;

grant select on public.prediction_weekly_leaderboard to authenticated;
grant select on public.prediction_season_leaderboard to authenticated;
