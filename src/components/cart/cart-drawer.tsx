"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductVisual } from "@/components/product/product-visual";
import { formatCents } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function CartDrawer() {
  const { items, totals, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  const freeShipPct = Math.min(
    100,
    Math.round(
      (totals.subtotalCents / siteConfig.freeShippingThresholdCents) * 100,
    ),
  );

  return (
    <div className={isOpen ? "" : "pointer-events-none"} aria-hidden={!isOpen}>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-ink-950/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[91] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-ink-700" />
            <h2 className="text-base font-semibold text-ink-950">
              Your cart{totals.itemCount > 0 && ` (${totals.itemCount})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-50 hover:text-ink-900"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50">
              <ShoppingBag className="h-7 w-7 text-ink-400" />
            </div>
            <div>
              <p className="font-semibold text-ink-950">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink-500">
                Browse our research peptide catalogue to get started.
              </p>
            </div>
            <Button onClick={closeCart} variant="primary">
              Shop peptides
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-ink-100 bg-ink-50/60 px-5 py-3">
              {totals.freeShippingRemainingCents > 0 ? (
                <p className="text-xs text-ink-600">
                  Add{" "}
                  <span className="font-semibold text-ink-900">
                    {formatCents(totals.freeShippingRemainingCents)}
                  </span>{" "}
                  more for free shipping
                </p>
              ) : (
                <p className="text-xs font-semibold text-aurora-700">
                  You&apos;ve unlocked free shipping
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-frost-500 transition-all"
                  style={{ width: `${freeShipPct}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <ul className="flex-1 divide-y divide-ink-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-3 py-4">
                  <Link
                    href={`/shop/${item.productSlug}`}
                    onClick={closeCart}
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
                  >
                    <ProductVisual
                      name={item.productName}
                      categorySlug={item.categorySlug}
                      imageUrl={item.imageUrl}
                      compact
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/shop/${item.productSlug}`}
                        onClick={closeCart}
                        className="truncate text-sm font-semibold text-ink-950 hover:text-frost-700"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-ink-400 hover:text-red-600"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-ink-500">{item.variantName}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-ink-200">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 text-ink-600 hover:text-ink-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1.5 text-ink-600 hover:text-ink-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink-950">
                        {formatCents(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <footer className="border-t border-ink-100 px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-ink-900">{formatCents(totals.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt>Estimated tax</dt>
                  <dd className="font-medium text-ink-900">{formatCents(totals.taxCents)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-ink-900">
                    {totals.shippingCents === 0 ? "Free" : formatCents(totals.shippingCents)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-950">
                  <dt>Total</dt>
                  <dd>{formatCents(totals.totalCents)}</dd>
                </div>
              </dl>
              <div className="mt-4 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className={buttonVariants({ variant: "primary", className: "w-full" })}
                >
                  Proceed to checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full" })}
                >
                  View full cart
                </Link>
              </div>
              <p className="mt-3 text-center text-[11px] text-ink-400">
                Research Use Only · Not for human or veterinary use
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
