import { X } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
import { QuantityStepper } from "./QuantityStepper";
import type { Watch } from "../mock/watches";

interface CartItemRowProps {
  watch: Watch;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

export function CartItemRow({
  watch,
  quantity,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemRowProps) {
  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={watch.images[0]}
          alt={`${watch.brand} ${watch.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{watch.brand}</h3>
            <p className="text-sm text-gray-600 mb-2">{watch.model}</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(watch.price)}
            </p>
          </div>

          <button
            onClick={onRemove}
            disabled={isUpdating}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label={`Remove ${watch.brand} ${watch.model} from cart`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <QuantityStepper
            value={quantity}
            onChange={onUpdateQuantity}
            disabled={isUpdating}
          />
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(watch.price * quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
