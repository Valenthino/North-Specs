import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/data/admin";
import { createProductAction } from "../../actions";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-frost-700 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-ink-950">New product</h1>
        <p className="mt-1 text-ink-500">Add a research peptide. You can add sizes/prices after saving.</p>
      </div>
      <ProductForm action={createProductAction} categories={categories} submitLabel="Create product" />
    </div>
  );
}
