"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  organization: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(10, "Please include a short message."),
});

export interface ContactResult {
  ok?: boolean;
  error?: string;
}

export async function submitContactAction(
  _prev: ContactResult,
  formData: FormData,
): Promise<ContactResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization") ?? "",
    subject: formData.get("subject") ?? "",
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Persist when Supabase is available; otherwise accept in demo mode.
  const writer = createAdminClient() ?? (await createClient());
  if (writer) {
    const { error } = await writer.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      organization: parsed.data.organization || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
      handled: false,
    });
    if (error) return { error: "We couldn't send your message. Please try again." };
  }

  return { ok: true };
}
