-- Commissioner-authorized one-time Week 12 refresh, 27 November 2026.
-- Original prices: 2026-week-12-prices-before-refresh.json.
-- Fresh model: lib/data/experiments/odds-week-twelve.json.
-- All saved selections use the refreshed weekly prices; no votes are changed.
-- Run this whole transaction. Any failed assertion rolls back the refresh.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';
lock table public.prediction_weeks, public.prediction_matchups,
  public.prediction_votes, public.prediction_bankers in share mode;
-- No other transaction can access prices while their trigger is suspended.
lock table public.prediction_prices in access exclusive mode;
create temporary table week12_price_refresh (
  matchup_id bigint, roster_id smallint,
  old_numerator smallint, old_denominator smallint,
  numerator smallint, denominator smallint,
  primary key (matchup_id, roster_id)
) on commit drop;
-- Session-local staging remains restricted even if inspected during the query.
alter table week12_price_refresh enable row level security;
insert into week12_price_refresh values
  (985, 11, 3, 1, 9, 1),
  (985, 12, 1, 3, 1, 10),
  (986, 1, 10, 11, 4, 11),
  (986, 7, 11, 10, 11, 4),
  (987, 6, 11, 10, 8, 15),
  (987, 10, 10, 11, 15, 8),
  (988, 3, 8, 13, 1, 8),
  (988, 4, 13, 8, 8, 1),
  (989, 8, 11, 8, 2, 7),
  (989, 9, 8, 11, 10, 3),
  (990, 2, 10, 3, 11, 4),
  (990, 5, 2, 7, 4, 11);

do $$
declare
  votes_before jsonb;
  bankers_before jsonb;
  other_prices_before jsonb;
  changed integer;
  freeze_rejected boolean := false;
begin
  if not exists (
    select 1 from public.prediction_weeks
    where id = 195 and league_id = '1389706813993160704'
      and season = 2026 and week = 12
      and locks_at = '2026-11-29T18:00:00Z'::timestamptz
      and clock_timestamp() < locks_at
  ) then raise exception 'Expected unlocked MAC 12 Week 12 not found'; end if;
  if (select count(*) from public.prediction_matchups
      where prediction_week_id = 195) <> 6
    or exists (select 1 from public.prediction_matchups
      where prediction_week_id = 195 and
        (status <> 'scheduled' or winner_roster_id is not null
         or home_final is not null or away_final is not null))
  then raise exception 'Week 12 fixtures have changed or settled'; end if;
  if (select count(*) from public.prediction_prices p
      join public.prediction_matchups m on m.id = p.matchup_id
      where m.prediction_week_id = 195) <> 12
    or (select count(*) from week12_price_refresh r
      join public.prediction_matchups m on m.id = r.matchup_id
      join public.prediction_prices p using (matchup_id, roster_id)
      where m.prediction_week_id = 195
        and r.roster_id in (m.home_roster_id, m.away_roster_id)
        and p.numerator = r.old_numerator
        and p.denominator = r.old_denominator
        and p.published_at = '2026-11-26T10:45:47.327013Z'::timestamptz) <> 12
  then raise exception 'Original prices no longer match the approved receipt'; end if;
  if not exists (select 1 from pg_trigger
    where tgrelid = 'public.prediction_prices'::regclass
      and tgname = 'validate_prediction_price' and tgenabled = 'O')
  then raise exception 'Expected price freeze trigger is not enabled'; end if;

  select coalesce(jsonb_agg(to_jsonb(v) order by v.matchup_id, v.voter_id), '[]')
    into votes_before from public.prediction_votes v
    join public.prediction_matchups m on m.id = v.matchup_id
    where m.prediction_week_id = 195;
  select coalesce(jsonb_agg(to_jsonb(b) order by b.voter_id), '[]')
    into bankers_before from public.prediction_bankers b
    where b.prediction_week_id = 195;
  select coalesce(jsonb_agg(to_jsonb(p) order by p.matchup_id, p.roster_id), '[]')
    into other_prices_before from public.prediction_prices p
    where not exists (select 1 from week12_price_refresh r
      where r.matchup_id = p.matchup_id and r.roster_id = p.roster_id);

  alter table public.prediction_prices disable trigger validate_prediction_price;
  update public.prediction_prices p
    set numerator = r.numerator, denominator = r.denominator,
        published_at = transaction_timestamp()
    from week12_price_refresh r
    where p.matchup_id = r.matchup_id and p.roster_id = r.roster_id;
  get diagnostics changed = row_count;
  alter table public.prediction_prices enable trigger validate_prediction_price;
  if changed <> 12 then raise exception 'Expected twelve refreshed prices'; end if;
  if exists (select 1 from week12_price_refresh r
      join public.prediction_prices p using (matchup_id, roster_id)
      where p.numerator <> r.numerator or p.denominator <> r.denominator
        or p.payout <> round(1 + r.numerator::numeric / r.denominator, 2))
  then raise exception 'Refreshed fractions or payouts did not match'; end if;

  if votes_before is distinct from (select coalesce(
      jsonb_agg(to_jsonb(v) order by v.matchup_id, v.voter_id), '[]')
    from public.prediction_votes v join public.prediction_matchups m
      on m.id = v.matchup_id where m.prediction_week_id = 195)
    or bankers_before is distinct from (select coalesce(
      jsonb_agg(to_jsonb(b) order by b.voter_id), '[]')
      from public.prediction_bankers b where b.prediction_week_id = 195)
    or other_prices_before is distinct from (select coalesce(
      jsonb_agg(to_jsonb(p) order by p.matchup_id, p.roster_id), '[]')
      from public.prediction_prices p where not exists (
        select 1 from week12_price_refresh r
        where r.matchup_id = p.matchup_id and r.roster_id = p.roster_id))
  then raise exception 'Selections, Bankers or other weeks changed'; end if;

  -- Prove the original freeze protection works again before committing.
  begin
    update public.prediction_prices set numerator = numerator
      where matchup_id = 985 and roster_id = 11;
  exception when raise_exception then
    if sqlerrm = 'Published prices are frozen' then
      freeze_rejected := true;
    else raise; end if;
  end;
  if not freeze_rejected then raise exception 'Price freeze was not restored'; end if;
end;
$$;
select p.* from public.prediction_prices p
  join week12_price_refresh r using (matchup_id, roster_id)
  order by matchup_id, roster_id;
commit;
