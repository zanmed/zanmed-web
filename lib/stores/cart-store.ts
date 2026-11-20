"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  TAX_RATE,
} from "@/lib/constants";
import { logCartWhatsAppOrder } from "../actions/cart";

export interface CartProductSnapshot {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  product: CartProductSnapshot;
}

interface Totals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

function computeTotals(items: CartItem[], shippingOverride?: number): Totals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const shipping =
    shippingOverride !== undefined
      ? shippingOverride
      : subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
        ? 0
        : STANDARD_SHIPPING;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}

function migrateItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item?.productId && item?.product)
    .map((item) => ({
      ...item,
      quantity:
        typeof item.quantity === "number" && item.quantity > 0
          ? Math.floor(item.quantity)
          : 1,
      unitPrice: Number(item.unitPrice) || 0,
    }));
}

interface CartState extends Totals {
  items: CartItem[];
  isSendingWhatsApp: boolean;
}

interface CartActions {
  addToCart: (product: CartProductSnapshot, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  setShippingCost: (amount: number) => void;
  checkoutViaWhatsApp: () => Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }>;
}

type CartStore = CartState & CartActions;

const EMPTY_TOTALS: Totals = { subtotal: 0, tax: 0, shipping: 0, total: 0 };

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSendingWhatsApp: false,
      ...EMPTY_TOTALS,

      addToCart: (product, quantity = 1) => {
        if (quantity <= 0) {
          toast.error("Invalid quantity");
          return;
        }
        if (!product.inStock) {
          toast.error(`${product.name} is out of stock`);
          return;
        }
        if (!product.price || product.price <= 0) {
          toast.error("This item is unavailable");
          return;
        }

        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          let newItems: CartItem[];

          if (existing) {
            newItems = state.items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            );
          } else {
            newItems = [
              ...state.items,
              {
                productId: product.id,
                quantity,
                unitPrice: product.price,
                product,
              },
            ];
          }

          toast.success(`Added ${product.name} to cart`);
          return {
            items: newItems,
            ...computeTotals(newItems, state.shipping),
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          toast.success("Item removed from cart");
          return {
            items: newItems,
            ...computeTotals(newItems, state.shipping),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 0) return;
        if (quantity === 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => {
          const newItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          );
          return {
            items: newItems,
            ...computeTotals(newItems, state.shipping),
          };
        });
      },

      incrementQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item) get().updateQuantity(productId, item.quantity + 1);
      },

      decrementQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;
        if (item.quantity <= 1) {
          get().removeFromCart(productId);
          return;
        }
        get().updateQuantity(productId, item.quantity - 1);
      },

      clearCart: () => set({ items: [], ...EMPTY_TOTALS }),

      setShippingCost: (amount) =>
        set((state) => computeTotals(state.items, amount)),

      checkoutViaWhatsApp: async () => {
        const state = get();
        if (!state.items.length) {
          toast.error("Your cart is empty");
          return { success: false, error: "Cart is empty" };
        }

        const outOfStockItem = state.items.find((i) => !i.product.inStock);
        if (outOfStockItem) {
          toast.error(
            `${outOfStockItem.product.name} is out of stock — remove it to continue`,
          );
          return { success: false, error: "Cart contains out-of-stock items" };
        }

        set({ isSendingWhatsApp: true });
        try {
          const { url } = await logCartWhatsAppOrder(
            state.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              slug: item.product.slug,
              price: item.unitPrice,
              quantity: item.quantity,
            })),
          );

          set({ isSendingWhatsApp: false });
          if (!url) {
            toast.error("Something went wrong. Please try again.");
            return { success: false, error: "Failed to build WhatsApp link" };
          }
          return { success: true, url };
        } catch (err) {
          console.error("[checkoutViaWhatsApp]", err);
          set({ isSendingWhatsApp: false });
          toast.error("Failed to start WhatsApp order. Please try again.");
          return { success: false, error: "Failed to start WhatsApp order" };
        }
      },
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: CartStore) => ({ items: state.items }),
      onRehydrateStorage: () => (state: CartStore | undefined) => {
        if (!state?.items?.length) return;
        const migrated = migrateItems(state.items);
        Object.assign(state, { items: migrated, ...computeTotals(migrated) });
      },
    },
  ),
);

export const selectCartCount = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectHasItems = (s: CartStore) => s.items.length > 0;
export const selectIsInCart = (productId: string) => (s: CartStore) =>
  s.items.some((i) => i.productId === productId);
export const selectCartItem = (productId: string) => (s: CartStore) =>
  s.items.find((i) => i.productId === productId);
