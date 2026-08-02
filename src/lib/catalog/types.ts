/**
 * UI-facing domain types. Both the Supabase queries and the built-in demo
 * catalogue produce these shapes so pages never care about the data source.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  productCount?: number;
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  sizeMg?: number | null;
  priceCents: number;
  compareAtPriceCents?: number | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface Coa {
  id: string;
  batchNumber: string;
  purity?: string | null;
  testMethod?: string | null;
  testDate?: string | null;
  fileUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  casNumber?: string | null;
  molecularFormula?: string | null;
  molecularWeight?: number | null;
  sequence?: string | null;
  synonyms?: string[];
  purity?: string | null;
  appearance?: string | null;
  form?: string | null;
  source?: string | null;
  solubility?: string | null;
  storage?: string | null;
  reconstitution?: string | null;
  researchAreas: string[];
  imageUrl?: string | null;
  isFeatured: boolean;
  researchUseOnly: boolean;
  variants: Variant[];
  coas: Coa[];
}

/** Lowest active price across a product's variants (in cents). */
export function fromPriceCents(product: Product): number | null {
  const active = product.variants.filter((v) => v.isActive);
  if (active.length === 0) return null;
  return Math.min(...active.map((v) => v.priceCents));
}

/** True if any variant is in stock. */
export function inStock(product: Product): boolean {
  return product.variants.some((v) => v.isActive && v.stockQuantity > 0);
}
