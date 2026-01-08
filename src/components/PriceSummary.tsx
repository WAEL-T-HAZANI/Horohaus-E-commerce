import { formatCurrency } from "../utils/formatCurrency";

interface PriceSummaryProps {
  subtotal: number;
  shipping?: number;
  tax?: number;
  className?: string;
}

export function PriceSummary({
  subtotal,
  shipping,
  tax,
  className = "",
}: PriceSummaryProps) {
  const shippingCost = shipping ?? (subtotal >= 500 ? 0 : 25);
  const taxAmount = tax ?? subtotal * 0.08;
  const total = subtotal + shippingCost + taxAmount;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium text-gray-900">
          {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(taxAmount)}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
