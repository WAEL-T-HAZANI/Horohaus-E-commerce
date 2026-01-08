import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  watchId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (watchId: string, quantity?: number) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  removeItem: (watchId: string) => void;
  clearCart: () => void;
  getItemQuantity: (watchId: string) => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (watchId: string, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.watchId === watchId);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.watchId === watchId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { watchId, quantity }],
          };
        });
      },
      
      updateQuantity: (watchId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(watchId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.watchId === watchId ? { ...item, quantity } : item
          ),
        }));
      },
      
      removeItem: (watchId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.watchId !== watchId),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemQuantity: (watchId: string) => {
        const item = get().items.find((item) => item.watchId === watchId);
        return item?.quantity || 0;
      },
      
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "horohaus-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

