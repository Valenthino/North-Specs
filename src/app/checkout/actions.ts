"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllProducts } from "@/lib/data/products";
import { siteConfig } from "@/config/site";

const TAX_RATE = 0.13;

const lineSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

const checkoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  organization: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  poNumber: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  address: z.object({
    line1: z.string().min(2),
    line2: z.string().optional().default(""),
    city: z.string().min(1),
    province: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().default("CA"),
  }),
  items: z.array(lineSchema).min(1),
  acceptedTerms: z.literal(true),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

export interface PlaceOrderResult {
  ok: boolean;
  orderNumber?: string;
  demo?: boolean;
  error?: string;
}

export async function placeOrder(raw: CheckoutInput): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order details." };
  }
  const input = parsed.data;

  // Recompute prices server-side from the catalogue (never trust client prices).
  const products = await getAllProducts();
  const variantIndex = new Map(
    products.flatMap((p) =>
      p.variants.map((v) => [v.id, { product: p, variant: v }] as const),
    ),
  );

  const lines = input.items.map((item) => {
    const match = variantIndex.get(item.variantId);
    if (!match) throw new Error(`Unknown product variant: ${item.variantId}`);
    return {
      product_id: match.product.id, // real product UUID when Supabase is live
      variant_id: item.variantId,
      product_name: match.product.name,
      variant_name: match.variant.name,
      sku: match.variant.sku,
      unit_price_cents: match.variant.priceCents,
      quantity: item.quantity,
      total_cents: match.variant.priceCents * item.quantity,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.total_cents, 0);
  const shipping = subtotal >= siteConfig.freeShippingThresholdCents ? 0 : siteConfig.flatShippingCents;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const shippingAddress = {
    recipient_name: input.fullName,
    organization: input.organization,
    line1: input.address.line1,
    line2: input.address.line2,
    city: input.address.city,
    province: input.address.province,
    postal_code: input.address.postalCode,
    country: input.address.country,
    phone: input.phone,
  };

  const supabase = await createClient();

  // Demo mode: Supabase not configured — return a simulated order number.
  if (!supabase) {
    const orderNumber = `NS-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 900000) + 100000,
    )}`;
    return { ok: true, orderNumber, demo: true };
  }

  // Attach to the signed-in user when available.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use the admin client to persist regardless of auth (guest checkout), when available.
  const writer = createAdminClient() ?? supabase;

  const { data: order, error } = await writer
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: input.email,
      status: "pending",
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      tax_cents: tax,
      discount_cents: 0,
      total_cents: total,
      currency: siteConfig.currency,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      po_number: input.poNumber || null,
      customer_notes: input.notes || null,
      payment_status: "unpaid",
      placed_at: new Date().toISOString(),
    })
    .select("id, order_number")
    .single();

  if (error || !order) {
    return { ok: false, error: "We couldn't create your order. Please try again." };
  }

  const { error: itemsError } = await writer.from("order_items").insert(
    lines.map((l) => ({ ...l, order_id: order.id })),
  );

  if (itemsError) {
    return { ok: false, error: "We couldn't save your order items. Please contact support." };
  }

  return { ok: true, orderNumber: order.order_number };
}
