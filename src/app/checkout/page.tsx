"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, HelpCircle, Loader2, Lock, Search } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { ProductVisual } from "@/components/product/product-visual";
import { formatCents, cn } from "@/lib/utils";
import { canadianProvinces } from "@/config/site";
import { placeOrder } from "./actions";

type ShippingMethod = "standard" | "expedited";
type PaymentMethod = "card" | "paypal";

const SHIPPING: Record<ShippingMethod, { label: string; eta: string; cents: number }> = {
  standard: { label: "Standard shipping", eta: "3–5 business days", cents: 700 },
  expedited: { label: "Expedited shipping", eta: "1–2 business days", cents: 1000 },
};

// Simple demo discount codes (presentational — real coupons arrive with the payments phase).
const DISCOUNTS: Record<string, { kind: "pct"; value: number; label: string }> = {
  RESEARCH10: { kind: "pct", value: 10, label: "RESEARCH10" },
  LAB15: { kind: "pct", value: 15, label: "LAB15" },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart, isReady } = useCart();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [shipping, setShipping] = React.useState<ShippingMethod>("standard");
  const [payment, setPayment] = React.useState<PaymentMethod>("card");
  const [codeInput, setCodeInput] = React.useState("");
  const [discount, setDiscount] = React.useState<{ label: string; cents: number } | null>(null);
  const [codeMsg, setCodeMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isReady && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [isReady, items.length, submitting, router]);

  const subtotalCents = totals.subtotalCents;
  const shippingCents = SHIPPING[shipping].cents;
  const taxCents = totals.taxCents;
  const discountCents = discount?.cents ?? 0;
  const totalCents = Math.max(0, subtotalCents + shippingCents + taxCents - discountCents);

  const applyCode = () => {
    const key = codeInput.trim().toUpperCase();
    if (!key) {
      setCodeMsg("Enter a discount code or gift card.");
      return;
    }
    const found = DISCOUNTS[key];
    if (!found) {
      setDiscount(null);
      setCodeMsg("That code isn't recognised.");
      return;
    }
    const cents = Math.round((subtotalCents * found.value) / 100);
    setDiscount({ label: found.label, cents });
    setCodeMsg(`Applied ${found.label} — ${found.value}% off.`);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Please confirm the Research Use Only terms to continue.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    setSubmitting(true);

    const noteParts = [
      String(fd.get("notes") ?? "").trim(),
      `Shipping: ${SHIPPING[shipping].label}`,
      `Payment preference: ${payment === "card" ? "Credit card" : "PayPal"}`,
      discount ? `Discount: ${discount.label}` : "",
    ].filter(Boolean);

    const result = await placeOrder({
      email: String(fd.get("email") ?? ""),
      fullName: `${firstName} ${lastName}`.trim(),
      organization: String(fd.get("organization") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      poNumber: String(fd.get("poNumber") ?? ""),
      notes: noteParts.join(" · "),
      address: {
        line1: String(fd.get("line1") ?? ""),
        line2: String(fd.get("line2") ?? ""),
        city: String(fd.get("city") ?? ""),
        province: String(fd.get("province") ?? ""),
        postalCode: String(fd.get("postalCode") ?? ""),
        country: "CA",
      },
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      acceptedTerms: true,
    });

    if (result.ok && result.orderNumber) {
      clearCart();
      const q = new URLSearchParams({ order: result.orderNumber });
      if (result.demo) q.set("demo", "1");
      router.push(`/checkout/confirmation?${q.toString()}`);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
      {/* ── Left: form ─────────────────────────────────────────── */}
      <div className="px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-xl space-y-10">
          {error && <Alert tone="error">{error}</Alert>}

          {/* Delivery address */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">Delivery Address</h2>
            <p className="mt-1 text-sm text-ink-500">We ship to Canadian research addresses only.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="First name" htmlFor="firstName" required>
                <Input id="firstName" name="firstName" required autoComplete="given-name" placeholder="Enter first name" />
              </Field>
              <Field label="Last name" htmlFor="lastName" required>
                <Input id="lastName" name="lastName" required autoComplete="family-name" placeholder="Enter last name" />
              </Field>

              <Field label="Work email" htmlFor="email" required className="sm:col-span-2">
                <Input id="email" name="email" type="email" required autoComplete="email" placeholder="jane@university.ca" />
              </Field>

              <Field label="Address" htmlFor="line1" required className="sm:col-span-2">
                <div className="relative">
                  <Input id="line1" name="line1" required autoComplete="address-line1" placeholder="Enter delivery address" className="pr-10" />
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </div>
              </Field>
              <Field label="Apt / suite / lab" htmlFor="line2" className="sm:col-span-2">
                <Input id="line2" name="line2" autoComplete="address-line2" placeholder="Building / Suite / Lab (optional)" />
              </Field>

              <Field label="City" htmlFor="city" required>
                <Input id="city" name="city" required autoComplete="address-level2" placeholder="Toronto" />
              </Field>
              <Field label="Province" htmlFor="province" required>
                <Select id="province" name="province" required defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  {canadianProvinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Postal code" htmlFor="postalCode" required className="sm:col-span-2">
                <Input id="postalCode" name="postalCode" required autoComplete="postal-code" placeholder="M5V 2T6" />
              </Field>

              <Field label="Phone" htmlFor="phone" className="sm:col-span-2">
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-ink-200 bg-ink-50 px-3 text-sm text-ink-600">
                    +1
                  </span>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    className="rounded-l-none"
                  />
                </div>
              </Field>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
              <input
                type="checkbox"
                name="saveInfo"
                className="h-4 w-4 rounded border-ink-300 text-frost-500 focus:ring-frost-500"
              />
              Save this information for next time
            </label>

            {/* Optional B2B details */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Lab / institution" htmlFor="organization" hint="Optional">
                <Input id="organization" name="organization" placeholder="Dept. of Biochemistry" />
              </Field>
              <Field label="PO number" htmlFor="poNumber" hint="For institutional orders">
                <Input id="poNumber" name="poNumber" placeholder="PO-2026-0001" />
              </Field>
              <input type="hidden" name="notes" value="" />
            </div>
          </section>

          {/* Shipping method */}
          <section>
            <h2 className="text-xl font-bold tracking-tight text-ink-900">Shipping method</h2>
            <div className="mt-4 space-y-3">
              {(Object.keys(SHIPPING) as ShippingMethod[]).map((key) => {
                const opt = SHIPPING[key];
                const active = shipping === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setShipping(key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                      active ? "border-ink-900 bg-ink-50/60 ring-1 ring-ink-900" : "border-ink-200 hover:border-ink-300",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        active ? "border-ink-900" : "border-ink-300",
                      )}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-ink-900" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink-900">{opt.label}</span>
                      <span className="block text-xs text-ink-500">{opt.eta}</span>
                    </span>
                    <span className="text-sm font-semibold text-ink-900">{formatCents(opt.cents)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-xl font-bold tracking-tight text-ink-900">Payment</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-ink-200">
              {/* Credit card */}
              <button
                type="button"
                onClick={() => setPayment("card")}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3.5 text-left",
                  payment === "card" ? "bg-ink-50/60" : "",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    payment === "card" ? "border-ink-900" : "border-ink-300",
                  )}
                >
                  {payment === "card" && <span className="h-2.5 w-2.5 rounded-full bg-ink-900" />}
                </span>
                <CreditCard className="h-4 w-4 text-ink-700" />
                <span className="flex-1 text-sm font-semibold text-ink-900">Credit card</span>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                  <span className="rounded bg-ink-100 px-1.5 py-0.5">VISA</span>
                  <span className="rounded bg-ink-100 px-1.5 py-0.5">MC</span>
                  <span className="rounded bg-ink-100 px-1.5 py-0.5">AMEX</span>
                </span>
              </button>

              {payment === "card" && (
                <div className="space-y-3 border-t border-ink-200 p-4">
                  <div className="relative">
                    <Input placeholder="Card number" inputMode="numeric" autoComplete="cc-number" className="pr-10" />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Expiration (MM / YY)" autoComplete="cc-exp" />
                    <div className="relative">
                      <Input placeholder="Security code" inputMode="numeric" autoComplete="cc-csc" className="pr-10" />
                      <HelpCircle className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    </div>
                  </div>
                  <Input placeholder="Name on card" autoComplete="cc-name" />
                </div>
              )}

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setPayment("paypal")}
                className={cn(
                  "flex w-full items-center gap-3 border-t border-ink-200 px-4 py-3.5 text-left",
                  payment === "paypal" ? "bg-ink-50/60" : "",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    payment === "paypal" ? "border-ink-900" : "border-ink-300",
                  )}
                >
                  {payment === "paypal" && <span className="h-2.5 w-2.5 rounded-full bg-ink-900" />}
                </span>
                <span className="flex-1 text-sm font-semibold text-ink-900">PayPal</span>
                <span className="font-mono text-xs font-bold italic text-[#003087]">Pay</span>
                <span className="font-mono text-xs font-bold italic text-[#009cde]">Pal</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Card fields are a preview of the payment step. Live processing (Stripe / PayPal) activates
              in the next phase — orders are recorded and reviewed before dispatch.
            </p>
          </section>
        </div>
      </div>

      {/* ── Right: order summary ───────────────────────────────── */}
      <div className="border-t border-ink-100 bg-[#f7f8f9] px-5 py-10 sm:px-8 lg:border-l lg:border-t-0 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-xl lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">Order Summary</h2>

          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.variantId} className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-ink-200 bg-white">
                  <ProductVisual
                    name={item.productName}
                    molecularFormula={item.molecularFormula}
                    categorySlug={item.categorySlug}
                    imageUrl={item.imageUrl}
                    compact
                  />
                  {item.quantity > 1 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ink-900 px-1 text-[11px] font-semibold text-white">
                      {item.quantity}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{item.productName}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{item.variantName}</p>
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-ink-900">
                  {formatCents(item.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          {/* Discount */}
          <div className="mt-6 flex gap-2">
            <Input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Discount code or gift card"
              className="flex-1"
            />
            <Button type="button" variant="primary" onClick={applyCode} className="shrink-0">
              Apply
            </Button>
          </div>
          {codeMsg && (
            <p className={cn("mt-2 text-xs", discount ? "text-frost-700" : "text-ink-500")}>{codeMsg}</p>
          )}

          {/* Totals */}
          <dl className="mt-6 space-y-3 border-t border-ink-200 pt-6 text-sm">
            <div className="flex justify-between text-ink-600">
              <dt>Subtotal</dt>
              <dd className="font-medium text-ink-900">{formatCents(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-ink-600">
              <dt className="inline-flex items-center gap-1">
                Shipping <HelpCircle className="h-3.5 w-3.5 text-ink-400" />
              </dt>
              <dd className="font-medium text-ink-900">{formatCents(shippingCents)}</dd>
            </div>
            <div className="flex justify-between text-ink-600">
              <dt>Tax (GST/HST)</dt>
              <dd className="font-medium text-ink-900">{formatCents(taxCents)}</dd>
            </div>
            <div className="flex justify-between text-ink-600">
              <dt>Discount</dt>
              <dd className="font-medium text-ink-900">
                {discountCents ? `−${formatCents(discountCents)}` : formatCents(0)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink-200 pt-3 text-lg font-bold text-ink-900">
              <dt>Total</dt>
              <dd>{formatCents(totalCents)}</dd>
            </div>
          </dl>

          <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-xs text-ink-600">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-ink-300 text-frost-500 focus:ring-frost-500"
            />
            <span>
              I confirm these products are for <strong>laboratory research use only</strong>, not for
              human or veterinary use, and I accept the{" "}
              <Link href="/legal/terms" className="text-frost-700 underline" target="_blank">
                terms of sale
              </Link>
              .
            </span>
          </label>

          <Button type="submit" size="lg" variant="primary" className="mt-6 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Placing order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pay now · {formatCents(totalCents)}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
