import type { Metadata } from "next";
import Link from "next/link";
import { Compass, FlaskConical, Microscope, ShieldCheck, Snowflake, Target } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About North Specs Peptides",
  description:
    "North Specs Peptides supplies high-purity, third-party-tested research peptides to Canadian labs and researchers.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-[0.12]" />
        <Container className="relative py-20">
          <p className="eyebrow mb-3 text-frost-300">About us</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Making research peptides more accessible — and more trustworthy — for Canadian science.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            North Specs Peptides was founded by researchers who were frustrated by opaque sourcing,
            missing documentation and inconsistent purity. We built the supplier we wished we had.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-3">Our mission</p>
              <h2 className="text-3xl font-bold text-ink-950">
                Access to legal, research-grade peptides — with the documentation to back them up
              </h2>
              <p className="mt-5 text-ink-600">
                Our goal is simple: help researchers and laboratories access high-purity peptides
                easily, with the certificates of analysis and specifications their work requires.
                Every product is supplied strictly for laboratory research — not for human or
                veterinary use.
              </p>
              <p className="mt-4 text-ink-600">
                We publish molecular specifications, purity data and batch certificates so you always
                know exactly what&apos;s in the vial.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: "Purpose-built", text: "For researchers, by researchers" },
                { icon: Microscope, title: "Verified purity", text: "HPLC & MS tested" },
                { icon: ShieldCheck, title: "Documented", text: "COA on every batch" },
                { icon: Snowflake, title: "Cold chain", text: "Stability protected" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
                  <item.icon className="h-6 w-6 text-frost-600" />
                  <p className="mt-3 font-bold text-ink-950">{item.title}</p>
                  <p className="text-sm text-ink-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-ink-50/50">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-2 justify-center">What we value</p>
            <h2 className="text-3xl font-bold text-ink-950">Principles that guide every order</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FlaskConical,
                title: "Scientific integrity",
                text: "Accurate specifications and honest documentation. If we don't know it, we don't claim it.",
              },
              {
                icon: Compass,
                title: "Accessibility",
                text: "Clear pricing, plain-language handling guides, and a catalogue built for the way researchers actually work.",
              },
              {
                icon: ShieldCheck,
                title: "Responsible supply",
                text: "Research Use Only, always. We supply qualified researchers and expect responsible handling.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-frost-300">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-950">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-ink-950 px-8 py-14 text-center text-white">
            <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">
              Questions about a product, batch or specification?
            </h2>
            <p className="max-w-xl text-white/70">
              Our team is happy to help you find the right research peptide and documentation for
              your work.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Contact us
              </Link>
              <Link
                href="/shop"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "border-white/20 bg-white/5 text-white hover:bg-white/10",
                })}
              >
                Browse the catalogue
              </Link>
            </div>
            <p className="text-xs text-white/40">{siteConfig.compliance.ruoLong}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
