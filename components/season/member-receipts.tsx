'use client';
import { useEffect, useMemo, useState } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import {
  againstTheRoom,
  compareForecast,
  type AwardVote,
  type FinalPickGame,
} from '@/lib/season/features';
import type { SeasonHubData } from '@/lib/data/season-hub';

type Profile = { id: string; display_name: string; roster_id: number | null };
type Forecast = { voter_id: string; rankings: number[] };
type MemberData = {
  status: 'loading' | 'signed-out' | 'ready' | 'error';
  profiles: Profile[];
  forecasts: Forecast[];
  votes: AwardVote[];
  games: FinalPickGame[];
};
const empty = { profiles: [], forecasts: [], votes: [], games: [] };
export function MemberReceipts({ data }: { data: SeasonHubData }) {
  const client = useMemo(() => getBrowserSupabaseClient(), []);
  const [member, setMember] = useState<MemberData>({
    status: 'loading',
    ...empty,
  });
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let alive = true,
      version = 0,
      lastId: string | undefined;
    let authEvent = false;
    async function load(id: string | null) {
      if (!alive || id === lastId) return;
      lastId = id ?? undefined;
      const request = ++version;
      setMember({ status: id ? 'loading' : 'signed-out', ...empty });
      if (!id || !client) return;
      try {
        const [profiles, forecasts, games] = await Promise.all([
          client.from('profiles').select('id,display_name,roster_id'),
          data.half || data.final
            ? client
                .from('season_forecasts')
                .select('voter_id,rankings')
                .eq('league_id', data.leagueId)
                .eq('season', 2026)
            : Promise.resolve({ data: [], error: null }),
          data.completedWeeks.length
            ? client
                .from('prediction_matchups')
                .select(
                  'id,home_roster_id,away_roster_id,winner_roster_id,prediction_weeks!inner(week,league_id,season)',
                )
                .eq('status', 'final')
                .eq('prediction_weeks.league_id', data.leagueId)
                .eq('prediction_weeks.season', 2026)
                .lte(
                  'prediction_weeks.week',
                  Math.min(14, Math.max(...data.completedWeeks)),
                )
            : Promise.resolve({ data: [], error: null }),
        ]);
        if (
          profiles.error ||
          forecasts.error ||
          games.error ||
          !profiles.data?.some((p) => p.id === id)
        )
          throw Error('Member data unavailable');
        const mapped: FinalPickGame[] = (games.data ?? []).map((g) => {
          const parent = g.prediction_weeks as unknown as { week: number };
          return {
            id: g.id,
            home: g.home_roster_id,
            away: g.away_roster_id,
            winner: g.winner_roster_id,
            week: parent.week,
          };
        });
        const votes: AwardVote[] = [];
        for (let i = 0; i < mapped.length; i += 40) {
          const result = await client
            .from('prediction_votes')
            .select('matchup_id,voter_id,selected_roster_id')
            .in(
              'matchup_id',
              mapped.slice(i, i + 40).map((g) => g.id),
            );
          if (result.error) throw Error('Votes unavailable');
          votes.push(...result.data);
        }
        if (alive && version === request)
          setMember({
            status: 'ready',
            profiles: profiles.data,
            forecasts: forecasts.data ?? [],
            games: mapped,
            votes,
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
  const name = (id: number) =>
    data.managers.find((m) => m.rosterId === id)?.name ?? `Roster ${id}`;
  const calls = againstTheRoom(member.games, member.votes);
  const trophies = [...new Set(calls.map((c) => `${c.week}:${c.voterId}`))];
  const leaders = member.profiles
    .map((p) => ({
      ...p,
      count: trophies.filter((t) => t.endsWith(`:${p.id}`)).length,
    }))
    .filter((p) => p.count)
    .sort(
      (a, b) =>
        b.count - a.count || a.display_name.localeCompare(b.display_name),
    );
  const memberMessage =
    member.status === 'loading'
      ? 'Loading member results…'
      : member.status === 'error'
        ? 'Member results are unavailable. Please retry.'
        : 'Sign in through Weekly picks to view the members’ awards and prediction reviews.';
  return (
    <>
      <section
        id="against-the-room"
        className="linear-panel rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Against the Room</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Back a winning team that fewer than half the voters picked. At least
          six managers must vote on that matchup. One trophy per manager per
          week; every qualifying call stays in the receipts.
        </p>
        {member.status !== 'ready' ? (
          <p className="mt-3 text-sm">
            {memberMessage}{' '}
            {member.status === 'signed-out' && (
              <a className="text-primary underline" href="/matchups">
                Sign in
              </a>
            )}
            {member.status === 'error' && (
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setReload((r) => r + 1)}
              >
                Retry
              </button>
            )}
          </p>
        ) : (
          <>
            {!calls.length ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {data.completedWeeks.length
                  ? 'No qualifying calls in the settled prediction results yet.'
                  : 'Waiting for the first settled weekly picks.'}
              </p>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap gap-3">
                  {leaders.map((p) => (
                    <p
                      key={p.id}
                      className="rounded-lg border border-primary/20 px-3 py-2 text-xs"
                    >
                      {p.display_name} · {p.count}{' '}
                      {p.count === 1 ? 'award' : 'awards'}
                    </p>
                  ))}
                </div>
                {[...new Set(calls.map((c) => c.week))]
                  .sort((a, b) => b - a)
                  .map((week) => (
                    <details
                      key={week}
                      className="mt-3 rounded-lg border border-white/10 p-3"
                    >
                      <summary className="cursor-pointer text-sm font-medium">
                        Week {week} · the minority had a point
                      </summary>
                      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                        {calls
                          .filter((c) => c.week === week)
                          .map((c) => (
                            <li key={`${c.voterId}:${c.winner}`}>
                              {member.profiles.find((p) => p.id === c.voterId)
                                ?.display_name ?? 'League member'}{' '}
                              backed {name(c.winner)} · {c.backers} of{' '}
                              {c.voters} voters picked the winner.
                            </li>
                          ))}
                      </ul>
                    </details>
                  ))}
              </>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">
              Awards appear after the weekly picks sync has marked results
              final. Missing or unsettled matchups are still pending.
            </p>
          </>
        )}
      </section>
      <section
        id="prediction-reviews"
        className="linear-panel rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">
          Bring the Receipts · prediction reviews
        </h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Two checkpoints: after Week 7 and after the season. Every place wrong
          adds one penalty point; lowest total wins and ties share the place.
          Original ballots stay unchanged. The website’s editorial prediction is
          scored alongside the managers.
        </p>
        {[
          {
            title: 'Halfway review · after Week 7',
            table: data.half?.map((t) => t.rosterId) ?? null,
            waiting: data.halfwayReady
              ? 'Waiting for seven complete weeks of verified results and an unambiguous table.'
              : 'Opens when Week 7 is complete and results have settled.',
            note: 'Provisional comparison against the Week 7 table, ranked by wins (ties count half), then points scored. It is not a forecast of the final result.',
          },
          {
            title: 'Final review · end of season',
            table: data.final,
            waiting:
              'Opens after Sleeper marks the season complete and all 12 playoff/consolation placings are confirmed.',
            note: 'Uses championship bracket places 1–6 and consolation bracket places 7–12. Wall of Shame punishments are a separate league decision.',
          },
        ].map((check) => {
          const ballots = [
            {
              id: 'editorial',
              name: 'Website editorial prediction',
              rosterId: null as number | null,
              rankings: data.editorial,
            },
            ...(member.status === 'ready'
              ? member.forecasts.map((f) => ({
                  id: f.voter_id,
                  name:
                    member.profiles.find((p) => p.id === f.voter_id)
                      ?.display_name ?? 'League member',
                  rosterId:
                    member.profiles.find((p) => p.id === f.voter_id)
                      ?.roster_id ?? null,
                  rankings: f.rankings,
                }))
              : []),
          ];
          const scored = check.table
            ? ballots
                .flatMap((b) => {
                  const score = compareForecast(b.rankings, check.table!);
                  return score ? [{ ...b, ...score }] : [];
                })
                .sort(
                  (a, b) => a.total - b.total || a.name.localeCompare(b.name),
                )
            : [];
          const optimism = scored.flatMap((s) => {
            if (s.rosterId === null || !check.table) return [];
            const gap =
              check.table.indexOf(s.rosterId) - s.rankings.indexOf(s.rosterId);
            return gap > 0 ? [{ name: s.name, gap }] : [];
          });
          const mostOptimistic = Math.max(0, ...optimism.map((s) => s.gap));
          return (
            <details
              key={check.title}
              className="mt-4 rounded-lg border border-white/10 p-3"
              open={Boolean(check.table)}
            >
              <summary className="cursor-pointer text-sm font-semibold">
                {check.title} · {check.table ? 'Ready' : 'Waiting'}
              </summary>
              {!check.table ? (
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  {check.waiting}
                </p>
              ) : (
                <>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    {check.note}
                  </p>
                  {member.status !== 'ready' && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {memberMessage}{' '}
                      <a className="text-primary underline" href="/matchups">
                        Weekly picks sign-in
                      </a>
                    </p>
                  )}
                  {member.status === 'ready' && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {member.forecasts.length} submitted manager ballots.
                      Non-submitters receive no accuracy score.
                    </p>
                  )}
                  {mostOptimistic > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Most optimistic self-assessment:{' '}
                      {optimism
                        .filter((s) => s.gap === mostOptimistic)
                        .map((s) => s.name)
                        .join(', ')}{' '}
                      · placed themselves {mostOptimistic} places above this
                      table.
                    </p>
                  )}
                  {scored.map((s) => (
                    <details
                      key={s.id}
                      className="mt-3 rounded-lg border border-white/10 p-3"
                    >
                      <summary className="cursor-pointer text-xs font-semibold">
                        #
                        {scored.findIndex((other) => other.total === s.total) +
                          1}{' '}
                        · {s.name} · {s.total} places wrong · {s.exact} exact
                      </summary>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Biggest misjudgement:{' '}
                        {s.rows
                          .filter((r) => r.gap === s.biggest)
                          .map(
                            (r) =>
                              `${name(r.rosterId)} (predicted ${r.predicted}, actual ${r.actual})`,
                          )
                          .join('; ')}
                        .
                      </p>
                      {s.rosterId !== null && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Self-belief check: predicted themselves #
                          {s.rankings.indexOf(s.rosterId) + 1}; actual #
                          {check.table!.indexOf(s.rosterId) + 1}.
                        </p>
                      )}
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <caption className="sr-only">
                            Predicted and actual places for {s.name}
                          </caption>
                          <thead>
                            <tr>
                              <th scope="col" className="py-2">
                                Manager
                              </th>
                              <th scope="col" className="p-2">
                                Predicted
                              </th>
                              <th scope="col" className="p-2">
                                Actual
                              </th>
                              <th scope="col" className="p-2">
                                Gap
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.rows.map((r) => (
                              <tr
                                key={r.rosterId}
                                className="border-t border-white/10"
                              >
                                <th
                                  scope="row"
                                  className="py-2 text-left font-normal"
                                >
                                  {name(r.rosterId)}
                                </th>
                                <td className="p-2">{r.predicted}</td>
                                <td className="p-2">{r.actual}</td>
                                <td className="p-2">{r.gap}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  ))}
                </>
              )}
            </details>
          );
        })}
      </section>
    </>
  );
}
