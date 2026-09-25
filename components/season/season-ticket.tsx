import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { SplitFlap } from '@/components/effects/split-flap';
import { TeamAvatar } from '@/components/shared/team-avatar';

const shortLock = new Intl.DateTimeFormat('en-IE', {
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Europe/Dublin',
});

export type TicketStub = {
  week: number;
  saved: number;
  total: number;
  available: boolean;
  locked: boolean;
  lockAt: string;
};

function stubLabel(stub: TicketStub) {
  if (!stub.available) return 'Open picks';
  if (stub.locked) return 'View picks';
  return stub.saved === stub.total ? 'Review picks' : 'Finish picks';
}

/** The signed-in hero: your season on a perforated ticket, one action on the stub. */
export function SeasonTicket({
  team,
  record,
  points,
  calls,
  awards,
  stub,
}: {
  team: { teamName: string; ownerName: string; avatar: string | null };
  record: { wins: number; losses: number; ties: number } | null;
  points: string;
  calls: number;
  awards: string;
  stub: TicketStub | null;
}) {
  const lock = stub ? Date.parse(stub.lockAt) : NaN;
  const recordText = record
    ? `${record.wins}–${record.losses}${record.ties ? `–${record.ties}` : ''}`
    : null;
  return (
    <section aria-labelledby="season-ticket-title" className="season-ticket">
      <div className="season-ticket-main">
        <p className="season-ticket-kicker">Season ticket · 2026</p>
        <div className="mt-3 flex min-w-0 items-center gap-3">
          <TeamAvatar
            avatar={team.avatar}
            name={team.teamName}
            className="size-11"
          />
          <div className="min-w-0">
            <h2
              id="season-ticket-title"
              className="truncate font-heading text-xl font-black leading-tight tracking-tight sm:text-2xl"
            >
              {team.teamName}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {team.ownerName}
            </p>
          </div>
        </div>
        <div className="mt-4">
          {record ? (
            <>
              <p className="sr-only">Record {recordText}</p>
              <span className="season-ticket-record" aria-hidden="true">
                <SplitFlap value={String(record.wins)} />
                <span className="season-ticket-dash">–</span>
                <SplitFlap value={String(record.losses)} />
                {record.ties > 0 && (
                  <>
                    <span className="season-ticket-dash">–</span>
                    <SplitFlap value={String(record.ties)} />
                  </>
                )}
              </span>
            </>
          ) : (
            <p className="font-mono text-sm font-bold text-muted-foreground">
              Record unavailable
            </p>
          )}
        </div>
        <dl className="season-ticket-stats">
          <div>
            <dt>Points</dt>
            <dd>{points}</dd>
          </div>
          <div>
            <dt>Calls</dt>
            <dd>{calls}</dd>
          </div>
          <div>
            <dt>Awards</dt>
            <dd>{awards}</dd>
          </div>
        </dl>
      </div>
      {stub ? (
        <a href="/matchups" className="season-ticket-stub">
          <span className="season-ticket-stub-week">Wk {stub.week}</span>
          {stub.available && (
            <span className="season-ticket-stub-count">
              <span className="text-xl font-black text-foreground">
                {stub.saved}/{stub.total}
              </span>
              <span>picks</span>
            </span>
          )}
          <span className="season-ticket-stub-action">
            {stubLabel(stub)} <ArrowRight className="size-3.5" />
          </span>
          {Number.isFinite(lock) && (
            <span className="season-ticket-stub-lock">
              {stub.locked ? 'Closed' : 'Locks'} {shortLock.format(lock)}
            </span>
          )}
        </a>
      ) : (
        <a href="/matchups" className="season-ticket-stub">
          <span className="season-ticket-stub-week">Admit one</span>
          <span className="season-ticket-stub-action">
            Open picks <ArrowRight className="size-3.5" />
          </span>
        </a>
      )}
    </section>
  );
}

/** Signed out, loading or failed: the same ticket, waiting at the gate. */
export function GateTicket({
  children,
  title = 'Show your ticket at the gate',
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <section aria-labelledby="gate-ticket-title" className="gate-ticket">
      <p className="gate-ticket-band" aria-hidden="true">
        <span>Admit one</span>
        <span>MAC 12 · 2026</span>
      </p>
      <div className="p-4 sm:p-5">
        <h2
          id="gate-ticket-title"
          className="font-heading text-xl font-black tracking-tight"
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
