# Weekly Bankers and rivalry strips

Each member can nominate one saved winner pick as their Banker each week.
Correct picks earn one point; a correct Banker earns two points **total**.
Wrong or missing picks earn zero. Tied matchups award zero and are excluded
from accuracy and the settled Banker denominator. Six wins including the
Banker earn seven points. No nomination is made automatically or retroactively.

Save a winner, then choose “Make this my Banker ×2”. Choosing another matchup
atomically replaces the previous nomination. Changing the winner in that
matchup keeps its Banker status. The Banker shares the existing Sunday lock
and stays private until then. After lock, member voter badges reveal Bankers;
settled matchups show the member's points outcome. Weekly and season tables
rank by points (equal points share a rank) and retain raw correct picks,
accuracy, and correct/settled Banker counts. The homepage uses the same points.

`prediction_bankers` has a primary key on week and member, a composite foreign
key proving the matchup belongs to that week, and a foreign key to the member's
saved vote. The invoker RPC uses an atomic upsert under RLS. The trigger checks
the database clock and forbids moving an existing nomination between weeks or
members. Authenticated members cannot delete nominations. Page reads do not
write or grade anything; points come from the existing settled matchup winners.

Apply `20260918150000_add_weekly_bankers.sql` before releasing this code. It
adds the Banker table/RPC and extends the weekly and season leaderboard views
without changing existing votes, results or their base points. Existing client
versions continue to work with the extended views. Do not deploy the new client
before the migration: member reads require the new table and view columns.

Rivalry strips use the verified, owner-mapped 2025 regular-season snapshot plus
stored final results from earlier 2026 weeks. They are limited to that verified
league/season mapping. Each strip labels its coverage and any missing recent
results; it never claims an all-time record. Viewed-week and later results are
excluded so old previews retain the history they had before kickoff. The
record, last meeting and biggest winning margin come from the same meetings.

For isolated database verification, start a temporary container with no network:

```sh
docker run --detach --rm --name mac12-banker-tests --network none -e POSTGRES_PASSWORD=local-test-only -e POSTGRES_DB=banker_tests public.ecr.aws/supabase/postgres:17.6.1.095
node tests/bankers-db.mjs
docker stop mac12-banker-tests
```

The runner creates a disposable database, applies the initial prediction and
Banker migrations, exercises real PostgreSQL constraints, RLS, deadline checks,
and leaderboard calculations, and drops that database afterwards. `npm test`
covers rivalry calculations and confirmed/failed Banker saves without a database.
