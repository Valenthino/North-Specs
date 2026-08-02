import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the North Specs Peptides team about products, batches or research support.",
};

export default function ContactPage() {
  return (
    <Container className="py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">Contact</p>
          <h1 className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">
            Talk to our research team
          </h1>
          <p className="mt-4 text-ink-600">
            Questions about a product, a specific batch, a certificate of analysis, or a bulk /
            institutional order? Send us a note and we&apos;ll get back to you.
          </p>

          <dl className="mt-8 space-y-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-frost-50 text-frost-700">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-sm font-semibold text-ink-950">Email</dt>
                <dd className="text-sm text-ink-600">
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-frost-700">
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-frost-50 text-frost-700">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-sm font-semibold text-ink-950">Shipping</dt>
                <dd className="text-sm text-ink-600">Canada-wide delivery 🇨🇦</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-frost-50 text-frost-700">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-sm font-semibold text-ink-950">Response time</dt>
                <dd className="text-sm text-ink-600">Typically within 1 business day</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          <ContactForm />
          <p className="mt-4 text-xs text-ink-400">{siteConfig.compliance.ruoLong}</p>
        </div>
      </div>
    </Container>
  );
}
