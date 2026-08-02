import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { VariantManager } from "@/components/admin/variant-manager";
import { getAdminProductById, getAdminCategories } from "@/lib/data/admin";
import { updateProductAction, deleteProductAction } from "../../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);
  if (!product) notFound();

  const boundUpdate = updateProductAction.bind(null, product.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-frost-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <Link
          href={`/shop/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-frost-700"
        >
          View in store <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink-950">{product.name}</h1>
        <p className="mt-1 text-ink-500">Edit product details and manage sizes.</p>
      </div>

      <VariantManager productId={product.id} variants={product.variants} />

      <ProductForm action={boundUpdate} categories={categories} product={product} submitLabel="Save changes" />

      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
        <h2 className="text-sm font-bold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">
          Deleting a product removes it and all its variants. This cannot be undone.
        </p>
        <form action={deleteProductAction} className="mt-4">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" /> Delete product
          </button>
        </form>
      </div>
    </div>
  );
}
