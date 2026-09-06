import { syncPredictionWeeksForCron } from '@/lib/data/predictions';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    const weeks = await syncPredictionWeeksForCron();
    const ready = weeks.every((week) => week.ok);
    return Response.json(
      { ok: ready, synced: weeks },
      { status: ready ? 200 : 503 },
    );
  } catch {
    return Response.json(
      {
        ok: false,
        error: 'Prediction sync unavailable. Pending weeks will be retried.',
      },
      { status: 503 },
    );
  }
}
