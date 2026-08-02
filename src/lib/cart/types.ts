export interface CartItem {
  variantId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  sku: string;
  priceCents: number;
  quantity: number;
  categorySlug?: string | null;
  molecularFormula?: string | null;
  imageUrl?: string | null;
  maxStock?: number;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  freeShippingRemainingCents: number;
}
