"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyConfig } from "@/lib/currency/currency";
import { DEFAULT_CURRENCIES, formatConvertedPrice } from "@/lib/currency/currency";

// ─── Cart Store ───────────────────────────────────────────────
export interface CartItem {
  id: string;          // product id
  variantId?: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  variantName?: string;
  unitPrice: number;   // always in INR
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, variantId: string | undefined, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotalINR: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === newItem.id && i.variantId === newItem.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id && i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (id, variantId, qty) => {
        if (qty < 1) {
          get().removeItem(id, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.variantId === variantId
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalINR: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    { name: "laiton-cart" }
  )
);

// ─── Currency Store ───────────────────────────────────────────
interface CurrencyStore {
  selectedCurrency: string;
  currencies: Record<string, CurrencyConfig>;
  setCurrency: (code: string) => void;
  setCurrencies: (currencies: Record<string, CurrencyConfig>) => void;
  format: (priceInINR: number) => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "INR",
      currencies: DEFAULT_CURRENCIES,

      setCurrency: (code) => set({ selectedCurrency: code }),
      setCurrencies: (currencies) => set({ currencies }),

      format: (priceInINR) => {
        const { selectedCurrency, currencies } = get();
        return formatConvertedPrice(priceInINR, selectedCurrency, currencies);
      },
    }),
    { name: "laiton-currency" }
  )
);

// ─── Wishlist Store ───────────────────────────────────────────
interface WishlistStore {
  items: string[]; // product ids
  toggleItem: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => {
      const toggle = (productId: string) => {
        set((state) => {
          const exists = state.items.includes(productId);
          return {
            items: exists
              ? state.items.filter((id) => id !== productId)
              : [...state.items, productId],
          };
        });
      };

      return {
        items: [],
        toggleItem: toggle,
        toggleWishlist: toggle,
        isInWishlist: (productId) => get().items.includes(productId),
        clear: () => set({ items: [] }),
      };
    },
    { name: "laiton-wishlist" }
  )
);

// ─── Auth / User Store ────────────────────────────────────────
interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses?: unknown[];
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user || null });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await fetch("/api/auth?action=logout", { method: "POST" });
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));
