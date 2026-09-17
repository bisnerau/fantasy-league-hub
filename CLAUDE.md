# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Fantasy League Hub for "MAC 12" — a 12-team fantasy football league (est. 2020). A fun Sleeper companion centred on weekly picks, bragging rights, league stories, managers, and a historical record book. Live scoring and roster management belong on Sleeper. Unavailable feeds show honest unavailable/waiting states, never fictional demo league data.

## Commands

- `npm run dev` — start Vite dev server (vinext + Cloudflare Workers local bindings)
- `npm run build` — production build via vinext
- `npm run start` — run built output locally with Wrangler (`wrangler dev --config dist/server/wrangler.json`)
- `npm run lint` — run oxlint (type-aware, with React/TS/a11y/import plugins)
- `npm run format` — run oxfmt (single quotes, 80-char width)

- `npm test` — isolated Node unit/integration tests (Node 22.13+)
- `npm run test:e2e` — Playwright Chromium tests against the existing production build; run `npm run build` first. Initial setup: `npx playwright install chromium`.

See `docs/clubhouse-verification.md` for fixture isolation, coverage, and release checks.

## Architecture

**Framework stack**: Vite 8 + vinext (React 19 RSC framework) + Cloudflare Workers runtime. Despite leftover Next.js types in tsconfig and `next.config.ts`, the app builds and runs through vinext/Vite — not Next.js. Imports like `next/font/google`, `next/image`, `next/link`, `next/navigation` and the `next/` metadata types are shimmed by vinext.

**Routing**: File-based App Router convention under `app/`:

- `/` — picks-first clubhouse, member-only prediction race, draft story/status, champion and shame spotlights
- `/standings` — live standings table with median record
- `/matchups` — weekly matchup predictions, expandable lineups, authenticated voting, and the season prediction table
- `/records` — historical record book (2020–present), franchise all-time records
- `/managers` — manager profiles and history
- `/wall-of-shame` — league lowlights
- `/draft-recap` — commissioner-prepared draft report, published only after review

**Data flow**: Pages are async RSCs. Sleeper data is fetched server-side through `lib/data/` and `lib/sleeper/client.ts`, with caching hints and bounded fetch timeouts. Supabase stores prediction metadata, votes, member profiles, and leaderboards. Public page reads use a sessionless publishable-key client. Only the authenticated cron sync uses the server secret; visiting any page must never seed or grade predictions. Browser member reads and saves retain the existing Supabase authentication and RLS contract.

**Key data modules**:

- `lib/sleeper/client.ts` — typed wrappers around every Sleeper API endpoint used
- `lib/sleeper/types.ts` — TypeScript types for Sleeper API responses
- `lib/sleeper/history.ts` — `crawlLeagueHistory()` walks `previous_league_id` chain to archive full seasons
- `lib/sleeper/projections.ts` — unofficial Sleeper projections/stats feed
- `lib/data/dashboard.ts` — assembles standings, draft status and reigning champion; optional feed failures do not discard available standings
- `lib/data/historical.ts` — hardcoded 2020–2024 season results with franchise color mapping
- `lib/data/verified-history.ts` — merges hardcoded history with Sleeper-verified seasons by walking the league chain
- `lib/data/predictions.ts` — separate read-only weekly picks and cron-only metadata/result synchronization paths
- `lib/predictions/rules.ts` — Sunday 1pm Eastern lock, Irish-time display, grading delay, sign-in error messages
- `lib/predictions/votes.ts` — verifies the exact saved row before confirming a pick
- `lib/sleeper/scores.ts` — shared score handling (Sleeper fractional fields are hundredths; missing is not zero)
- `lib/supabase/` — browser and server-only Supabase clients; the server client requires the secret key and must never be imported by client components

**League config**: `lib/config/league.config.ts` — league name, branding colors (exposed as CSS custom properties `--league-primary/secondary/accent`), owner name/avatar overrides. League ID comes from `NEXT_PUBLIC_SLEEPER_LEAGUE_ID` env var.

**UI**: shadcn/ui (Base UI + Tailwind CSS 4), with Recharts where needed. `components/ui/` is generated and excluded from oxlint. Charcoal/chalk/crest-green theme, gold for achievements, restrained motion, and global reduced-motion support. Standard anchors are intentional: production QA found the current vinext `next/link` dynamic navigation import throws at runtime. Do not restore that shim without testing the built app's navigation.

