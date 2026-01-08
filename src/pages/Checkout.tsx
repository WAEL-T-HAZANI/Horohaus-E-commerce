import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "../state/cartStore";
import { fetchWatchById, submitOrder } from "../api/mockApi";
import { PriceSummary } from "../components/PriceSummary";
import { useMemo } from "react";
import { useToast } from "../components/ToastProvider";
import { AlertCircle } from "lucide-react";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(5, "Postal code is required"),
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC"),
  billingSameAsShipping: z.boolean().default(true),
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

export function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { showToast } = useToast();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      billingSameAsShipping: true,
    },
  });

  const watchQueries = useQuery({
    queryKey: ["checkout-watches", items.map((i) => i.watchId)],
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

  const handleShippingSubmit = (_data: ShippingFormData) => {
    setStep(2);
  };

  const handlePaymentSubmit = async (data: PaymentFormData): Promise<void> => {
    if (items.length === 0) {
      showToast("Your cart is empty", "error");
      navigate("/cart");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const shippingData = shippingForm.getValues();
      const paymentData: Record<string, string> = {
        cardNumber: data.cardNumber,
        expiry: data.expiry,
        cvc: data.cvc,
        billingSameAsShipping: String(data.billingSameAsShipping),
      };
      const orderData = {
        shipping: shippingData as Record<string, string>,
        payment: paymentData,
        cart: items.map((item) => ({ id: item.watchId, qty: item.quantity })),
      };

      const result = await submitOrder(orderData);
      clearCart();
      navigate(
        `/order-success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Order submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/watches")}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium focus-ring"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    step >= 1 ? "text-accent" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1
                        ? "bg-accent text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="font-medium">Shipping</span>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
                <div
                  className={`flex items-center gap-2 ${
                    step >= 2 ? "text-accent" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2
                        ? "bg-accent text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="font-medium">Payment</span>
                </div>
              </div>
            </div>

            {step === 1 ? (
              <form
                onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...shippingForm.register("fullName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  {shippingForm.formState.errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {shippingForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...shippingForm.register("email")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  {shippingForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {shippingForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...shippingForm.register("phone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  {shippingForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {shippingForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    {...shippingForm.register("address")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  {shippingForm.formState.errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {shippingForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...shippingForm.register("city")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                    {shippingForm.formState.errors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {shippingForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      {...shippingForm.register("postalCode")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                    {shippingForm.formState.errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {shippingForm.formState.errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    {...shippingForm.register("country")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  {shippingForm.formState.errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {shippingForm.formState.errors.country.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium focus-ring"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <form
                onSubmit={paymentForm.handleSubmit(
                  handlePaymentSubmit as (data: PaymentFormData) => void
                )}
                className="space-y-6"
              >
                {submitError && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle size={20} />
                    <p className="text-sm">{submitError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    placeholder="1234 5678 9012 3456"
                    {...paymentForm.register("cardNumber")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  {paymentForm.formState.errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {paymentForm.formState.errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry (MM/YY)
                    </label>
                    <input
                      placeholder="12/25"
                      {...paymentForm.register("expiry")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                    {paymentForm.formState.errors.expiry && (
                      <p className="mt-1 text-sm text-red-600">
                        {paymentForm.formState.errors.expiry.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      placeholder="123"
                      {...paymentForm.register("cvc")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                    {paymentForm.formState.errors.cvc && (
                      <p className="mt-1 text-sm text-red-600">
                        {paymentForm.formState.errors.cvc.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...paymentForm.register("billingSameAsShipping")}
                    className="rounded border-gray-300 text-accent focus:ring-gray-900"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Billing address same as shipping
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Review Order
                  </h3>
                  <div className="space-y-2 text-sm">
                    {watchQueries.data?.map((watch) => {
                      const item = items.find((i) => i.watchId === watch.id);
                      if (!item) return null;
                      return (
                        <div key={watch.id} className="flex justify-between">
                          <span className="text-gray-600">
                            {watch.brand} {watch.model} × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            ${(watch.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus-ring"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <PriceSummary subtotal={subtotal} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
