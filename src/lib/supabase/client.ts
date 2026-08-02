"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Browser Supabase client for use in Client Components.
 * Returns `null` when Supabase is not configured so callers can degrade gracefully.
 */
export function createClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
