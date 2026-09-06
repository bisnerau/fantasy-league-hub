import { createServer } from 'node:http';
import { NoOpCacheHandler, setCacheHandler } from 'vinext/shims/cache-handler';

// An entirely in-memory companion API. The built application runs unchanged.
// Neither the server nor the browser test harness forwards external requests.
process.env.PORT = '4318';
process.env.HOST = '127.0.0.1';
process.env.NEXT_PUBLIC_SLEEPER_LEAGUE_ID = 'fixture-league';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fixture.invalid';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'fixture-public-key';
process.env.SUPABASE_SECRET_KEY = '';
process.env.CRON_SECRET = '';

const memberId = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
const names = [
  'Burns XI',
  'Prime Time',
  'Mahomes-lander and The Boys',
  'Cooper Kupp Mah Balls',
  'Who’s throwing Diggs',
  'Sauce Pjardner',
  'Tampa B’AH',
  'Hawk Tuas Binatsos',
  'Pronouns Who Dey',
  'The Finest Wagyu',
  'BurrowMeDickinYoAss',
  'Burkeys Teur',
];
const lock = '2026-09-13T17:00:00.000Z';
let mode = 'open';
let failVote = false;
let failRead = false;
let delayVote = 0;
let votes = [];
const now = () =>
  Date.parse(
    mode === 'final'
      ? '2026-09-16T10:00:00Z'
      : mode === 'locked'
        ? lock
        : '2026-09-12T12:00:00Z',
  );
Date.now = now;
const profiles = [
  { id: memberId, display_name: 'Emmet Burns', roster_id: 1 },
  { id: otherId, display_name: 'Alan Fixture', roster_id: 2 },
];
const rosters = names.map((_name, index) => ({
  roster_id: index + 1,
  owner_id: `manager-${index + 1}`,
  players: [`player-${index + 1}`],
  starters: [`player-${index + 1}`],
  settings: {
    wins: mode === 'final' ? 1 : 0,
    losses: 0,
    ties: 0,
    fpts: 100,
    fpts_decimal: 5,
  },
}));
const users = names.map((name, index) => ({
  user_id: `manager-${index + 1}`,
  display_name: index === 0 ? 'Emmet Burns' : `Manager ${index + 1}`,
  avatar: null,
  metadata: { team_name: name },
}));
const matchups = () =>
  names.map((_name, index) => ({
    roster_id: index + 1,
    matchup_id: Math.floor(index / 2) + 1,
    points: 100 + index,
    players: [`player-${index + 1}`],
    starters: [`player-${index + 1}`],
  }));
const rows = () =>
  Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    prediction_week_id: 1,
    sleeper_matchup_id: index + 1,
    home_roster_id: index * 2 + 1,
    away_roster_id: index * 2 + 2,
    home_projected: 110,
    away_projected: 90,
    home_final: mode === 'final' ? 110.04 : null,
    away_final: mode === 'final' ? 110.03 : null,
    winner_roster_id: mode === 'final' ? index * 2 + 1 : null,
    status:
      mode === 'final' ? 'final' : mode === 'locked' ? 'locked' : 'scheduled',
  }));
const user = {
  id: memberId,
  aud: 'authenticated',
  role: 'authenticated',
  email: 'fixture@mac12.test',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {},
  created_at: '2026-09-01T00:00:00Z',
};
const token = () =>
  `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')}.${Buffer.from(JSON.stringify({ sub: memberId, aud: 'authenticated', role: 'authenticated', exp: Math.floor(now() / 1000) + 86400 * 30 })).toString('base64url')}.fixture-signature`;
const json = (data, status = 200) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store' } });

async function handle(
  url,
  method = 'GET',
  body = null,
  headers = new Headers(),
) {
  if (url.pathname === '/__fixture') {
    if (body.reset) {
      mode = 'open';
      failVote = false;
      failRead = false;
      delayVote = 0;
      votes = [];
    }
    if (body.mode) mode = body.mode;
    if (body.failVote != null) failVote = body.failVote;
    if (body.failRead != null) failRead = body.failRead;
    if (body.delayVote != null) delayVote = body.delayVote;
    if (body.otherVote)
      votes.push({ matchup_id: 1, voter_id: otherId, selected_roster_id: 2 });
    return json({ now: now(), mode, votes });
  }
  if (url.pathname === '/auth/v1/token')
    return body.password === 'fixture-password'
      ? json({
          access_token: token(),
          token_type: 'bearer',
          expires_in: 86400 * 30,
          expires_at: Math.floor(now() / 1000) + 86400 * 30,
          refresh_token: 'fixture-refresh-token',
          user,
        })
      : json(
          { code: 'invalid_credentials', msg: 'Invalid login credentials' },
          400,
        );
  if (url.pathname === '/auth/v1/user') return json(user);
  if (url.pathname === '/auth/v1/logout')
    return new Response(null, { status: 204 });
  if (url.pathname.startsWith('/rest/')) {
    const table = url.pathname.split('/').at(-1);
    const authenticated = headers
      .get('authorization')
      ?.includes('fixture-signature');
    if (table === 'prediction_weeks')
      return json([
        {
          id: 1,
          league_id: 'fixture-league',
          season: 2026,
          week: 1,
          locks_at: lock,
        },
      ]);
    if (table === 'prediction_matchups')
      return json(mode === 'predraft' ? [] : rows());
    if (!authenticated)
      return json({ message: 'Fixture sign-in required' }, 401);
    if (failRead && method === 'GET')
      return json({ message: 'Fixture read failure' }, 400);
    if (table === 'profiles')
      return json(url.searchParams.has('id') ? [profiles[0]] : profiles);
    if (table.endsWith('leaderboard'))
      return json(
        mode === 'final'
          ? profiles.map((profile, index) => ({
              voter_id: profile.id,
              display_name: profile.display_name,
              completed_picks: 6,
              correct_picks: 6 - index,
              accuracy: index ? 83.3 : 100,
            }))
          : profiles.map((profile) => ({
              voter_id: profile.id,
              display_name: profile.display_name,
              completed_picks: 0,
              correct_picks: 0,
              accuracy: 0,
            })),
      );
    if (table === 'prediction_votes') {
      if (method === 'POST') {
        if (delayVote)
          await new Promise((resolve) => setTimeout(resolve, delayVote));
        if (mode === 'locked' || mode === 'final')
          return json({ message: 'Predictions are locked for this week' }, 400);
        if (failVote) return json({ message: 'Fixture save failure' }, 400);
        if (body.voter_id !== memberId)
          return json({ message: 'Invalid member' }, 403);
        votes = [
          ...votes.filter(
            (vote) =>
              vote.matchup_id !== body.matchup_id || vote.voter_id !== memberId,
          ),
          body,
        ];
        return json(body);
      }
      return json(
        votes.filter(
          (vote) =>
            mode === 'locked' || mode === 'final' || vote.voter_id === memberId,
        ),
      );
    }
  }
  throw new Error(`Unmocked fixture request: ${method} ${url.pathname}`);
}

