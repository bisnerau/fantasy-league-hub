'use client';

import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import { leagueMembers, memberLoginEmail } from '@/lib/data/member-directory';
import { formatLockTime, signInErrorMessage } from '@/lib/predictions/rules';
import { isCompleteForecast } from '@/lib/predictions/season-consensus';
import {
  againstTheRoom,
  awardNames,
  type AwardVote,
  type FinalPickGame,
} from '@/lib/season/features';
import { acquisitionSummary } from '@/lib/season/my-season';
import { matchupScore, formatScore, rosterScore } from '@/lib/sleeper/scores';
import type { SeasonHubData } from '@/lib/data/season-hub';
import type { PredictionWeekData } from '@/lib/data/predictions';
import type { SleeperRoster } from '@/lib/sleeper/types';

type Game = FinalPickGame & { status: string };
type Member = {
  status: 'loading' | 'signed-out' | 'ready' | 'error';
  id: string | null;
  profile: { display_name: string; roster_id: number } | null;
  votes: AwardVote[];
  games: Game[];
  finalVotes: AwardVote[];
  forecast: number[] | null;
};
const empty = {
  id: null,
  profile: null,
  votes: [],
  games: [],
  finalVotes: [],
  forecast: null,
};
export type PersonalDraft = {
  rosterId: number;
  grade: string;
  gradeScore: number;
  predictedFinish: number;
  headline: string;
};
export function MySeason({
  data,
  picks,
  rosters,
  drafts,
}: {
  data: SeasonHubData;
  picks: PredictionWeekData | null;
  rosters: SleeperRoster[] | null;
  drafts: PersonalDraft[];
}) {
  const client = useMemo(() => getBrowserSupabaseClient(), []);
  const [member, setMember] = useState<Member>({ status: 'loading', ...empty });
  const [reload, setReload] = useState(0);
  const [slug, setSlug] = useState(leagueMembers[0].loginSlug);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [locked, setLocked] = useState(picks?.locked ?? true);
  useEffect(() => {
    if (!picks) return;
    const tick = () =>
      setLocked(picks.locked || Date.now() >= new Date(picks.lockAt).getTime());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, [picks]);
  useEffect(() => {
    let alive = true,
      version = 0,
      lastId: string | undefined,
      authEvent = false;
    async function load(id: string | null) {
      if (!alive || id === lastId) return;
      lastId = id ?? undefined;
      const request = ++version;
      setMember({ status: id ? 'loading' : 'signed-out', ...empty });
      if (!client || !id) return;
      try {
        const [profile, forecast, votes, games] = await Promise.all([
          client
            .from('profiles')
            .select('display_name,roster_id')
            .eq('id', id)
            .single(),
          client
            .from('season_forecasts')
            .select('rankings')
            .eq('voter_id', id)
            .eq('league_id', data.leagueId)
            .eq('season', 2026)
            .maybeSingle(),
          client
            .from('prediction_votes')
            .select(
              'matchup_id,voter_id,selected_roster_id,prediction_matchups!inner(prediction_weeks!inner(league_id,season))',
            )
            .eq('voter_id', id)
            .eq('prediction_matchups.prediction_weeks.league_id', data.leagueId)
            .eq('prediction_matchups.prediction_weeks.season', 2026),
          client
            .from('prediction_matchups')
            .select(
              'id,status,home_roster_id,away_roster_id,winner_roster_id,prediction_weeks!inner(week,league_id,season)',
            )
            .eq('prediction_weeks.league_id', data.leagueId)
            .eq('prediction_weeks.season', 2026),
        ]);
        if (
          profile.error ||
          forecast.error ||
          votes.error ||
          games.error ||
          !profile.data ||
          !data.managers.some((m) => m.rosterId === profile.data.roster_id)
        )
          throw Error('Member data unavailable');
        if (
          forecast.data &&
          !isCompleteForecast(
            forecast.data.rankings,
            data.managers.map((m) => m.rosterId),
          )
        )
          throw Error('Forecast unavailable');
        const mapped: Game[] = (games.data ?? []).map((g) => ({
          id: g.id,
          status: g.status,
          home: g.home_roster_id,
          away: g.away_roster_id,
          winner: g.winner_roster_id,
          week: (g.prediction_weeks as unknown as { week: number }).week,
        }));
        const settled = mapped.filter(
          (g) =>
            g.status === 'final' &&
            g.week <= 14 &&
            data.completedWeeks.includes(g.week),
        );
        const finalVotes: AwardVote[] = [];
        for (let i = 0; i < settled.length; i += 40) {
          const result = await client
            .from('prediction_votes')
            .select('matchup_id,voter_id,selected_roster_id')
            .in(
              'matchup_id',
              settled.slice(i, i + 40).map((g) => g.id),
            );
          if (result.error) throw Error('Awards unavailable');
          finalVotes.push(...result.data);
        }
        if (alive && version === request)
          setMember({
            status: 'ready',
            id,
            profile: profile.data,
            votes: votes.data ?? [],
            games: mapped,
            finalVotes,
            forecast: forecast.data?.rankings ?? null,
          });
      } catch {
        if (alive && version === request)
          setMember({ status: 'error', ...empty });
      }
    }
    if (!client) {
      void Promise.resolve().then(() => {
        if (alive) setMember({ status: 'signed-out', ...empty });
      });
      return () => {
        alive = false;
      };
    }
    void client.auth
      .getSession()
      .then(({ data: session, error }) => {
        if (!alive || authEvent) return;
        if (error) {
          setMember({ status: 'error', ...empty });
          return;
        }
        void load(session.session?.user.id ?? null);
      })
      .catch(() => {
        if (alive && !authEvent) setMember({ status: 'error', ...empty });
      });
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        authEvent = true;
        void Promise.resolve().then(() => load(session?.user.id ?? null));
      },
    );
    return () => {
      alive = false;
      version++;
      listener.subscription.unsubscribe();
    };
  }, [client, data, reload]);
  async function signIn(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true);
    setLoginError('');
    try {
      const result = await client.auth.signInWithPassword({
        email: memberLoginEmail(slug),
        password,
      });
      if (result.error)
        setLoginError(signInErrorMessage(result.error, navigator.onLine));
      else setPassword('');
    } catch {
      setLoginError(signInErrorMessage({}, navigator.onLine));
    } finally {
      setBusy(false);
    }
  }
  const title = (
    <header>
      <p className="ui-kicker">Your MAC 12 · 2026</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">My Season</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your picks, pickups, trades and the receipts that follow them.
      </p>
    </header>
  );
  if (member.status === 'loading')
    return (
      <div className="space-y-4">
        {title}
        <output className="linear-panel block rounded-xl p-4 text-sm">
          Loading your season…
        </output>
      </div>
    );
  if (member.status === 'error')
    return (
      <div className="space-y-4">
        {title}
        <section className="linear-panel rounded-xl p-4">
          <p role="alert" className="text-sm">
            Your member details could not be loaded. Please retry.
          </p>
          <Button className="mt-3" onClick={() => setReload((r) => r + 1)}>
            Retry
          </Button>
        </section>
      </div>
    );
  if (member.status === 'signed-out')
    return (
      <div className="space-y-4">
        {title}
        <section className="linear-panel max-w-lg rounded-xl p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Sign in to your season</h2>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Use your usual MAC 12 manager account. See which pickups paid off,
            your weekly calls and the progress of your team.
          </p>
          <form className="mt-4 space-y-3" onSubmit={signIn}>
            <label
              htmlFor="my-season-manager"
              className="block text-xs font-medium"
            >
              Manager
            </label>
            <Select
              value={slug}
              onValueChange={(value) => {
                if (value) setSlug(value);
              }}
            >
              <SelectTrigger
                id="my-season-manager"
                className="w-full"
                disabled={busy}
              >
                <SelectValue>
                  {leagueMembers.find((m) => m.loginSlug === slug)?.displayName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {leagueMembers.map((m) => (
                  <SelectItem key={m.loginSlug} value={m.loginSlug}>
                    {m.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label
              htmlFor="my-season-password"
              className="block text-xs font-medium"
            >
              Password
            </label>
            <Input
              id="my-season-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              required
            />
            {loginError && (
              <p role="alert" className="text-xs text-destructive">
                {loginError}
              </p>
            )}
            <Button
              type="submit"
              className="min-h-11 w-full"
              disabled={busy || !client}
            >
              {busy ? 'Signing in…' : 'Open My Season'}
            </Button>
          </form>
        </section>
      </div>
    );
  const id = member.profile!.roster_id;
  const name = (rosterId: number) =>
    data.managers.find((m) => m.rosterId === rosterId)?.name ??
    `Roster ${rosterId}`;
  const player = (playerId: string) =>
    data.names[playerId] ?? `Player ${playerId}`;
  const roster = rosters?.find((r) => r.roster_id === id);
  const currentMatch = picks?.matchups.find(
    (m) => m.home.rosterId === id || m.away.rosterId === id,
  );
  const opponent = currentMatch
    ? currentMatch.home.rosterId === id
      ? currentMatch.away
      : currentMatch.home
    : null;
  const saved = member.votes.filter((v) =>
    picks?.matchups.some((m) => m.databaseId === v.matchup_id),
  );
  const available = picks?.availability === 'ready' && picks.databaseReady;
  const finished = member.games.filter(
    (g) => g.status === 'final' && data.completedWeeks.includes(g.week),
  );
  const decisions = finished.filter((g) => g.winner !== null);
  const correct = decisions.filter((g) =>
    member.votes.some(
      (v) => v.matchup_id === g.id && v.selected_roster_id === g.winner,
    ),
  ).length;
  const submitted = decisions.filter((g) =>
    member.votes.some((v) => v.matchup_id === g.id),
  ).length;
  const adds =
    data.activity?.acquisitions?.filter((a) => a.rosterId === id) ?? null;
  const summary = adds ? acquisitionSummary(adds) : null;
  const best = adds
    ?.filter((a) => a.points !== null && a.points > 0)
    .sort((a, b) => b.points! - a.points!)[0];
  const trades = data.receipts.filter((r) => r.trade.roster_ids.includes(id));
  const honours = data.awards.flatMap(
    (w) =>
      w.result?.awards
        .filter((a) => a.rosterId === id)
        .map((a) => ({ ...a, week: w.week })) ?? [],
  );
  const minority = againstTheRoom(
    finished.filter((g) => g.week <= 14),
    member.finalVotes,
  ).filter((c) => c.voterId === member.id);
  const awardCount =
    new Set(honours.map((a) => `${a.week}:${a.kind}`)).size +
    new Set(minority.map((a) => a.week)).size;
  const logs = (data.activity?.weeks ?? []).flatMap((w) => {
    const own = w.rows.find((r) => r.roster_id === id);
    if (!own || matchupScore(own) === null) return [];
    const other =
      own.matchup_id === null
        ? undefined
        : w.rows.find(
            (r) => r.matchup_id === own.matchup_id && r.roster_id !== id,
          );
    return [
      {
        week: w.week,
        points: matchupScore(own)!,
        opponent: other?.roster_id ?? null,
        against: other ? matchupScore(other) : null,
      },
    ];
  });
  const bestWeek = [...logs].sort((a, b) => b.points - a.points)[0];
  const worstWeek = [...logs].sort((a, b) => a.points - b.points)[0];
  const draft = drafts.find((d) => d.rosterId === id);
  const date = (value: number) =>
    new Intl.DateTimeFormat('en-IE', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Europe/Dublin',
    }).format(new Date(value));
  return (
    <div className="space-y-4 sm:space-y-5">
      {title}
      <section className="linear-panel rounded-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {member.profile!.display_name}
          </h2>
          <a
            href="https://sleeper.com/leagues/1389706813993160704"
            className="text-xs font-semibold text-primary"
          >
            Manage team in Sleeper ↗
          </a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: 'League record',
              value: roster
                ? `${roster.settings.wins}–${roster.settings.losses}–${roster.settings.ties}`
                : 'Unavailable',
            },
            {
              label: 'Points scored',
              value: roster
                ? formatScore(
                    rosterScore(
                      roster.settings.fpts,
                      roster.settings.fpts_decimal,
                    ),
                  )
                : 'Unavailable',
            },
            { label: 'Prediction points', value: `${correct}` },
            { label: 'Weekly awards', value: `${awardCount}` },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 p-3"
            >
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-mono text-lg font-semibold">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Record is W–L–T. Prediction points and awards use settled results;
          league totals come from Sleeper.
        </p>
      </section>
      <section className="linear-panel rounded-xl border-primary/20 p-4 sm:p-5">
        <p className="ui-kicker">Your next action</p>
        <h2 className="mt-2 text-lg font-semibold">
          Weekly picks {picks ? `· Week ${picks.week}` : ''}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {available
            ? `${saved.length} of ${picks!.matchups.length} picks saved${locked ? ' · locked' : ''}.`
            : 'The weekly ballot is not available right now.'}
        </p>
        {picks && (
          <p className="mt-2 text-xs text-muted-foreground">
            {locked ? 'Closed' : 'Deadline'}: {formatLockTime(picks.lockAt)}
          </p>
        )}
        <a
          href="/matchups"
          className="mt-3 flex min-h-11 items-center justify-between rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {!available
            ? 'Open Weekly picks'
            : locked
              ? 'View the picks'
              : saved.length === picks!.matchups.length
                ? 'Review your picks'
                : 'Finish your picks'}
          <ArrowRight className="size-4" />
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          {opponent
            ? `${picks?.finalized ? 'Last matchup' : 'This week’s opponent'}: ${opponent.ownerName} · ${opponent.teamName}.`
            : 'Your current opponent will appear when the matchup is confirmed.'}
        </p>
      </section>
      <nav
        aria-label="My Season sections"
        className="flex flex-wrap gap-2 text-xs font-semibold text-primary"
      >
        {[
          ['Waiver wire', '#my-waivers'],
          ['Trades', '#my-trades'],
          ['Awards', '#my-awards'],
          ['Season log', '#my-log'],
          ['Predictions', '#my-predictions'],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="min-h-11 rounded-lg border border-primary/20 px-3 py-3"
          >
            {label}
          </a>
        ))}
      </nav>
      <section
        id="my-waivers"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">
          Your waiver wire · did the pickups pay?
        </h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Completed waiver and free-agent additions, with the fantasy points
          actually used in your starting lineup.
        </p>
        {!summary ? (
          <p className="mt-3 text-sm text-amber-200">
            Transaction history is incomplete. Pickup returns are unavailable.
          </p>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Players added', value: summary.additions },
                { label: 'Points used', value: formatScore(summary.points) },
                { label: 'Starts recorded', value: summary.starts },
                {
                  label: 'FAAB on successful claims',
                  value: summary.faab ?? 'Unknown',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-white/10 p-3"
                >
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-mono text-lg">{s.value}</p>
                </div>
              ))}
            </div>
            {best && (
              <p className="mt-3 text-sm">
                Top verified pickup: <strong>{player(best.playerId)}</strong> ·{' '}
                {best.points!.toFixed(2)} points used.
              </p>
            )}
            {adds!.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                No completed pickups yet. Your first addition will start the
                receipt book.
              </p>
            )}
            {adds!.map((a) => (
              <details
                key={a.id}
                className="mt-3 rounded-lg border border-white/10 p-3"
              >
                <summary className="cursor-pointer text-sm font-semibold">
                  {player(a.playerId)}
                  <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
                    {date(a.acquired)} ·{' '}
                    {a.type === 'waiver'
                      ? `Waiver · ${a.faab === null ? 'FAAB unknown' : `${a.faab} FAAB`}`
                      : 'Free agent'}{' '}
                    ·{' '}
                    {a.evidence?.length
                      ? `${formatScore(a.points)} points used`
                      : 'Waiting for settled weeks'}{' '}
                    ·{' '}
                    {roster?.players?.includes(a.playerId)
                      ? 'On your roster'
                      : roster
                        ? 'Off your roster'
                        : 'Roster status unavailable'}
                  </span>
                </summary>
                <p className="mt-3 text-xs text-muted-foreground">
                  {a.starts} starts recorded for this acquisition.
                  {a.drops.length
                    ? ` Released: ${a.drops.map(player).join(', ')}.`
                    : ''}
                  {a.exited
                    ? ' This ownership spell ended; later points are excluded.'
                    : ''}
                </p>
                {a.evidence === null ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Acquisition timing or ownership history could not be
                    verified.
                  </p>
                ) : a.evidence.length ? (
                  <ul className="mt-3 space-y-2 text-xs">
                    {a.evidence.map((e) => (
                      <li key={e.week}>
                        Week {e.week} ·{' '}
                        {e.excluded
                          ? 'Excluded: moved on'
                          : e.points === null
                            ? 'Points unavailable'
                            : e.started
                              ? `${e.points.toFixed(2)} starter points`
                              : 'Not started · 0 points used'}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </details>
            ))}
          </>
        )}
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-semibold text-primary">
            How pickup returns are measured
          </summary>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            Settled scoring weeks only. The acquisition week counts if Sleeper
            records the player in your starting lineup; later bench weeks
            contribute zero used points. Exclude any departure week, then stop
            counting that ownership spell. Re-additions have separate receipts.
            Missing timing, ownership or score data stays unavailable, not zero.
            Starts are recorded starts, not proof of a good decision at the
            time. A player may have been injured or on bye; no cause is inferred
            from a zero. FAAB counts completed waiver claims once per
            transaction, not failed bids or FAAB sent in trades.
          </p>
        </details>
      </section>
      <section
        id="my-trades"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Your trades</h2>
        {!data.transactionReady && (
          <p className="mt-3 text-xs text-amber-200">
            Transaction history is incomplete; this list may be partial.
          </p>
        )}
        {!trades.length && data.transactionReady && (
          <p className="mt-3 text-sm text-muted-foreground">
            No completed 2026 trades yet. A peaceful start for the negotiations
            department.
          </p>
        )}
        {trades.map(({ trade, review }) => (
          <a
            key={trade.transaction_id}
            href={`/season-hub#trade-${trade.transaction_id}`}
            className="mt-3 block rounded-lg border border-white/10 p-3 hover:border-primary/40"
          >
            <p className="text-sm font-semibold">
              {trade.roster_ids
                .filter((r) => r !== id)
                .map(name)
                .join(' / ')}{' '}
              · {date(trade.status_updated ?? trade.created)}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Received:{' '}
              {Object.entries(trade.adds ?? {})
                .filter(([, owner]) => owner === id)
                .map(([playerId]) => player(playerId))
                .join(', ') || 'See picks / FAAB in receipt'}
              .
            </p>
            <p className="mt-2 text-xs text-primary">
              {review?.initialReady
                ? 'First three-week review ready'
                : review
                  ? `${review.weeks.length} full scoring weeks settled`
                  : 'Review waiting for verified history'}{' '}
              · Open trade receipt →
            </p>
          </a>
        ))}
      </section>
      <section
        id="my-awards"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Your trophy cabinet</h2>
        {!awardCount && (
          <p className="mt-3 text-sm text-muted-foreground">
            No settled awards yet. The season has plenty of opportunities to
            provide evidence.
          </p>
        )}
        {honours.map((a) => (
          <article
            key={`${a.week}:${a.kind}:${a.playerId ?? ''}`}
            className="mt-3 rounded-lg border border-primary/20 p-3"
          >
            <h3 className="text-sm font-semibold">
              Week {a.week} · {awardNames[a.kind]}
            </h3>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              {a.playerId ? `${player(a.playerId)}. ` : ''}
              {a.detail}
            </p>
          </article>
        ))}
        {minority.map((a) => (
          <p
            key={`${a.week}:${a.winner}`}
            className="mt-3 rounded-lg border border-primary/20 p-3 text-xs"
          >
            Week {a.week} · Against the Room: backed {name(a.winner)}, with{' '}
            {a.backers} of {a.voters} voters.
          </p>
        ))}
        <a
          href="/season-hub#weekly-awards"
          className="mt-3 inline-block text-xs text-primary underline"
        >
          All awards and rules
        </a>
      </section>
      <section
        id="my-log"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Your season log</h2>
        {!logs.length ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Settled matchup results will appear here after Week 1.
          </p>
        ) : (
          <>
            {bestWeek && (
              <p className="mt-3 text-xs text-muted-foreground">
                Best recorded week: {bestWeek.week} ·{' '}
                {bestWeek.points.toFixed(2)} points. Lowest: Week{' '}
                {worstWeek.week} · {worstWeek.points.toFixed(2)}.
              </p>
            )}
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-primary">
                Every completed matchup
              </summary>
              <ul className="mt-3 space-y-2 text-xs">
                {[...logs].reverse().map((g) => (
                  <li
                    key={g.week}
                    className="rounded-lg border border-white/10 p-3"
                  >
                    Week {g.week} ·{' '}
                    {g.opponent ? name(g.opponent) : 'No paired opponent'} ·{' '}
                    {g.points.toFixed(2)}
                    {g.against !== null
                      ? `–${g.against.toFixed(2)} · ${g.points > g.against ? 'Win' : g.points < g.against ? 'Loss' : 'Tie'}`
                      : ''}
                  </li>
                ))}
              </ul>
            </details>
          </>
        )}
        {logs.length < data.completedWeeks.length && (
          <p className="mt-3 text-xs text-amber-200">
            Some historical scores are unavailable. Best and lowest weeks use
            the available results only.
          </p>
        )}
      </section>
      <section
        id="my-predictions"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">
          Your calls and preseason receipts
        </h2>
        <p className="mt-3 text-sm">
          {correct} correct winners from {decisions.length} settled, decisive
          matchups.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {submitted} submitted · {decisions.length - submitted} missed ·{' '}
          {decisions.length
            ? `${((100 * correct) / decisions.length).toFixed(1)}%`
            : 'No settled accuracy yet'}
          . Missed picks count against accuracy; tied matchups are excluded.
        </p>
        {!!finished.length && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-primary">
              Weekly prediction results
            </summary>
            <ul className="mt-3 space-y-2 text-xs">
              {[...new Set(finished.map((g) => g.week))]
                .sort((a, b) => b - a)
                .map((week) => {
                  const games = decisions.filter((g) => g.week === week);
                  const wins = games.filter((g) =>
                    member.votes.some(
                      (v) =>
                        v.matchup_id === g.id &&
                        v.selected_roster_id === g.winner,
                    ),
                  ).length;
                  return (
                    <li key={week}>
                      Week {week} · {wins} of {games.length} correct winners
                    </li>
                  );
                })}
            </ul>
          </details>
        )}
        {member.forecast ? (
          <details className="mt-4 rounded-lg border border-white/10 p-3">
            <summary className="cursor-pointer text-sm font-semibold">
              Your submitted final table
            </summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs">
              {member.forecast.map((r) => (
                <li key={r}>
                  {name(r)}
                  {r === id ? ' (you)' : ''}
                </li>
              ))}
            </ol>
          </details>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            You have not submitted a final-table prediction.
          </p>
        )}
        <a
          href="/draft-recap"
          className="mt-3 inline-block text-xs text-primary underline"
        >
          Open season predictions
        </a>
        <a
          href="/season-hub#prediction-reviews"
          className="ml-4 mt-3 inline-block text-xs text-primary underline"
        >
          Halfway and final reviews
        </a>
        {draft && (
          <a
            href={`/draft-recap#roster-${id}`}
            className="mt-4 block rounded-lg border border-primary/20 p-3"
          >
            <p className="ui-kicker">The preseason verdict</p>
            <p className="mt-2 text-sm font-semibold">
              {draft.grade} · {draft.gradeScore}/100 · predicted #
              {draft.predictedFinish}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {draft.headline}
            </p>
            <span className="mt-2 block text-xs text-primary">
              Full report, draft personality and schedule →
            </span>
          </a>
        )}
      </section>
    </div>
  );
}
