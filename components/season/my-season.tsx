'use client';

import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
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
import { signInErrorMessage } from '@/lib/predictions/rules';
import { isCompleteForecast } from '@/lib/predictions/season-consensus';
import {
  againstTheRoom,
  compareForecast,
  type AwardVote,
  type FinalPickGame,
} from '@/lib/season/features';
import {
  acquisitionSummary,
  formGuide,
  leagueFaith,
  personalResults,
  pickAttendance,
} from '@/lib/season/my-season';
import { formatScore, rosterScore } from '@/lib/sleeper/scores';
import {
  formatRecord,
  gamesPlayed,
  getLuck,
  type TeamStanding,
} from '@/lib/data/standings';
import type { SeasonHubData } from '@/lib/data/season-hub';
import type { PredictionWeekData } from '@/lib/data/predictions';
import type { Rivalry } from '@/lib/data/rivalries';
import type { SleeperRoster } from '@/lib/sleeper/types';
import { CallsPanel } from './calls-panel';
import { FormGuide } from './form-guide';
import { LeagueFaith } from './league-faith';
import { PickupReturns } from './pickup-returns';
import { GateTicket, SeasonTicket } from './season-ticket';
import { SectionChips } from './section-chips';
import { TaleOfTape } from './tale-of-tape';
import { TradeScoreboard } from './trade-scoreboard';
import { TrophyCabinet } from './trophy-cabinet';
import { formatIrishTime } from '@/lib/format/irish-time';

