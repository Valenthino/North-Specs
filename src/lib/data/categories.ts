import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { demoCategoriesWithCounts } from "@/lib/catalog/data";
import type { Category } from "@/lib/catalog/types";
import { getAllProducts } from "./products";
import { mapCategory } from "./mappers";

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data && data.length > 0) {
      const products = await getAllProducts();
      return data.map((row) =>
        mapCategory(row, products.filter((p) => p.categorySlug === row.slug).length),
      );
    }
  }
  return demoCategoriesWithCounts;
});

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
