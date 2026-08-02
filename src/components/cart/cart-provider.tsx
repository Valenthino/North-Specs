"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import type { CartItem, CartTotals } from "@/lib/cart/types";

const STORAGE_KEY = "north-specs-cart-v1";

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  isOpen: boolean;
  isReady: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

/** Canadian GST/HST is region-dependent; we use a representative 13% for estimates. */
const TAX_RATE = 0.13;

function computeTotals(items: CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const overThreshold = subtotalCents >= siteConfig.freeShippingThresholdCents;
  const shippingCents = itemCount === 0 || overThreshold ? 0 : siteConfig.flatShippingCents;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;
  const freeShippingRemainingCents = Math.max(
    0,
    siteConfig.freeShippingThresholdCents - subtotalCents,
  );
  return { itemCount, subtotalCents, shippingCents, taxCents, totalCents, freeShippingRemainingCents };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  // Hydrate from localStorage once on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setIsReady(true);
  }, []);

  // Persist on change (after hydration).
  React.useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, isReady]);

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock ?? 999) }
            : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = React.useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = React.useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock ?? 999) }
              : i,
          ),
    );
  }, []);

  const clearCart = React.useCallback(() => setItems([]), []);
  const openCart = React.useCallback(() => setIsOpen(true), []);
  const closeCart = React.useCallback(() => setIsOpen(false), []);

  const totals = React.useMemo(() => computeTotals(items), [items]);

  const value: CartContextValue = {
    items,
    totals,
    isOpen,
    isReady,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
