import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { ProductVisual } from "./product-visual";
import { QuickAddButton } from "./quick-add";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import { fromPriceCents, inStock, type Product } from "@/lib/catalog/types";

export function ProductCard({ product }: { product: Product }) {
  const price = fromPriceCents(product);
  const available = inStock(product);
  const hasCoa = product.coas.length > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductVisual
          name={product.name}
          molecularFormula={product.molecularFormula}
          categorySlug={product.categorySlug}
          imageUrl={product.imageUrl}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.purity && <Badge tone="ink">{product.purity} purity</Badge>}
          {hasCoa && (
            <Badge tone="frost" className="gap-1">
              <FileCheck2 className="h-3 w-3" /> COA
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.categoryName && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-frost-700">
            {product.categoryName}
          </p>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-base font-bold leading-snug text-ink-950 group-hover:text-frost-700">
            {product.name}
          </h3>
        </Link>
        {product.subtitle && (
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-500">{product.subtitle}</p>
        )}

        {product.casNumber && (
          <p className="mt-2 font-mono text-[11px] text-ink-400">CAS {product.casNumber}</p>
        )}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {price !== null ? (
              <>
                <p className="text-[11px] text-ink-400">From</p>
                <p className="text-lg font-bold text-ink-950">{formatCents(price)}</p>
              </>
            ) : (
              <p className="text-sm text-ink-400">Contact for pricing</p>
            )}
            <p className={`mt-0.5 text-[11px] font-medium ${available ? "text-aurora-700" : "text-amber-600"}`}>
              {available ? "In stock" : "Backorder"}
            </p>
          </div>
          <QuickAddButton product={product} />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
