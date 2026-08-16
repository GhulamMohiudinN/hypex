import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, size, qty = 1) => {
        const items = get().items;
        const key = `${product.id}-${size}`;
        const existing = items.find((i) => i.key === key);
        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + qty } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                key,
                productId: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.dpImage || product.images?.[0],
                size,
                qty,
              },
            ],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => i.key !== key) });
      },

      increaseQty: (key) => {
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + 1 } : i
          ),
        });
      },

      decreaseQty: (key) => {
        set({
          items: get()
            .items.map((i) =>
              i.key === key ? { ...i, qty: i.qty - 1 } : i
            )
            .filter((i) => i.qty > 0),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    {
      name: "hypex-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
