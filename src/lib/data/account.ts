import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { OrderRow, OrderItemRow, ProfileRow } from "@/lib/supabase/database.types";

export interface SessionProfile {
  userId: string;
  email: string;
  profile: ProfileRow | null;
}

/** Returns the signed-in user's profile, or null when signed out. */
export const getSessionProfile = cache(async (): Promise<SessionProfile | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { userId: user.id, email: user.email ?? "", profile: profile ?? null };
});

export type OrderWithItems = OrderRow & { items: OrderItemRow[] };

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  // Embedded joins aren't modelled in our hand-written Relationships, so cast
  // through unknown at this boundary.
  return data as unknown as OrderWithItems[];
}

export { isSupabaseConfigured };
