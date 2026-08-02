"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { submitContactAction, type ContactResult } from "@/app/contact/actions";

export function ContactForm() {
  const [state, formAction, pending] = React.useActionState<ContactResult, FormData>(
    submitContactAction,
    {},
  );

  if (state.ok) {
    return (
      <Alert tone="success" title="Message sent">
        Thanks for reaching out — our team will get back to you shortly.
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required>
          <Input id="name" name="name" required placeholder="Dr. Jane Researcher" />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <Input id="email" name="email" type="email" required placeholder="you@lab.ca" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Organization" htmlFor="organization">
          <Input id="organization" name="organization" placeholder="University / Company" />
        </Field>
        <Field label="Subject" htmlFor="subject">
          <Input id="subject" name="subject" placeholder="Product enquiry, COA request…" />
        </Field>
      </div>
      <Field label="Message" htmlFor="message" required>
        <Textarea id="message" name="message" required placeholder="How can we help with your research?" />
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </Button>
    </form>
  );
}
