"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  FlaskConical,
  Mail,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCart } from "@/components/cart/cart-provider";
import { mainNav, utilityNav, type MegaNavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const tagTone: Record<string, string> = {
  New: "bg-frost-100 text-frost-800",
  Popular: "bg-bone-200 text-bone-900",
  Tool: "bg-ink-900 text-white",
};

function MegaPanel({ item, onNavigate }: { item: MegaNavItem; onNavigate: () => void }) {
  return (
    <div className="animate-slide-down border-t border-ink-100 bg-white shadow-header">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-9 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div
          className={cn(
            "grid gap-10 sm:grid-cols-2",
            item.featured ? "lg:col-span-8" : "lg:col-span-12 lg:grid-cols-3",
          )}
        >
          {item.columns?.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 border-b border-ink-100 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-frost-700">
                {col.heading}
              </p>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="group block rounded-lg px-3 py-2 transition-colors hover:bg-bone-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-900 group-hover:text-frost-700">
                          {link.label}
                        </span>
                        {link.tag && (
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider",
                              tagTone[link.tag],
                            )}
                          >
                            {link.tag}
                          </span>
                        )}
                      </span>
                      {link.description && (
                        <span className="mt-0.5 block text-xs leading-snug text-ink-500">
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {item.featured && (
          <div className="lg:col-span-4">
            <Link
              href={item.featured.href}
              onClick={onNavigate}
              className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-ink-950 p-7 text-white"
            >
              <div className="bg-lattice absolute inset-0 opacity-80" />
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-frost-500/25 blur-3xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-frost-300">
                  {item.featured.eyebrow}
                </p>
                <p className="mt-2.5 font-display text-xl font-semibold leading-snug">
                  {item.featured.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.featured.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-frost-300 transition-all group-hover:gap-3">
                  {item.featured.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const { totals, openCart, isReady } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 140);
  };
  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(null);
  };

  const activeItem = mainNav.find((i) => i.label === activeMenu && i.columns);

  return (
    <>
      {/* ── Utility strip (desktop only) ─────────────────────── */}
      <div className="hidden border-b border-ink-100 bg-bone-50 lg:block">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-8 py-2 text-xs">
          <div className="flex items-center gap-5 text-ink-600">
            {utilityNav.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-frost-700">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5 text-ink-600">
            <span className="font-medium text-ink-800">
              Free shipping on research orders over $200 CAD
            </span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-1.5 hover:text-frost-700"
            >
              <Mail className="h-3.5 w-3.5" /> {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "shadow-header" : "border-b border-ink-100",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-6 lg:h-[76px] lg:px-8">
          {/* Left: mobile menu button + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ink-700 hover:bg-bone-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          {/* Center: desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {mainNav.map((item) =>
              item.columns ? (
                <button
                  key={item.label}
                  onMouseEnter={() => open(item.label)}
                  onFocus={() => open(item.label)}
                  onClick={() => (activeMenu === item.label ? closeNow() : open(item.label))}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors xl:px-3.5 xl:text-sm",
                    activeMenu === item.label
                      ? "bg-bone-100 text-frost-700"
                      : "text-ink-800 hover:bg-bone-100 hover:text-frost-700",
                  )}
                  aria-expanded={activeMenu === item.label}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-ink-400 transition-transform",
                      activeMenu === item.label && "rotate-180",
                    )}
                  />
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => open(item.label)}
                  className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-ink-800 transition-colors hover:bg-bone-100 hover:text-frost-700 xl:px-3.5 xl:text-sm"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-ink-700 hover:bg-bone-100"
              aria-label="Search the catalogue"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              className="hidden rounded-lg p-2 text-ink-700 hover:bg-bone-100 sm:inline-flex"
              aria-label="My account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative rounded-lg p-2 text-ink-700 hover:bg-bone-100"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {isReady && totals.itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-frost-600 px-1 text-[10px] font-bold text-white">
                  {totals.itemCount}
                </span>
              )}
            </button>
            <Link
              href="/shop"
              className="ml-2 hidden items-center gap-1.5 rounded-lg bg-frost-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-frost-700 xl:inline-flex"
            >
              <FlaskConical className="h-4 w-4" /> Shop peptides
            </Link>
          </div>
        </div>

        {activeItem && (
          <div
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={() => open(activeItem.label)}
          >
            <MegaPanel item={activeItem} onNavigate={closeNow} />
          </div>
        )}
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
