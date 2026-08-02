"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCart } from "@/components/cart/cart-provider";
import { mainNav, type MegaNavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

function MegaPanel({ item }: { item: MegaNavItem }) {
  return (
    <div className="animate-slide-down border-t border-ink-100 bg-white shadow-header">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className={cn("grid gap-8 sm:grid-cols-2", item.featured ? "lg:col-span-8" : "lg:col-span-12 lg:grid-cols-3")}>
          {item.columns?.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-frost-700">
                {col.heading}
              </p>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group block rounded-lg px-3 py-2 transition-colors hover:bg-ink-50"
                    >
                      <span className="block text-sm font-semibold text-ink-900 group-hover:text-frost-700">
                        {link.label}
                      </span>
                      {link.description && (
                        <span className="block text-xs text-ink-500">{link.description}</span>
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
              className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-ink-950 p-6 text-white"
            >
              <div className="bg-dots absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-frost-300">
                  Quality
                </p>
                <p className="mt-2 text-lg font-bold leading-snug">{item.featured.title}</p>
                <p className="mt-1.5 text-sm text-white/70">{item.featured.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-frost-300 group-hover:gap-2 transition-all">
                  Learn more →
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

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const activeItem = mainNav.find((i) => i.label === activeMenu && i.columns);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "shadow-header" : "border-b border-ink-100",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-[70px] lg:px-8">
          {/* Left: mobile menu button + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          {/* Center: desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) =>
              item.columns ? (
                <button
                  key={item.label}
                  onMouseEnter={() => open(item.label)}
                  onFocus={() => open(item.label)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                    activeMenu === item.label
                      ? "bg-ink-50 text-frost-700"
                      : "text-ink-800 hover:bg-ink-50 hover:text-frost-700",
                  )}
                  aria-expanded={activeMenu === item.label}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-ink-400 transition-transform",
                      activeMenu === item.label && "rotate-180",
                    )}
                  />
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => open(item.label)}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-50 hover:text-frost-700"
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
              className="rounded-lg p-2 text-ink-700 hover:bg-ink-50"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              className="hidden rounded-lg p-2 text-ink-700 hover:bg-ink-50 sm:inline-flex"
              aria-label="My account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-50"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {isReady && totals.itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-frost-500 px-1 text-[10px] font-bold text-white">
                  {totals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeItem && (
          <div className="absolute inset-x-0 top-full hidden lg:block" onMouseEnter={() => open(activeItem.label)}>
            <MegaPanel item={activeItem} />
          </div>
        )}
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} onOpenSearch={() => setSearchOpen(true)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
