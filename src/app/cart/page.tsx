"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Container } from "@/components/ui/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductVisual } from "@/components/product/product-visual";
import { RuoNotice } from "@/components/compliance/ruo-notice";
import { formatCents } from "@/lib/utils";

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem, isReady } = useCart();

  if (isReady && items.length === 0) {
    return (
      <Container className="py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-50">
            <ShoppingBag className="h-9 w-9 text-ink-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink-950">Your cart is empty</h1>
          <p className="mt-2 text-ink-500">
            Browse our catalogue of research-grade peptides to get started.
          </p>
          <Link href="/shop" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-6" })}>
            Shop peptides <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-ink-950">Your cart</h1>
      <p className="mt-1 text-ink-500">{totals.itemCount} item{totals.itemCount !== 1 && "s"}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <div>
          <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 p-4 sm:p-5">
                <Link
                  href={`/shop/${item.productSlug}`}
                  className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl"
                >
                  <ProductVisual name={item.productName} categorySlug={item.categorySlug} imageUrl={item.imageUrl} compact />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/shop/${item.productSlug}`}
                        className="font-semibold text-ink-950 hover:text-frost-700"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-ink-500">
                        {item.variantName} · SKU {item.sku}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-semibold text-ink-950">
                      {formatCents(item.priceCents * item.quantity)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-lg border border-ink-200">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-2 text-ink-600 hover:text-ink-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-2 text-ink-600 hover:text-ink-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-frost-700 hover:underline">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink-950">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
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
                <dt>Estimated tax (GST/HST)</dt>
                <dd className="font-medium text-ink-900">{formatCents(totals.taxCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-3 text-base font-bold text-ink-950">
                <dt>Total</dt>
                <dd>{formatCents(totals.totalCents)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className={buttonVariants({ variant: "primary", size: "lg", className: "mt-5 w-full" })}
            >
              Proceed to checkout <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-3 text-center text-xs text-ink-400">
              Taxes calculated at checkout by province.
            </p>
          </div>
          <div className="mt-4">
            <RuoNotice compact />
          </div>
        </div>
      </div>
    </Container>
  );
}
