import type { Metadata } from 'next';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react';
import { PredictionCentre } from '@/components/predictions/prediction-centre';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { getPredictionWeekData } from '@/lib/data/predictions';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Matchup Predictor',
  description:
    'Pick every MAC 12 matchup winner before Sunday kickoff and track the season prediction table.',
};

export const dynamic = 'force-dynamic';

export default async function MatchupsPage({
  searchParams,
}: {
  searchParams?: Promise<{ week?: string; view?: string }>;
}) {
  const params = await searchParams;
  const view = params?.view === 'standings' ? 'standings' : 'weekly';
  const requestedWeek = Number(params?.week);
  const data = await getPredictionWeekData(
    Number.isInteger(requestedWeek) ? requestedWeek : undefined,
  );
  const earliestWeek = 1;
  const latestWeek = Math.max(1, data.currentWeek);
  const previousWeek = Math.max(earliestWeek, data.week - 1);
  const nextWeek = Math.min(latestWeek, data.week + 1);

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <section className="draft-page-heading !items-center !py-1">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-kicker">Matchup predictor</span>
            <Badge
              variant="outline"
              className="border-primary/15 bg-primary/[0.055] text-[9px] text-primary"
            >
              <Sparkles /> New for 2026
            </Badge>
          </div>
          <h1 className="mt-2 max-w-3xl text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl lg:text-[38px]">
            {view === 'standings'
              ? 'Who calls it best?'
              : 'Call every game before kickoff.'}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-muted-foreground">
            {view === 'standings'
              ? 'Every correct weekly pick counts toward the season prediction title.'
              : 'Six weekly picks. Hidden until Sunday. Every correct winner counts toward the season prediction title.'}
          </p>
        </div>
        <div className="hidden size-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.065] text-primary sm:flex">
          <Swords className="size-5" />
        </div>
      </section>

      <nav
        className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.065] bg-white/[0.02] p-1"
        aria-label="Prediction views"
      >
        <a
          href={`/matchups?week=${data.week}`}
          className={cn(
            'flex h-9 items-center justify-center gap-2 rounded-lg text-[11px] font-semibold transition-colors',
            view === 'weekly'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-white/[0.035] hover:text-foreground',
          )}
          aria-current={view === 'weekly' ? 'page' : undefined}
        >
          <CalendarDays className="size-3.5" /> Weekly picks
        </a>
        <a
          href="/matchups?view=standings"
          className={cn(
            'flex h-9 items-center justify-center gap-2 rounded-lg text-[11px] font-semibold transition-colors',
            view === 'standings'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-white/[0.035] hover:text-foreground',
          )}
          aria-current={view === 'standings' ? 'page' : undefined}
        >
          <Trophy className="size-3.5" /> Prediction standings
        </a>
      </nav>

      {view === 'weekly' && (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.065] bg-white/[0.02] p-2">
          {data.week <= earliestWeek ? (
            <span
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'opacity-40',
              )}
              aria-disabled="true"
            >
              <ChevronLeft /> Previous
            </span>
          ) : (
            <a
              href={`/matchups?week=${previousWeek}`}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              <ChevronLeft /> Previous
            </a>
          )}
          <div className="text-center">
            <p className="font-heading text-sm font-semibold">
              Week {data.week}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {data.season} season
            </p>
          </div>
          {data.week >= latestWeek ? (
            <span
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'opacity-40',
              )}
              aria-disabled="true"
            >
              Next <ChevronRight />
            </span>
          ) : (
            <a
              href={`/matchups?week=${nextWeek}`}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Next <ChevronRight />
            </a>
          )}
        </div>
      )}

      <PredictionCentre data={data} mode={view} />
    </div>
  );
}
