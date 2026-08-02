"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import type { ActionResult } from "@/app/admin/actions";
import type { AdminProduct } from "@/lib/data/admin";
import type { CategoryRow } from "@/lib/supabase/database.types";

type FormAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function ProductForm({
  action,
  categories,
  product,
  submitLabel = "Save product",
}: {
  action: FormAction;
  categories: Pick<CategoryRow, "id" | "name">[];
  product?: AdminProduct;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = React.useActionState<ActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.ok && <Alert tone="success">Product saved.</Alert>}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-bold text-ink-950">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" required className="sm:col-span-2">
            <Input id="name" name="name" required defaultValue={product?.name} placeholder="BPC-157" />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from name">
            <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="bpc-157" />
          </Field>
          <Field label="Subtitle" htmlFor="subtitle">
            <Input id="subtitle" name="subtitle" defaultValue={product?.subtitle ?? ""} placeholder="Body Protection Compound" />
          </Field>
          <Field label="Category" htmlFor="category_id" className="sm:col-span-2">
            <Select id="category_id" name="category_id" defaultValue={product?.category_id ?? ""}>
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-bold text-ink-950">Scientific specification</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CAS number" htmlFor="cas_number">
            <Input id="cas_number" name="cas_number" defaultValue={product?.cas_number ?? ""} placeholder="137525-51-0" />
          </Field>
          <Field label="Molecular formula" htmlFor="molecular_formula">
            <Input id="molecular_formula" name="molecular_formula" defaultValue={product?.molecular_formula ?? ""} placeholder="C62H98N16O22" />
          </Field>
          <Field label="Molecular weight (g/mol)" htmlFor="molecular_weight">
            <Input id="molecular_weight" name="molecular_weight" type="number" step="0.01" defaultValue={product?.molecular_weight ?? ""} placeholder="1419.53" />
          </Field>
          <Field label="Purity" htmlFor="purity">
            <Input id="purity" name="purity" defaultValue={product?.purity ?? ""} placeholder="≥99%" />
          </Field>
          <Field label="Sequence" htmlFor="sequence" className="sm:col-span-2">
            <Input id="sequence" name="sequence" defaultValue={product?.sequence ?? ""} placeholder="GEPPPGKPADDAGLV" />
          </Field>
          <Field label="Appearance" htmlFor="appearance">
            <Input id="appearance" name="appearance" defaultValue={product?.appearance ?? ""} placeholder="Lyophilized white powder" />
          </Field>
          <Field label="Form" htmlFor="form">
            <Input id="form" name="form" defaultValue={product?.form ?? ""} placeholder="Lyophilized powder" />
          </Field>
          <Field label="Storage" htmlFor="storage" className="sm:col-span-2">
            <Input id="storage" name="storage" defaultValue={product?.storage ?? ""} placeholder="Store lyophilized at -20°C." />
          </Field>
          <Field label="Reconstitution" htmlFor="reconstitution" className="sm:col-span-2">
            <Input id="reconstitution" name="reconstitution" defaultValue={product?.reconstitution ?? ""} placeholder="Reconstitute with bacteriostatic water." />
          </Field>
          <Field label="Research areas" htmlFor="research_areas" hint="Comma-separated" className="sm:col-span-2">
            <Input
              id="research_areas"
              name="research_areas"
              defaultValue={product?.research_areas?.join(", ") ?? ""}
              placeholder="Cytoprotection research, Tissue-repair models"
            />
          </Field>
          <Field label="Image URL" htmlFor="image_url" hint="Optional — a branded visual is generated otherwise" className="sm:col-span-2">
            <Input id="image_url" name="image_url" defaultValue={product?.image_url ?? ""} placeholder="https://…" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-bold text-ink-950">Visibility</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 text-sm text-ink-800">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product ? product.is_active : true}
              className="h-4 w-4 rounded border-ink-300 text-frost-600 focus:ring-frost-500"
            />
            Active (visible in the store)
          </label>
          <label className="flex items-center gap-2.5 text-sm text-ink-800">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product?.is_featured ?? false}
              className="h-4 w-4 rounded border-ink-300 text-frost-600 focus:ring-frost-500"
            />
            Featured on the homepage
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : submitLabel}
        </Button>
      </div>
    </form>
  );
}
