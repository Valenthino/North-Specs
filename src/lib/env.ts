/**
 * Central place to read environment configuration.
 *
 * The storefront is designed to run even when Supabase is not configured yet
 * (it falls back to the built-in demo catalogue), so these getters never throw
 * at import time — callers check `isSupabaseConfigured()` first.
 */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  // Accept both the legacy anon key and the newer publishable key names.
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "",
  // Accept both the legacy service-role key and the newer secret key names.
  supabaseServiceRoleKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "North Specs Labs",
};

/** True when the public Supabase credentials are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** True when the privileged service-role key is present (server only). */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}
