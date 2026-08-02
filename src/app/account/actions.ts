"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  organizationName: z.string().optional().default(""),
  department: z.string().optional().default(""),
  jobTitle: z.string().optional().default(""),
  phone: z.string().optional().default(""),
});

export interface ProfileResult {
  ok?: boolean;
  error?: string;
}

export async function updateProfileAction(
  _prev: ProfileResult,
  formData: FormData,
): Promise<ProfileResult> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    organizationName: formData.get("organizationName") ?? "",
    department: formData.get("department") ?? "",
    jobTitle: formData.get("jobTitle") ?? "",
    phone: formData.get("phone") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      organization_name: parsed.data.organizationName || null,
      department: parsed.data.department || null,
      job_title: parsed.data.jobTitle || null,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account");
  return { ok: true };
}
