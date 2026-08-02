import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { LogoMark } from "./logo";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-100">
      {/* RUO disclaimer band */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-5 py-5 sm:px-6 lg:px-8">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-frost-300" />
          <p className="text-xs leading-relaxed text-white/70">
            <span className="font-semibold text-white">Research Use Only.</span>{" "}
            {siteConfig.compliance.disclaimer}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                <LogoMark />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-white">North Specs</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-frost-300">
                  Peptides
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {siteConfig.tagline} Third-party tested, high-purity peptides shipped across Canada for
              laboratory research.
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/70">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 hover:text-frost-300"
              >
                <Mail className="h-4 w-4" /> {siteConfig.contact.email}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Shipping across Canada 🇨🇦
              </p>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  {col.heading}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-frost-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Not for human or
            veterinary use.
          </p>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:text-frost-300">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-frost-300">
              Privacy
            </Link>
            <Link href="/legal/research-use-only" className="hover:text-frost-300">
              RUO Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
