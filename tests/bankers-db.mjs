// Optional isolated PostgreSQL integration check. Never connects to a live service.
// Start the mac12-banker-tests container described in docs/bankers-and-rivalries.md first.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const bootstrap = `
create schema if not exists auth;
do $$ begin
  if not exists(select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists(select from pg_roles where rolname = 'anon') then create role anon; end if;
end $$;
create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
grant usage on schema auth, public to authenticated, anon;
`;
execFileSync('docker', [
  'exec',
  'mac12-banker-tests',
  'createdb',
  '-U',
  'postgres',
  'banker_integration',
]);
try {
  const sql =
    bootstrap +
    [
      'supabase/migrations/20260904150000_create_prediction_centre.sql',
      'supabase/migrations/20260904183000_add_prediction_accuracy_tables.sql',
      'supabase/migrations/20260918150000_add_weekly_bankers.sql',
      'tests/bankers-db.sql',
    ]
      .map((file) =>
        readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'),
      )
      .join('\n');
  execFileSync(
    'docker',
    [
      'exec',
      '-i',
      'mac12-banker-tests',
      'psql',
      '-U',
      'postgres',
      '-d',
      'banker_integration',
      '-v',
      'ON_ERROR_STOP=1',
      '-q',
    ],
    { input: sql, stdio: ['pipe', 'inherit', 'inherit'] },
  );
  console.log('Banker database integration checks passed.');
} finally {
  execFileSync('docker', [
    'exec',
    'mac12-banker-tests',
    'dropdb',
    '-U',
    'postgres',
    'banker_integration',
  ]);
}
