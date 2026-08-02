"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { signInAction, type AuthResult } from "../actions";

function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";
  const [state, formAction, pending] = React.useActionState<AuthResult, FormData>(signInAction, {});

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your research account, orders and documentation."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-frost-700 hover:underline">
            Create one
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
        <input type="hidden" name="redirect" value={redirect} />
        <Field label="Work email" htmlFor="email" required>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@lab.ca" />
        </Field>
        <Field label="Password" htmlFor="password" required>
          <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}
