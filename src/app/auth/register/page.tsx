"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { signUpAction, type AuthResult } from "../actions";

export default function RegisterPage() {
  const [state, formAction, pending] = React.useActionState<AuthResult, FormData>(signUpAction, {});

  return (
    <AuthShell
      title="Create a research account"
      subtitle="For qualified researchers and research organizations in Canada."
      footer={
        <>
          Already registered?{" "}
          <Link href="/auth/login" className="font-semibold text-frost-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        {state.error && (
          <Alert tone="error" className="!py-3">
            {state.error}
          </Alert>
        )}
        <Field label="Full name" htmlFor="fullName" required>
          <Input id="fullName" name="fullName" required autoComplete="name" placeholder="Dr. Jane Researcher" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lab / institution" htmlFor="organizationName">
            <Input id="organizationName" name="organizationName" placeholder="University / Company" />
          </Field>
          <Field label="Account type" htmlFor="accountType">
            <Select id="accountType" name="accountType" defaultValue="academic">
              <option value="academic">Academic / University</option>
              <option value="commercial">Commercial / Industry</option>
              <option value="government">Government</option>
              <option value="individual">Independent researcher</option>
            </Select>
          </Field>
        </div>
        <Field label="Work email" htmlFor="email" required>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@lab.ca" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(000) 000-0000" />
          </Field>
          <Field label="Password" htmlFor="password" required hint="Min. 8 characters">
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
          </Field>
        </div>

        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          By creating an account you confirm that all products are for laboratory research use only
          — not for human or veterinary use.
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
