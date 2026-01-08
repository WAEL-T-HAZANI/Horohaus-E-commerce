import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "N/A";

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="text-sm text-gray-600 mb-1">Order Number</div>
          <div className="text-2xl font-bold text-gray-900">{orderNumber}</div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You will receive an email confirmation shortly with your order
            details and tracking information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/watches"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium focus-ring"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus-ring"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
