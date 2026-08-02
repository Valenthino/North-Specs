import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminProducts } from "@/lib/data/admin";
import { formatCents } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Products</h1>
          <p className="mt-1 text-ink-500">{products.length} products in the catalogue.</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ variant: "primary" })}>
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-4 font-semibold text-ink-900">No products yet</p>
          <p className="mt-1 text-sm text-ink-500">
            Add your first product, or apply the SQL seed to import the demo catalogue.
          </p>
          <Link href="/admin/products/new" className={buttonVariants({ variant: "primary", className: "mt-4" })}>
            Add a product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Variants</th>
                  <th className="px-6 py-3 font-semibold">From</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {products.map((product) => {
                  const prices = product.variants.map((v) => v.price_cents);
                  const from = prices.length ? Math.min(...prices) : null;
                  return (
                    <tr key={product.id} className="hover:bg-ink-50/50">
                      <td className="px-6 py-3">
                        <Link href={`/admin/products/${product.id}`} className="font-semibold text-ink-950 hover:text-frost-700">
                          {product.name}
                        </Link>
                        <p className="text-xs text-ink-400">{product.slug}</p>
                      </td>
                      <td className="px-6 py-3 text-ink-600">{product.category?.name ?? "—"}</td>
                      <td className="px-6 py-3 text-ink-600">{product.variants.length}</td>
                      <td className="px-6 py-3 font-medium text-ink-900">
                        {from !== null ? formatCents(from) : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-1.5">
                          {product.is_active ? (
                            <Badge tone="aurora">Active</Badge>
                          ) : (
                            <Badge tone="default">Draft</Badge>
                          )}
                          {product.is_featured && <Badge tone="frost">Featured</Badge>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
