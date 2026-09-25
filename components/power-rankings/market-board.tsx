import { SplitFlap } from '@/components/effects/split-flap';
import { RankMovement } from '@/components/power-rankings/rank-movement';
import type { RankingRow } from '@/components/power-rankings/rankings-list';
import { TeamAvatar } from '@/components/shared/team-avatar';

const pad = (rank: number) => String(rank).padStart(2, '0');

/** The exchange board: No.1, then the biggest riser and heaviest faller. */
export function MarketBoard({
  week,
  label,
  top,
  riser,
  faller,
}: {
  week: number;
  label: string;
  top: RankingRow;
  riser?: RankingRow;
  faller?: RankingRow;
}) {
  const summary = [
    `${top.teamName}, managed by ${top.manager}, are number one in Week ${week}.`,
    riser &&
      `Stock up: ${riser.teamName}, from ${riser.previousRank} to ${riser.rank}.`,
    faller &&
      `Stock down: ${faller.teamName}, from ${faller.previousRank} to ${faller.rank}.`,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <section className="market-board" aria-labelledby="market-title">
      <h2 id="market-title" className="ui-kicker text-primary">
        The market · Week {week} · Movement {label}
      </h2>
      <p className="sr-only">{summary}</p>
      <div className="mt-3" aria-hidden="true">
        <div className="flex items-center gap-3">
          <SplitFlap value={pad(1)} className="market-flap" />
          <TeamAvatar
            avatar={top.avatar}
            name={top.teamName}
            className="hidden size-12 shrink-0 min-[375px]:flex"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black leading-tight min-[375px]:text-lg">
              {top.teamName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {top.manager} · {top.record}
            </p>
          </div>
          <RankMovement rank={1} previousRank={top.previousRank} />
        </div>
        {(riser || faller) && (
          <>
            <div className="cut-divider market-divider">
              <span>Market movers</span>
            </div>
            <dl className="grid gap-2">
              {riser && <Mover label="Stock up" tone="up" row={riser} />}
              {faller && <Mover label="Stock down" tone="down" row={faller} />}
            </dl>
          </>
        )}
      </div>
    </section>
  );
}

function Mover({
  label,
  tone,
  row,
}: {
  label: string;
  tone: 'up' | 'down';
  row: RankingRow;
}) {
  return (
    <div className="market-mover" data-tone={tone}>
      <dt className="market-mover-label">{label}</dt>
      <dd className="flex min-w-0 flex-1 items-center gap-2.5">
        <TeamAvatar
          avatar={row.avatar}
          name={row.teamName}
          className="size-7"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">
            {row.teamName}
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {row.manager}
          </span>
        </span>
        <span className="market-mover-ranks">
          {row.previousRank} → {row.rank}
        </span>
      </dd>
    </div>
  );
}
