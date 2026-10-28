import { createClient } from '@supabase/supabase-js';
import {
  supabaseUrl,
  supabasePublishableKey,
  isSupabaseConfigured,
} from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

// Never cache a commissioner response in a browser or shared CDN.
const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
const denied = (status: number) =>
  Response.json({ allowed: false }, { status, headers });

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return denied(401);
  if (!isSupabaseConfigured) return denied(503);
  try {
    // Verify the bearer with Auth, then read its own protected database profile.
    // User-editable metadata and client-supplied roster IDs never grant access.
    const client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: identity, error: authError } =
      await client.auth.getUser(token);
    if (authError || !identity.user) return denied(401);
    const { data: profile, error } = await client
      .from('profiles')
      .select('id,roster_id,is_admin,login_slug')
      .eq('id', identity.user.id)
      .maybeSingle();
    if (error) return denied(503);
    if (
      !profile ||
      profile.id !== identity.user.id ||
      profile.is_admin !== true ||
      profile.roster_id !== 1 ||
      profile.login_slug !== 'emmet-burns'
    )
      return denied(403);
    if (new URL(request.url).searchParams.get('access') === '1') {
      return Response.json({ allowed: true }, { headers });
    }
    const { halftimeReport } = await import('@/lib/data/halftime/report');
    return Response.json(
      { allowed: true, report: halftimeReport },
      { headers },
    );
  } catch {
    return denied(503);
  }
}
