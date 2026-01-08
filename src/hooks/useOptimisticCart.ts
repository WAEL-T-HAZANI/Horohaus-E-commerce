import { useState } from "react";
import { useCartStore } from "../state/cartStore";
import { mutateCartAdd, mutateCartUpdate, mutateCartRemove } from "../api/mockApi";
import { useToast } from "../components/ToastProvider";

export function useOptimisticCart() {
  const { addItem, updateQuantity, removeItem } = useCartStore();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const addToCart = async (watchId: string, quantity: number = 1) => {
    // Optimistic update
    const previousQuantity = useCartStore.getState().getItemQuantity(watchId);
    addItem(watchId, quantity);
    setIsUpdating(watchId);

    try {
      await mutateCartAdd({ id: watchId, qty: quantity });
      showToast("Added to cart", "success");
    } catch (error) {
      // Rollback
      if (previousQuantity > 0) {
        updateQuantity(watchId, previousQuantity);
      } else {
        removeItem(watchId);
      }
      showToast(error instanceof Error ? error.message : "Couldn't add to cart. Please try again.", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  const updateCartQuantity = async (watchId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(watchId);
      return;
    }

    // Optimistic update
    const previousQuantity = useCartStore.getState().getItemQuantity(watchId);
    updateQuantity(watchId, quantity);
    setIsUpdating(watchId);

    try {
      await mutateCartUpdate({ id: watchId, qty: quantity });
    } catch (error) {
      // Rollback
      updateQuantity(watchId, previousQuantity);
      showToast(error instanceof Error ? error.message : "Couldn't update cart. Please try again.", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  const removeFromCart = async (watchId: string) => {
    // Optimistic update
    const previousQuantity = useCartStore.getState().getItemQuantity(watchId);
    removeItem(watchId);
    setIsUpdating(watchId);

    try {
      await mutateCartRemove({ id: watchId });
      showToast("Removed from cart", "success");
    } catch (error) {
      // Rollback
      updateQuantity(watchId, previousQuantity);
      showToast(error instanceof Error ? error.message : "Couldn't remove from cart. Please try again.", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  return {
    addToCart,
    updateCartQuantity,
    removeFromCart,
    isUpdating,
  };
}

