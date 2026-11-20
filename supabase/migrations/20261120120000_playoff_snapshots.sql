-- One immutable, atomic daily publication. Public traffic can only read.
create table public.playoff_snapshots (
  id uuid primary key default gen_random_uuid(),
  league_id text not null,
  season integer not null,
  forecast_date date not null,
  model_version text not null,
  input jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  unique (league_id, season, forecast_date)
);
alter table public.playoff_snapshots enable row level security;
create policy "Public forecast reads" on public.playoff_snapshots for select to anon, authenticated using (true);
revoke all on public.playoff_snapshots from anon, authenticated;
grant select on public.playoff_snapshots to anon, authenticated;
grant select, insert on public.playoff_snapshots to service_role;
