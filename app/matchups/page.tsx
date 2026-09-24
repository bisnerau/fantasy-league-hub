import type { Metadata } from 'next';
import { CalendarDays, Trophy } from 'lucide-react';
import { PredictionCentre } from '@/components/predictions/prediction-centre';
import { getPredictionWeekData } from '@/lib/data/predictions';
import {
  getMatchOfTheWeek,
  orderMatchupsForDisplay,
} from '@/lib/data/match-of-the-week';
import { cn } from '@/lib/utils';
import { getWeeklyRivalries } from '@/lib/data/rivalries';

export const metadata: Metadata = {
  title: 'Weekly Picks',
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
  const rivalries = view === 'weekly' ? await getWeeklyRivalries(data) : {};
  const matchOfTheWeek = getMatchOfTheWeek(data);

  const tabs = (
    <nav
      className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/30 p-1"
      aria-label="Prediction views"
    >
      <a
        href={`/matchups?week=${data.week}`}
        className={cn(
          'flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors',
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
          'flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors',
          view === 'standings'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-white/[0.035] hover:text-foreground',
        )}
        aria-current={view === 'standings' ? 'page' : undefined}
      >
        <Trophy className="size-3.5" /> Prediction standings
      </a>
    </nav>
  );

  return (
    <PredictionCentre
      key={`${data.season}-${data.week}-${view}`}
      data={{
        ...data,
        matchups: orderMatchupsForDisplay(data.matchups, matchOfTheWeek),
      }}
      matchOfTheWeek={matchOfTheWeek}
      rivalries={rivalries}
      mode={view}
      tabs={tabs}
    />
  );
}
