import { Stamp } from '@/components/effects/stamp';
import { awardNames, type Award } from '@/lib/season/features';

/** Weekly awards and Against the Room wins on one shelf. */
export function TrophyCabinet({
  honours,
  minority,
  count,
  partial,
  scheduleIncomplete,
  roomUnavailable,
  team,
  player,
}: {
  honours: (Award & { week: number })[];
  minority: { week: number; winner: number; backers: number; voters: number }[];
  count: number;
  partial: boolean;
  scheduleIncomplete: boolean;
  roomUnavailable: boolean;
  team: (rosterId: number) => string;
  player: (playerId: string) => string;
}) {
  return (
    <section
      id="my-awards"
      aria-labelledby="my-awards-title"
      className="season-panel"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="ui-kicker text-primary">Weekly awards</p>
          <h2 id="my-awards-title" className="section-title">
            Your trophy cabinet
          </h2>
        </div>
        <p className="text-right font-mono text-3xl font-black text-award">
          {count}
          {partial ? '+' : ''}
          <span className="sr-only"> awards</span>
        </p>
      </div>
      {scheduleIncomplete && (
        <p className="season-note mt-3">
          Some schedule or waiver awards are awaiting complete data. The total
          shows confirmed awards only.
        </p>
      )}
      {roomUnavailable && (
        <p className="season-note mt-3">
          Against the Room results are temporarily unavailable. Other awards
          remain below.
        </p>
      )}
      {!count && !partial && (
        <p className="mt-3 text-sm text-muted-foreground">
          No settled awards yet. The season has plenty of opportunities to
          provide evidence.
        </p>
      )}
      {(honours.length > 0 || minority.length > 0) && (
        <ul className="trophy-shelf">
          {honours.map((a) => (
            <li
              key={`${a.week}:${a.kind}:${a.playerId ?? ''}`}
              className="trophy"
            >
              <Stamp tone="gold">Wk {a.week}</Stamp>
              <h3 className="mt-2 text-sm font-bold">{awardNames[a.kind]}</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {a.playerId ? `${player(a.playerId)}. ` : ''}
                {a.detail}
              </p>
            </li>
          ))}
          {minority.map((a) => (
            <li key={`${a.week}:${a.winner}`} className="trophy">
              <Stamp tone="gold">Wk {a.week}</Stamp>
              <h3 className="mt-2 text-sm font-bold">Against the Room</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Backed {team(a.winner)} with {a.backers} of {a.voters} voters.
              </p>
            </li>
          ))}
        </ul>
      )}
      <a href="/season-hub#weekly-awards" className="season-link mt-3">
        All awards and rules
      </a>
    </section>
  );
}
