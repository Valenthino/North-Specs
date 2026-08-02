"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { createCategoryAction, type ActionResult } from "@/app/admin/actions";

export function CategoryForm() {
  const [state, formAction, pending] = React.useActionState<ActionResult, FormData>(
    createCategoryAction,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <h2 className="text-lg font-bold text-ink-950">New category</h2>
      {state.ok && <Alert tone="success" className="!py-2">Category created.</Alert>}
      {state.error && <Alert tone="error" className="!py-2">{state.error}</Alert>}
      <Field label="Name" htmlFor="cat-name" required>
        <Input id="cat-name" name="name" required placeholder="Metabolic Research" />
      </Field>
      <Field label="Slug" htmlFor="cat-slug" hint="Auto-generated if blank">
        <Input id="cat-slug" name="slug" placeholder="metabolic-research" />
      </Field>
      <Field label="Short description" htmlFor="cat-short">
        <Input id="cat-short" name="short_description" placeholder="Incretin & metabolic-signalling peptides." />
      </Field>
      <Field label="Description" htmlFor="cat-desc">
        <Textarea id="cat-desc" name="description" className="min-h-[80px]" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Icon" htmlFor="cat-icon" hint="e.g. activity, atom, brain">
          <Input id="cat-icon" name="icon" placeholder="activity" />
        </Field>
        <Field label="Display order" htmlFor="cat-order">
          <Input id="cat-order" name="display_order" type="number" defaultValue={0} />
        </Field>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Create category</>}
      </Button>
    </form>
  );
}
