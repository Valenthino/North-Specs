"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/catalog/types";
import { fromPriceCents } from "@/lib/catalog/types";

/** Adds the lowest-priced in-stock variant to the cart from a product card. */
export function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const variant =
    product.variants.filter((v) => v.isActive && v.stockQuantity > 0)[0] ??
    product.variants.filter((v) => v.isActive)[0];

  if (!variant) return null;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      variantId: variant.id,
      productSlug: product.slug,
      productName: product.name,
      variantName: variant.name,
      sku: variant.sku,
      priceCents: variant.priceCents,
      categorySlug: product.categorySlug,
      molecularFormula: product.molecularFormula,
      imageUrl: product.imageUrl,
      maxStock: variant.stockQuantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-ink-900 text-white transition-colors hover:bg-frost-500"
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}

export function priceLabel(product: Product) {
  return fromPriceCents(product);
}
