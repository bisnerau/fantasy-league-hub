import { SplitFlap } from '@/components/effects/split-flap';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  formatRecord,
  type CutLine,
  type TeamStanding,
} from '@/lib/data/standings';

/** The stadium board: the last seed in against the first team out. */
export function CutLineHero({ cut, week }: { cut: CutLine; week: number }) {
  const { lastIn, firstOut, gap } = cut;
  return (
    <section className="cut-board" aria-labelledby="cut-title">
      <h2 id="cut-title" className="ui-kicker text-primary">
        The cut line · Seed {cut.lastIn.rank} v {cut.firstOut.rank}
      </h2>
      <p className="sr-only">
        After Week {week}, {lastIn.teamName} hold the last playoff place at seed{' '}
        {lastIn.rank} with a {formatRecord(lastIn)} record. {firstOut.teamName}{' '}
        are first out at seed {firstOut.rank} with {formatRecord(firstOut)}.{' '}
        {gap}.
      </p>
      <div className="mt-3" aria-hidden="true">
        <CutTeam team={lastIn} />
        <div className="cut-divider">
          <span>In</span>
          <span>Out</span>
        </div>
        <CutTeam team={firstOut} />
        <p className="mt-4 text-center font-mono text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {gap}
        </p>
      </div>
    </section>
  );
}

function CutTeam({ team }: { team: TeamStanding }) {
  return (
    <div className="flex items-center gap-3">
      <span className="cut-seed text-center font-mono text-sm font-black text-muted-foreground">
        {team.rank}
      </span>
      <TeamAvatar
        avatar={team.avatar}
        name={team.teamName}
        className="size-8 shrink-0 min-[375px]:size-10"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold leading-tight">
          {team.teamName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {team.ownerName}
        </p>
      </div>
      <SplitFlap value={formatRecord(team)} className="cut-flap" />
    </div>
  );
}
