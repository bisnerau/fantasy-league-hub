-- One-time draft-night setup. Public page visits only read this window.
insert into public.season_forecast_windows
  (league_id, season, locks_at, team_count)
values
  ('1389706813993160704', 2026, '2026-09-13 17:00:00+00', 12)
on conflict (league_id, season) do nothing;