/** `locked` is judged when the member data loads; a focus refresh updates it. */
type Game = FinalPickGame & { status: string; locked: boolean };
type Profile = { id: string; roster_id: number; display_name: string };
type Member = {
  status: 'loading' | 'signed-out' | 'ready' | 'error';
  id: string | null;
  profile: { display_name: string; roster_id: number } | null;
  votes: AwardVote[];
  games: Game[];
  finalVotes: AwardVote[];
  awardsReady: boolean;
  forecast: number[] | null;
  /** Everyone's picks on your games once each week locked. */
  roomVotes: AwardVote[];
  roomReady: boolean;
  bankers: { matchup_id: number; voter_id: string }[] | null;
  profiles: Profile[];
  timedOut?: boolean;
};
const empty = {
  id: null,
  profile: null,
  votes: [],
  games: [],
  finalVotes: [],
  awardsReady: true,
  forecast: null,
  roomVotes: [],
  roomReady: true,
  bankers: null,
  profiles: [],
};
/** Member reads must settle: a hung request becomes a visible Retry, never an endless load. */
const readLimit = 15000;
class TimedOut extends Error {}
function limit<T>(request: PromiseLike<T>, ms = readLimit) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new TimedOut()), ms);
    Promise.resolve(request).then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

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
  standings,
  rivalries,
}: {
  data: SeasonHubData;
  picks: PredictionWeekData | null;
  rosters: SleeperRoster[] | null;
  drafts: PersonalDraft[];
  standings: TeamStanding[] | null;
  rivalries: Record<number, Rivalry>;
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
      setMember((previous) =>
        id && previous.status === 'ready' && previous.id === id
          ? previous
          : { status: id ? 'loading' : 'signed-out', ...empty },
      );
      if (!client || !id) return;
      try {
        const [profile, forecast, votes, games] = await limit(
          Promise.all([
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
              .eq(
                'prediction_matchups.prediction_weeks.league_id',
                data.leagueId,
              )
              .eq('prediction_matchups.prediction_weeks.season', 2026),
            client
              .from('prediction_matchups')
              .select(
                'id,status,home_roster_id,away_roster_id,winner_roster_id,prediction_weeks!inner(week,locks_at,league_id,season)',
              )
              .eq('prediction_weeks.league_id', data.leagueId)
              .eq('prediction_weeks.season', 2026),
          ]),
        );
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
        const mapped: Game[] = (games.data ?? []).map((g) => {
          const week = g.prediction_weeks as unknown as {
            week: number;
            locks_at: string;
          };
          return {
            id: g.id,
            status: g.status,
            home: g.home_roster_id,
            away: g.away_roster_id,
            winner: g.winner_roster_id,
            week: week.week,
            locked: Date.parse(week.locks_at) <= Date.now(),
          };
        });
        const settled = mapped.filter(
          (g) =>
            g.status === 'final' &&
            g.week <= 14 &&
            data.completedWeeks.includes(g.week),
        );
        const finalVotes: AwardVote[] = [];
        let awardsReady = true;
        try {
          for (let i = 0; i < settled.length; i += 40) {
            const result = await limit(
              client
                .from('prediction_votes')
                .select('matchup_id,voter_id,selected_roster_id')
                .in(
                  'matchup_id',
                  settled.slice(i, i + 40).map((g) => g.id),
                ),
            );
            if (result.error) {
              awardsReady = false;
              finalVotes.length = 0;
              break;
            }
            finalVotes.push(...result.data);
          }
        } catch {
          awardsReady = false;
          finalVotes.length = 0;
        }
        // The league's picks on your games are readable once each week locks.
        // Failures here hide the room section only.
        const rosterId = profile.data.roster_id;
        const roomIds = mapped
          .filter(
            (g) => (g.home === rosterId || g.away === rosterId) && g.locked,
          )
          .map((g) => g.id);
        let roomVotes: AwardVote[] = [];
        let roomReady = true;
        let bankers: Member['bankers'] = null;
        let profiles: Profile[] = [];
        if (roomIds.length)
          try {
            const [room, banked, people] = await limit(
              Promise.all([
                client
                  .from('prediction_votes')
                  .select('matchup_id,voter_id,selected_roster_id')
                  .in('matchup_id', roomIds),
                client
                  .from('prediction_bankers')
                  .select('matchup_id,voter_id')
                  .in('matchup_id', roomIds),
                client.from('profiles').select('id,roster_id,display_name'),
              ]),
            );
            if (room.error) roomReady = false;
            else roomVotes = room.data;
            if (!banked.error) bankers = banked.data;
            if (!people.error) profiles = people.data;
          } catch {
            roomReady = false;
          }
        if (alive && version === request)
          setMember({
            status: 'ready',
            id,
            profile: profile.data,
            votes: votes.data ?? [],
            games: mapped,
            finalVotes,
            awardsReady,
            forecast: forecast.data?.rankings ?? null,
            roomVotes,
            roomReady,
            bankers,
            profiles,
          });
      } catch (error) {
        if (alive && version === request)
          setMember({
            status: 'error',
            ...empty,
            timedOut: error instanceof TimedOut,
          });
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
    void limit(client.auth.getSession())
      .then(({ data: session, error }) => {
        if (!alive || authEvent) return;
        if (error) {
          setMember({ status: 'error', ...empty });
          return;
        }
        void load(session.session?.user.id ?? null);
      })
      .catch((error: unknown) => {
        if (alive && !authEvent)
          setMember({
            status: 'error',
            ...empty,
            timedOut: error instanceof TimedOut,
          });
      });
    // Supabase advises dispatching other client calls from the auth callback
    // with a timer, so no read starts while the client is still handling the
    // event (a microtask can land inside it).
    const timers: number[] = [];
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        authEvent = true;
        timers.push(
          window.setTimeout(() => void load(session?.user.id ?? null), 0),
        );
      },
    );
    return () => {
      alive = false;
      version++;
      for (const timer of timers) window.clearTimeout(timer);
      listener.subscription.unsubscribe();
    };
  }, [client, data, reload]);
  useEffect(() => {
    if (member.status !== 'ready') return;
    let lastRefresh = 0;
    const refresh = () => {
      if (
        document.visibilityState !== 'visible' ||
        Date.now() - lastRefresh < 1000
      )
        return;
      lastRefresh = Date.now();
      setReload((value) => value + 1);
    };
    const restored = (event: PageTransitionEvent) => {
      if (event.persisted) refresh();
    };
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', restored);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', restored);
    };
  }, [member.status]);
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
      <p className="ui-kicker text-primary">Your MAC 12 · 2026</p>
      <h1 className="mt-2 font-heading text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
        My Season
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Your form, your pickups, your trades and what the league really thinks
        of you.
      </p>
    </header>
  );
  if (member.status === 'loading')
    return (
      <div className="space-y-5">
        {title}
        <output className="gate-ticket block" aria-live="polite">
          <span className="gate-ticket-band" aria-hidden="true">
            <span>Admit one</span>
            <span>MAC 12 · 2026</span>
          </span>
          <span className="block p-4 text-sm text-muted-foreground sm:p-5">
            Loading your season…
          </span>
        </output>
      </div>
    );
  if (member.status === 'error')
    return (
      <div className="space-y-5">
        {title}
        <GateTicket title="Ticket not recognised">
          <p role="alert" className="mt-2 text-sm">
            {member.timedOut
              ? 'Your season took too long to load. Please retry.'
              : 'Your member details could not be loaded. Please retry.'}
          </p>
          <Button
            className="mt-3 min-h-11"
            onClick={() => setReload((r) => r + 1)}
          >
            Retry
          </Button>
        </GateTicket>
      </div>
    );
  if (member.status === 'signed-out')
    return (
      <div className="space-y-5">
        {title}
        <div className="max-w-lg">
          <GateTicket>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Use your usual MAC 12 manager account to see your form, which
              pickups paid off and how the league rates you.
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
                    {
                      leagueMembers.find((m) => m.loginSlug === slug)
                        ?.displayName
                    }
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
          </GateTicket>
        </div>
      </div>
    );
  const id = member.profile!.roster_id;
  const standing = (rosterId: number) =>
    standings?.find((t) => t.rosterId === rosterId);
  const manager = (rosterId: number) =>
    data.managers.find((m) => m.rosterId === rosterId)?.name ??
    `Roster ${rosterId}`;
  const team = (rosterId: number) =>
    standing(rosterId)?.teamName ?? manager(rosterId);
  const player = (playerId: string) =>
    data.names[playerId] ?? `Player ${playerId}`;
  const roster = rosters?.find((r) => r.roster_id === id);
  const me = standing(id);
  const currentMatch = picks?.matchups.find(
    (m) => m.home.rosterId === id || m.away.rosterId === id,
  );
  const opponent = currentMatch
    ? currentMatch.home.rosterId === id
      ? currentMatch.away
      : currentMatch.home
    : null;
  const ownSide = currentMatch
    ? currentMatch.home.rosterId === id
      ? currentMatch.home
      : currentMatch.away
    : null;
  const saved = member.votes.filter((v) =>
    picks?.matchups.some((m) => m.databaseId === v.matchup_id),
  );
  const available = Boolean(
    picks && picks.availability === 'ready' && picks.databaseReady,
  );
  const finished = member.games.filter(
    (g) => g.status === 'final' && data.completedWeeks.includes(g.week),
  );
  const decisions = finished.filter((g) => g.winner !== null);
  const picked = (g: Game) =>
    member.votes.some(
      (v) => v.matchup_id === g.id && v.selected_roster_id === g.winner,
    );
  const correct = decisions.filter(picked).length;
  const submitted = decisions.filter((g) =>
    member.votes.some((v) => v.matchup_id === g.id),
  ).length;
  const weekly = [...new Set(finished.map((g) => g.week))]
    .sort((a, b) => b - a)
    .map((week) => {
      const games = decisions.filter((g) => g.week === week);
      return {
        week,
        correct: games.filter(picked).length,
        games: games.length,
      };
    });
  const adds =
    data.activity?.acquisitions?.filter((a) => a.rosterId === id) ?? null;
  const summary = adds ? acquisitionSummary(adds) : null;
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
  const scheduleIncomplete = data.awards.some(
    (w) => !w.result || !w.result.waiverReady,
  );
  const awardsPartial = !member.awardsReady || scheduleIncomplete;
  const awardCount =
    new Set(honours.map((a) => `${a.week}:${a.kind}`)).size +
    new Set(minority.map((a) => a.week)).size;
  const results = personalResults(
    data.activity?.weeks ?? [],
    id,
    data.completedWeeks,
  );
  const tiles = formGuide(results, data.completedWeeks);
  const bestWeek = [...results.games].sort((a, b) => b.points - a.points)[0];
  const lowestWeek = [...results.games].sort((a, b) => a.points - b.points)[0];
  const luck = me ? getLuck(me) : null;
  const room = leagueFaith(
    member.games
      .filter((g) => g.locked)
      .map((g) => ({
        ...g,
        settled: g.status === 'final' && data.completedWeeks.includes(g.week),
      })),
    member.roomVotes,
    id,
    member.id!,
    member.bankers,
  );
  const profileTeam = (voterId: string) => {
    const profile = member.profiles.find((p) => p.id === voterId);
    if (!profile) return null;
    return {
      teamName: team(profile.roster_id),
      ownerName: standing(profile.roster_id)?.ownerName ?? profile.display_name,
    };
  };
  const attendance = pickAttendance(member.games, member.votes);
  const table =
    standings && standings.length === 12
      ? [...standings].sort((a, b) => a.rank - b.rank).map((t) => t.rosterId)
      : null;
  const tableWeek = standings?.length
    ? Math.max(...standings.map(gamesPlayed))
    : 0;
  const ballot =
    member.forecast && table && tableWeek
      ? compareForecast(member.forecast, table)
      : null;
  const draft = drafts.find((d) => d.rosterId === id);
  const date = (value: number) => formatIrishTime(value);
  const tapeSide = (side: NonNullable<typeof opponent>) => {
    const row = standing(side.rosterId);
    return {
      teamName: row?.teamName ?? side.teamName,
      ownerName: row?.ownerName ?? side.ownerName,
      avatar: row?.avatar ?? side.avatar,
      record: formatRecord(row ?? side),
      pointsFor: row?.pointsFor ?? null,
      form: row?.form ?? [],
    };
  };
  const winShare = (r: { wins: number; losses: number; ties: number }) =>
    (r.wins + r.ties / 2) / Math.max(1, r.wins + r.losses + r.ties);
  const rivalry = currentMatch
    ? rivalries[currentMatch.sleeperMatchupId]
    : null;
  const home = currentMatch?.home.rosterId === id;
  const thisWeekRoom = currentMatch
    ? room.weeks.find((w) => w.matchupId === currentMatch.databaseId)
    : undefined;
  const sections = [
    opponent && ['my-week', 'This week'],
    ['my-log', 'Form'],
    room.total > 0 || !member.roomReady ? ['my-faith', 'The room'] : null,
    ['my-waivers', 'Waivers'],
    ['my-trades', 'Trades'],
    ['my-awards', 'Trophies'],
    ['my-predictions', 'Calls'],
  ]
    .filter((item): item is string[] => Array.isArray(item))
    .map(([sectionId, label]) => ({ id: sectionId, label }));
  return (
    <div className="space-y-5">
      {title}
      <div>
        <SeasonTicket
          team={{
            teamName: me?.teamName ?? manager(id),
            ownerName: me?.ownerName ?? member.profile!.display_name,
            avatar: me?.avatar ?? null,
          }}
          record={roster ? roster.settings : null}
          points={
            roster
              ? formatScore(
                  rosterScore(
                    roster.settings.fpts,
                    roster.settings.fpts_decimal,
                  ),
                )
              : '—'
          }
          calls={correct}
          awards={`${awardCount}${awardsPartial ? '+' : ''}`}
          stub={
            picks
              ? {
                  week: picks.week,
                  saved: saved.length,
                  total: picks.matchups.length,
                  available,
                  locked,
                  lockAt: picks.lockAt,
                }
              : null
          }
        />
        <p className="mt-2 flex flex-wrap gap-x-4 px-1">
          <a href="/my-season" className="season-link">
            Refresh all results
          </a>
          <a
            href="https://sleeper.com/leagues/1389706813993160704"
            className="season-link"
          >
            Manage team in Sleeper ↗
          </a>
        </p>
      </div>
      <SectionChips items={sections} />
      {picks && opponent && ownSide && (
        <TaleOfTape
          week={picks.week}
          finalized={picks.finalized}
          me={tapeSide(ownSide)}
          them={tapeSide(opponent)}
          recordEdge={
            winShare(standing(id) ?? ownSide) -
            winShare(standing(opponent.rosterId) ?? opponent)
          }
          href={`/matchups?week=${picks.week}#matchup-${currentMatch!.sleeperMatchupId}`}
          rivalry={
            rivalry
              ? {
                  meetings: rivalry.meetings,
                  mine: home ? rivalry.homeWins : rivalry.awayWins,
                  theirs: home ? rivalry.awayWins : rivalry.homeWins,
                  ties: rivalry.ties,
                  last: rivalry.last && {
                    season: rivalry.last.season,
                    week: rivalry.last.week,
                    mine: home
                      ? rivalry.last.homePoints
                      : rivalry.last.awayPoints,
                    theirs: home
                      ? rivalry.last.awayPoints
                      : rivalry.last.homePoints,
                  },
                  scope: rivalry.scope,
                  partial: rivalry.partial,
                }
              : null
          }
          room={thisWeekRoom ?? null}
        />
      )}
      <FormGuide
        tiles={tiles}
        name={team}
        best={bestWeek?.week ?? null}
        lowest={
          lowestWeek && lowestWeek.week !== bestWeek?.week
            ? lowestWeek.week
            : null
        }
        luck={
          me && luck !== null && me.allPlay
            ? {
                value: luck,
                allPlay: formatRecord(me.allPlay),
                record: formatRecord(me),
              }
            : null
        }
      />
      <LeagueFaith
        room={room}
        ready={member.roomReady}
        voter={profileTeam}
        team={team}
      />
      <PickupReturns
        adds={adds}
        summary={summary}
        rostered={(playerId) =>
          roster ? Boolean(roster.players?.includes(playerId)) : null
        }
        player={player}
        date={date}
      />
      <TradeScoreboard
        trades={trades}
        ready={data.transactionReady}
        rosterId={id}
        team={team}
        player={player}
        date={date}
      />
      <TrophyCabinet
        honours={honours}
        minority={minority}
        count={awardCount}
        partial={awardsPartial}
        scheduleIncomplete={scheduleIncomplete}
        roomUnavailable={!member.awardsReady}
        team={team}
        player={player}
      />
      <CallsPanel
        correct={correct}
        decided={decisions.length}
        submitted={submitted}
        weekly={weekly}
        attendance={attendance}
        forecast={member.forecast}
        ballot={ballot}
        tableWeek={tableWeek || null}
        rosterId={id}
        team={team}
        draft={draft}
      />
    </div>
  );
}
