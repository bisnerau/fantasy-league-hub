-- Run only in an isolated database after the prediction migrations.
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

insert into auth.users(id, email, raw_user_meta_data) values
 ('00000000-0000-4000-8000-000000000001', 'one@fixture.invalid', '{}'),
 ('00000000-0000-4000-8000-000000000002', 'two@fixture.invalid', '{}'),
 ('00000000-0000-4000-8000-000000000003', 'three@fixture.invalid', '{}');
insert into public.prediction_weeks(id, league_id, season, week, locks_at) values
 (91001, 'fixture', 2026, 1, now() + interval '1 day'),
 (91002, 'fixture', 2026, 2, now() + interval '2 days'),
 (91003, 'other-league', 2026, 1, now() + interval '1 day');
insert into public.prediction_matchups(id, prediction_week_id, sleeper_matchup_id, home_roster_id, away_roster_id)
select 91000 + n, 91001, n, 2*n-1, 2*n from generate_series(1,6) n;
insert into public.prediction_matchups(id, prediction_week_id, sleeper_matchup_id, home_roster_id, away_roster_id)
values (92001, 91002, 1, 1, 2), (93001, 91003, 1, 1, 2);
insert into public.prediction_votes(matchup_id, voter_id, selected_roster_id)
select 91000 + n, '00000000-0000-4000-8000-000000000001', 2*n-1 from generate_series(1,6) n;
insert into public.prediction_votes(matchup_id, voter_id, selected_roster_id) values
 (91001, '00000000-0000-4000-8000-000000000002', 2),
 (91002, '00000000-0000-4000-8000-000000000002', 3),
 (91003, '00000000-0000-4000-8000-000000000003', 5),
 (92001, '00000000-0000-4000-8000-000000000001', 1),
 (93001, '00000000-0000-4000-8000-000000000001', 1);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select * from public.set_prediction_banker(91001);
select * from public.set_prediction_banker(91002);
select pg_temp.check_that((select count(*) = 1 and max(matchup_id) = 91002 from public.prediction_bankers), 'switch replaces the one Banker atomically');
select * from public.set_prediction_banker(91001);
select pg_temp.must_reject($q$insert into public.prediction_bankers values (91001, '00000000-0000-4000-8000-000000000001', 91002, now())$q$, 'second Banker in the same week is rejected');
select pg_temp.must_reject($q$insert into public.prediction_bankers values (91002, '00000000-0000-4000-8000-000000000001', 91001, now())$q$, 'matchup cannot be nominated for another week');
select pg_temp.must_reject($q$update public.prediction_bankers set prediction_week_id = 91002, matchup_id = 92001$q$, 'existing Banker cannot move between weeks');
select pg_temp.must_reject($q$insert into public.prediction_bankers values (91001, '00000000-0000-4000-8000-000000000002', 91001, now())$q$, 'cannot nominate for another member');
update public.prediction_votes set selected_roster_id = 2 where matchup_id = 91001 and voter_id = auth.uid();
select pg_temp.check_that((select v.selected_roster_id = 2 from public.prediction_bankers b join public.prediction_votes v using (matchup_id, voter_id) where b.prediction_week_id = 91001), 'Banker follows a changed winner');
update public.prediction_votes set selected_roster_id = 1 where matchup_id = 91001 and voter_id = auth.uid();
select * from public.set_prediction_banker(92001);
select * from public.set_prediction_banker(93001);
select pg_temp.check_that((select count(*) = 3 from public.prediction_bankers), 'other weeks and leagues have independent Bankers');
select pg_temp.check_that((select points = 0 from public.prediction_weekly_leaderboard where voter_id = auth.uid() and league_id = 'fixture' and week = 1), 'unsettled picks have no points');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select pg_temp.check_that((select count(*) = 0 from public.prediction_bankers), 'other members cannot see Bankers before lock');
select pg_temp.must_reject('select public.set_prediction_banker(91006)', 'Banker requires the member own saved pick');
select * from public.set_prediction_banker(91001);
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
select * from public.set_prediction_banker(91003);

reset role;
update public.prediction_weeks set locks_at = now() - interval '1 minute' where id = 91001;
update public.prediction_matchups set status = 'final', home_final = 110, away_final = 100, winner_roster_id = home_roster_id where prediction_week_id = 91001;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select pg_temp.check_that((select count(*) = 3 from public.prediction_bankers where prediction_week_id = 91001), 'Bankers revealed to members after lock');
select pg_temp.check_that((select points = 7 and correct_picks = 6 and accuracy = 100 and correct_bankers = 1 and completed_bankers = 1 from public.prediction_weekly_leaderboard where voter_id = auth.uid() and league_id = 'fixture' and week = 1), 'six correct picks with a winning Banker earn seven points and 100% accuracy');
select pg_temp.check_that((select points = 1 and correct_picks = 1 and completed_bankers = 1 and correct_bankers = 0 from public.prediction_weekly_leaderboard where voter_id = '00000000-0000-4000-8000-000000000002' and league_id = 'fixture' and week = 1), 'missed Banker earns no bonus or penalty; ordinary winner earns one');
select pg_temp.check_that((select points = 7 from public.prediction_season_leaderboard where voter_id = auth.uid() and league_id = 'fixture'), 'season points match settled weekly total');
select pg_temp.must_reject('select public.set_prediction_banker(91002)', 'RPC cannot change Banker after lock');
select pg_temp.must_reject('delete from public.prediction_bankers where prediction_week_id = 91001', 'members cannot erase a locked Banker');
with changed as (update public.prediction_bankers set matchup_id = 91002 where prediction_week_id = 91001 returning *)
select pg_temp.check_that((select count(*) = 0 from changed), 'direct update cannot bypass the deadline');
with changed as (update public.prediction_votes set selected_roster_id = 2 where matchup_id = 91001 and voter_id = auth.uid() returning *)
select pg_temp.check_that((select count(*) = 0 from changed), 'cannot change Banker winner through the vote after lock');

reset role;
select pg_temp.must_reject($q$insert into public.prediction_bankers values (91001, '00000000-0000-4000-8000-000000000001', 91002, now())$q$, 'database trigger enforces deadline even with RLS bypass');
update public.prediction_matchups set home_final = 100, away_final = 100, winner_roster_id = null where id = 91003;
set local role authenticated;
select pg_temp.check_that((select points = 0 and completed_bankers = 0 and correct_bankers = 0 from public.prediction_weekly_leaderboard where voter_id = '00000000-0000-4000-8000-000000000003' and league_id = 'fixture' and week = 1), 'tied Banker earns zero and is excluded from Banker accuracy');
select pg_temp.check_that((select points = 6 and correct_picks = 5 and completed_picks = 5 from public.prediction_weekly_leaderboard where voter_id = auth.uid() and league_id = 'fixture' and week = 1), 'tied ordinary game excluded from accuracy and points');
reset role;
set local role anon;
select pg_temp.must_reject('select * from public.prediction_bankers', 'anonymous visitors cannot read Bankers');
select pg_temp.must_reject('select public.set_prediction_banker(91001)', 'anonymous visitors cannot nominate Bankers');
rollback;
