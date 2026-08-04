"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  FileCheck2,
  FlaskConical,
  LogIn,
  Mail,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Logo } from "./logo";
import { mainNav, utilityNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const quickLinks = [
  { label: "Reconstitution calculator", href: "/tools/reconstitution-calculator", icon: FlaskConical },
  { label: "Certificates of Analysis", href: "/coa", icon: FileCheck2 },
];

export function MobileMenu({
  open,
  onClose,
  onOpenSearch,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}) {
  const [expanded, setExpanded] = React.useState<string | null>("Shop");

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={cn("lg:hidden", open ? "" : "pointer-events-none")} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[95] bg-ink-950/60 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[96] flex w-[90%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <Logo />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-bone-100 hover:text-ink-900"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="border-b border-ink-100 px-5 py-4">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl border border-ink-200 bg-bone-50 px-4 py-3 text-left text-sm text-ink-500"
          >
            <Search className="h-4 w-4" />
            Search peptides, CAS, formula…
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 text-xs font-semibold text-ink-800"
              >
                <q.icon className="h-4 w-4 flex-shrink-0 text-frost-600" />
                <span className="leading-tight">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
          {mainNav.map((item) => {
            const hasColumns = item.columns && item.columns.length > 0;
            const isOpen = expanded === item.label;
            return (
              <div key={item.label} className="border-b border-ink-50 last:border-0">
                {hasColumns ? (
                  <>
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between px-2 py-3.5 text-left text-base font-semibold text-ink-950"
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-ink-400 transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-[1200px]" : "max-h-0",
                      )}
                    >
                      <div className="space-y-4 px-2 pb-4">
                        {item.columns!.map((col) => (
                          <div key={col.heading}>
                            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-frost-700">
                              {col.heading}
                            </p>
                            <ul className="space-y-0.5">
                              {col.links.map((link) => (
                                <li key={`${col.heading}-${link.href}-${link.label}`}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="block rounded-lg px-2 py-2 text-sm text-ink-700 hover:bg-bone-100 hover:text-frost-700"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-frost-700"
                        >
                          View all {item.label.toLowerCase()} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block px-2 py-3.5 text-base font-semibold text-ink-950 hover:text-frost-700"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="mt-4 border-t border-ink-100 pt-4">
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Quick links
            </p>
            <ul className="space-y-0.5">
              {utilityNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-lg px-2 py-2 text-sm text-ink-700 hover:bg-bone-100 hover:text-frost-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="space-y-2 border-t border-ink-100 bg-bone-50 px-5 py-4">
          <Link
            href="/shop"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-frost-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <FlaskConical className="h-4 w-4" /> Shop research peptides
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-800"
            >
              <User className="h-4 w-4" /> Account
            </Link>
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-800"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          </div>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-2 px-1 pt-1 text-xs text-ink-600"
          >
            <Mail className="h-3.5 w-3.5" /> {siteConfig.contact.email}
          </a>
          <div className="flex items-start gap-2 rounded-lg border border-bone-300 bg-bone-100 px-3 py-2.5 text-[11px] text-ink-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-frost-600" />
            <span>{siteConfig.compliance.ruoLong}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
