"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { RuoNotice } from "@/components/compliance/ruo-notice";
import { formatCents } from "@/lib/utils";
import { canadianProvinces } from "@/config/site";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart, isReady } = useCart();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  React.useEffect(() => {
    if (isReady && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [isReady, items.length, submitting, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Please confirm the Research Use Only terms to continue.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    setSubmitting(true);

    const result = await placeOrder({
      email: String(fd.get("email") ?? ""),
      fullName: String(fd.get("fullName") ?? ""),
      organization: String(fd.get("organization") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      poNumber: String(fd.get("poNumber") ?? ""),
      notes: String(fd.get("notes") ?? ""),
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
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-ink-950">Checkout</h1>
      <p className="mt-1 text-ink-500">Complete your research order</p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="space-y-8">
          {error && <Alert tone="error">{error}</Alert>}

          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink-950">Contact &amp; organization</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="fullName" required className="sm:col-span-1">
                <Input id="fullName" name="fullName" required autoComplete="name" placeholder="Dr. Jane Researcher" />
              </Field>
              <Field label="Work email" htmlFor="email" required>
                <Input id="email" name="email" type="email" required autoComplete="email" placeholder="jane@university.ca" />
              </Field>
              <Field label="Lab / institution" htmlFor="organization" hint="Optional but recommended">
                <Input id="organization" name="organization" placeholder="Dept. of Biochemistry" />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(000) 000-0000" />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink-950">Shipping address</h2>
            <p className="mt-1 text-sm text-ink-500">We ship to Canadian research addresses only.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Address line 1" htmlFor="line1" required className="sm:col-span-2">
                <Input id="line1" name="line1" required autoComplete="address-line1" placeholder="123 Research Blvd" />
              </Field>
              <Field label="Address line 2" htmlFor="line2" className="sm:col-span-2">
                <Input id="line2" name="line2" autoComplete="address-line2" placeholder="Building / Suite / Lab" />
              </Field>
              <Field label="City" htmlFor="city" required>
                <Input id="city" name="city" required autoComplete="address-level2" placeholder="Toronto" />
              </Field>
              <Field label="Province" htmlFor="province" required>
                <Select id="province" name="province" required defaultValue="">
                  <option value="" disabled>
                    Select province
                  </option>
                  {canadianProvinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Postal code" htmlFor="postalCode" required>
                <Input id="postalCode" name="postalCode" required autoComplete="postal-code" placeholder="M5V 2T6" />
              </Field>
              <Field label="Country" htmlFor="country">
                <Input id="country" name="country" value="Canada" readOnly className="bg-ink-50" />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink-950">Purchase order &amp; notes</h2>
            <div className="mt-4 grid gap-4">
              <Field label="PO number" htmlFor="poNumber" hint="For institutional purchase orders">
                <Input id="poNumber" name="poNumber" placeholder="PO-2026-0001" />
              </Field>
              <Field label="Order notes" htmlFor="notes">
                <Textarea id="notes" name="notes" placeholder="Delivery instructions, grant reference, etc." />
              </Field>
            </div>
          </section>

          <RuoNotice />
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink-950">Order summary</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.variantId} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="block font-medium text-ink-900">{item.productName}</span>
                    <span className="text-ink-500">
                      {item.variantName} × {item.quantity}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-medium text-ink-900">
                    {formatCents(item.priceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-ink-900">{formatCents(totals.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Shipping</dt>
                <dd className="font-medium text-ink-900">
                  {totals.shippingCents === 0 ? "Free" : formatCents(totals.shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Tax (GST/HST)</dt>
                <dd className="font-medium text-ink-900">{formatCents(totals.taxCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-950">
                <dt>Total</dt>
                <dd>{formatCents(totals.totalCents)}</dd>
              </div>
            </dl>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs text-ink-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-frost-600 focus:ring-frost-500"
              />
              <span>
                I confirm these products are for <strong>laboratory research use only</strong>, not
                for human or veterinary use, and I accept the{" "}
                <Link href="/legal/terms" className="text-frost-700 underline" target="_blank">
                  terms of sale
                </Link>
                .
              </span>
            </label>

            <Button type="submit" size="lg" variant="primary" className="mt-5 w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Placing order…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Place order · {formatCents(totals.totalCents)}
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-[11px] text-ink-400">
              Payment processing (Stripe) is added in a later phase. Orders are recorded and reviewed
              before dispatch.
            </p>
          </div>
        </div>
      </form>
    </Container>
  );
}
