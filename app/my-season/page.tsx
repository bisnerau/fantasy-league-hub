import { draftRecapContent } from '@/lib/data/draft-recap-content';
import type { Metadata } from 'next';
import { getSeasonHubData, featureLeagueId } from '@/lib/data/season-hub';
import { getPredictionWeekData } from '@/lib/data/predictions';
import { getLeagueRosters } from '@/lib/sleeper/client';
import { MySeason } from '@/components/season/my-season';

export const metadata: Metadata = {
  title: 'My Season',
  description:
    'Your MAC 12 picks, waiver returns, trades, awards and season progress.',
};
export const dynamic = 'force-dynamic';
export default async function MySeasonPage() {
  const [hub, picks, rosters] = await Promise.allSettled([
    getSeasonHubData({ includeActivity: true }),
    getPredictionWeekData(),
    getLeagueRosters(featureLeagueId),
  ]);
  const data = hub.status === 'fulfilled' ? hub.value : null;
  if (!data)
    return (
      <section className="linear-panel rounded-xl p-5">
        <h1 className="text-2xl font-semibold">My Season</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Season data is unavailable right now. Your picks remain on the Weekly
          picks page.
        </p>
        <a
          className="mt-3 inline-block text-primary underline"
          href="/my-season"
        >
          Retry
        </a>
      </section>
    );
  return (
    <MySeason
      data={data}
      drafts={draftRecapContent.entries.map((e) => ({
        rosterId: e.rosterId,
        grade: e.grade,
        gradeScore: e.gradeScore,
        predictedFinish: e.predictedFinish,
        headline: e.headline,
      }))}
      picks={
        picks.status === 'fulfilled' && picks.value.leagueId === featureLeagueId
          ? picks.value
          : null
      }
      rosters={rosters.status === 'fulfilled' ? rosters.value : null}
    />
  );
}
