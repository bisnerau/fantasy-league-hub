-- Expose participation only; rankings remain protected by their existing RLS.
create or replace function public.season_forecast_submission_status(
  requested_league text, requested_season smallint
)
returns table(voter_id uuid, roster_id smallint, display_name text, submitted boolean)
language sql stable security definer
set search_path = ''
as $$
  select p.id, p.roster_id, p.display_name,
    exists (
      select 1 from public.season_forecasts f
      where f.voter_id = p.id and f.league_id = requested_league
        and f.season = requested_season
    )
  from public.profiles p
  join public.season_forecast_windows w
    on w.league_id = requested_league and w.season = requested_season
  where auth.uid() is not null
    and exists (select 1 from public.profiles member where member.id = auth.uid())
    and p.roster_id between 1 and w.team_count
  order by p.roster_id;
$$;
revoke all on function public.season_forecast_submission_status(text, smallint) from public, anon;
grant execute on function public.season_forecast_submission_status(text, smallint) to authenticated;
