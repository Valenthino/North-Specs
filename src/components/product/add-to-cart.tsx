"use client";

import * as React from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCents, cn } from "@/lib/utils";
import type { Product, Variant } from "@/lib/catalog/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const activeVariants = product.variants.filter((v) => v.isActive);
  const [selected, setSelected] = React.useState<Variant | undefined>(
    activeVariants.find((v) => v.stockQuantity > 0) ?? activeVariants[0],
  );
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  if (!selected) {
    return (
      <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
        This product is not currently available. Please contact us for availability.
      </div>
    );
  }

  const outOfStock = selected.stockQuantity <= 0;

  const add = () => {
    addItem(
      {
        variantId: selected.id,
        productSlug: product.slug,
        productName: product.name,
        variantName: selected.name,
        sku: selected.sku,
        priceCents: selected.priceCents,
        categorySlug: product.categorySlug,
        molecularFormula: product.molecularFormula,
        imageUrl: product.imageUrl,
        maxStock: selected.stockQuantity,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="space-y-5">
      {/* Variant selector */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink-800">Size</p>
        <div className="flex flex-wrap gap-2">
          {activeVariants.map((v) => {
            const isSel = v.id === selected.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setSelected(v);
                  setQty(1);
                }}
                className={cn(
                  "min-w-[92px] rounded-xl border px-4 py-2.5 text-left transition-all",
                  isSel
                    ? "border-frost-500 bg-frost-50 ring-1 ring-frost-500"
                    : "border-ink-200 bg-white hover:border-ink-300",
                )}
              >
                <span className="block text-sm font-bold text-ink-950">{v.name}</span>
                <span className="block text-xs text-ink-500">{formatCents(v.priceCents)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price + quantity */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-ink-950">{formatCents(selected.priceCents)}</p>
          <p className={cn("text-sm font-medium", outOfStock ? "text-amber-600" : "text-aurora-700")}>
            {outOfStock ? "Available on backorder" : `${selected.stockQuantity} in stock`}
          </p>
        </div>
        <div className="inline-flex items-center rounded-xl border border-ink-200">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-2.5 text-ink-600 hover:text-ink-900"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-base font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="p-2.5 text-ink-600 hover:text-ink-900"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button onClick={add} size="lg" variant="primary" className="w-full">
        {added ? (
          <>
            <Check className="h-5 w-5" /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" /> Add to cart · {formatCents(selected.priceCents * qty)}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-ink-400">
        SKU {selected.sku} · Research Use Only · Not for human or veterinary use
      </p>
    </div>
  );
}
