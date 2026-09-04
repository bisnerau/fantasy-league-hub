import { createClient } from '@supabase/supabase-js';
import { supabaseUrl } from './config';

export function getSupabaseAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? '';
  if (!supabaseUrl || !secretKey) return null;

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
