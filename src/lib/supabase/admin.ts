import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseAdminConfigured } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Privileged Supabase client using the service-role key.
 * SERVER ONLY — bypasses Row Level Security. Never import into client code.
 * Returns `null` when the service-role key is not configured.
 */
export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }
  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
