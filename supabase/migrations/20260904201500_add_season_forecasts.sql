create table public.season_forecast_windows (
  league_id text not null,
  season smallint not null,
  locks_at timestamptz not null,
  team_count smallint not null check (team_count between 2 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (league_id, season)
);

create table public.season_forecasts (
  league_id text not null,
  season smallint not null,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  rankings jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (league_id, season, voter_id),
  foreign key (league_id, season)
    references public.season_forecast_windows(league_id, season)
    on delete cascade
);

create index season_forecasts_voter_idx
  on public.season_forecasts (voter_id);

create trigger season_forecast_windows_set_updated_at
before update on public.season_forecast_windows
for each row execute function public.set_updated_at();

create or replace function public.validate_season_forecast()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  forecast_window public.season_forecast_windows;
  ranking_count integer;
  distinct_ranking_count integer;
  lowest_roster_id integer;
  highest_roster_id integer;
begin
  select * into forecast_window
  from public.season_forecast_windows
  where league_id = new.league_id
    and season = new.season;

  if not found then
    raise exception 'Season forecast window does not exist';
  end if;

  if now() >= forecast_window.locks_at then
    raise exception 'Season forecasts are locked';
  end if;

  if jsonb_typeof(new.rankings) <> 'array' then
    raise exception 'A complete ranking of every team is required';
  end if;

  if jsonb_array_length(new.rankings) <> forecast_window.team_count then
    raise exception 'A complete ranking of every team is required';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(new.rankings) as ranking(value)
    where jsonb_typeof(ranking.value) <> 'number'
      or ranking.value::text !~ '^[0-9]+$'
  ) then
    raise exception 'Every forecast entry must be a roster number';
  end if;

  select
    count(*),
    count(distinct ranking.value::text::integer),
    min(ranking.value::text::integer),
    max(ranking.value::text::integer)
  into
    ranking_count,
    distinct_ranking_count,
    lowest_roster_id,
    highest_roster_id
  from jsonb_array_elements(new.rankings) as ranking(value);

  if ranking_count <> forecast_window.team_count
    or distinct_ranking_count <> forecast_window.team_count
    or lowest_roster_id <> 1
    or highest_roster_id <> forecast_window.team_count then
    raise exception 'Each roster must appear exactly once';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

create trigger season_forecasts_validate
before insert or update on public.season_forecasts
for each row execute function public.validate_season_forecast();

alter table public.season_forecast_windows enable row level security;
alter table public.season_forecasts enable row level security;

create policy "Season forecast windows are public"
on public.season_forecast_windows for select
to anon, authenticated
using (true);

create policy "Members see their own forecast before lock and all forecasts after lock"
on public.season_forecasts for select
to authenticated
using (
  voter_id = auth.uid()
  or exists (
    select 1
    from public.season_forecast_windows forecast_window
    where forecast_window.league_id = season_forecasts.league_id
      and forecast_window.season = season_forecasts.season
      and now() >= forecast_window.locks_at
  )
);

create policy "Members can submit their own forecast before lock"
on public.season_forecasts for insert
to authenticated
with check (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.season_forecast_windows forecast_window
    where forecast_window.league_id = season_forecasts.league_id
      and forecast_window.season = season_forecasts.season
      and now() < forecast_window.locks_at
  )
);

create policy "Members can change their own forecast before lock"
on public.season_forecasts for update
to authenticated
using (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.season_forecast_windows forecast_window
    where forecast_window.league_id = season_forecasts.league_id
      and forecast_window.season = season_forecasts.season
      and now() < forecast_window.locks_at
  )
)
with check (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.season_forecast_windows forecast_window
    where forecast_window.league_id = season_forecasts.league_id
      and forecast_window.season = season_forecasts.season
      and now() < forecast_window.locks_at
  )
);

grant select on public.season_forecast_windows to anon, authenticated;
grant select, insert, update on public.season_forecasts to authenticated;