const fixtureFetch = async (input, options = {}) => {
  const url = new URL(
    typeof input === 'string' ? input : (input.url ?? input.href),
  );
  if (url.hostname === 'api.sleeper.app') {
    if (url.pathname === '/v1/state/nfl')
      return json({
        week: mode === 'final' ? 2 : 1,
        season: '2026',
        season_type: 'regular',
      });
    if (url.pathname.endsWith('/users')) return json(users);
    if (url.pathname.endsWith('/rosters')) return json(rosters);
    if (url.pathname.includes('/matchups/'))
      return json(mode === 'predraft' ? [] : matchups());
    if (url.pathname.endsWith('/drafts'))
      return json([
        {
          draft_id: 'fixture-draft',
          season: '2026',
          status: mode === 'predraft' ? 'pre_draft' : 'complete',
          start_time: Date.parse('2026-09-06T10:00:00Z'),
          type: 'snake',
          settings: { rounds: 15, pick_timer: 120 },
        },
      ]);
    if (url.pathname.endsWith('winners_bracket'))
      return json([
        { p: 1, w: 1, l: 2 },
        { p: 3, w: 3, l: 4 },
      ]);
    if (url.pathname.startsWith('/v1/league/'))
      return json({
        league_id: 'fixture-league',
        name: 'MAC 12',
        season: url.pathname.endsWith('fixture-history') ? '2025' : '2026',
        status: url.pathname.endsWith('fixture-history')
          ? 'complete'
          : mode === 'predraft'
            ? 'pre_draft'
            : 'in_season',
        total_rosters: 12,
        previous_league_id: url.pathname.endsWith('fixture-history')
          ? null
          : 'fixture-history',
        roster_positions: ['QB', 'BN'],
        settings: { playoff_week_start: 15, last_scored_leg: 14 },
        metadata: { latest_league_winner_roster_id: '1' },
        scoring_settings: { rec: 1 },
      });
    if (url.pathname === '/v1/players/nfl')
      return json(
        Object.fromEntries(
          names.map((_name, index) => [
            `player-${index + 1}`,
            {
              player_id: `player-${index + 1}`,
              full_name: `Fixture quarterback ${index + 1}`,
              position: 'QB',
              team: 'BUF',
            },
          ]),
        ),
      );
    if (url.pathname.startsWith('/projections/'))
      return json(
        names.map((_name, index) => ({
          player_id: `player-${index + 1}`,
          stats: { pts_ppr: 20 + index },
        })),
      );
  }
  if (
    url.hostname === 'fixture.invalid' ||
    url.hostname.endsWith('.supabase.co')
  )
    return handle(
      url,
      options.method,
      options.body ? JSON.parse(options.body) : null,
      new Headers(options.headers),
    );
  throw new Error(
    `External network blocked in isolated fixture server: ${url.hostname}`,
  );
};

const api = createServer(async (request, response) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  try {
    const result = await handle(
      new URL(request.url, 'http://127.0.0.1:4319'),
      request.method,
      chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {},
      new Headers(request.headers),
    );
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(await result.text());
  } catch (error) {
    response.writeHead(500);
    response.end(JSON.stringify({ error: error.message }));
  }
});
await new Promise((resolve, reject) => {
  api.once('error', reject);
  api.listen(4319, '127.0.0.1', resolve);
});
globalThis.fetch = fixtureFetch;
// Production caches must not retain another test's season/status when the
// scenario clock moves backwards. Only this isolated test process disables them.
setCacheHandler(new NoOpCacheHandler());
await import('../../dist/standalone/server.js');
// Bypass framework data caching so each fixture scenario is independent.
globalThis.fetch = fixtureFetch;
