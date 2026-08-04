import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import { LogoMark } from "./logo";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const assurances = [
  { icon: FileCheck2, label: "COA on every batch" },
  { icon: ShieldCheck, label: "≥99% verified purity" },
  { icon: Snowflake, label: "Cold-chain shipping" },
  { icon: FlaskConical, label: "Research Use Only" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-100">
      {/* ── Researcher CTA band ─────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="bg-lattice absolute inset-0 opacity-70" />
        <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-frost-500/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-[1320px] flex-col items-start gap-6 px-5 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-frost-300">
              For qualified researchers
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-[28px]">
              Open a research account with North Specs Labs
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Institutional pricing, batch documentation archives, purchase orders and repeat-order
              history — built for laboratory procurement.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-frost-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-frost-400"
            >
              Create a research account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?topic=bulk"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Request bulk pricing
            </Link>
          </div>
        </div>
      </div>

      {/* ── Assurance strip ─────────────────────────────────── */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-4 px-5 py-5 sm:px-6 lg:grid-cols-4 lg:px-8">
          {assurances.map((a) => (
            <div key={a.label} className="flex items-center gap-2.5 text-sm text-white/75">
              <a.icon className="h-4 w-4 flex-shrink-0 text-frost-300" aria-hidden />
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sitemap ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="North Specs Labs — home">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-frost-300">
                <LogoMark className="h-7 w-7" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold text-white">North Specs</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-frost-300">
                  Labs
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              High-purity, third-party-tested research peptides supplied to laboratories and
              qualified researchers across Canada.
            </p>
            <address className="mt-6 space-y-2.5 not-italic text-sm text-white/70">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-frost-300"
              >
                <Mail className="h-4 w-4 flex-shrink-0" /> {siteConfig.contact.email}
              </a>
              <a
                href={`mailto:${siteConfig.contact.supportEmail}`}
                className="flex items-center gap-2.5 transition-colors hover:text-frost-300"
              >
                <Mail className="h-4 w-4 flex-shrink-0" /> {siteConfig.contact.supportEmail}
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-frost-300"
              >
                <Phone className="h-4 w-4 flex-shrink-0" /> {siteConfig.contact.phone}
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 flex-shrink-0" /> Shipping Canada-wide
              </span>
            </address>
            <p className="mt-4 text-xs text-white/45">{siteConfig.contact.hours}</p>
          </div>

          {/* Nav groups — each group's links flow in two columns */}
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-9">
            {footerNav.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="mb-4 border-b border-white/10 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-frost-300">
                  {col.heading}
                </p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {col.links.map((link) => (
                    <li key={`${col.heading}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[13px] leading-snug text-white/65 transition-colors hover:text-frost-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* ── RUO disclaimer ──────────────────────────────────── */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-[1320px] items-start gap-3 px-5 py-6 sm:px-6 lg:px-8">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-frost-300" aria-hidden />
          <p className="text-xs leading-relaxed text-white/60">
            <span className="font-semibold text-white">Research Use Only.</span>{" "}
            {siteConfig.compliance.disclaimer}{" "}
            <Link href="/legal/research-use-only" className="text-frost-300 underline underline-offset-2">
              Read the full RUO policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-4 px-5 py-6 text-xs text-white/50 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved. Not for human
            or veterinary use.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/legal/terms" className="hover:text-frost-300">
              Terms of Use
            </Link>
            <Link href="/legal/privacy" className="hover:text-frost-300">
              Privacy
            </Link>
            <Link href="/legal/cookies" className="hover:text-frost-300">
              Cookies
            </Link>
            <Link href="/legal/research-use-only" className="hover:text-frost-300">
              RUO policy
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-frost-300">
              Disclaimer
            </Link>
            <Link href="/faq" className="hover:text-frost-300">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
