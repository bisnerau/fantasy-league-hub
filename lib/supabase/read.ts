import { createClient } from '@supabase/supabase-js';
import {
  isSupabaseConfigured,
  supabaseUrl,
  supabasePublishableKey,
} from './config';

/** Public metadata only. Page rendering must not require a write-capable key. */
export function getSupabaseReadClient() {
  return isSupabaseConfigured
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
}
