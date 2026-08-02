"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, LogIn, Search, ShieldCheck, User, X } from "lucide-react";
import { Logo } from "./logo";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
  onOpenSearch,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

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
          "fixed inset-0 z-[95] bg-ink-950/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[96] flex w-[88%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <Logo />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-50 hover:text-ink-900"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="mx-5 mt-4 flex items-center gap-2.5 rounded-xl border border-ink-200 px-4 py-3 text-left text-sm text-ink-500"
        >
          <Search className="h-4 w-4" />
          Search peptides, CAS, formula…
        </button>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
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
                        isOpen ? "max-h-[640px]" : "max-h-0",
                      )}
                    >
                      <div className="space-y-4 px-2 pb-4">
                        {item.columns!.map((col) => (
                          <div key={col.heading}>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-frost-700">
                              {col.heading}
                            </p>
                            <ul className="space-y-0.5">
                              {col.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="block rounded-lg px-2 py-2 text-sm text-ink-700 hover:bg-ink-50 hover:text-frost-700"
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
        </nav>

        <div className="space-y-2 border-t border-ink-100 px-5 py-4">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50"
          >
            <User className="h-4 w-4" /> My account
          </Link>
          <Link
            href="/auth/login"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50"
          >
            <LogIn className="h-4 w-4" /> Sign in / Register
          </Link>
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[11px] text-amber-800">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <span>{siteConfig.compliance.ruoLong}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
