"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { demoProducts } from "@/lib/catalog/data";
import { ProductVisual } from "@/components/product/product-visual";
import { formatCents } from "@/lib/utils";
import { fromPriceCents } from "@/lib/catalog/types";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return demoProducts
      .filter((p) =>
        [p.name, p.subtitle, p.casNumber, p.molecularFormula, p.categoryName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink-950/60 p-4 pt-[10vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink-100 px-4">
          <Search className="h-5 w-5 flex-shrink-0 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search peptides, CAS number, molecular formula…"
            className="h-14 flex-1 border-0 bg-transparent text-base text-ink-950 outline-none placeholder:text-ink-400 focus:ring-0"
          />
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50" aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </form>

        {query.trim() && (
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-500">
                No matches for &ldquo;{query}&rdquo;. Press Enter to search the full catalogue.
              </p>
            ) : (
              <ul>
                {results.map((p) => {
                  const price = fromPriceCents(p);
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          router.push(`/shop/${p.slug}`);
                          onClose();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-ink-50"
                      >
                        <span className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg">
                          <ProductVisual name={p.name} categorySlug={p.categorySlug} compact />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink-950">
                            {p.name}
                          </span>
                          <span className="block truncate text-xs text-ink-500">{p.subtitle}</span>
                        </span>
                        {price !== null && (
                          <span className="text-sm font-semibold text-ink-900">
                            {formatCents(price)}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
