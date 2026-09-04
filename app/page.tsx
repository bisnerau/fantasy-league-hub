import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  Flame,
  History,
  ListOrdered,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  UserPlus,
  UsersRound,
  Vote,
} from 'lucide-react';

import { DraftCountdown } from '@/components/draft/draft-countdown';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getDashboardData } from '@/lib/data/dashboard';

const activityIcons = {
  trade: Repeat2,
  waiver: ShieldCheck,
  free_agent: UserPlus,
};

function formatDraftDate(startTime: number) {
  return new Intl.DateTimeFormat('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Dublin',
  }).format(new Date(startTime));
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const draft = data.draft;
  const champion = data.reigningChampion;

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="draft-page-heading">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-kicker">2026 draft room</span>
            <span className="status-pill status-pill-live">
              <span className="live-dot" /> League connected
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[46px]">
            Draft day is almost here.
          </h1>
          <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-muted-foreground sm:block">
            Everything MAC 12 needs before the clock starts. League status,
            managers, settings and players moving up draft boards.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <CalendarDays className="size-4 text-primary" />
          {draft ? formatDraftDate(draft.startTime) : 'Draft date pending'}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,.72fr)]">
        {draft ? (
          <DraftCountdown startTime={draft.startTime} />
        ) : (
          <div className="draft-countdown-card flex min-h-52 flex-col justify-between">
            <span className="ui-kicker">Draft countdown</span>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                Waiting for Sleeper
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The countdown will appear when the draft is scheduled.
              </p>
            </div>
          </div>
        )}

        <a
          href={
            champion?.franchiseId
              ? `/managers#${champion.franchiseId}`
              : '/managers'
          }
          className="champion-spotlight flex flex-col gap-0 rounded-xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="ui-kicker">Defending champion</span>
            <Crown className="size-4 text-amber-300" />
          </div>
          {champion ? (
            <div className="mt-auto pt-8">
              <TeamAvatar
                avatar={champion.avatar}
                name={champion.teamName}
                className="size-14 ring-4 ring-amber-300/10"
              />
              <p className="mt-4 text-xl font-semibold tracking-[-0.025em]">
                {champion.teamName}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{champion.ownerName}</span>
                <span className="text-white/15">•</span>
                <span>
                  {champion.wins}–{champion.losses} in {champion.season}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-auto pt-8 text-sm text-muted-foreground">
              Champion history is syncing.
            </div>
          )}
        </a>
      </section>

      <Card className="linear-panel gap-0 py-0">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <UsersRound className="size-4 text-primary" />
            <h2 className="text-sm font-medium">The league</h2>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {data.standings.length}/12 managers connected
          </span>
        </div>
        <div className="team-rail">
          {data.standings.map((team) => (
            <a
              key={team.rosterId}
              href={
                team.franchiseId ? `/managers#${team.franchiseId}` : '/managers'
              }
              className="team-chip"
            >
              <TeamAvatar
                avatar={team.avatar}
                name={team.teamName}
                className="size-10"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">
                  {team.teamName}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {team.ownerName}
                </p>
              </div>
            </a>
          ))}
        </div>
      </Card>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.72fr)]">
        <Card className="linear-panel gap-0 py-0">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
            <div>
              <span className="ui-kicker">League setup</span>
              <h2 className="mt-1 text-base font-medium">Draft settings</h2>
            </div>
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.025] text-[10px] text-muted-foreground"
            >
              Sleeper verified
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2">
            <div className="draft-setting-row">
              <CalendarDays />
              <div>
                <span>Date & time</span>
                <strong>
                  {draft ? formatDraftDate(draft.startTime) : 'Pending'}
                </strong>
              </div>
            </div>
            <div className="draft-setting-row sm:border-l">
              <Repeat2 />
              <div>
                <span>Draft format</span>
                <strong className="capitalize">{draft?.type ?? 'Snake'}</strong>
              </div>
            </div>
            <div className="draft-setting-row border-t">
              <ListOrdered />
              <div>
                <span>Rounds</span>
                <strong>{draft?.rounds ?? 15} rounds</strong>
              </div>
            </div>
            <div className="draft-setting-row border-t sm:border-l">
              <Clock3 />
              <div>
                <span>Pick timer</span>
                <strong>2 minutes</strong>
              </div>
            </div>
            <div className="draft-setting-row border-t">
              <UsersRound />
              <div>
                <span>Roster</span>
                <strong>{draft?.rosterSize ?? 15} total slots</strong>
              </div>
            </div>
          </div>

          {draft?.orderSet && draft.pickOrder.length > 0 ? (
            <div className="m-3 mt-0 sm:m-4 sm:mt-0">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Draft order
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                {draft.pickOrder.map((pick) => (
                  <div
                    key={pick.slot}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                  >
                    <span className="font-mono text-sm font-black text-primary">
                      {pick.slot}
                    </span>
                    <span className="truncate text-xs">{pick.teamName}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="m-3 mt-0 flex items-start gap-3 rounded-lg border border-amber-300/15 bg-amber-300/[0.045] p-3.5 sm:m-4 sm:mt-0">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-300" />
              <div>
                <p className="text-xs font-medium text-amber-100">
                  Draft order is not set yet
                </p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Sleeper has all 12 managers, but no pick order has been
                  published. Set it before Sunday so everyone can mock from the
                  right slot.
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="linear-panel gap-0 py-0">
          <div className="border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
            <span className="ui-kicker">Commissioner check</span>
            <h2 className="mt-1 text-base font-medium">Draft readiness</h2>
          </div>
          <div className="p-3 sm:p-4">
            {[
              [
                'League filled',
                `${data.standings.length} of 12 managers`,
                true,
              ],
              [
                'Draft scheduled',
                draft ? formatDraftDate(draft.startTime) : 'Not scheduled',
                Boolean(draft),
              ],
              [
                'Format confirmed',
                `${draft?.rounds ?? 15}-round ${draft?.type ?? 'snake'}, 2 min timer`,
                true,
              ],
              [
                'Pick order',
                draft?.orderSet ? 'Published' : 'Still required',
                Boolean(draft?.orderSet),
              ],
            ].map(([label, detail, done]) => (
              <div key={String(label)} className="readiness-row">
                <span
                  className={
                    done
                      ? 'readiness-check readiness-check-done'
                      : 'readiness-check readiness-check-open'
                  }
                >
                  {done ? <Check /> : <span />}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium">{label}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground capitalize">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card className="linear-panel min-h-64 gap-0 py-0">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <History className="size-4 text-primary" />
              <h2 className="text-sm font-medium">Latest moves</h2>
            </div>
            <span className="text-[10px] text-muted-foreground">
              League wire
            </span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {data.activities.length ? (
              data.activities.slice(0, 3).map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div key={activity.id} className="flex gap-3 px-4 py-3.5">
                    <span className="activity-icon">
                      <Icon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-medium">
                          {activity.title}
                        </p>
                        <span className="text-[9px] text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                        {activity.detail}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                <span className="activity-icon">
                  <History />
                </span>
                <p className="mt-3 text-xs font-medium">The wire is quiet</p>
                <p className="mt-1 max-w-56 text-[10px] leading-4 text-muted-foreground">
                  Moves will appear here as managers start shaping their
                  post-draft rosters.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="linear-panel min-h-64 gap-0 py-0">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-orange-300" />
              <h2 className="text-sm font-medium">Rising on Sleeper</h2>
            </div>
            <a href="/" className="text-[10px] text-primary">
              Live trends
            </a>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {data.trending.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span className="font-mono text-[10px] text-white/25">
                  0{index + 1}
                </span>
                <span className="flex size-8 items-center justify-center rounded-md bg-white/[0.045] text-[10px] font-semibold text-muted-foreground">
                  {player.position}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{player.name}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {player.team} · {player.count.toLocaleString()} adds
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    player.available
                      ? 'border-emerald-300/15 bg-emerald-300/[0.05] text-[9px] text-emerald-300'
                      : 'border-white/10 text-[9px] text-muted-foreground'
                  }
                >
                  {player.available ? 'Available' : 'Rostered'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <a href="/records" className="record-cta group min-h-64">
          <div className="flex items-center justify-between">
            <span className="ui-kicker text-white/45">
              Seven seasons of MAC 12
            </span>
            <ChevronRight className="size-4 text-white/30 transition-transform group-hover:translate-x-1" />
          </div>
          <div className="mt-auto">
            <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
              <Trophy className="size-5 text-amber-300" />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              Know the history.
            </h2>
            <p className="mt-2 text-xs leading-5 text-white/45">
              Champions, podiums and every final table from 2020 through today.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-white">
              Open record book <ArrowRight className="size-3.5" />
            </span>
          </div>
        </a>
      </section>

      <Card className="linear-panel gap-0 py-0">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-medium">League roadmap</h2>
          </div>
          <span className="text-[10px] text-muted-foreground">
            In the works
          </span>
        </div>
        <div className="grid gap-px sm:grid-cols-2">
          {[
            {
              icon: BarChart3,
              title: 'Power rankings',
              detail:
                'Weekly algorithmic rankings based on scoring, roster strength and schedule.',
              href: null,
            },
            {
              icon: Swords,
              title: 'Matchup predictor',
              detail:
                'Head-to-head breakdowns with league-wide voting on who wins each week.',
              tag: 'Live now',
              tagIcon: Vote,
              href: '/matchups',
            },
            {
              icon: Repeat2,
              title: 'Trade centre',
              detail:
                'Trade history, analysis and league reaction to every deal.',
              href: null,
            },
            {
              icon: ListOrdered,
              title: 'Draft recap',
              detail:
                'Pick-by-pick breakdown, best values and biggest reaches.',
              href: null,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-0 sm:px-5 sm:[&:nth-child(even)]:border-l"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/[0.065] bg-white/[0.03] text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium">
                      {item.href ? (
                        <a href={item.href} className="hover:text-primary">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </p>
                    {item.tag && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/[0.07] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-primary">
                        {item.tagIcon && <item.tagIcon className="size-2.5" />}
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
