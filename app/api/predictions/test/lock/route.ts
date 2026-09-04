import { predictionTestLeagueId } from '@/lib/data/predictions';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return Response.json({ ok: false }, { status: 503 });
  }

  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;
  if (!token) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(token);
  if (userError || !user) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) {
    return Response.json({ ok: false }, { status: 403 });
  }

  const season = new Date().getUTCFullYear();
  const locksAt = new Date().toISOString();
  const { data: week, error: weekError } = await admin
    .from('prediction_weeks')
    .update({ locks_at: locksAt })
    .eq('league_id', predictionTestLeagueId)
    .eq('season', season)
    .eq('week', 1)
    .select('id')
    .maybeSingle();

  if (weekError || !week) {
    return Response.json({ ok: false }, { status: 404 });
  }

  const { data: matchups, error: matchupError } = await admin
    .from('prediction_matchups')
    .update({ status: 'locked' })
    .eq('prediction_week_id', week.id)
    .select('id');
  if (matchupError) {
    return Response.json({ ok: false }, { status: 500 });
  }

  const matchupIds = (matchups ?? []).map((matchup) => matchup.id);
  const { count: voteCount } = matchupIds.length
    ? await admin
        .from('prediction_votes')
        .select('matchup_id', { count: 'exact', head: true })
        .in('matchup_id', matchupIds)
    : { count: 0 };

  return Response.json({ ok: true, votes: voteCount ?? 0 });
}
