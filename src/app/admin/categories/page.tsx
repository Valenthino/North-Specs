import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryIcon } from "@/components/category-icon";
import { getAdminCategories } from "@/lib/data/admin";
import { deleteCategoryAction } from "../actions";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Categories</h1>
        <p className="mt-1 text-ink-500">Organize your catalogue into research areas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          {categories.length === 0 ? (
            <p className="px-6 py-10 text-center text-ink-500">No categories yet — create one.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-950 text-frost-300">
                      <CategoryIcon name={cat.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink-950">{cat.name}</p>
                      <p className="text-xs text-ink-400">{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {cat.is_active ? <Badge tone="aurora">Active</Badge> : <Badge>Hidden</Badge>}
                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create */}
        <CategoryForm />
      </div>
    </div>
  );
}
