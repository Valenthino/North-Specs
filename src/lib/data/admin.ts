import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "./account";
import type {
  CategoryRow,
  OrderRow,
  OrderItemRow,
  ProductRow,
  ProductVariantRow,
} from "@/lib/supabase/database.types";

/** True when the current user may access the admin area. */
export async function isCurrentUserStaff(): Promise<boolean> {
  const session = await getSessionProfile();
  return session?.profile?.role === "staff" || session?.profile?.role === "admin";
}

export interface AdminStats {
  productCount: number;
  orderCount: number;
  pendingOrders: number;
  revenueCents: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();
  if (!supabase) return { productCount: 0, orderCount: 0, pendingOrders: 0, revenueCents: 0 };

  const [{ count: productCount }, { data: orders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_cents, status"),
  ]);

  const orderList = orders ?? [];
  const revenueCents = orderList
    .filter((o) => !["cancelled", "refunded"].includes(o.status))
    .reduce((sum, o) => sum + o.total_cents, 0);
  const pendingOrders = orderList.filter((o) => o.status === "pending").length;

  return {
    productCount: productCount ?? 0,
    orderCount: orderList.length,
    pendingOrders,
    revenueCents,
  };
}

export type AdminProduct = ProductRow & {
  category: Pick<CategoryRow, "name" | "slug"> | null;
  variants: ProductVariantRow[];
};

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name, slug), variants:product_variants(*)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as AdminProduct[];
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name, slug), variants:product_variants(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as AdminProduct) ?? null;
}

export type AdminOrder = OrderRow & { items: OrderItemRow[] };

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as AdminOrder[];
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as AdminOrder) ?? null;
}

export async function getAdminCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("categories").select("*").order("display_order");
  return data ?? [];
}
