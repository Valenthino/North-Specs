import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-card";
import { CategoryIcon } from "@/components/category-icon";
import { RuoNotice } from "@/components/compliance/ruo-notice";
import { getCategoryBySlug, getCategories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description ?? category.shortDescription ?? undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    getProductsByCategory(slug),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-[0.12]" />
        <Container className="relative py-14">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/" className="hover:text-frost-300">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-frost-300">Shop</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/80">{category.name}</span>
          </div>
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-frost-300">
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
              <p className="mt-2 max-w-2xl text-white/70">{category.description}</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        {/* Category chips */}
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/shop"
            className="flex-shrink-0 rounded-lg bg-ink-50 px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
          >
            All
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className={`flex-shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                c.slug === slug
                  ? "bg-ink-900 text-white"
                  : "bg-ink-50 text-ink-700 hover:bg-ink-100"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <p className="mb-6 text-sm text-ink-500">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-500">
            No products in this category yet.
          </p>
        )}

        <div className="mt-10">
          <RuoNotice />
        </div>
      </Container>
    </>
  );
}
