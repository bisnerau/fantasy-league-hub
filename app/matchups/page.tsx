import type { Metadata } from 'next';
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Sparkles,
  Swords,
} from 'lucide-react';
import { PredictionCentre } from '@/components/predictions/prediction-centre';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  getPredictionTestWeekData,
  getPredictionWeekData,
} from '@/lib/data/predictions';
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
  searchParams?: Promise<{ week?: string; test?: string }>;
}) {
  const params = await searchParams;
  const isTestWeek = params?.test === '1';
  const requestedWeek = Number(params?.week);
  const data = isTestWeek
    ? await getPredictionTestWeekData()
    : await getPredictionWeekData(
        Number.isInteger(requestedWeek) ? requestedWeek : undefined,
      );
  const earliestWeek = 1;
  const latestWeek = Math.max(1, data.currentWeek);
  const previousWeek = Math.max(earliestWeek, data.week - 1);
  const nextWeek = Math.min(latestWeek, data.week + 1);

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="draft-page-heading">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-kicker">Matchup predictor</span>
            <Badge
              variant="outline"
              className={cn(
                'text-[9px]',
                isTestWeek
                  ? 'border-amber-300/15 bg-amber-300/[0.055] text-amber-200'
                  : 'border-primary/15 bg-primary/[0.055] text-primary',
              )}
            >
              {isTestWeek ? <FlaskConical /> : <Sparkles />}
              {isTestWeek ? 'Temporary test' : 'New for 2026'}
            </Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[46px]">
            {isTestWeek
              ? 'Try the complete voting flow.'
              : 'Call every game before kickoff.'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {isTestWeek
              ? 'These six practice matchups are separate from the season and will be deleted after testing.'
              : 'Six weekly picks. Hidden until Sunday. Every correct winner counts toward the season prediction title.'}
          </p>
        </div>
        <div className="hidden size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.065] text-primary sm:flex">
          <Swords className="size-6" />
        </div>
      </section>

      {isTestWeek ? (
        <div className="flex items-center justify-between rounded-xl border border-amber-300/10 bg-amber-300/[0.025] p-2 pl-3">
          <p className="text-[10px] text-amber-100/75">
            Practice only · votes do not count toward the season table
          </p>
          <a
            href="/matchups"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Back to Week 1 <ChevronRight />
          </a>
        </div>
      ) : (
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
            <p className="text-[9px] text-muted-foreground">
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

      <PredictionCentre data={data} />
    </div>
  );
}
