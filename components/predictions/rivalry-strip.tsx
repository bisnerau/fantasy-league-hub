import type { Rivalry } from '@/lib/data/rivalries';
import type { PredictionMatchup } from '@/lib/data/predictions';
import { leagueMembers } from '@/lib/data/member-directory';

export function RivalryStrip({
  rivalry,
  matchup,
}: {
  rivalry?: Rivalry;
  matchup: PredictionMatchup;
}) {
  if (!rivalry) return null;
  const home =
    leagueMembers.find((m) => m.rosterId === matchup.home.rosterId)
      ?.displayName ?? matchup.home.ownerName;
  const away =
    leagueMembers.find((m) => m.rosterId === matchup.away.rosterId)
      ?.displayName ?? matchup.away.ownerName;
  const { last, biggest } = rivalry;
  return (
    <section
      aria-label={`${home} versus ${away} rivalry`}
      className="border-t border-border bg-muted/20 px-3.5 py-3 sm:px-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold">The history</h3>
        <p className="text-sm font-medium">
          {rivalry.meetings ? (
            <>
              {home} {rivalry.homeWins}–{rivalry.awayWins} {away}
              {rivalry.ties ? ` · ${rivalry.ties} tied` : ''}
            </>
          ) : (
            'No verified meetings yet'
          )}
        </p>
      </div>
      {last && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Last meeting:{' '}
          {last.homePoints === last.awayPoints
            ? 'tied'
            : `${last.homePoints > last.awayPoints ? home : away} won`}{' '}
          · {home} {last.homePoints.toFixed(2)}–{last.awayPoints.toFixed(2)}{' '}
          {away} · {last.season}, W{last.week}.
        </p>
      )}
      {biggest && (
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Biggest win: {biggest.homePoints > biggest.awayPoints ? home : away}{' '}
          by {Math.abs(biggest.homePoints - biggest.awayPoints).toFixed(2)} ·{' '}
          {biggest.season}, W{biggest.week}. The receipt survives.
        </p>
      )}
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {rivalry.scope}.{' '}
        {rivalry.partial
          ? 'Some recent results are unavailable; showing the verified meetings we have.'
          : 'Verified meetings only.'}
      </p>
    </section>
  );
}
