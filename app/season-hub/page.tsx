import { OpenLinkedReceipt } from '@/components/season/open-linked-receipt';
import type { Metadata } from 'next';
import { getSeasonHubData } from '@/lib/data/season-hub';
import { awardNames } from '@/lib/season/features';
import { MemberReceipts } from '@/components/season/member-receipts';

export const metadata: Metadata = {
  title: 'Awards & Receipts',
  description:
    'MAC 12 weekly awards, 2026 trade receipts and halfway and final prediction reviews.',
};
export const dynamic = 'force-dynamic';
export default async function SeasonHubPage() {
  const data = await getSeasonHubData();
  if (!data)
    return (
      <section className="linear-panel rounded-xl p-5">
        <h1 className="text-2xl font-semibold">Awards & Receipts</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The 2026 league data is unavailable right now. Please try again
          shortly.
        </p>
        <a
          href="/season-hub"
          className="mt-3 inline-block text-primary underline"
        >
          Retry
        </a>
      </section>
    );
  const name = (id: number) =>
    data.managers.find((m) => m.rosterId === id)?.name ?? `Roster ${id}`;
  const player = (id: string) => data.names[id] ?? `Player ${id}`;
  const trophies = new Set(
    data.awards.flatMap(
      (w) =>
        w.result?.awards.map((a) => `${w.week}:${a.kind}:${a.rosterId}`) ?? [],
    ),
  );
  const counts = data.managers
    .map((m) => ({
      ...m,
      count: [...trophies].filter((t) => t.endsWith(`:${m.rosterId}`)).length,
    }))
    .filter((m) => m.count)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return (
    <div className="space-y-5">
      <OpenLinkedReceipt />
      <header className="linear-panel rounded-xl p-4 sm:p-6">
        <p className="ui-kicker">MAC 12 · 2026 season</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Awards & Receipts
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          The schedule complaints, waiver wins, unpopular picks and trade
          receipts that deserve a permanent record.
        </p>
        <nav
          aria-label="Awards and receipts sections"
          className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-primary"
        >
          <a
            href="#weekly-awards"
            className="rounded-lg border border-primary/20 px-3 py-2"
          >
            Weekly awards
          </a>
          <a
            href="#against-the-room"
            className="rounded-lg border border-primary/20 px-3 py-2"
          >
            Against the Room
          </a>
          <a
            href="#prediction-reviews"
            className="rounded-lg border border-primary/20 px-3 py-2"
          >
            Prediction reviews
          </a>
          <a
            href="#trade-receipts"
            className="rounded-lg border border-primary/20 px-3 py-2"
          >
            Trade Receipts
          </a>
        </nav>
      </header>
      <section
        id="weekly-awards"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Weekly awards</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Regular season, Weeks 1–14. Results wait until at least Wednesday and
          the NFL week has advanced. No qualifying performance means no award.
          Ties share the honour; each manager earns at most one of each award
          per week.
        </p>
        <details className="mt-3 rounded-lg border border-white/10 p-3">
          <summary className="cursor-pointer text-xs font-semibold">
            What earns each award?
          </summary>
          <dl className="mt-3 space-y-3 text-xs leading-6">
            <div>
              <dt className="font-semibold">The Schedule Solicitor</dt>
              <dd className="text-muted-foreground">
                Highest-scoring loser, provided they would have beaten at least
                six of the other eleven teams.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">The Get Away With It Award</dt>
              <dd className="text-muted-foreground">
                Lowest-scoring winner, provided at least six of the other eleven
                teams would have beaten them.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">The Waiver Receipt</dt>
              <dd className="text-muted-foreground">
                Most positive starter points from a player added through waivers
                or free agency in that scoring week. Uses Sleeper’s transaction
                week and recorded starting lineup.
              </dd>
            </div>
          </dl>
        </details>
        {!!counts.length && (
          <div className="mt-4">
            <h3 className="ui-kicker">
              Season trophy count · schedule & waiver awards
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {counts.map((m) => (
                <span
                  key={m.rosterId}
                  className="rounded-lg border border-primary/20 px-3 py-2 text-xs"
                >
                  {m.name} · {m.count}
                </span>
              ))}
            </div>
          </div>
        )}
        {!data.awards.length ? (
          <p className="mt-4 rounded-lg border border-white/10 p-4 text-sm text-muted-foreground">
            The trophy cabinet opens after Week 1 results settle. Nobody has
            earned a scheduling complaint yet.
          </p>
        ) : (
          [...data.awards].reverse().map((w) => (
            <details
              key={w.week}
              className="mt-3 rounded-lg border border-white/10 p-3"
              open={w.week === data.awards.at(-1)?.week}
            >
              <summary className="cursor-pointer text-sm font-semibold">
                Week {w.week} ·{' '}
                {w.result
                  ? `${new Set(w.result.awards.map((a) => `${a.kind}:${a.rosterId}`)).size} awards`
                  : 'Results unavailable'}
              </summary>
              {!w.result ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Waiting for complete matchup results. No awards calculated for
                  this week.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {!w.result.awards.length && (
                    <p className="text-xs text-muted-foreground">
                      No qualifying awards in the available results.
                    </p>
                  )}
                  {w.result.awards.map((a) => (
                    <article
                      key={`${a.kind}:${a.rosterId}:${a.playerId ?? ''}`}
                      className="rounded-lg border border-primary/15 bg-primary/[0.025] p-3"
                    >
                      <p className="ui-kicker">{awardNames[a.kind]}</p>
                      <h3 className="mt-2 text-sm font-semibold">
                        {name(a.rosterId)}
                        {a.playerId ? ` · ${player(a.playerId)}` : ''}
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        {a.detail}
                      </p>
                    </article>
                  ))}
                  {!w.result.waiverReady && (
                    <p className="text-xs text-amber-200">
                      Waiver award pending: transaction or starter-point data is
                      unavailable.
                    </p>
                  )}
                </div>
              )}
            </details>
          ))
        )}
      </section>
      <MemberReceipts data={data} />
      <section
        id="trade-receipts"
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <h2 className="text-lg font-semibold">Trade Receipts · 2026 onwards</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Who received what, and what actually made the lineup. First review
          after three full scoring weeks, then an end-of-season review. Each
          trade expands below.
        </p>
        <details className="mt-3 rounded-lg border border-white/10 p-3">
          <summary className="cursor-pointer text-xs font-semibold">
            How trade reviews work
          </summary>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Weeks begin Tuesday at 00:00 UTC for this analysis. We exclude the
            acquisition week and any week in which a player leaves the receiving
            roster, then stop counting that player. First reviews always use the
            first three full scoring weeks; the final review uses all eligible
            weeks through Week 17. Starter points measure the contribution
            actually used; roster points include the bench. A recorded zero is
            counted, but missing points are marked unavailable. Injuries and
            byes can reduce the return, and the scores alone do not establish
            whether a trade was sensible at the time. Draft picks and FAAB are
            listed separately and never assigned a fictional points value. This
            is a points receipt, not an overall trade grade.
          </p>
        </details>
        {!data.transactionReady && (
          <p className="mt-4 text-sm text-amber-200">
            Some transaction history is unavailable. The trade list may be
            incomplete and point reviews are paused.
          </p>
        )}
        {!data.receipts.length && data.transactionReady && (
          <p className="mt-4 rounded-lg border border-white/10 p-4 text-sm text-muted-foreground">
            No completed 2026 trades yet. The next accepted deal will appear
            here automatically.
          </p>
        )}
        {data.receipts.map(({ trade, review }) => {
          const first = review?.initialReady;
          const final = data.finalReady && review?.weeks.at(-1) === 17;
          const periods = [
            ...(first
              ? [
                  {
                    label: 'First three full weeks',
                    weeks: review!.weeks.slice(0, 3),
                  },
                ]
              : []),
            ...(final
              ? [{ label: 'End-of-season receipt', weeks: review!.weeks }]
              : []),
          ];
          return (
            <details
              key={trade.transaction_id}
              id={`trade-${trade.transaction_id}`}
              className="scroll-mt-20 mt-4 rounded-lg border border-white/10 p-3"
            >
              <summary className="cursor-pointer text-sm font-semibold">
                {trade.roster_ids.map(name).join(' ↔ ')}
                <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
                  {new Intl.DateTimeFormat('en-IE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Europe/Dublin',
                  }).format(
                    new Date(trade.status_updated ?? trade.created),
                  )}{' '}
                  ·{' '}
                  {final
                    ? 'Final review ready'
                    : first
                      ? 'First review ready'
                      : 'Review pending'}
                </span>
              </summary>
              {!review ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Waiting for complete transaction history and a confirmed
                  completion time.
                </p>
              ) : !first && !final ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {review.firstWeek === null
                    ? 'No full 2026 scoring weeks remain after this trade.'
                    : `${review.weeks.length} of 3 completed full scoring weeks available. First eligible week: ${review.firstWeek}.`}
                </p>
              ) : null}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {trade.roster_ids.map((rosterId) => (
                  <div
                    key={rosterId}
                    className="rounded-lg border border-white/10 p-3"
                  >
                    <h3 className="text-sm font-semibold">
                      {name(rosterId)} received
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {Object.entries(trade.adds ?? {})
                        .filter(([, id]) => id === rosterId)
                        .map(([id]) => (
                          <li key={id}>
                            {player(id)}
                            {review?.sides
                              .find((s) => s.rosterId === rosterId)
                              ?.players.find((p) => p.playerId === id)?.exited
                              ? ' · since moved on'
                              : ''}
                          </li>
                        ))}
                      {(trade.draft_picks ?? [])
                        .filter((p) => p.owner_id === rosterId)
                        .map((p, i) => (
                          <li key={i}>
                            {String(p.season)} round {String(p.round)} pick ·
                            original roster {String(p.roster_id)} · future
                            return unscored
                          </li>
                        ))}
                      {(trade.waiver_budget ?? [])
                        .filter((b) => b.receiver === rosterId)
                        .map((b, i) => (
                          <li key={i}>
                            {b.amount} FAAB from {name(b.sender)} · unscored
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
              {periods.map((period) => (
                <section key={period.label} className="mt-4">
                  <h3 className="text-sm font-semibold">
                    {period.label} · Weeks {period.weeks.join(', ')}
                  </h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <caption className="sr-only">
                        Points returned by received players during{' '}
                        {period.label}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col" className="py-2">
                            Manager / player
                          </th>
                          <th scope="col" className="p-2">
                            Starter points
                          </th>
                          <th scope="col" className="p-2">
                            Roster points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {review!.sides.map((side) => {
                          const contributions = side.players.flatMap((p) =>
                            p.contributions.filter((c) =>
                              period.weeks.includes(c.week),
                            ),
                          );
                          const sum = (key: 'started' | 'total') =>
                            contributions.some((c) => c[key] === null)
                              ? 'Unavailable'
                              : contributions
                                  .reduce((n, c) => n + c[key]!, 0)
                                  .toFixed(2);
                          return (
                            <tr
                              key={side.rosterId}
                              className="border-t border-white/10"
                            >
                              <th
                                scope="row"
                                className="py-3 text-left font-medium"
                              >
                                {name(side.rosterId)}
                                <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                                  {side.players
                                    .map((p) => player(p.playerId))
                                    .join(', ') || 'No received players'}
                                  {contributions.some((c) => c.excluded)
                                    ? ' · departure weeks and later excluded'
                                    : ''}
                                </span>
                              </th>
                              <td className="p-2">{sum('started')}</td>
                              <td className="p-2">{sum('total')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <details className="mt-3 rounded-lg border border-white/10 p-3">
                    <summary className="cursor-pointer text-xs font-medium">
                      Player-by-player weekly evidence
                    </summary>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <caption className="sr-only">
                          Weekly contributions during {period.label}
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col" className="p-2">
                              Manager / player
                            </th>
                            <th scope="col" className="p-2">
                              Week
                            </th>
                            <th scope="col" className="p-2">
                              Starter points
                            </th>
                            <th scope="col" className="p-2">
                              Roster points
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {review!.sides.flatMap((side) =>
                            side.players.flatMap((p) =>
                              p.contributions
                                .filter((c) => period.weeks.includes(c.week))
                                .map((c) => (
                                  <tr
                                    key={`${side.rosterId}:${p.playerId}:${c.week}`}
                                    className="border-t border-white/10"
                                  >
                                    <th
                                      scope="row"
                                      className="p-2 text-left font-normal"
                                    >
                                      {player(p.playerId)}
                                      <span className="block text-muted-foreground">
                                        {name(side.rosterId)}
                                      </span>
                                    </th>
                                    <td className="p-2">{c.week}</td>
                                    <td className="p-2">
                                      {c.excluded
                                        ? 'Excluded: moved on'
                                        : c.started === null
                                          ? 'Unavailable'
                                          : c.started.toFixed(2)}
                                    </td>
                                    <td className="p-2">
                                      {c.excluded
                                        ? 'Excluded: moved on'
                                        : c.total === null
                                          ? 'Unavailable'
                                          : c.total.toFixed(2)}
                                    </td>
                                  </tr>
                                )),
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </section>
              ))}
              {trade.draft_picks?.length || trade.waiver_budget?.length ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  This deal includes picks or FAAB. The points columns cover
                  received players only.
                </p>
              ) : null}
            </details>
          );
        })}
        <p className="mt-4 text-[10px] text-muted-foreground">
          Source:{' '}
          <a
            href="https://sleeper.com/leagues/1389706813993160704"
            className="text-primary underline"
          >
            Sleeper’s 2026 MAC 12 league
          </a>
          . These pages read results and transactions; lineup decisions and
          trades remain in Sleeper.
        </p>
      </section>
    </div>
  );
}
