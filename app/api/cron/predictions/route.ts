import { syncPredictionWeeksForCron } from '@/lib/data/predictions';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const weeks = await syncPredictionWeeksForCron();
  const ready = weeks.every((week) => week.databaseReady);
  return Response.json(
    {
      ok: ready,
      synced: weeks.map((week) => ({
        season: week.season,
        week: week.week,
        matchups: week.matchups.length,
        finalized: week.finalized,
      })),
    },
    { status: ready ? 200 : 503 },
  );
}
