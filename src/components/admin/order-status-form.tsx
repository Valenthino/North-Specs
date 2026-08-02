"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, Textarea, Label } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import type { ActionResult } from "@/app/admin/actions";
import type { OrderStatus } from "@/lib/supabase/database.types";

const statuses: OrderStatus[] = [
  "pending",
  "awaiting_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

type FormAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function OrderStatusForm({
  action,
  currentStatus,
  internalNotes,
}: {
  action: FormAction;
  currentStatus: OrderStatus;
  internalNotes: string | null;
}) {
  const [state, formAction, pending] = React.useActionState<ActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.ok && <Alert tone="success" className="!py-2">Order updated.</Alert>}
      {state.error && <Alert tone="error" className="!py-2">{state.error}</Alert>}
      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue={currentStatus}>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="internal_notes">Internal notes</Label>
        <Textarea
          id="internal_notes"
          name="internal_notes"
          defaultValue={internalNotes ?? ""}
          placeholder="Fulfilment notes (not visible to the customer)"
          className="min-h-[80px]"
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update order"}
      </Button>
    </form>
  );
}
