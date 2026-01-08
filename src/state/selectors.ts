import { useMemo } from "react";
import { useCartStore } from "./cartStore";

// Memoized selector for cart items with watch details
export function useCartItemsWithDetails() {
  const items = useCartStore((state) => state.items);

  // In a real app, you'd fetch these from a query cache or API
  // For now, we'll return items and let components fetch details as needed
  return items;
}

// Calculate cart totals
export function useCartTotals() {
  const items = useCartStore((state) => state.items);

  return useMemo(() => {
    return {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      uniqueItems: items.length,
    };
  }, [items]);
}
