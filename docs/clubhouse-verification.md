# Clubhouse implementation and verification

## Product boundary

This is a Sleeper companion: picks and bragging rights first, then the league's stories, people and records. Sleeper remains the place for live scores, drafting, trades, waivers and roster changes. Existing accounts and the all-six-picks Sunday 1pm Eastern deadline are preserved, including picks involving earlier NFL games. Draft reports require manual preparation and review; the UI does not promise automatic publication.

The first implementation batch replaces the dashboard with a picks-first clubhouse, adds a private prediction race, simplifies navigation, applies a charcoal/chalk/crest-green identity, and improves loading, missing-data, save, error and reduced-motion states. New editorial experiences such as Weekly Receipts remain future work.

## Run checks

```sh
npm test
npm run lint
npm run build
npm run test:e2e
```

The browser runner needs Chromium (`npx playwright install chromium` once). It starts the built standalone app on port 4318 and an in-memory fixture API on 4319. Both ports must be free. It does not reuse an existing server. Browser results and screenshots are ignored by git under `test-results/`.

Unit/integration tests stub Sleeper and Supabase requests. The browser harness uses dummy credentials, substitutes Sleeper responses on the server, and routes browser Supabase calls into a local in-memory API. All other external browser traffic is blocked. It never signs into a real manager account or writes real picks. The production build may contain the public Supabase URL/key; these are intercepted by the test harness and are not used to contact production.

Coverage includes score precision/missing data, Sunday DST and grading boundaries, read-only pages, cron retries and write failures, idempotent seeding, saved-row confirmation, both themes at 320/390/768/1024/1440px, full-ballot completion, changed picks, reload persistence, offline and failed changes, member read retry, sign-out, lock-time reveal, keyboard menu dismissal, navigation, skip link and reduced motion.

Browser privacy tests simulate the existing RLS contract; they do not independently validate production database permissions. Layout tests use Chromium viewport emulation, not physical iOS/Android devices or a full screen-reader audit.

## Release checks

No deployment, schema migration, account provisioning or production vote changes are part of this local implementation.

1. Review the local product and diff, then deploy using the existing Vercel workflow when authorised.
2. Confirm `NEXT_PUBLIC_SLEEPER_LEAGUE_ID`, public Supabase settings, `SUPABASE_SECRET_KEY` and `CRON_SECRET` remain configured. No new secrets or schema fields are required.
3. Verify the daily 10:00 UTC cron is installed and inspect its response after deployment. Public page visits no longer seed ballots; the cron must successfully prepare the current week before members can vote.
4. Investigate HTTP 503 responses. The job retries unresolved weeks on later daily runs; it does not have an alerting integration or immediate automatic retries.
5. Spot-check one authorised member's sign-in and existing picks without changing them. Check real-device navigation and light/dark rendering.

## Remaining boundaries

- Finalization uses the 64-hour delay plus NFL week advancement and complete finite scores, not a dedicated NFL game-completion feed. Unusual postponements and later stat corrections still need commissioner review; final rows are intentionally not automatically regraded.
- Projection numbers are PPR estimates, not authoritative custom-league projections. Missing estimates are unavailable, not displayed as zero.
- Ordinary document navigation is retained because the current vinext production `next/link` handler fails when dynamically loading its navigation module. Soft transitions should wait for a verified framework fix; hover, press, panel and arrival feedback remain available with reduced-motion support.
- Dependency/security remediation and live RLS validation from the broader review are separate follow-up work. Do not treat fixture tests as a production security certification.
