import { X } from "lucide-react";
import { FiltersSidebar } from "./FiltersSidebar";
import type {
  Brand,
  MovementType,
  CaseMaterial,
  Crystal,
  Strap,
} from "../mock/watches";

interface Filters {
  brands?: Brand[];
  minPrice?: number;
  maxPrice?: number;
  caseSizeMin?: number;
  caseSizeMax?: number;
  movementType?: MovementType[];
  waterResistance?: number[];
  caseMaterial?: CaseMaterial[];
  crystal?: Crystal[];
  strap?: Strap[];
  complications?: string[];
  inStock?: boolean;
  minRating?: number;
}

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
}

export function FiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClear,
}: FiltersDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close filters"
          >
            <X size={24} />
          </button>
        </div>
        <FiltersSidebar
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClear={onClear}
        />
      </div>
    </>
  );
}
