import { Stamp } from '@/components/effects/stamp';
import type { leagueFaith, RoomVoter } from '@/lib/season/my-season';

type Identity = { teamName: string; ownerName: string };

/** How the rest of the league picks your games once each week locks. */
export function LeagueFaith({
  room,
  ready,
  voter,
  team,
}: {
  room: ReturnType<typeof leagueFaith> | null;
  ready: boolean;
  voter: (voterId: string) => Identity | null;
  team: (rosterId: number) => string;
}) {
  if (!ready)
    return (
      <section
        id="my-faith"
        aria-labelledby="my-faith-title"
        className="season-panel"
      >
        <Heading />
        <p className="season-note mt-3">
          The league’s picks are unavailable right now. The rest of your season
          is unaffected.
        </p>
      </section>
    );
  if (!room || !room.total) return null;
  const share = Math.round((100 * room.backed) / room.total);
  return (
    <section
      id="my-faith"
      aria-labelledby="my-faith-title"
      className="season-panel"
    >
      <Heading />
      <div className="faith-meter">
        <p className="font-mono text-4xl font-black tracking-tight text-primary">
          {share}%
        </p>
        <p className="text-sm leading-5">
          of the league’s picks backed you
          <span className="block text-xs text-muted-foreground">
            {room.backed} of {room.total} picks · your own pick not counted
          </span>
        </p>
      </div>
      <div className="faith-split" aria-hidden="true">
        <span style={{ width: `${share}%` }} />
      </div>

      {(room.believers.length > 0 || room.doubters.length > 0) && (
        <div className="faith-people">
          <FaithPerson
            label="Biggest believer"
            people={room.believers}
            voter={voter}
            count={(v) => `${v.for} of ${v.for + v.against} for you`}
          />
          <FaithPerson
            label="Chief doubter"
            people={room.doubters}
            voter={voter}
            count={(v) => `${v.against} of ${v.for + v.against} against`}
          />
        </div>
      )}

      <ol className="faith-weeks">
        {[...room.weeks].reverse().map((w) => {
          const total = w.for + w.against;
          const wrong = room.provedWrong.includes(w);
          return (
            <li key={w.matchupId} className="faith-week">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-xs font-semibold">
                  Wk {w.week} · v {team(w.opponent)}
                </p>
                <p className="shrink-0 font-mono text-xs font-bold">
                  {w.for}–{w.against}
                  <span className="sr-only"> for and against you</span>
                </p>
              </div>
              <div className="faith-bar" aria-hidden="true">
                <span style={{ width: `${(100 * w.for) / total}%` }} />
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                {w.result === 'won'
                  ? 'You won'
                  : w.result === 'lost'
                    ? 'You lost'
                    : 'Result pending'}
                {!!w.bankersFor &&
                  ` · ${w.bankersFor} Banker${w.bankersFor > 1 ? 's' : ''} on you`}
                {!!w.bankersAgainst &&
                  ` · ${w.bankersAgainst} Banker${w.bankersAgainst > 1 ? 's' : ''} against`}
                {wrong && <Stamp tone="win">Proved them wrong</Stamp>}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Heading() {
  return (
    <>
      <p className="ui-kicker text-primary">After each lock</p>
      <h2 id="my-faith-title" className="section-title">
        How the league rates you
      </h2>
    </>
  );
}

function FaithPerson({
  label,
  people,
  voter,
  count,
}: {
  label: string;
  people: RoomVoter[];
  voter: (voterId: string) => Identity | null;
  count: (v: RoomVoter) => string;
}) {
  const named = people
    .map((v) => ({ vote: v, who: voter(v.voterId) }))
    .filter((p): p is { vote: RoomVoter; who: Identity } => p.who !== null);
  if (!named.length) return <div />;
  // Ties share the title; the team name decides who is shown first.
  const first = [...named].sort((a, b) =>
    a.who.teamName.localeCompare(b.who.teamName),
  )[0];
  return (
    <div className="faith-person">
      <p className="ui-kicker">{label}</p>
      <p className="mt-2 truncate text-sm font-bold">{first.who.teamName}</p>
      <p className="truncate text-[11px] text-muted-foreground">
        {first.who.ownerName}
      </p>
      <p className="mt-1 text-xs font-semibold text-primary">
        {count(first.vote)}
      </p>
      {named.length > 1 && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          +{named.length - 1} tied
        </p>
      )}
    </div>
  );
}
