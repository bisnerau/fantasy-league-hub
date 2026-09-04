import type { Metadata } from 'next';
import { ChevronLeft, ChevronRight, Sparkles, Swords } from 'lucide-react';
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
  searchParams?: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const requestedWeek = Number(params?.week);
  const data = await getPredictionWeekData(
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
              className="border-primary/15 bg-primary/[0.055] text-[9px] text-primary"
            >
              <Sparkles /> New for 2026
            </Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[46px]">
            Call every game before kickoff.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Six weekly picks. Hidden until Sunday. Every correct winner counts
            toward the season prediction title.
          </p>
        </div>
        <div className="hidden size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.065] text-primary sm:flex">
          <Swords className="size-6" />
        </div>
      </section>

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
          <p className="font-heading text-sm font-semibold">Week {data.week}</p>
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

      <PredictionCentre data={data} />
    </div>
  );
}
