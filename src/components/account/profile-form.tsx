"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { updateProfileAction, type ProfileResult } from "@/app/account/actions";

interface Initial {
  fullName: string;
  organizationName: string;
  department: string;
  jobTitle: string;
  phone: string;
}

export function ProfileForm({ email, initial }: { email: string; initial: Initial }) {
  const [state, formAction, pending] = React.useActionState<ProfileResult, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      {state.ok && <Alert tone="success">Profile updated.</Alert>}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <Field label="Email">
        <Input value={email} readOnly disabled className="bg-ink-50" />
      </Field>
      <Field label="Full name" htmlFor="fullName" required>
        <Input id="fullName" name="fullName" defaultValue={initial.fullName} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Organization" htmlFor="organizationName">
          <Input id="organizationName" name="organizationName" defaultValue={initial.organizationName} />
        </Field>
        <Field label="Department" htmlFor="department">
          <Input id="department" name="department" defaultValue={initial.department} />
        </Field>
        <Field label="Job title" htmlFor="jobTitle">
          <Input id="jobTitle" name="jobTitle" defaultValue={initial.jobTitle} />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" defaultValue={initial.phone} />
        </Field>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
      </Button>
    </form>
  );
}
