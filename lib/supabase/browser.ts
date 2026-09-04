'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from './config';

let client: SupabaseClient | null = null;

export function getBrowserSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(supabaseUrl, supabasePublishableKey);
  return client;
}
