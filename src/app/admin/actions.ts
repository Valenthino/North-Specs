"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserStaff } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import type { OrderStatus } from "@/lib/supabase/database.types";

export interface ActionResult {
  ok?: boolean;
  error?: string;
}

async function getStaffClient() {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase is not configured." as const };
  if (!(await isCurrentUserStaff())) return { error: "Not authorized." as const };
  return { supabase };
}

function toCents(value: FormDataEntryValue | null): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function toList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

/* ─────────────────────────── Products ─────────────────────────── */

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await getStaffClient();
  if ("error" in gate) return { error: gate.error };
  const { supabase } = gate;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };
  const slug = str(formData.get("slug")) ?? slugify(name);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      subtitle: str(formData.get("subtitle")),
      description: str(formData.get("description")),
      category_id: str(formData.get("category_id")),
      cas_number: str(formData.get("cas_number")),
      molecular_formula: str(formData.get("molecular_formula")),
      molecular_weight: formData.get("molecular_weight") ? Number(formData.get("molecular_weight")) : null,
      sequence: str(formData.get("sequence")),
      purity: str(formData.get("purity")),
      appearance: str(formData.get("appearance")),
      form: str(formData.get("form")),
      storage: str(formData.get("storage")),
      reconstitution: str(formData.get("reconstitution")),
      research_areas: toList(formData.get("research_areas")),
      image_url: str(formData.get("image_url")),
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Could not create product." };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect(`/admin/products/${data.id}`);
}

export async function updateProductAction(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await getStaffClient();
  if ("error" in gate) return { error: gate.error };
  const { supabase } = gate;

  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      slug: str(formData.get("slug")) ?? undefined,
      subtitle: str(formData.get("subtitle")),
      description: str(formData.get("description")),
      category_id: str(formData.get("category_id")),
      cas_number: str(formData.get("cas_number")),
      molecular_formula: str(formData.get("molecular_formula")),
      molecular_weight: formData.get("molecular_weight") ? Number(formData.get("molecular_weight")) : null,
      sequence: str(formData.get("sequence")),
      purity: str(formData.get("purity")),
      appearance: str(formData.get("appearance")),
      form: str(formData.get("form")),
      storage: str(formData.get("storage")),
      reconstitution: str(formData.get("reconstitution")),
      research_areas: toList(formData.get("research_areas")),
      image_url: str(formData.get("image_url")),
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  return { ok: true };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const gate = await getStaffClient();
  if ("error" in gate) return;
  const id = String(formData.get("id") ?? "");
  await gate.supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

/* ─────────────────────────── Variants ─────────────────────────── */

export async function addVariantAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await getStaffClient();
  if ("error" in gate) return { error: gate.error };
  const { supabase } = gate;

  const productId = String(formData.get("product_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  if (!name || !sku) return { error: "Variant name and SKU are required." };

  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    name,
    sku,
    size_mg: formData.get("size_mg") ? Number(formData.get("size_mg")) : null,
    price_cents: toCents(formData.get("price")),
    stock_quantity: Number(formData.get("stock_quantity") ?? 0),
    is_active: true,
  });

  if (error) return { error: error.message };
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
  return { ok: true };
}

export async function updateVariantAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await getStaffClient();
  if ("error" in gate) return { error: gate.error };

  const variantId = String(formData.get("variant_id") ?? "");
  const productId = String(formData.get("product_id") ?? "");

  const { error } = await gate.supabase
    .from("product_variants")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      price_cents: toCents(formData.get("price")),
      stock_quantity: Number(formData.get("stock_quantity") ?? 0),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", variantId);

  if (error) return { error: error.message };
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
  return { ok: true };
}

export async function deleteVariantAction(formData: FormData): Promise<void> {
  const gate = await getStaffClient();
  if ("error" in gate) return;
  const variantId = String(formData.get("variant_id") ?? "");
  const productId = String(formData.get("product_id") ?? "");
  await gate.supabase.from("product_variants").delete().eq("id", variantId);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

/* ─────────────────────────── Categories ─────────────────────────── */

export async function createCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await getStaffClient();
  if ("error" in gate) return { error: gate.error };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const { error } = await gate.supabase.from("categories").insert({
    name,
    slug: str(formData.get("slug")) ?? slugify(name),
    short_description: str(formData.get("short_description")),
    description: str(formData.get("description")),
    icon: str(formData.get("icon")),
    display_order: Number(formData.get("display_order") ?? 0),
    is_active: true,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { ok: true };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const gate = await getStaffClient();
  if ("error" in gate) return;
  const id = String(formData.get("id") ?? "");
  await gate.supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

/* ─────────────────────────── Orders ─────────────────────────── */

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "awaiting_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export async function updateOrderStatusAction(
  orderId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await getStaffClient();
  if ("error" in gate) return { error: gate.error };

  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return { error: "Invalid status." };

  const { error } = await gate.supabase
    .from("orders")
    .update({
      status,
      internal_notes: str(formData.get("internal_notes")),
    })
    .eq("id", orderId);

  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
