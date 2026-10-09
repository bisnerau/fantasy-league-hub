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
 ('00000000-0000-4000-8000-000000000011', 'odds-one@fixture.invalid', '{}'),
 ('00000000-0000-4000-8000-000000000012', 'odds-two@fixture.invalid', '{}');
insert into public.prediction_weeks(id, league_id, season, week, locks_at) values
 (95001, 'odds', 2026, 4, now() + interval '1 day'),
 (95002, 'odds', 2026, 5, now() + interval '1 day');
-- Week 4 keeps the old rules (no prices). Week 5 is priced.
insert into public.prediction_matchups(id, prediction_week_id, sleeper_matchup_id, home_roster_id, away_roster_id) values
 (95101, 95001, 1, 1, 2),
 (95201, 95002, 1, 1, 2),
 (95202, 95002, 2, 3, 4),
 (95203, 95002, 3, 5, 6);

-- Members cannot publish prices; the server key can, once, before lock.
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000011', true);
select pg_temp.must_reject($q$insert into public.prediction_prices(matchup_id, roster_id, numerator, denominator) values (95201, 1, 3, 1)$q$, 'members cannot publish prices');
reset role;
insert into public.prediction_prices(matchup_id, roster_id, numerator, denominator) values
 (95201, 1, 3, 1), (95201, 2, 2, 7),
 (95202, 3, 1, 1), (95202, 4, 1, 1),
 (95203, 5, 4, 6), (95203, 6, 6, 4);
select pg_temp.check_that((select payout = 4 from public.prediction_prices where matchup_id = 95201 and roster_id = 1), '3/1 returns 4 points');
select pg_temp.check_that((select payout = 1.29 from public.prediction_prices where matchup_id = 95201 and roster_id = 2), '2/7 returns 1.29 points');
select pg_temp.must_reject($q$update public.prediction_prices set numerator = 9 where matchup_id = 95201 and roster_id = 1$q$, 'published prices cannot be changed');
select pg_temp.must_reject($q$delete from public.prediction_prices where matchup_id = 95201$q$, 'published prices cannot be removed');
select pg_temp.must_reject($q$insert into public.prediction_prices(matchup_id, roster_id, numerator, denominator) values (95201, 1, 5, 1)$q$, 'a team cannot be priced twice');
select pg_temp.must_reject($q$insert into public.prediction_prices(matchup_id, roster_id, numerator, denominator) values (95201, 9, 5, 1)$q$, 'a price must belong to a team in the matchup');
select pg_temp.must_reject($q$insert into public.prediction_prices(matchup_id, roster_id, numerator, denominator) values (95201, 3, 0, 1)$q$, 'a zero price is rejected');

insert into public.prediction_votes(matchup_id, voter_id, selected_roster_id) values
 (95101, '00000000-0000-4000-8000-000000000011', 1),
 (95201, '00000000-0000-4000-8000-000000000011', 1),
 (95202, '00000000-0000-4000-8000-000000000011', 3),
 (95203, '00000000-0000-4000-8000-000000000011', 6),
 (95101, '00000000-0000-4000-8000-000000000012', 1),
 (95201, '00000000-0000-4000-8000-000000000012', 2),
 (95202, '00000000-0000-4000-8000-000000000012', 4),
 (95203, '00000000-0000-4000-8000-000000000012', 5);
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000011', true);
select * from public.set_prediction_banker(95201);
select * from public.set_prediction_banker(95101);
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000012', true);
select * from public.set_prediction_banker(95203);
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000011', true);
select pg_temp.check_that((select count(*) = 6 from public.prediction_prices), 'members can read published prices');
reset role;
set local role anon;
select pg_temp.check_that((select count(*) = 6 from public.prediction_prices), 'visitors can read published prices');
reset role;

-- Lock and settle. Week 4: roster 1 wins. Week 5: 1 wins at 3/1, 3–4 ties, 5 wins at 4/6.
update public.prediction_weeks set locks_at = now() - interval '1 minute' where id in (95001, 95002);
select pg_temp.must_reject($q$insert into public.prediction_prices(matchup_id, roster_id, numerator, denominator) values (95203, 5, 1, 2)$q$, 'nothing can be priced after lock');
update public.prediction_matchups set status = 'final', home_final = 110, away_final = 100, winner_roster_id = home_roster_id where id in (95101, 95201, 95203);
update public.prediction_matchups set status = 'final', home_final = 100, away_final = 100, winner_roster_id = null where id = 95202;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000011', true);
select pg_temp.check_that((select points = 2 from public.prediction_weekly_leaderboard where voter_id = auth.uid() and league_id = 'odds' and week = 4), 'unpriced week keeps the old rules: correct Banker earns 2');
select pg_temp.check_that((select points = 8 and correct_picks = 1 and completed_picks = 2 from public.prediction_weekly_leaderboard where voter_id = auth.uid() and league_id = 'odds' and week = 5), 'correct 3/1 Banker returns 8; tie and wrong pick return 0');
select pg_temp.check_that((select points = 1 from public.prediction_weekly_leaderboard where voter_id = '00000000-0000-4000-8000-000000000012' and league_id = 'odds' and week = 4), 'unpriced ordinary winner earns 1');
select pg_temp.check_that((select points = 3.34 and correct_bankers = 1 from public.prediction_weekly_leaderboard where voter_id = '00000000-0000-4000-8000-000000000012' and league_id = 'odds' and week = 5), 'correct 4/6 Banker returns 3.34');
select pg_temp.check_that((select points = 10 from public.prediction_season_leaderboard where voter_id = auth.uid() and league_id = 'odds'), 'season adds old-rule and priced weeks: 2 + 8');
select pg_temp.check_that((select points = 4.34 from public.prediction_season_leaderboard where voter_id = '00000000-0000-4000-8000-000000000012' and league_id = 'odds'), 'season keeps two-decimal returns: 1 + 3.34');
reset role;
rollback;
