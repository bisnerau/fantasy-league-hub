import type { Metadata } from 'next';
import {
  AlertTriangle,
  Award,
  CalendarClock,
  ChevronDown,
  ClipboardCheck,
  SearchCheck,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { draftRecapContent } from '@/lib/data/draft-recap-content';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '2026 Draft Recap',
  description:
    'MAC 12 draft grades, team analysis, season outlooks and Leinster comparisons.',
};

function gradeClass(grade: string) {
  if (grade.startsWith('A')) {
    return 'border-primary/25 bg-primary/[0.09] text-primary';
  }
  if (grade.startsWith('B')) {
    return 'border-secondary/30 bg-secondary/[0.1] text-secondary-foreground';
  }
  if (grade.startsWith('C')) {
    return 'border-amber-300/25 bg-amber-300/[0.08] text-amber-200';
  }
  return 'border-orange-400/25 bg-orange-400/[0.08] text-orange-200';
}

function WaitingForDraft() {
  const checks = [
    {
      icon: ClipboardCheck,
      title: 'Consensus-led grades',
      detail:
        'Current expert rankings, projections and multi-source ADP will anchor every score.',
    },
    {
      icon: SearchCheck,
      title: 'Fresh information',
      detail: 'Player news and context will be checked again after the draft.',
    },
    {
      icon: Sparkles,
      title: 'Personal outlooks',
      detail:
        'League history and each manager’s habits will shape the verdict.',
    },
    {
      icon: Shield,
      title: 'Leinster comparisons',
      detail: 'Every team gets a fitting player comparison and explanation.',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="draft-page-heading">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-kicker">2026 draft report</span>
            <Badge
              variant="outline"
              className="border-amber-300/20 bg-amber-300/[0.055] text-[9px] text-amber-200"
            >
              <CalendarClock /> Waiting for the final pick
            </Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
            The verdict is ready to be written.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            As soon as Sleeper marks the draft complete, every roster will be
            graded, analysed and compared with a Leinster player.
          </p>
        </div>
        <div className="hidden size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.065] text-primary sm:flex">
          <Award className="size-6" />
        </div>
      </section>

      <Card className="linear-panel gap-0 py-0">
        <div className="grid sm:grid-cols-2">
          {checks.map((check, index) => {
            const Icon = check.icon;
            return (
              <div
                key={check.title}
                className={cn(
                  'flex gap-3 border-white/[0.065] p-4 sm:p-5',
                  index < 3 && 'border-b',
                  index === 2 && 'sm:border-b-0',
                  index % 2 === 1 && 'sm:border-l',
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.055] text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">{check.title}</h2>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    {check.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="rounded-xl border border-white/[0.065] bg-white/[0.018] px-4 py-3 text-center text-[11px] text-muted-foreground">
        Sharp, funny and fair. The full report unlocks after draft night.
      </div>
    </div>
  );
}

export default function DraftRecapPage() {
  if (!draftRecapContent.published) return <WaitingForDraft />;

  const entries = [...draftRecapContent.entries].sort(
    (a, b) => a.draftSlot - b.draftSlot,
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="draft-page-heading">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-kicker">2026 draft report</span>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/[0.055] text-[9px] text-primary"
            >
              <Trophy /> Grades are in
            </Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
            Twelve drafts. Twelve verdicts.
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {draftRecapContent.overview}
          </p>
        </div>
        <div className="hidden size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.065] text-primary sm:flex">
          <Award className="size-6" />
        </div>
      </section>

      <nav
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
        aria-label="Drafted teams"
      >
        {entries.map((entry) => (
          <a
            key={entry.rosterId}
            href={`#roster-${entry.rosterId}`}
            className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.065] bg-white/[0.02] p-2.5 transition-colors hover:border-primary/20 hover:bg-primary/[0.035]"
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-black',
                gradeClass(entry.grade),
              )}
            >
              {entry.grade}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-semibold">
                {entry.teamName}
              </span>
              <span className="mt-0.5 block truncate text-[9px] text-muted-foreground">
                {entry.managerName}
              </span>
            </span>
          </a>
        ))}
      </nav>

      <Card className="linear-panel gap-0 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.055] text-primary">
            <SearchCheck className="size-4" />
          </span>
          <div>
            <p className="ui-kicker">How the grades were calculated</p>
            {draftRecapContent.generatedAt && (
              <p className="mt-1 text-[9px] text-muted-foreground">
                Research updated{' '}
                {new Intl.DateTimeFormat('en-IE', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(draftRecapContent.generatedAt))}
              </p>
            )}
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              {draftRecapContent.methodology}
            </p>
            {draftRecapContent.sources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {draftRecapContent.sources.map((source) => (
                  <a
                    key={`${source.category}-${source.url}`}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[9px] font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    {source.label} · {source.category}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {entries.map((entry) => (
          <article
            key={entry.rosterId}
            id={`roster-${entry.rosterId}`}
            className="scroll-mt-20"
          >
            <Card className="linear-panel gap-0 py-0">
              <header className="flex items-start gap-3 border-b border-white/[0.065] p-4 sm:items-center sm:p-5">
                <TeamAvatar
                  avatar={entry.avatar}
                  name={entry.teamName}
                  className="size-11 sm:size-12"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                    Draft slot {entry.draftSlot} · {entry.managerName}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-bold tracking-[-0.025em] sm:text-xl">
                    {entry.teamName}
                  </h2>
                </div>
                <div
                  className={cn(
                    'flex min-w-16 shrink-0 flex-col items-center rounded-xl border px-3 py-2',
                    gradeClass(entry.grade),
                  )}
                >
                  <span className="font-mono text-2xl font-black tracking-[-0.06em]">
                    {entry.grade}
                  </span>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] opacity-70">
                    {entry.gradeScore}/100
                  </span>
                </div>
              </header>

              <div className="space-y-5 p-4 sm:p-5">
                <div>
                  <p className="ui-kicker">The verdict</p>
                  <h3 className="mt-1.5 text-base font-semibold sm:text-lg">
                    {entry.headline}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-[13px]">
                    {entry.summary}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-primary/12 bg-primary/[0.035] p-3.5">
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary">
                      <Award className="size-3.5" /> Best pick
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {entry.bestPick.player}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      {entry.bestPick.detail}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-300/12 bg-amber-300/[0.025] p-3.5">
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-200">
                      <AlertTriangle className="size-3.5" /> Biggest concern
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {entry.biggestConcern.player}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      {entry.biggestConcern.detail}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.065] bg-white/[0.018] p-4">
                    <p className="ui-kicker">Season outlook</p>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {entry.seasonOutlook}
                    </p>
                  </div>
                  <div className="rounded-xl border border-secondary/20 bg-secondary/[0.045] p-4">
                    <p className="ui-kicker text-secondary-foreground/70">
                      Leinster comparison
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {entry.leinsterComparison.player}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {entry.leinsterComparison.detail}
                    </p>
                  </div>
                </div>

                <details className="group rounded-xl border border-white/[0.065] bg-black/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground hover:text-foreground">
                    Full draft · {entry.picks.length} picks
                    <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-white/[0.055] px-3 pb-2 sm:px-4">
                    {entry.picks.map((pick) => (
                      <div
                        key={pick.overall}
                        className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 border-b border-white/[0.05] py-2.5 text-[11px] last:border-0"
                      >
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {pick.round}.{pick.overall}
                        </span>
                        <span className="truncate font-medium">
                          {pick.player}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {pick.position} · {pick.nflTeam}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </Card>
          </article>
        ))}
      </div>
    </div>
  );
}
