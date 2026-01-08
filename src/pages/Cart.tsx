import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "../state/cartStore";
import { fetchWatchById } from "../api/mockApi";
import { CartItemRow } from "../components/CartItemRow";
import { PriceSummary } from "../components/PriceSummary";
import { EmptyState } from "../components/EmptyState";
import { useOptimisticCart } from "../hooks/useOptimisticCart";
import { useMemo } from "react";

export function Cart() {
  const items = useCartStore((state) => state.items);
  const { updateCartQuantity, removeFromCart, isUpdating } =
    useOptimisticCart();

  const watchQueries = useQuery({
    queryKey: ["cart-watches", items.map((i) => i.watchId)],
    queryFn: async () => {
      const watches = await Promise.all(
        items.map((item) => fetchWatchById(item.watchId))
      );
      return watches.filter((w): w is NonNullable<typeof w> => w !== null);
    },
    enabled: items.length > 0,
  });

  const subtotal = useMemo(() => {
    if (!watchQueries.data) return 0;
    return watchQueries.data.reduce((sum, watch) => {
      const item = items.find((i) => i.watchId === watch.id);
      return sum + watch.price * (item?.quantity || 0);
    }, 0);
  }, [watchQueries.data, items]);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>
          <EmptyState
            title="Your cart is empty"
            message="Start shopping to add items to your cart."
          />
          <div className="mt-8 text-center">
            <Link
              to="/watches"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium focus-ring"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {watchQueries.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: items.length }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : watchQueries.data ? (
              <div>
                {watchQueries.data.map((watch) => {
                  const item = items.find((i) => i.watchId === watch.id);
                  if (!item) return null;

                  return (
                    <CartItemRow
                      key={watch.id}
                      watch={watch}
                      quantity={item.quantity}
                      onUpdateQuantity={(qty) =>
                        updateCartQuantity(watch.id, qty)
                      }
                      onRemove={() => removeFromCart(watch.id)}
                      isUpdating={isUpdating === watch.id}
                    />
                  );
                })}
              </div>
            ) : null}

            <div className="mt-8">
              <Link
                to="/watches"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <PriceSummary subtotal={subtotal} />
              <Link
                to="/checkout"
                className="mt-6 w-full block text-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium focus-ring"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