**Client components**: Interactive navigation/theme, draft countdown, standings sorting, manager accordions, and the prediction centre/clubhouse member panels. `use-prediction-member.ts` shares authenticated reads and guards against stale responses. Page shells and public data remain server-rendered.

## Path aliases

`@/*` maps to the project root (e.g., `@/lib/sleeper/client`, `@/components/ui/card`).

## Environment

Requires `NEXT_PUBLIC_SLEEPER_LEAGUE_ID` in `.env.local` to connect to a real Sleeper league. Matchup voting also uses `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and the server-only `SUPABASE_SECRET_KEY`. Never expose or commit the secret key. See `.env.example` for all vars.

Supabase schema changes live in `supabase/migrations/` and are applied with the linked Supabase CLI before production deployment. Manager Auth accounts are provisioned with `npm run members:create`; the generated password sheet is written outside the repository to `/private/tmp`.

## Deployment

**Production target is Vercel**, not Cloudflare Workers. Despite `@cloudflare/vite-plugin` in the dev stack (used for local dev bindings), production builds use vinext's standalone Node.js output and deploy via the Vercel Build Output API.

**How it works**: `vercel.json` runs `node scripts/vercel-build.mjs` which:

1. Runs `vinext build` → produces `dist/standalone/` (self-contained Node.js server with bundled `node_modules`)
2. Copies `dist/standalone/dist/client/` to `.vercel/output/static/` (CDN-served assets)
3. Copies the full standalone output into `.vercel/output/functions/index.func/`
4. Creates `index.mjs` — a Vercel function entry that adapts Node.js `(req, res)` to the vinext fetch handler (`mod.default.fetch(webRequest)`)
5. Writes `.vc-config.json` (Node.js 22, streaming enabled) and `config.json` (routes: static assets from CDN, everything else to the function)

**Do NOT** set `outputDirectory` in `vercel.json` — it breaks Build Output API detection. The build script writes directly to `.vercel/output/` which Vercel picks up automatically when `framework` is `null`.

**Do NOT** replace the fetch-handler adapter in `index.mjs` with `startProdServer()` — Vercel Functions are serverless request handlers, not long-running HTTP servers.

The `.openai/hosting.json` contains a legacy OpenAI Sites project ID (this was originally scaffolded as an OpenAI Site). D1/R2 bindings are configured in the Cloudflare plugin but currently null/unused.

`vercel.json` schedules `/api/cron/predictions` with two daily jobs, at 10:00 and 11:00 UTC, covering 11am Irish time in both summer and winter. It prepares the current ballot and retries every unresolved stored week in the configured league season. Grading starts on the Tuesday after Sunday lock at 11:00 Europe/Dublin, and also requires NFL state advanced beyond the week, a complete schedule, and both scores for each matchup. The earlier winter run cannot settle that week before the Irish cutoff; repeated runs are idempotent. Scheduler delivery may be later than the configured time. Settled rows are not downgraded or regraded; votes are never changed. Any failed week yields HTTP 503 for monitoring. Vercel applies these schedules only on deployment. The endpoint requires the server-only `CRON_SECRET` and `SUPABASE_SECRET_KEY` configured in Vercel.

Weekly Picks includes authored matchup reports in `lib/data/newsletters/`, indexed by `lib/data/matchup-newsletters.ts`. The commissioner prompts for reviews on Tuesdays and previews on Thursdays. Write individual stories with a few telling stats and friendly league slagging; the initial stats-heavy template style was rejected. The cron only syncs results and ballots, never generates prose. Preserve each published preview and winner call; show reviews only after settlement. Week 1 reviews and Week 2 previews are authored. Use “matchup report”, “preview” or “round-up” in visible wording; the commissioner retired “newsletter”. Hugo and Alan live together. See `docs/matchup-stories.md` for the writing and publishing workflow.

## Formatting & linting conventions

- oxfmt: single quotes, 80-char print width
- oxlint: type-aware checking enabled, `typescript/no-explicit-any` is an error, React Compiler rule enforced
- `components/ui/**` and `hooks/use-mobile.ts` are excluded from linting (shadcn-generated)
