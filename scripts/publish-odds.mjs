// Publishes and freezes one week's Weekly Picks prices.
//
//   npm run odds:publish -- 5             # dry run: prints the prices
//   npm run odds:publish -- 5 --publish   # writes them to Supabase, once
//
// Prices come from the committed snapshot lib/data/experiments/odds-week-<n>.json
// (built after Thursday's game by scripts/build-odds-snapshot.mjs): the
// opponent-adjusted best-lineup totals, a 20-point logistic win chance, and the
// nearest familiar fraction. The database rejects any change after publishing
// and any price once the week has locked. Uses the server-only secret key.
import { readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  fractionalPrice,
  priceFromFraction,
  winChance,
} from '../lib/predictions/fractional-odds.ts';

const week = Number(process.argv[2]);
const publish = process.argv.includes('--publish');
if (!Number.isInteger(week) || week < 1) {
  throw new Error('Usage: npm run odds:publish -- <week> [--publish]');
}
const words = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
];
const snapshot = JSON.parse(
  readFileSync(
    new URL(
      `../lib/data/experiments/odds-week-${words[week]}.json`,
      import.meta.url,
    ),
    'utf8',
  ),
);
if (snapshot.week !== week) throw new Error('Snapshot week does not match');
if (snapshot.lineupBasis !== 'best') {
  throw new Error('Weekly Picks prices use best-lineup snapshots only');
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
// Dry runs only read public tables; publishing needs the server-only key.
const key = publish
  ? secret
  : (secret ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const leagueId = process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID;
if (!url || !key || !leagueId) {
  throw new Error(
    publish
      ? 'Publishing needs SUPABASE_SECRET_KEY (server-only; never commit it)'
      : 'Supabase URL, a key and the league ID are required',
  );
}
const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: weekRow, error: weekError } = await db
  .from('prediction_weeks')
  .select('id,locks_at')
  .eq('league_id', leagueId)
  .eq('season', snapshot.season)
  .eq('week', week)
  .single();
if (weekError) throw weekError;
if (Date.now() >= Date.parse(weekRow.locks_at)) {
  throw new Error(`Week ${week} locked at ${weekRow.locks_at}`);
}
const { data: rows, error: rowsError } = await db
  .from('prediction_matchups')
  .select('id,sleeper_matchup_id,home_roster_id,away_roster_id')
  .eq('prediction_week_id', weekRow.id);
if (rowsError) throw rowsError;

const prices = snapshot.matchups.flatMap((matchup) => {
  const [home, away] = matchup.teams;
  const row = rows.find((r) => r.sleeper_matchup_id === matchup.id);
  if (
    !row ||
    row.home_roster_id !== home.id ||
    row.away_roster_id !== away.id
  ) {
    throw new Error(`Fixture ${matchup.id} does not match the stored ballot`);
  }
  const homeChance = winChance(home.adjustedTotal, away.adjustedTotal);
  return [
    [home, homeChance],
    [away, 1 - homeChance],
  ].map(([team, chance]) => {
    const { numerator, denominator } = fractionalPrice(chance);
    return {
      matchup_id: row.id,
      roster_id: team.id,
      numerator,
      denominator,
      manager: team.name,
      chance,
      sleeper_matchup_id: matchup.id,
    };
  });
});

for (const p of prices) {
  const price = priceFromFraction(p.numerator, p.denominator);
  console.log(
    `Fixture ${p.sleeper_matchup_id} · ${p.manager.padEnd(16)} ${price.label.padStart(6)}  returns ${price.payout.toFixed(2)}  (${Math.round(p.chance * 100)}%)`,
  );
}

const { data: existing, error: existingError } = await db
  .from('prediction_prices')
  .select('matchup_id')
  .in(
    'matchup_id',
    rows.map((r) => r.id),
  );
if (existingError) throw existingError;
if (existing.length) {
  throw new Error(`Week ${week} prices are already published and frozen`);
}
if (!publish) {
  console.log('\nDry run. Add --publish to freeze these prices.');
  process.exit(0);
}
const { data: inserted, error: insertError } = await db
  .from('prediction_prices')
  .insert(
    prices.map(({ matchup_id, roster_id, numerator, denominator }) => ({
      matchup_id,
      roster_id,
      numerator,
      denominator,
    })),
  )
  .select('matchup_id,roster_id,numerator,denominator,payout,published_at');
if (insertError) throw insertError;
const receipt = new URL(
  `../docs/research/${snapshot.season}-week-${week}-prices.json`,
  import.meta.url,
);
writeFileSync(
  receipt,
  `${JSON.stringify({ week, season: snapshot.season, snapshot: snapshot.snapshot, prices: inserted }, null, 2)}\n`,
);
console.log(
  `\nPublished ${inserted.length} prices. Receipt: ${receipt.pathname}`,
);
