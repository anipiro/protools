"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const CART_KEY = "toolyard.cart.v1";
const WISHLIST_KEY = "toolyard.wishlist.v1";

type Cart = Record<string, number>;

interface ShopState {
  /** False until the saved cart has been read, so the first render matches the server. */
  ready: boolean;
  cart: Cart;
  wishlist: string[];
  cartCount: number;
  addToCart: (id: string, qty: number, stock: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleWish: (id: string) => void;
}

const ShopContext = createContext<ShopState | null>(null);

function readCart(): Cart {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const cart: Cart = {};
    for (const [id, qty] of Object.entries(parsed)) {
      if (typeof qty === "number" && Number.isInteger(qty) && qty > 0) cart[id] = qty;
    }
    return cart;
  } catch {
    return {};
  }
}

function readWishlist(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(WISHLIST_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked. The cart still works for this visit.
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<Cart>({});
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setCart(readCart());
    setWishlist(readWishlist());
    setReady(true);

    // Keep several open tabs in step.
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY) setCart(readCart());
      if (event.key === WISHLIST_KEY) setWishlist(readWishlist());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ready) write(CART_KEY, cart);
  }, [ready, cart]);

  useEffect(() => {
    if (ready) write(WISHLIST_KEY, wishlist);
  }, [ready, wishlist]);

  const addToCart = useCallback((id: string, qty: number, stock: number) => {
    setCart((prev) => {
      const next = Math.min((prev[id] ?? 0) + qty, stock);
      return next > 0 ? { ...prev, [id]: next } : prev;
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty > 0) next[id] = Math.floor(qty);
      else delete next[id];
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      ready,
      cart,
      wishlist,
      cartCount: Object.values(cart).reduce((sum, qty) => sum + qty, 0),
      addToCart,
      setQty,
      removeFromCart,
      toggleWish,
    }),
    [ready, cart, wishlist, addToCart, setQty, removeFromCart, toggleWish],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}
