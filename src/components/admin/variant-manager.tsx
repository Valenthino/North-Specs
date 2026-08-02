"use client";

import * as React from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import {
  addVariantAction,
  updateVariantAction,
  deleteVariantAction,
  type ActionResult,
} from "@/app/admin/actions";
import type { ProductVariantRow } from "@/lib/supabase/database.types";

function VariantRow({ variant, productId }: { variant: ProductVariantRow; productId: string }) {
  const [state, formAction, pending] = React.useActionState<ActionResult, FormData>(
    updateVariantAction,
    {},
  );

  return (
    <tr className="border-t border-ink-100">
      <td className="px-3 py-2">
        <form action={formAction} className="flex flex-wrap items-center gap-2" id={`v-${variant.id}`}>
          <input type="hidden" name="variant_id" value={variant.id} />
          <input type="hidden" name="product_id" value={productId} />
          <Input name="name" defaultValue={variant.name} className="h-9 w-24" aria-label="Size" />
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
            <Input
              name="price"
              type="number"
              step="0.01"
              defaultValue={(variant.price_cents / 100).toFixed(2)}
              className="h-9 w-24 pl-6"
              aria-label="Price"
            />
          </div>
          <Input
            name="stock_quantity"
            type="number"
            defaultValue={variant.stock_quantity}
            className="h-9 w-20"
            aria-label="Stock"
          />
          <label className="flex items-center gap-1.5 text-xs text-ink-600">
            <input type="checkbox" name="is_active" defaultChecked={variant.is_active} className="h-4 w-4 rounded border-ink-300 text-frost-600" />
            Active
          </label>
          <Button type="submit" size="sm" variant="subtle" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : state.ok ? <Check className="h-4 w-4 text-aurora-600" /> : "Save"}
          </Button>
        </form>
        {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      </td>
      <td className="px-3 py-2 text-right align-top">
        <form action={deleteVariantAction}>
          <input type="hidden" name="variant_id" value={variant.id} />
          <input type="hidden" name="product_id" value={productId} />
          <button
            type="submit"
            className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${variant.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </td>
    </tr>
  );
}

function AddVariant({ productId }: { productId: string }) {
  const [state, formAction, pending] = React.useActionState<ActionResult, FormData>(
    addVariantAction,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <div className="border-t border-ink-100 bg-ink-50/50 p-4">
      {state.error && (
        <Alert tone="error" className="mb-3 !py-2">
          {state.error}
        </Alert>
      )}
      <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="product_id" value={productId} />
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Size</label>
          <Input name="name" placeholder="10 mg" className="h-9 w-24" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">SKU</label>
          <Input name="sku" placeholder="NS-XXX-10" className="h-9 w-32" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">mg</label>
          <Input name="size_mg" type="number" step="0.01" placeholder="10" className="h-9 w-20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Price (CAD)</label>
          <Input name="price" type="number" step="0.01" placeholder="99.00" className="h-9 w-28" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Stock</label>
          <Input name="stock_quantity" type="number" placeholder="100" className="h-9 w-20" defaultValue={0} />
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Add</>}
        </Button>
      </form>
    </div>
  );
}

export function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariantRow[];
}) {
  const sorted = [...variants].sort((a, b) => a.price_cents - b.price_cents);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="border-b border-ink-100 px-6 py-4">
        <h2 className="text-lg font-bold text-ink-950">Sizes &amp; pricing</h2>
        <p className="text-sm text-ink-500">Each size is a purchasable variant with its own SKU and stock.</p>
      </div>
      {sorted.length > 0 ? (
        <table className="w-full text-sm">
          <tbody>
            {sorted.map((v) => (
              <VariantRow key={v.id} variant={v} productId={productId} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="px-6 py-6 text-sm text-ink-500">No sizes yet — add one below.</p>
      )}
      <AddVariant productId={productId} />
    </div>
  );
}
