import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { demoProducts } from "@/lib/catalog/data";
import type { Product } from "@/lib/catalog/types";
import { mapProduct, PRODUCT_SELECT } from "./mappers";

/**
 * All product queries try Supabase first and fall back to the built-in demo
 * catalogue when Supabase is not configured (or returns nothing). This lets the
 * storefront run before the database is wired up.
 */

async function queryAllProducts(): Promise<Product[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("name");

  if (error || !data || data.length === 0) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map(mapProduct);
}

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const live = await queryAllProducts();
  return live ?? demoProducts;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return mapProduct(data as any);
    }
  }
  return demoProducts.find((p) => p.slug === slug) ?? null;
});

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.isFeatured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.subtitle,
      p.casNumber,
      p.molecularFormula,
      p.categoryName,
      ...(p.researchAreas ?? []),
      ...(p.synonyms ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: "name" | "price-asc" | "price-desc" | "featured";
}

export async function getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
  let products = filters.search
    ? await searchProducts(filters.search)
    : await getAllProducts();

  if (filters.category) {
    products = products.filter((p) => p.categorySlug === filters.category);
  }

  const lowestPrice = (p: Product) =>
    p.variants.length ? Math.min(...p.variants.map((v) => v.priceCents)) : Infinity;

  switch (filters.sort) {
    case "price-asc":
      products = [...products].sort((a, b) => lowestPrice(a) - lowestPrice(b));
      break;
    case "price-desc":
      products = [...products].sort((a, b) => lowestPrice(b) - lowestPrice(a));
      break;
    case "featured":
      products = [...products].sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
      );
      break;
    default:
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  return products;
}
