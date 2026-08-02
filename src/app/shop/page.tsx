import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-card";
import { SortSelect } from "@/components/product/sort-select";
import { RuoNotice } from "@/components/compliance/ruo-notice";
import { getFilteredProducts, type ProductFilters } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop Research Peptides",
  description:
    "Browse North Specs' catalogue of high-purity, third-party-tested research peptides. Research Use Only.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const filters: ProductFilters = {
    category: params.category,
    search: params.search,
    sort: (params.sort as ProductFilters["sort"]) ?? "name",
  };

  const [products, categories] = await Promise.all([
    getFilteredProducts(filters),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === params.category);

  const buildHref = (categorySlug?: string) => {
    const p = new URLSearchParams();
    if (categorySlug) p.set("category", categorySlug);
    if (params.search) p.set("search", params.search);
    if (params.sort) p.set("sort", params.sort);
    const qs = p.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {/* Page header */}
      <div className="border-b border-ink-100 bg-ink-50/50">
        <Container className="py-10">
          <p className="eyebrow mb-2">Catalogue</p>
          <h1 className="text-3xl font-bold text-ink-950 sm:text-4xl">
            {activeCategory ? activeCategory.name : params.search ? "Search results" : "All research peptides"}
          </h1>
          <p className="mt-2 max-w-2xl text-ink-600">
            {activeCategory
              ? activeCategory.description
              : "High-purity peptides for laboratory research, each with full molecular specifications and batch documentation."}
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Sidebar filters */}
          <aside className="mb-6 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
                <SlidersHorizontal className="h-4 w-4" /> Categories
              </p>
              {/* Desktop: vertical list. Mobile: horizontal scroll chips. */}
              <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible">
                <Link
                  href={buildHref()}
                  className={cn(
                    "flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:flex lg:items-center lg:justify-between",
                    !params.category
                      ? "bg-ink-900 text-white lg:bg-ink-50 lg:text-frost-700"
                      : "bg-ink-50 text-ink-700 hover:bg-ink-100 lg:bg-transparent lg:hover:bg-ink-50",
                  )}
                >
                  All peptides
                </Link>
                {categories.map((cat) => {
                  const isActive = cat.slug === params.category;
                  return (
                    <Link
                      key={cat.id}
                      href={buildHref(cat.slug)}
                      className={cn(
                        "flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:flex lg:items-center lg:justify-between lg:whitespace-normal",
                        isActive
                          ? "bg-ink-900 text-white lg:bg-frost-50 lg:text-frost-700"
                          : "bg-ink-50 text-ink-700 hover:bg-ink-100 lg:bg-transparent lg:hover:bg-ink-50",
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className="ml-2 hidden text-xs text-ink-400 lg:inline">
                        {cat.productCount}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 hidden lg:block">
                <RuoNotice compact />
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-ink-500">
                {products.length} {products.length === 1 ? "product" : "products"}
                {params.search && (
                  <>
                    {" "}
                    for <span className="font-medium text-ink-800">&ldquo;{params.search}&rdquo;</span>
                  </>
                )}
              </p>
              <SortSelect current={params.sort} />
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-20 text-center">
                <Search className="h-10 w-10 text-ink-300" />
                <p className="mt-4 font-semibold text-ink-900">No products found</p>
                <p className="mt-1 max-w-sm text-sm text-ink-500">
                  Try a different category or search term. Every North Specs product is Research Use
                  Only.
                </p>
                <Link href="/shop" className="mt-4 text-sm font-semibold text-frost-700 hover:underline">
                  Clear filters
                </Link>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
