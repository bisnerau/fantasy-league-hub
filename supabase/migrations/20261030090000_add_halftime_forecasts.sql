-- The second-half ballot: a predicted final regular-season table plus the
-- championship and loser-bowl brackets seeded from it. Separate from
-- season_forecasts so the frozen preseason ballots are never touched.
create table public.halftime_forecast_windows (
  league_id text not null,
  season smallint not null,
  locks_at timestamptz not null,
  team_count smallint not null check (team_count = 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (league_id, season)
);

create table public.halftime_forecasts (
  league_id text not null,
  season smallint not null,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  rankings jsonb not null,
  championship jsonb not null,
  loser_bowl jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (league_id, season, voter_id),
  foreign key (league_id, season)
    references public.halftime_forecast_windows(league_id, season)
    on delete cascade
);

create index halftime_forecasts_voter_idx
  on public.halftime_forecasts (voter_id);

create trigger halftime_forecast_windows_set_updated_at
before update on public.halftime_forecast_windows
for each row execute function public.set_updated_at();

-- Mirrors bracketGames() in lib/season/halftime-ballot.ts. Picks are the team
-- that goes through in game order: championship winners advance; in the
-- loser bowl losers advance and the final pick is last one standing.
create or replace function public.halftime_bracket_valid(
  rankings jsonb, picks jsonb, kind text
)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  s integer[];
  p integer[];
  a1 integer; b1 integer; a2 integer; b2 integer;
  bye1 integer; bye2 integer;
begin
  if jsonb_typeof(picks) is distinct from 'array'
    or jsonb_array_length(picks) <> 5
    or exists (
      select 1 from jsonb_array_elements(picks) as pick(value)
      where jsonb_typeof(pick.value) <> 'number'
        or pick.value::text !~ '^[0-9]+$'
    ) then
    return false;
  end if;

  s := array(
    select t.value::text::integer
    from jsonb_array_elements(rankings) with ordinality as t(value, n)
    order by t.n
  );
  p := array(
    select t.value::text::integer
    from jsonb_array_elements(picks) with ordinality as t(value, n)
    order by t.n
  );

  if kind = 'championship' then
    a1 := s[4]; b1 := s[5]; a2 := s[3]; b2 := s[6]; bye1 := s[1]; bye2 := s[2];
  elsif kind = 'loser_bowl' then
    a1 := s[8]; b1 := s[9]; a2 := s[7]; b2 := s[10]; bye1 := s[12]; bye2 := s[11];
  else
    return false;
  end if;

  return p[1] in (a1, b1)
    and p[2] in (a2, b2)
    and p[3] in (bye1, p[1])
    and p[4] in (bye2, p[2])
    and p[5] in (p[3], p[4]);
end;
$$;

create or replace function public.validate_halftime_forecast()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  forecast_window public.halftime_forecast_windows;
  ranking_count integer;
  distinct_ranking_count integer;
  lowest_roster_id integer;
  highest_roster_id integer;
begin
  select * into forecast_window
  from public.halftime_forecast_windows
  where league_id = new.league_id
    and season = new.season;

  if not found then
    raise exception 'Second-half ballot window does not exist';
  end if;

  if now() >= forecast_window.locks_at then
    raise exception 'Second-half ballots are locked';
  end if;

  if jsonb_typeof(new.rankings) <> 'array'
    or jsonb_array_length(new.rankings) <> forecast_window.team_count then
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

  if not public.halftime_bracket_valid(new.rankings, new.championship, 'championship') then
    raise exception 'Every championship pick must come from its game';
  end if;

  if not public.halftime_bracket_valid(new.rankings, new.loser_bowl, 'loser_bowl') then
    raise exception 'Every loser bowl pick must come from its game';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

create trigger halftime_forecasts_validate
before insert or update on public.halftime_forecasts
for each row execute function public.validate_halftime_forecast();

alter table public.halftime_forecast_windows enable row level security;
alter table public.halftime_forecasts enable row level security;

create policy "Halftime ballot windows are public"
on public.halftime_forecast_windows for select
to anon, authenticated
using (true);

create policy "Members see their own halftime ballot before lock and all after lock"
on public.halftime_forecasts for select
to authenticated
using (
  voter_id = auth.uid()
  or exists (
    select 1
    from public.halftime_forecast_windows forecast_window
    where forecast_window.league_id = halftime_forecasts.league_id
      and forecast_window.season = halftime_forecasts.season
      and now() >= forecast_window.locks_at
  )
);

create policy "Members can submit their own halftime ballot before lock"
on public.halftime_forecasts for insert
to authenticated
with check (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.halftime_forecast_windows forecast_window
    where forecast_window.league_id = halftime_forecasts.league_id
      and forecast_window.season = halftime_forecasts.season
      and now() < forecast_window.locks_at
  )
);

create policy "Members can change their own halftime ballot before lock"
on public.halftime_forecasts for update
to authenticated
using (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.halftime_forecast_windows forecast_window
    where forecast_window.league_id = halftime_forecasts.league_id
      and forecast_window.season = halftime_forecasts.season
      and now() < forecast_window.locks_at
  )
)
with check (
  voter_id = auth.uid()
  and exists (
    select 1
    from public.halftime_forecast_windows forecast_window
    where forecast_window.league_id = halftime_forecasts.league_id
      and forecast_window.season = halftime_forecasts.season
      and now() < forecast_window.locks_at
  )
);

grant select on public.halftime_forecast_windows to anon, authenticated;
grant select, insert, update on public.halftime_forecasts to authenticated;

-- Participation only; ballots stay behind the RLS above until the lock.
create or replace function public.halftime_forecast_submission_status(
  requested_league text, requested_season smallint
)
returns table(voter_id uuid, roster_id smallint, display_name text, submitted boolean)
language sql stable security definer
set search_path = ''
as $$
  select p.id, p.roster_id, p.display_name,
    exists (
      select 1 from public.halftime_forecasts f
      where f.voter_id = p.id and f.league_id = requested_league
        and f.season = requested_season
    )
  from public.profiles p
  join public.halftime_forecast_windows w
    on w.league_id = requested_league and w.season = requested_season
  where auth.uid() is not null
    and exists (select 1 from public.profiles member where member.id = auth.uid())
    and p.roster_id between 1 and w.team_count
  order by p.roster_id;
$$;
revoke all on function public.halftime_forecast_submission_status(text, smallint) from public, anon;
grant execute on function public.halftime_forecast_submission_status(text, smallint) to authenticated;

-- Week 8 Sunday kickoff: 1pm Eastern (US clocks change that day), 6pm Irish.
insert into public.halftime_forecast_windows
  (league_id, season, locks_at, team_count)
values
  ('1389706813993160704', 2026, '2026-11-01 18:00:00+00', 12)
on conflict (league_id, season) do nothing;
