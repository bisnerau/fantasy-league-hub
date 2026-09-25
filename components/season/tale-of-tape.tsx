import { ArrowRight } from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import type { Result } from '@/lib/data/standings';

export type TapeSide = {
  teamName: string;
  ownerName: string;
  avatar: string | null;
  record: string;
  pointsFor: number | null;
  form: Result[];
};

type Row = {
  label: string;
  mine: string;
  theirs: string;
  /** Positive when you lead the line, negative when they do. */
  edge: number;
};

/** You against this week's opponent, with the verified history underneath. */
export function TaleOfTape({
  week,
  finalized,
  me,
  them,
  recordEdge,
  href,
  rivalry,
  room,
}: {
  week: number;
  finalized: boolean;
  me: TapeSide;
  them: TapeSide;
  /** Positive when your record is better, negative when theirs is. */
  recordEdge: number;
  href: string;
  rivalry: {
    mine: number;
    theirs: number;
    ties: number;
    meetings: number;
    last: { season: number; week: number; mine: number; theirs: number } | null;
    scope: string;
    partial: boolean;
  } | null;
  room: { for: number; against: number } | null;
}) {
  const rows: Row[] = [
    {
      label: 'Record',
      mine: me.record,
      theirs: them.record,
      edge: recordEdge,
    },
  ];
  if (me.pointsFor != null && them.pointsFor != null)
    rows.push({
      label: 'Points for',
      mine: me.pointsFor.toFixed(1),
      theirs: them.pointsFor.toFixed(1),
      edge: me.pointsFor - them.pointsFor,
    });
  if (me.form.length && them.form.length)
    rows.push({
      label: 'Form',
      mine: me.form.slice(-4).join(''),
      theirs: them.form.slice(-4).join(''),
      edge: 0,
    });
  return (
    <section
      id="my-week"
      aria-labelledby="my-week-title"
      className="season-panel"
    >
      <p className="ui-kicker text-primary">
        {finalized ? `Last matchup · Week ${week}` : `This week · Week ${week}`}
      </p>
      <h2 id="my-week-title" className="section-title">
        Tale of the tape
      </h2>
      <div className="tape-teams">
        <TapeTeam side={me} />
        <span className="tape-versus" aria-hidden="true">
          v
        </span>
        <TapeTeam side={them} align="end" />
      </div>
      <dl className="tape-rows">
        {rows.map((row) => (
          <div key={row.label} className="tape-row">
            <dt>{row.label}</dt>
            <dd data-lead={row.edge > 0 || undefined}>
              <span className="sr-only">You </span>
              {row.mine}
            </dd>
            <dd data-lead={row.edge < 0 || undefined}>
              <span className="sr-only">Them </span>
              {row.theirs}
            </dd>
          </div>
        ))}
      </dl>
      {rivalry && rivalry.meetings > 0 && (
        <p className="tape-note">
          <span className="font-semibold text-foreground">
            All-time {rivalry.mine}–{rivalry.theirs}
            {rivalry.ties ? `–${rivalry.ties}` : ''}
          </span>
          {rivalry.last && (
            <>
              {` · last met Wk ${rivalry.last.week} ${rivalry.last.season}, `}
              <span className="whitespace-nowrap">
                {rivalry.last.mine.toFixed(1)}–{rivalry.last.theirs.toFixed(1)}
              </span>
            </>
          )}
          <span className="block text-[11px]">
            {rivalry.scope}
            {rivalry.partial ? ' · archive partial' : ''}
          </span>
        </p>
      )}
      {room && room.for + room.against > 0 && (
        <p className="tape-note">
          <span className="font-semibold text-foreground">The room:</span>{' '}
          {room.for} backing you, {room.against} against.
        </p>
      )}
      <a href={href} className="season-link mt-3">
        See the matchup <ArrowRight className="size-4" />
      </a>
    </section>
  );
}

function TapeTeam({
  side,
  align = 'start',
}: {
  side: TapeSide;
  align?: 'start' | 'end';
}) {
  return (
    <div className="tape-team" data-align={align}>
      <TeamAvatar
        avatar={side.avatar}
        name={side.teamName}
        className="size-10"
      />
      <p className="mt-2 line-clamp-2 text-sm font-bold leading-tight">
        {side.teamName}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">
        {side.ownerName}
      </p>
    </div>
  );
}
