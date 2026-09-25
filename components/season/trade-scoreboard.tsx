import { ArrowRight } from 'lucide-react';
import { tradeScore } from '@/lib/season/my-season';
import type { SeasonHubData } from '@/lib/data/season-hub';

/** Each trade as a deal-done card with a running starter-points scoreline. */
export function TradeScoreboard({
  trades,
  ready,
  rosterId,
  team,
  player,
  date,
}: {
  trades: SeasonHubData['receipts'];
  ready: boolean;
  rosterId: number;
  team: (rosterId: number) => string;
  player: (playerId: string) => string;
  date: (value: number) => string;
}) {
  return (
    <section
      id="my-trades"
      aria-labelledby="my-trades-title"
      className="season-panel"
    >
      <p className="ui-kicker text-primary">Transfer window</p>
      <h2 id="my-trades-title" className="section-title">
        Your trades
      </h2>
      {!ready && (
        <p className="season-note mt-3">
          Transaction history is incomplete; this list may be partial.
        </p>
      )}
      {!trades.length && ready && (
        <p className="mt-3 text-sm text-muted-foreground">
          No completed 2026 trades yet. A peaceful start for the negotiations
          department.
        </p>
      )}
      <ul className="mt-3 space-y-3">
        {trades.map(({ trade, review }) => {
          const score = tradeScore(review);
          const received = Object.entries(trade.adds ?? {})
            .filter(([, owner]) => owner === rosterId)
            .map(([id]) => player(id));
          const sent = Object.entries(trade.drops ?? {})
            .filter(([, owner]) => owner === rosterId)
            .map(([id]) => player(id));
          const others = trade.roster_ids.filter((r) => r !== rosterId);
          const mine =
            score.status === 'scored'
              ? score.sides.find((s) => s.rosterId === rosterId)
              : undefined;
          const theirs =
            score.status === 'scored'
              ? score.sides.filter((s) => s.rosterId !== rosterId)
              : [];
          const best = Math.max(...theirs.map((s) => s.points));
          return (
            <li key={trade.transaction_id}>
              <a
                href={`/season-hub#trade-${trade.transaction_id}`}
                className="deal-card"
              >
                <p className="deal-kicker">
                  <span>Deal done</span>
                  <span>{date(trade.status_updated ?? trade.created)}</span>
                </p>
                <p className="mt-2 text-sm font-bold">
                  You v {others.map(team).join(' / ')}
                </p>
                {mine && theirs.length ? (
                  <div className="deal-score">
                    <span data-lead={mine.points > best || undefined}>
                      <span className="deal-score-label">You</span>
                      {mine.points.toFixed(1)}
                    </span>
                    <span className="deal-score-dash" aria-hidden="true">
                      –
                    </span>
                    <span data-lead={best > mine.points || undefined}>
                      <span className="deal-score-label">
                        {theirs.length > 1 ? 'Them' : team(theirs[0].rosterId)}
                      </span>
                      {theirs.map((s) => s.points.toFixed(1)).join(' / ')}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 font-mono text-xs font-bold text-muted-foreground">
                    {score.status === 'unavailable'
                      ? 'Score unavailable'
                      : 'Too early to call'}
                  </p>
                )}
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  {score.status === 'scored'
                    ? `Starter points from the players each side received · ${score.weeks} week${score.weeks === 1 ? '' : 's'}${score.initialReady ? '' : ' · early days'}`
                    : score.status === 'unavailable'
                      ? 'A week of starter data could not be verified.'
                      : 'The score starts after the first full week following the trade.'}
                </p>
                <p className="mt-2 text-xs leading-5">
                  <span className="font-semibold">In:</span>{' '}
                  {received.join(', ') || 'Picks or FAAB'}
                  {sent.length > 0 && (
                    <>
                      {' '}
                      · <span className="font-semibold">Out:</span>{' '}
                      {sent.join(', ')}
                    </>
                  )}
                </p>
                <span className="season-link mt-2">
                  Open trade receipt <ArrowRight className="size-4" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
