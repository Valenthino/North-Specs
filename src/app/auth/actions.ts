"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const NOT_CONFIGURED =
  "Accounts require Supabase to be configured. Add your Supabase credentials to enable sign-in.";

export interface AuthResult {
  error?: string;
}

const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export async function signInAction(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const redirectTo = String(formData.get("redirect") || "/account");
  revalidatePath("/", "layout");
  redirect(redirectTo);
}

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  fullName: z.string().min(2, "Enter your full name."),
  organizationName: z.string().optional(),
  accountType: z.enum(["academic", "commercial", "government", "individual"]).optional(),
  phone: z.string().optional(),
});

export async function signUpAction(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    organizationName: formData.get("organizationName") || undefined,
    accountType: formData.get("accountType") || undefined,
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED };

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        organization_name: parsed.data.organizationName ?? "",
        account_type: parsed.data.accountType ?? "",
        phone: parsed.data.phone ?? "",
      },
    },
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/account?welcome=1");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
