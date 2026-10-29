-- Run only in an isolated database after the halftime ballot migration.
-- With rankings 1..12 in order, seed n is roster n.
begin;
create function pg_temp.check_that(ok boolean, label text) returns void language plpgsql as $$
begin
  if ok is distinct from true then raise exception 'FAILED: %', label; end if;
  raise notice 'PASS: %', label;
end;
$$;
create function pg_temp.must_reject(query text, label text) returns void language plpgsql as $$
declare rejected boolean := false;
begin
  begin execute query; exception when others then rejected := true; end;
  perform pg_temp.check_that(rejected, label);
end;
$$;
create function pg_temp.ballot(voter text, league text, champ text, loser text, ranks text default '[1,2,3,4,5,6,7,8,9,10,11,12]')
returns text language sql as $$
  select format(
    'insert into public.halftime_forecasts(league_id, season, voter_id, rankings, championship, loser_bowl) values (%L, 2026, %L, %L, %L, %L)',
    league, voter, ranks, champ, loser);
$$;

insert into auth.users(id, email, raw_user_meta_data) values
 ('00000000-0000-4000-8000-000000000001', 'one@fixture.invalid', '{"roster_id": "1"}'),
 ('00000000-0000-4000-8000-000000000002', 'two@fixture.invalid', '{"roster_id": "2"}');
insert into public.halftime_forecast_windows(league_id, season, locks_at, team_count) values
 ('fixture', 2026, now() + interval '1 day', 12),
 ('closed', 2026, now() - interval '1 minute', 12);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
-- Championship: 4 beats 5, 3 beats 6, 1 beats 4, 3 beats 2, 1 beats 3.
-- Loser bowl (losers go through): 9, 10, 9, 11, then 11 is last one standing.
do $$ begin execute pg_temp.ballot('00000000-0000-4000-8000-000000000001', 'fixture', '[4,3,1,3,1]', '[9,10,9,11,11]'); end $$;
select pg_temp.check_that((select count(*) = 1 from public.halftime_forecasts), 'a complete ballot saves');
select pg_temp.must_reject(pg_temp.ballot('00000000-0000-4000-8000-000000000002', 'fixture', '[4,3,1,3,1]', '[9,10,9,11,11]'), 'cannot file a ballot for another member');
update public.halftime_forecasts set championship = '[5,6,5,6,6]' where voter_id = auth.uid();
select pg_temp.check_that((select championship = '[5,6,5,6,6]' from public.halftime_forecasts where voter_id = auth.uid()), 'a member can change their ballot before the lock');
select pg_temp.must_reject($q$update public.halftime_forecasts set rankings = '[1,2,3,4,5,6,7,8,9,10,11]' where voter_id = auth.uid()$q$, 'an incomplete table is rejected');
select pg_temp.must_reject($q$update public.halftime_forecasts set rankings = '[1,1,3,4,5,6,7,8,9,10,11,12]' where voter_id = auth.uid()$q$, 'a repeated team is rejected');
select pg_temp.must_reject($q$update public.halftime_forecasts set championship = '[4,3,2,3,1]' where voter_id = auth.uid()$q$, 'a pick outside its game is rejected');
select pg_temp.must_reject($q$update public.halftime_forecasts set championship = '[4,3,1,3,2]' where voter_id = auth.uid()$q$, 'the final pick must come from the final');
select pg_temp.must_reject($q$update public.halftime_forecasts set loser_bowl = '[9,10,9,11]' where voter_id = auth.uid()$q$, 'a short bracket is rejected');
select pg_temp.must_reject($q$update public.halftime_forecasts set loser_bowl = '[9,10,12,11,"x"]' where voter_id = auth.uid()$q$, 'a non-roster pick is rejected');
select pg_temp.must_reject($q$update public.halftime_forecasts set rankings = '[1,2,3,4,7,6,5,8,9,10,11,12]' where voter_id = auth.uid()$q$, 'reseeding without updating picks that no longer fit is rejected');
select pg_temp.must_reject(pg_temp.ballot('00000000-0000-4000-8000-000000000001', 'closed', '[4,3,1,3,1]', '[9,10,9,11,11]'), 'ballots cannot be filed after the lock');
select pg_temp.check_that((select count(*) = 2 and bool_and(submitted = (roster_id = 1)) from public.halftime_forecast_submission_status('fixture', 2026::smallint)), 'participation shows who has filed without revealing ballots');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select pg_temp.check_that((select count(*) = 0 from public.halftime_forecasts), 'other members cannot see a ballot before the lock');
do $$ begin execute pg_temp.ballot('00000000-0000-4000-8000-000000000002', 'fixture', '[5,6,1,2,2]', '[8,7,12,11,12]'); end $$;
select pg_temp.check_that((select count(*) = 1 from public.halftime_forecasts), 'a member sees only their own ballot before the lock');

reset role;
update public.halftime_forecast_windows set locks_at = now() - interval '1 minute' where league_id = 'fixture';
set local role authenticated;
select pg_temp.check_that((select count(*) = 2 from public.halftime_forecasts), 'every ballot is revealed after the lock');
with changed as (update public.halftime_forecasts set championship = '[4,3,1,3,1]' where voter_id = auth.uid() returning *)
select pg_temp.check_that((select count(*) = 0 from changed), 'ballots cannot change after the lock');

reset role;
select pg_temp.must_reject($q$update public.halftime_forecasts set championship = '[4,3,1,3,1]' where voter_id = '00000000-0000-4000-8000-000000000002'$q$, 'the trigger enforces the lock even with RLS bypassed');
set local role anon;
select pg_temp.must_reject('select * from public.halftime_forecasts', 'anonymous visitors cannot read ballots');
select pg_temp.must_reject($q$select * from public.halftime_forecast_submission_status('fixture', 2026::smallint)$q$, 'anonymous visitors cannot read participation');
rollback;
